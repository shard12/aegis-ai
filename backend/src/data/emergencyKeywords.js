/** Critical indicator phrases → force CRITICAL + emergency */
export const CRITICAL_PATTERNS = [
  { pattern: /\b(chest pain|heart attack|cardiac)\b/i, label: 'chest_pain' },
  { pattern: /\b(can'?t breathe|cannot breathe|difficulty breathing|shortness of breath|choking)\b/i, label: 'breathing' },
  { pattern: /\b(unconscious|unresponsive|not waking|passed out)\b/i, label: 'unconscious' },
  { pattern: /\b(severe bleed|heavy bleeding|bleeding badly|hemorrhag)\b/i, label: 'bleeding' },
  { pattern: /\b(seizure|convuls|fitting)\b/i, label: 'seizure' },
  { pattern: /\b(anaphylaxis|severe allergic|throat closing|face swelling)\b/i, label: 'allergy' },
  { pattern: /\b(stroke|facial droop|slurred speech|one side weak)\b/i, label: 'stroke' },
  { pattern: /\b(suicid|kill myself|end my life)\b/i, label: 'mental_health_crisis' },
  { pattern: /\b(severe trauma|crush injury|amputat|impalement)\b/i, label: 'trauma' },
  { pattern: /\b(poison|overdose|ingested chemical)\b/i, label: 'poison' },
];

export const HIGH_PATTERNS = [
  /\b(high fever|104|40\s*°?c)\b/i,
  /\b(severe pain|worst pain)\b/i,
  /\b(confus|disoriented)\b/i,
];

export const MODERATE_PATTERNS = [
  /\b(fever|nausea|vomit|dizzy|headache)\b/i,
  /\b(cut|burn|rash)\b/i,
];
