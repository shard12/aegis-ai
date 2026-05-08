import { riskLabel } from '../../utils/formatters.js';
import { useLang } from '../../context/LanguageContext.jsx';

const ORDER = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export function RiskMeter({ level, confidence, why }) {
  const { t } = useLang();
  const idx = Math.max(0, ORDER.indexOf(level));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Risk level</p>
          <p
            className={`font-display text-3xl font-bold ${
              level === 'CRITICAL'
                ? 'text-aegis-alert'
                : level === 'HIGH'
                  ? 'text-orange-600'
                  : level === 'MEDIUM'
                    ? 'text-aegis-warn'
                    : 'text-aegis-tealDark'
            }`}
          >
            {riskLabel(level, t)}
          </p>
          {confidence != null && (
            <p className="mt-1 text-xs text-slate-500">Confidence: {Math.round(confidence * 100)}% (rules + optional AI)</p>
          )}
        </div>
        <div className="flex gap-1">
          {ORDER.map((k, i) => (
            <div
              key={k}
              className={`h-3 w-10 rounded-full ${i <= idx ? 'bg-aegis-teal' : 'bg-slate-200 dark:bg-slate-700'} ${k === 'CRITICAL' && i <= idx ? '!bg-aegis-alert' : ''}`}
            />
          ))}
        </div>
      </div>
      {why && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">{t.why} </span>
          {why}
        </div>
      )}
    </div>
  );
}
