import { CRITICAL_PATTERNS, HIGH_PATTERNS, MODERATE_PATTERNS } from '../data/emergencyKeywords.js';
import { snippetsForLabels } from '../data/knowledgeBase.js';

const INTENTS = [
  'General Health Query',
  'Symptom Check',
  'Medication / Prescription Query',
  'Appointment / Scheduling',
  'Urgent Medical Concern',
  'Emergency / Critical Condition',
];

function matchCritical(text) {
  const hits = [];
  for (const { pattern, label } of CRITICAL_PATTERNS) {
    if (pattern.test(text)) hits.push(label);
  }
  return hits;
}

function scoreRisk(text, criticalLabels) {
  if (criticalLabels.length) {
    return {
      risk_level: 'CRITICAL',
      confidence: 0.94,
      why: `Matched emergency indicators: ${criticalLabels.join(', ')}. Immediate professional care is required.`,
      emergency_triggered: true,
      intent: INTENTS[5],
    };
  }
  if (HIGH_PATTERNS.some((p) => p.test(text))) {
    return {
      risk_level: 'HIGH',
      confidence: 0.78,
      why: 'Severe or concerning symptoms described. Urgent medical evaluation is recommended.',
      emergency_triggered: false,
      intent: INTENTS[4],
    };
  }
  if (MODERATE_PATTERNS.some((p) => p.test(text))) {
    return {
      risk_level: 'MEDIUM',
      confidence: 0.65,
      why: 'Symptoms may need timely medical attention depending on duration and severity.',
      emergency_triggered: false,
      intent: INTENTS[1],
    };
  }
  return {
    risk_level: 'LOW',
    confidence: 0.55,
    why: 'No immediate red-flag patterns detected in text. Still seek care if symptoms worsen.',
    emergency_triggered: false,
    intent: INTENTS[0],
  };
}

function classifyIntentFallback(text, risk) {
  if (risk.intent) return risk.intent;
  const t = text.toLowerCase();
  if (/\b(pill|medicine|drug|dose|prescription)\b/i.test(t)) return INTENTS[2];
  if (/\b(appointment|schedule|book doctor)\b/i.test(t)) return INTENTS[3];
  return INTENTS[0];
}

/**
 * Rule-based triage (always available offline).
 * @param {{ message: string, context?: object }} input
 */
export function runRuleBasedTriage({ message, context = {} }) {
  const text = `${message} ${context.symptoms || ''} ${(context.allergies || []).join(' ')}`;
  const criticalLabels = matchCritical(text);
  const risk = scoreRisk(text, criticalLabels);
  const intent = classifyIntentFallback(text, risk);
  const ragBits = [];
  if (context.allergies?.length) ragBits.push(`Allergies on file: ${context.allergies.join(', ')}.`);
  if (context.age) ragBits.push(`Age noted: ${context.age}.`);
  if (context.previousMessages?.length) {
    ragBits.push(`Recent context: ${context.previousMessages.slice(-3).join(' | ')}`);
  }
  const kb = snippetsForLabels(criticalLabels);

  const medical_summary = summarizeStub(message, context, criticalLabels);
  const possible_concerns = criticalLabels.length
    ? criticalLabels.map((l) => `${l.replace(/_/g, ' ')} (emergency indicator)`)
    : extractConcernsStub(text);

  const suggested_response = buildEmpatheticReply(risk.risk_level, intent);
  const recommended_action = buildRecommendedAction(risk);

  const telegram_alert =
    risk.emergency_triggered || risk.risk_level === 'CRITICAL'
      ? buildTelegramStub(medical_summary, risk.risk_level, context)
      : '';

  return {
    intent,
    risk_level: risk.risk_level,
    confidence: risk.confidence,
    why_risk: risk.why,
    medical_summary,
    possible_concerns,
    suggested_response,
    recommended_action,
    rag_context_used: [ragBits.join(' '), kb].filter(Boolean).join('\n---\n'),
    emergency_triggered: risk.emergency_triggered,
    telegram_alert,
    offline: true,
    critical_labels: criticalLabels,
  };
}

function summarizeStub(message, context, labels) {
  const parts = [message.trim().slice(0, 500)];
  if (context.age) parts.push(`Age: ${context.age}`);
  if (labels.length) parts.push(`Flags: ${labels.join(', ')}`);
  return parts.join(' | ');
}

function extractConcernsStub(text) {
  const out = [];
  if (/\bpain\b/i.test(text)) out.push('Pain (location/duration not fully specified)');
  if (/\bfever\b/i.test(text)) out.push('Fever');
  if (/\bcough\b/i.test(text)) out.push('Respiratory symptoms');
  return out.length ? out : ['Non-specific; monitor symptoms'];
}

function buildEmpatheticReply(level, intent) {
  const base =
    "I'm here to help you stay safe. This tool does not diagnose or prescribe—please use it alongside professional care.";
  if (level === 'CRITICAL') {
    return `${base} Based on what you shared, this may be an emergency. Call your local emergency number now or go to the nearest ER.`;
  }
  if (level === 'HIGH') {
    return `${base} Your symptoms sound concerning. Seek urgent in-person medical care today unless you are already guided otherwise by a clinician.`;
  }
  if (level === 'MEDIUM') {
    return `${base} Consider contacting a clinician soon, especially if symptoms persist or worsen.`;
  }
  return `${base} If anything feels severe, sudden, or worsening, seek care immediately.`;
}

function buildRecommendedAction(risk) {
  if (risk.risk_level === 'CRITICAL' || risk.emergency_triggered) {
    return 'Call emergency services; use SOS to alert contacts with your location; go to nearest ER if advised.';
  }
  if (risk.risk_level === 'HIGH') {
    return 'Urgent clinic or ER evaluation; avoid driving yourself if impaired.';
  }
  if (risk.risk_level === 'MEDIUM') {
    return 'Schedule a clinician visit; monitor vitals and red-flag symptoms.';
  }
  return 'Self-care with clear return precautions; seek care if red flags appear.';
}

function buildTelegramStub(summary, level, context) {
  const name = context.profileName || 'Patient';
  return (
    `🚨 AEGIS SOS ALERT\n` +
    `Person: ${name}\n` +
    `Severity: ${level}\n` +
    `Summary: ${summary.slice(0, 400)}\n` +
    `Time: ${new Date().toISOString()}\n` +
    `Action: Please respond or dispatch help. Location link should follow in app.`
  );
}

export { INTENTS };
