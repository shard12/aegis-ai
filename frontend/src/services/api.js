const BASE = import.meta.env.VITE_API_BASE || '';

async function json(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export function analyzeTriage(body) {
  return json('/api/triage/analyze', { method: 'POST', body: JSON.stringify(body) });
}

export function triggerEmergency(body) {
  return json('/api/emergency/trigger', { method: 'POST', body: JSON.stringify(body) });
}

export function nearbyHospitals(body) {
  return json('/api/hospitals/nearby', { method: 'POST', body: JSON.stringify(body) });
}

export function generateReport(body) {
  return json('/api/report/generate', { method: 'POST', body: JSON.stringify(body) });
}

export function saveContext(body) {
  return json('/api/context/save', { method: 'POST', body: JSON.stringify(body) });
}

export function fetchHistory(limit = 30) {
  return json(`/api/history?limit=${limit}`);
}

export function validateTelegramChatId(body) {
  return json('/api/telegram/validate', { method: 'POST', body: JSON.stringify(body) });
}
