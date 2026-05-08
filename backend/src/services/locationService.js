export function mapsUrlFromCoords(lat, lng) {
  if (lat == null || lng == null) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;
}

export function parseLocationBody(body) {
  const lat = body.lat ?? body.latitude;
  const lng = body.lng ?? body.longitude;
  return { lat: lat != null ? Number(lat) : null, lng: lng != null ? Number(lng) : null };
}
