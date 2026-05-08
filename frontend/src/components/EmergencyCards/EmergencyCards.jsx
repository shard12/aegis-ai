import { useNavigate } from 'react-router-dom';
import { EMERGENCY_QUICK } from '../../utils/constants.js';
import { useLang } from '../../context/LanguageContext.jsx';

export function EmergencyCards() {
  const { t } = useLang();
  const nav = useNavigate();
  const iconById = {
    chest: '❤️',
    breath: '🫁',
    accident: '🚑',
    burn: '🔥',
    poison: '⚠️',
    fever: '🌡️',
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 pt-4">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Emergency quick actions</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Start with a symptom template and continue to guided triage.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EMERGENCY_QUICK.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => nav('/triage', { state: { preset: c.hint } })}
            className="tap-scale glass-card gradient-ring group flex min-h-[132px] flex-col rounded-3xl p-5 text-left transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100/80 text-xl dark:bg-slate-800/80">
                {iconById[c.id] || '🩺'}
              </span>
              <span className="rounded-full bg-aegis-teal/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-aegis-tealDark dark:text-teal-300">
                urgent
              </span>
            </div>
            <span className="mt-4 font-semibold text-slate-900 dark:text-white">{t[c.labelKey]}</span>
            <span className="mt-1 text-xs text-slate-500 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">→ {t.triage}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
