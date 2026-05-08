import Groq from 'groq-sdk';
import { runRuleBasedTriage } from './triageEngine.js';
import { buildRagContext } from './ragService.js';

const OUTPUT_KEYS = [
  'intent',
  'risk_level',
  'medical_summary',
  'possible_concerns',
  'suggested_response',
  'recommended_action',
  'rag_context_used',
  'emergency_triggered',
  'telegram_alert',
];

function safeParseJson(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
}

async function runLlmAgents(message, ruleResult, ragText) {
  const key = process.env.GROQ_API_KEY;
  if (!key?.trim()) return null;

  const groq = new Groq({ apiKey: key });
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const system = `You are part of Aegis AI, a safety-first healthcare communication assistant.
You must NEVER give a final diagnosis or prescribe medication. Never claim certainty.
Output ONLY valid JSON with these keys: ${OUTPUT_KEYS.join(', ')}.
possible_concerns must be an array of short strings.
risk_level must be one of: LOW, MEDIUM, HIGH, CRITICAL.
intent must be one of: General Health Query, Symptom Check, Medication / Prescription Query, Appointment / Scheduling, Urgent Medical Concern, Emergency / Critical Condition.
If symptoms suggest emergency, set emergency_triggered true and risk_level CRITICAL.
telegram_alert should be a short plain-text SOS summary if emergency_triggered, else empty string.`;

  const user = `Patient message:\n${message}\n\nRule-based draft:\n${JSON.stringify({
    intent: ruleResult.intent,
    risk_level: ruleResult.risk_level,
    medical_summary: ruleResult.medical_summary,
    emergency_triggered: ruleResult.emergency_triggered,
    why: ruleResult.why_risk,
  })}\n\nContext (RAG):\n${ragText.slice(0, 6000)}`;

  const completion = await groq.chat.completions.create({
    model,
    temperature: 0.2,
    max_tokens: 1200,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });

  const raw = completion.choices[0]?.message?.content || '';
  return safeParseJson(raw);
}

const RANK = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

function mergeRisk(a, b) {
  if (!b) return a;
  const ra = RANK[a] || 0;
  const rb = RANK[b] || 0;
  return rb > ra ? b : a;
}

/**
 * Full pipeline: rule-based safety floor + optional LLM polish.
 */
export async function runTriagePipeline(body) {
  const message = body.message || body.text || '';
  const context = body.context || {};

  const rule = runRuleBasedTriage({ message, context });
  const ragText = buildRagContext({ context, criticalLabels: rule.critical_labels });

  let llm = null;
  try {
    llm = await runLlmAgents(message, rule, ragText);
  } catch (e) {
    console.warn('LLM triage skipped:', e.message);
  }

  const risk_level = mergeRisk(rule.risk_level, llm?.risk_level);
  let emergency_triggered = rule.emergency_triggered || !!llm?.emergency_triggered;
  if (risk_level === 'CRITICAL') emergency_triggered = true;

  const confidence = rule.confidence;

  const response = {
    intent: llm?.intent || rule.intent,
    risk_level,
    confidence,
    why_risk: rule.why_risk,
    medical_summary: llm?.medical_summary || rule.medical_summary,
    possible_concerns: Array.isArray(llm?.possible_concerns)
      ? llm.possible_concerns
      : rule.possible_concerns,
    suggested_response: llm?.suggested_response || rule.suggested_response,
    recommended_action: llm?.recommended_action || rule.recommended_action,
    rag_context_used: [ragText, llm?.rag_context_used].filter(Boolean).join('\n---\n').slice(0, 8000),
    emergency_triggered,
    telegram_alert: emergency_triggered
      ? llm?.telegram_alert || rule.telegram_alert
      : '',
    follow_up_questions: buildFollowUps(rule, message),
    critical_labels: rule.critical_labels,
    engine: llm ? 'hybrid' : 'rules',
  };

  return response;
}

function buildFollowUps(rule, message) {
  if (rule.risk_level === 'CRITICAL') {
    return [
      'Are you alone right now?',
      'Is the person conscious and breathing normally?',
    ];
  }
  if (message.length < 20) {
    return ['Where is the pain or discomfort located?', 'When did this start?'];
  }
  return [
    'On a scale of 1–10, how severe is it right now?',
    'Any allergies or new medications today?',
  ];
}
