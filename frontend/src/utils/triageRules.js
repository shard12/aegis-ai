/** Client-side offline red-flag hints (must match backend philosophy). */
export const RED_FLAGS = [
  'chest pain',
  "can't breathe",
  'unconscious',
  'severe bleeding',
  'stroke',
  'seizure',
];

export function hasOfflineRedFlag(text) {
  const t = text.toLowerCase();
  return RED_FLAGS.some((k) => t.includes(k));
}
