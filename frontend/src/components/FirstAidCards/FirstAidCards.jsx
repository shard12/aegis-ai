import { useLang } from '../../context/LanguageContext.jsx';

export function FirstAidCards({ firstAid }) {
  const { t } = useLang();
  if (!firstAid) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t.first_aid}</h3>
      <ol className="space-y-2">
        {firstAid.steps?.map((s) => (
          <li key={s.n} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aegis-teal/15 text-sm font-bold text-aegis-tealDark">
              {s.n}
            </span>
            <span className="text-sm text-slate-700 dark:text-slate-300">{s.text}</span>
          </li>
        ))}
      </ol>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
          <p className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400">Do</p>
          <ul className="mt-2 list-inside list-disc text-sm text-emerald-900 dark:text-emerald-200">
            {firstAid.dos?.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50/80 p-4 dark:border-red-900 dark:bg-red-950/40">
          <p className="text-xs font-bold uppercase text-red-800 dark:text-red-400">Don&apos;t</p>
          <ul className="mt-2 list-inside list-disc text-sm text-red-900 dark:text-red-200">
            {firstAid.donts?.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      {firstAid.warnings?.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          {firstAid.warnings.join(' ')}
        </div>
      )}
    </div>
  );
}
