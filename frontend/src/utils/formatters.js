export function riskLabel(level, t) {
  const map = {
    LOW: t.risk_low,
    MEDIUM: t.risk_med,
    HIGH: t.risk_high,
    CRITICAL: t.risk_crit,
  };
  return map[level] || level;
}

export function formatMapsLink(lat, lng) {
  if (lat == null || lng == null) return '';
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
