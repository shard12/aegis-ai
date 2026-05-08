import { buildFirstAidCards } from './guidanceEngine.js';

export function buildEmergencyPayload(triageResult, { mapsUrl, lat, lng, contacts = [] }) {
  const cards = buildFirstAidCards(triageResult.risk_level, triageResult.critical_labels);
  return {
    ...triageResult,
    maps_url: mapsUrl || '',
    coordinates: lat != null && lng != null ? { lat, lng } : null,
    contacts_notified: contacts,
    first_aid: cards,
    timestamp: new Date().toISOString(),
  };
}
