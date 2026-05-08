import { findNearbyHospitals } from '../services/hospitalService.js';
import { parseLocationBody } from '../services/locationService.js';

export async function nearby(req, res, next) {
  try {
    const { lat, lng } = parseLocationBody(req.body);
    const limit = req.body.limit;
    const hospitals = await findNearbyHospitals({ lat, lng, limit });
    res.json({ ok: true, hospitals });
  } catch (e) {
    next(e);
  }
}
