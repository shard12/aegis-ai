/**
 * @param {string} token
 * @param {string|string[]} chatIds
 * @param {string} text
 */
export async function sendTelegramAlerts(token, chatIds, text) {
  if (!token || !chatIds?.length) {
    return { ok: false, error: 'Telegram not configured', results: [] };
  }
  const ids = Array.isArray(chatIds) ? chatIds : String(chatIds).split(/[,\s]+/).filter(Boolean);
  const results = [];
  for (const chat_id of ids) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, text: text.slice(0, 4000), parse_mode: 'HTML' }),
    });
    const data = await res.json().catch(() => ({}));
    results.push({ chat_id, ok: data.ok === true, description: data.description });
  }
  const ok = results.some((r) => r.ok);
  return { ok, results };
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
