function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function clean(s) {
  const v = String(s || '').trim();
  return v ? v : '';
}

function buildAddress(tags = {}) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:city'],
    tags['addr:district'],
    tags['addr:state'],
    tags['addr:postcode'],
  ]
    .map((x) => clean(x))
    .filter(Boolean);
  const joined = parts.join(', ');
  return joined || clean(tags['addr:full']) || '';
}

function inferCategory(tags = {}) {
  const amenity = clean(tags.amenity);
  const healthcare = clean(tags.healthcare);
  const emergency = clean(tags.emergency);
  if (emergency === 'yes') return 'emergency';
  if (amenity === 'hospital' || healthcare === 'hospital') return 'hospital';
  if (amenity === 'clinic' || healthcare === 'clinic') return 'clinic';
  if (amenity === 'doctors') return 'doctors';
  if (amenity === 'pharmacy') return 'pharmacy';
  return healthcare || amenity || 'medical';
}

function buildOverpassQuery({ lat, lng, radiusM }) {
  // Find hospitals/clinics/emergency-related facilities around a point.
  // Keep it broad but healthcare-focused to avoid fake/dummy lists.
  return `
[out:json][timeout:12];
(
  nwr(around:${radiusM},${lat},${lng})["amenity"~"hospital|clinic|doctors"];
  nwr(around:${radiusM},${lat},${lng})["healthcare"~"hospital|clinic|doctor"];
  nwr(around:${radiusM},${lat},${lng})["emergency"="yes"];
);
out center tags;
`.trim();
}

async function fetchOverpassJson(query) {
  const url = 'https://overpass-api.de/api/interpreter';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      'User-Agent': 'AegisAI/1.0 (emergency response app)',
    },
    body: query,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.remark || data?.message || `Overpass error (${res.status})`);
    err.status = 502;
    throw err;
  }
  return data;
}

/**
 * @param {{ lat?: number, lng?: number, limit?: number }} query
 */
export async function findNearbyHospitals(query) {
  const limit = Math.min(Number(query.limit || 8), 20);
  const lat = query.lat;
  const lng = query.lng;
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    const err = new Error('Location is required to find nearby hospitals.');
    err.status = 400;
    throw err;
  }

  const radiusM = 8000;
  const overpassQuery = buildOverpassQuery({ lat, lng, radiusM });
  const data = await fetchOverpassJson(overpassQuery);
  const elements = Array.isArray(data?.elements) ? data.elements : [];

  const mapped = elements
    .map((el) => {
      const tags = el.tags || {};
      const name = clean(tags.name) || clean(tags.operator) || 'Medical facility';
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      const distance_km =
        elLat != null && elLng != null ? haversineKm({ lat, lng }, { lat: elLat, lng: elLng }) : null;

      const phone = clean(tags.phone) || clean(tags['contact:phone']) || '';
      const website = clean(tags.website) || clean(tags['contact:website']) || '';
      const address = buildAddress(tags);
      const category = inferCategory(tags);

      const maps_url =
        elLat != null && elLng != null
          ? `https://www.google.com/maps?q=${encodeURIComponent(`${elLat},${elLng}`)}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`;

      return {
        id: `${el.type}_${el.id}`,
        name,
        category,
        phone: phone || null,
        address: address || null,
        website: website || null,
        distance_km,
        coordinates: elLat != null && elLng != null ? { lat: elLat, lng: elLng } : null,
        maps_url,
      };
    })
    .filter((x) => x.name && x.maps_url);

  mapped.sort((a, b) => (a.distance_km ?? 999999) - (b.distance_km ?? 999999));

  return mapped.slice(0, limit);
}
