import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SOSCenter } from '../../components/SOSCenter/SOSCenter.jsx';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { useApp } from '../../context/AppContext.jsx';
import { triggerEmergency } from '../../services/api.js';
import { formatMapsLink } from '../../utils/formatters.js';
import { useLang } from '../../context/LanguageContext.jsx';

export function Emergency() {
  const { t } = useLang();
  const { profile, settings } = useApp();
  const loc = useLocation();
  const triage = loc.state?.triage;
  const { coords, error: geoError, refresh } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [telegramOk, setTelegramOk] = useState(null);
  const [msg, setMsg] = useState('');
  const [lastError, setLastError] = useState('');

  const mapsUrl = coords ? formatMapsLink(coords.lat, coords.lng) : '';

  async function handleSos() {
    setLoading(true);
    setTelegramOk(null);
    setLastError('');
    try {
      let c = coords;
      if (!c) {
        try {
          c = await refresh();
        } catch {
          /* */
        }
      }
      const telegramIds = [
        ...(settings?.telegramRecipients || []).filter((r) => r.enabled !== false).map((r) => r.chatId).filter(Boolean),
        ...(settings?.emergencyContacts || []).filter((c) => c.enabled !== false).map((c) => c.chatId).filter(Boolean),
      ];
      const enabledContacts = (settings?.emergencyContacts || []).filter((x) => x.enabled !== false);
      const res = await triggerEmergency({
        sos_manual: true,
        message: triage?.medical_summary || t.sos_triggered,
        context: {
          ...profile,
          lastMessage: triage?.medical_summary,
        },
        triage: triage || { risk_level: 'UNKNOWN', medical_summary: t.manual_sos, emergency_triggered: true },
        lat: c?.lat,
        lng: c?.lng,
        maps_url: c ? formatMapsLink(c.lat, c.lng) : '',
        contacts: enabledContacts,
        telegram_chat_ids: telegramIds,
      });
      setTelegramOk(!!res.telegram?.ok);
      setMsg(res.emergency?.telegram_alert || triage?.telegram_alert || '');
      if (!res.telegram?.ok) {
        const first = res.telegram?.results?.find((r) => r?.ok === false)?.description;
        setLastError(first || t.telegram_delivery_failed);
      }
    } catch (e) {
      setTelegramOk(false);
      setMsg(e.message);
      setLastError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function copyText() {
    const t = msg || `${triage?.medical_summary || 'SOS'}\n${mapsUrl}`;
    navigator.clipboard.writeText(t);
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <Link to="/triage" className="text-sm text-aegis-teal underline">
        ← {t.back_to_triage}
      </Link>
      <div className="mt-6">
        <SOSCenter
          loading={loading}
          onTrigger={handleSos}
          telegramOk={telegramOk}
          lastError={lastError}
          mapsUrl={mapsUrl}
          locationStatus={
            geoError
              ? `${t.location_prefix}: ${geoError}`
              : coords
                ? `${t.location_prefix}: ${t.location_active} (±${Math.round(coords.accuracy || 0)}m)`
                : `${t.location_prefix}: ${t.location_not_granted}`
          }
          recipientCount={
            [
              ...(settings?.telegramRecipients || []).filter((r) => r.enabled !== false && r.chatId).map((r) => r.chatId),
              ...(settings?.emergencyContacts || []).filter((c) => c.enabled !== false && c.chatId).map((c) => c.chatId),
            ].length
          }
          onCopy={copyText}
        />
      </div>
    </main>
  );
}
