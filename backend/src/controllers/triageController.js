import { runTriagePipeline } from '../services/aiRouter.js';

export async function analyze(req, res, next) {
  try {
    const result = await runTriagePipeline(req.body);
    res.json({ ok: true, ...result });
  } catch (e) {
    next(e);
  }
}
