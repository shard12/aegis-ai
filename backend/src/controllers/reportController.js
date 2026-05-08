import { appendHistory } from '../store/memoryStore.js';
import { mapsUrlFromCoords } from '../services/locationService.js';
import { findNearbyHospitals } from '../services/hospitalService.js';

export async function generate(req, res, next) {
  try {
    const { triage, location, contacts_alerted, patient } = req.body;
    const lat = location?.lat;
    const lng = location?.lng;
    const maps = mapsUrlFromCoords(lat, lng);

    let nearest_hospitals = [];
    if (lat != null && lng != null) {
      try {
        nearest_hospitals = await findNearbyHospitals({ lat, lng, limit: 6 });
      } catch {
        nearest_hospitals = [];
      }
    }

    const report = {
      title: 'Aegis Emergency Handoff Summary',
      generated_at: new Date().toISOString(),
      disclaimer:
        'Informational only. Not a diagnosis. For licensed clinicians—verify with patient and records.',
      patient: patient || {},
      presentation: {
        medical_summary: triage?.medical_summary,
        intent: triage?.intent,
        risk_level: triage?.risk_level,
        possible_concerns: triage?.possible_concerns,
        recommended_action: triage?.recommended_action,
      },
      location: {
        maps_url: maps,
        coordinates: lat != null ? { lat, lng } : null,
      },
      notifications: {
        contacts_alerted: contacts_alerted || [],
        telegram_sent: !!req.body.telegram_sent,
      },
      nearest_hospitals,
      structured_json: {
        intent: triage?.intent,
        risk_level: triage?.risk_level,
        medical_summary: triage?.medical_summary,
        possible_concerns: triage?.possible_concerns,
        suggested_response: triage?.suggested_response,
        recommended_action: triage?.recommended_action,
        rag_context_used: triage?.rag_context_used,
        emergency_triggered: !!triage?.emergency_triggered,
        telegram_alert: triage?.telegram_alert || '',
      },
    };

    appendHistory({ type: 'report', report });

    res.json({ ok: true, report });
  } catch (e) {
    next(e);
  }
}
