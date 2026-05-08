import { nearbyHospitals } from './api.js';

export async function loadHospitals(coords) {
  return nearbyHospitals({
    lat: coords?.lat,
    lng: coords?.lng,
    limit: 8,
  });
}
