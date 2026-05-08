import { runRuleBasedTriage } from './triageEngine.js';

export function analyzeRisk(payload) {
  return runRuleBasedTriage(payload);
}
