import { KNOWLEDGE_SNIPPETS } from '../data/knowledgeBase.js';

const DOS = {
  CRITICAL: [
    'Call local emergency services immediately.',
    'Stay on the line with dispatch if possible.',
    'If unconscious and not breathing normally: start CPR if trained.',
  ],
  HIGH: [
    'Seek urgent in-person care.',
    'Arrange safe transport; avoid driving if dizzy or in severe pain.',
    'Bring a list of medications and allergies.',
  ],
  MEDIUM: [
    'Rest, hydrate if appropriate, and monitor symptoms.',
    'Contact a clinician if symptoms persist beyond expected timeframe.',
  ],
  LOW: [
    'Monitor for red-flag symptoms (breathing difficulty, chest pain, confusion, severe bleeding).',
    'Use trusted self-care resources; when unsure, call a nurse line or clinician.',
  ],
};

const DONTS = [
  'Do not rely on this app for diagnosis or prescription.',
  'Do not delay emergency care for serious symptoms.',
  'Do not give medication advice beyond general OTC guidance from a clinician.',
];

export function buildFirstAidCards(riskLevel, criticalLabels = []) {
  const key = criticalLabels[0] || 'default';
  const snippet = KNOWLEDGE_SNIPPETS[key] || KNOWLEDGE_SNIPPETS.default;
  return {
    steps: snippet.split('. ').filter(Boolean).map((s, i) => ({ n: i + 1, text: s.endsWith('.') ? s : `${s}.` })),
    dos: DOS[riskLevel] || DOS.MEDIUM,
    donts: DONTS,
    warnings: [
      'Worsening breathing, new confusion, fainting, or severe pain = escalate to emergency care.',
    ],
  };
}
