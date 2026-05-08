/** Static first-aid snippets for offline / RAG-style grounding (not a substitute for training). */
export const KNOWLEDGE_SNIPPETS = {
  chest_pain: 'If awake and not allergic: chewing aspirin may be advised only by emergency services in some regions—follow local EMS guidance. Stay seated, loosen tight clothing, call emergency services immediately.',
  breathing: 'Sit upright, loosen clothing, move to fresh air if safe. If severe or worsening, call emergency services. Do not leave the person alone.',
  bleeding: 'Apply firm direct pressure with clean cloth. Elevate injured limb if possible. If soaking through, add more layers—do not remove first cloth. Call emergency services for severe bleeding.',
  unconscious: 'Check breathing. If not breathing normally, begin CPR if trained. Call emergency services. Recovery position only if breathing normally and no spinal injury suspected.',
  stroke: 'Note time symptoms started. Do not give food or drink. Call emergency services immediately—time-sensitive care matters.',
  seizure: 'Protect from injury; do not restrain. Time the seizure. After it stops, place in recovery position if breathing. Call emergency if >5 min, repeated, or first seizure.',
  default: 'Stay calm. Monitor breathing and responsiveness. Call local emergency services or go to the nearest ER if symptoms are severe or worsening.',
};

export function snippetsForLabels(labels) {
  const keys = [...new Set([...labels, 'default'])];
  return keys.map((k) => KNOWLEDGE_SNIPPETS[k] || KNOWLEDGE_SNIPPETS.default).join('\n\n');
}
