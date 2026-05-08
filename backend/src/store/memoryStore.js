/** In-memory runtime store — replace with persistent DB for production */

const profiles = new Map();
const history = [];

export function saveContext(payload) {
  const id = payload.id || 'default';
  const prev = profiles.get(id) || {};
  const merged = {
    ...prev,
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  profiles.set(id, merged);
  return merged;
}

export function getContext(id = 'default') {
  return profiles.get(id) || null;
}

export function appendHistory(entry) {
  history.unshift({
    ...entry,
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
  });
  return history[0];
}

export function listHistory(limit = 50) {
  return history.slice(0, limit);
}
