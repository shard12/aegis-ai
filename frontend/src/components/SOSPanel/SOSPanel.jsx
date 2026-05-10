import { useLang } from '../../context/LanguageContext.jsx';
import { formatMapsLink } from '../../utils/formatters.js';
import { Copy, LocateFixed, MapPinned, Radio, Siren } from 'lucide-react';

export function SOSPanel({
  onTrigger,
  loading,
  mapsUrl,
  coords,
  tracking,
  onToggleTrack,
  telegramOk,
  messageText,
  onCopy,
}) {
  const { t } = useLang();
  const link = mapsUrl || (coords ? formatMapsLink(coords.lat, coords.lng) : '');

  return (
    <div className="rounded-3xl border-2 border-aegis-alert/40 bg-white p-6 shadow-xl dark:bg-slate-900">
      <h2 className="font-display text-2xl font-bold text-aegis-alert">{t.sos_center}</h2>
      <button
        type="button"
        disabled={loading}
        onClick={onTrigger}
        className="tap-scale mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-aegis-alert py-5 text-lg font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-700 disabled:opacity-60"
      >
        <Siren className="h-5 w-5" aria-hidden="true" />
        {loading ? 'Sending…' : t.sos}
      </button>

      <div className="mt-6 space-y-3 text-sm">
        <button
          type="button"
          onClick={onToggleTrack}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {tracking ? <Radio className="h-4 w-4 text-emerald-500" aria-hidden="true" /> : <LocateFixed className="h-4 w-4" aria-hidden="true" />}
          {tracking ? 'Live tracking ON' : t.share_location}
        </button>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-center font-medium text-aegis-tealDark underline dark:bg-slate-800 dark:text-teal-400"
          >
            <MapPinned className="h-4 w-4" aria-hidden="true" />
            Open Google Maps
          </a>
        )}

        {messageText && (
          <button
            type="button"
            onClick={onCopy}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2 text-xs text-slate-600 dark:border-slate-600"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            Copy emergency text
          </button>
        )}

        {telegramOk != null && (
          <p className={`text-center text-xs ${telegramOk ? 'text-emerald-600' : 'text-amber-600'}`}>
            Telegram (server): {telegramOk ? 'sent / configured' : 'check backend token & chat IDs'}
          </p>
        )}
      </div>
    </div>
  );
}
