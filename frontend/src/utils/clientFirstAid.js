/** Mirrors backend first-aid card shape for offline / immediate UI. */
const SNIP = {
  default: 'Stay with the person. Call emergency services if severe. Monitor breathing and responsiveness.',
  chest_pain: 'Call emergency services. Keep seated, loosen tight clothing. Do not drive yourself.',
  breathing: 'Sit upright, seek fresh air if safe. Call emergency if breathing worsens.',
  bleeding: 'Apply firm pressure. Elevate limb if possible. Call emergency for severe bleeding.',
};

export function buildFirstAidCards(riskLevel, criticalLabels = []) {
  const key = criticalLabels[0] && SNIP[criticalLabels[0]] ? criticalLabels[0] : 'default';
  const text = SNIP[key] || SNIP.default;
  return {
    steps: text.split('. ').map((s, i) => ({ n: i + 1, text: s.endsWith('.') ? s : `${s}.` })),
    dos:
      riskLevel === 'CRITICAL'
        ? ['Call emergency services', 'Stay on line with dispatch']
        : ['Monitor symptoms', 'Arrange clinician if worsening'],
    donts: ['No diagnosis from this app', 'Do not delay emergency care for red flags'],
    warnings: ['Worsening breathing, confusion, or severe pain → escalate immediately.'],
  };
}
