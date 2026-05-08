/**
 * Telegram alerts are sent server-side with TELEGRAM_BOT_TOKEN.
 * Client can open a pre-filled message for manual share.
 */
export function buildManualTelegramShareText({ summary, risk, mapsUrl }) {
  return encodeURIComponent(
    `Aegis SOS\nRisk: ${risk}\n${summary}\nMaps: ${mapsUrl || 'n/a'}\nTime: ${new Date().toISOString()}`,
  );
}

export function openTelegramShare(textEncoded) {
  window.open(`https://t.me/share/url?url=&text=${textEncoded}`, '_blank');
}
