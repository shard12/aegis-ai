export function summarizePatientInput(message, context) {
  const base = message.replace(/\s+/g, ' ').trim().slice(0, 800);
  const extras = [];
  if (context?.symptoms) extras.push(`Additional symptoms: ${context.symptoms}`);
  if (context?.age) extras.push(`Age ${context.age}`);
  return [base, ...extras].join(' | ');
}
