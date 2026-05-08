import { snippetsForLabels } from '../data/knowledgeBase.js';

/**
 * Lightweight "RAG": merge profile, history, allergies, prior reports, knowledge snippets.
 */
export function buildRagContext({ context = {}, criticalLabels = [] }) {
  const chunks = [];

  if (context.profileName) chunks.push(`Profile: ${context.profileName}`);
  if (context.age) chunks.push(`Age: ${context.age}`);
  if (context.gender) chunks.push(`Gender: ${context.gender}`);
  if (context.allergies?.length) chunks.push(`Allergies: ${context.allergies.join(', ')}`);
  if (context.notes) chunks.push(`Notes: ${context.notes}`);
  if (context.previousMessages?.length) {
    chunks.push(`Recent messages:\n${context.previousMessages.slice(-8).join('\n')}`);
  }
  if (context.previousReports?.length) {
    chunks.push(`Prior incidents: ${context.previousReports.length} on file`);
  }

  const kb = snippetsForLabels(criticalLabels.length ? criticalLabels : ['default']);
  chunks.push(`First-aid knowledge (general): ${kb}`);

  return chunks.filter(Boolean).join('\n---\n');
}
