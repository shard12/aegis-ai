function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateTime(value, { includeSeconds = false } = {}) {
  const d = toDate(value);
  if (!d) return '';
  const locale = undefined; // user agent locale
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
  }).format(d);
}

export function formatTime(value) {
  const d = toDate(value);
  if (!d) return '';
  const locale = undefined;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getTimeZoneLabel() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
}

