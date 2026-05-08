import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext.jsx';
import { useApp } from '../../context/AppContext.jsx';

export function Header() {
  const { t } = useLang();
  const { careMode } = useApp();
  const loc = useLocation();

  const nav = [
    { to: '/triage', label: t.triage },
    { to: '/emergency', label: t.sos },
    { to: '/hospitals', label: t.hospitals },
    { to: '/reports', label: t.reports },
    { to: '/settings', label: t.settings },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 ${careMode ? 'text-lg' : ''}`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight text-aegis-tealDark dark:text-teal-400">
          {t.brand}
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                loc.pathname === n.to ? 'text-aegis-teal' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
