import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext.jsx';

export function Hero() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.15),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.1),transparent_45%)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="glass-card gradient-ring rounded-[28px] p-8 sm:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-aegis-tealDark dark:text-teal-300">Emergency readiness platform</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              {t.tagline}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Clinical-grade triage, one-tap SOS escalation, real-time hospital discovery, and clinician-ready handoff reports in one calm interface.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/triage"
                className="tap-scale inline-flex min-h-[54px] min-w-[250px] items-center justify-center rounded-2xl bg-gradient-to-r from-red-600 to-aegis-alert px-8 py-4 text-base font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-700 hover:to-red-700"
              >
                {t.need_help}
              </Link>
              <Link
                to="/triage"
                className="tap-scale inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-slate-300 bg-white/90 px-8 py-4 text-base font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {t.triage}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
