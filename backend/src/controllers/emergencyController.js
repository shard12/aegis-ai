import { buildEmergencyPayload } from '../services/emergencyEngine.js';
import { mapsUrlFromCoords, parseLocationBody } from '../services/locationService.js';
import { sendTelegramAlerts, escapeHtml } from '../services/telegramService.js';
import { appendHistory } from '../store/memoryStore.js';
import { runRuleBasedTriage } from '../services/triageEngine.js';

function formatContactLine(c) {
  const name = c?.name ? escapeHtml(c.name) : '';
  const relationship = c?.relationship ? escapeHtml(c.relationship) : '';
  const phone = c?.phone ? escapeHtml(c.phone) : '';
  const bits = [name, relationship && `(${relationship})`, phone].filter(Boolean);
  return bits.join(' ').trim();
}

export async function trigger(req, res, next) {
  try {
    const { message, context, triage: triageOverride } = req.body;
    const { lat, lng } = parseLocationBody(req.body);
    const mapsUrl = mapsUrlFromCoords(lat, lng) || req.body.maps_url || '';

    const triage =
      triageOverride ||
      runRuleBasedTriage({
        message: message || context?.lastMessage || '',
        context: context || {},
      });

    const contacts = req.body.contacts || context?.emergencyContacts || [];
    const payload = buildEmergencyPayload(triage, { mapsUrl, lat, lng, contacts });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const envChatIds = process.env.TELEGRAM_CHAT_IDS || '';
    const bodyChatIds = req.body.telegram_chat_ids || req.body.telegramChatIds || '';
    const combinedChatIds = [envChatIds, bodyChatIds].filter(Boolean).join(',');

    const manualSos = req.body.sos_manual === true;
    let telegram = { ok: false, skipped: true };
    if (
      token &&
      combinedChatIds &&
      (manualSos || triage.emergency_triggered || triage.risk_level === 'CRITICAL')
    ) {
      const patientName = context?.profileName || context?.fullName || '';
      const emergencyNotes = context?.emergencyNotes || context?.notes || '';
      const contactLines = Array.isArray(contacts) ? contacts.map(formatContactLine).filter(Boolean) : [];
      const text =
        `<b>Aegis SOS</b>\n` +
        (patientName ? `<b>Patient:</b> ${escapeHtml(patientName)}\n` : '') +
        `<b>Risk:</b> ${escapeHtml(triage.risk_level)}\n` +
        `<b>Summary:</b> ${escapeHtml(triage.medical_summary)}\n` +
        (triage.recommended_action ? `<b>Recommended action:</b> ${escapeHtml(triage.recommended_action)}\n` : '') +
        (emergencyNotes ? `<b>Emergency notes:</b> ${escapeHtml(emergencyNotes)}\n` : '') +
        (contactLines.length ? `<b>Contacts:</b>\n${contactLines.map((l) => `- ${l}`).join('\n')}\n` : '') +
        `<b>Maps:</b> ${mapsUrl ? escapeHtml(mapsUrl) : 'n/a'}\n` +
        `<b>Time:</b> ${escapeHtml(new Date().toISOString())}`;
      telegram = await sendTelegramAlerts(token, combinedChatIds, text);
    }

    appendHistory({
      type: 'sos',
      triage,
      mapsUrl,
      telegram,
      contacts,
    });

    res.json({
      ok: true,
      emergency: payload,
      telegram,
      maps_url: mapsUrl,
    });
  } catch (e) {
    next(e);
  }
}
