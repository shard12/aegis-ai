import { saveContext, getContext, listHistory } from '../store/memoryStore.js';

export function save(req, res, next) {
  try {
    const saved = saveContext(req.body);
    res.json({ ok: true, profile: saved });
  } catch (e) {
    next(e);
  }
}

export function getProfile(req, res, next) {
  try {
    const id = req.query.id || 'default';
    const profile = getContext(id);
    res.json({ ok: true, profile });
  } catch (e) {
    next(e);
  }
}

export function history(req, res, next) {
  try {
    const items = listHistory(Number(req.query.limit) || 50);
    res.json({ ok: true, history: items });
  } catch (e) {
    next(e);
  }
}
