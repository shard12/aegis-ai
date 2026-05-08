import { useMemo } from 'react';
import { useLang } from '../../context/LanguageContext.jsx';

function StatusPill({ tone, children }) {
  const cls =
    tone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
      : tone === 'danger'
        ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200'
        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300';
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${cls}`} role="status" aria-live="polite">
      {children}
    </div>
  );
}

export function SOSCenter({
  loading,
  onTrigger,
  telegramOk,
  lastError,
  mapsUrl,
  locationStatus,
  recipientCount,
  onCopy,
}) {
  const { t } = useLang();

  const status = useMemo(() => {
    if (loading) return { tone: 'neutral', text: t.sos_sending };
    if (telegramOk === true) return { tone: 'success', text: t.sos_sent };
    if (telegramOk === false) return { tone: 'danger', text: lastError || t.sos_failed };
    return { tone: 'neutral', text: t.sos_ready };
  }, [loading, telegramOk, lastError, t]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t.sos_center}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.sos_subtitle}</p>
        </div>
        <div className="text-right text-xs text-slate-500 dark:text-slate-400">
          <div>
            {t.sos_recipients}: <span className="font-semibold text-slate-700 dark:text-slate-200">{recipientCount}</span>
          </div>
          <div>{locationStatus}</div>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          disabled={loading}
          onClick={onTrigger}
          aria-label={t.sos_one_tap}
          className="tap-scale relative w-full rounded-[28px] bg-gradient-to-b from-aegis-alert to-red-700 px-6 py-8 text-left shadow-xl shadow-red-500/25 ring-1 ring-red-300/40 transition hover:from-red-600 hover:to-red-800 disabled:opacity-70 dark:ring-red-500/30"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/90">{t.sos_one_tap}</div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-white">{t.sos}</div>
              <div className="mt-2 max-w-[40ch] text-sm text-white/90">{t.sos_help_text}</div>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
              <span className="text-2xl" aria-hidden="true">
                !
              </span>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-4">
        <StatusPill tone={status.tone}>{status.text}</StatusPill>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="min-h-[44px] rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
        >
          {t.copy_emergency_text}
        </button>
        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-aegis-tealDark hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-teal-300 dark:hover:bg-slate-900"
          >
            {t.open_map}
          </a>
        ) : null}
      </div>
    </div>
  );
}

