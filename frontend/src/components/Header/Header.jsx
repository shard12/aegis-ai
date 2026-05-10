import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ActivitySquare, AlertTriangle, Bell, FileText, Hospital, Menu, Settings, Sparkles, X } from 'lucide-react';
import { useLang } from '../../context/LanguageContext.jsx';
import { useApp } from '../../context/AppContext.jsx';

export function Header() {
  const { t } = useLang();
  const { careMode } = useApp();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const nav = [
    { to: '/', label: t.home || 'Dashboard', icon: ActivitySquare },
    { to: '/emergency', label: t.sos || 'Emergency', icon: AlertTriangle },
    { to: '/hospitals', label: t.hospitals || 'Hospitals', icon: Hospital },
    { to: '/reports', label: t.reports || 'Reports', icon: FileText },
    { to: '/triage', label: t.triage || 'AI Assistant', icon: Sparkles },
    { to: '/settings', label: t.settings || 'Settings', icon: Settings },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-cyan-400/10 dark:bg-slate-950/80 ${careMode ? 'text-lg' : ''}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
          </span>
          {t.brand}
        </Link>
        <nav className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 md:flex dark:border-white/10 dark:bg-white/5">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
                  loc.pathname === n.to
                    ? 'bg-cyan-500/15 text-cyan-700 dark:bg-cyan-400/20 dark:text-cyan-200'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">
            <Bell className="h-4 w-4" />
          </button>
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 text-xs font-bold text-white">AA</div>
          <Link to="/emergency" className="inline-flex min-h-[38px] items-center rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-3 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition hover:from-red-600 hover:to-rose-600">
            {t.sos || 'Emergency'}
          </Link>
        </div>
        <button type="button" onClick={() => setOpen((s) => !s)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 md:hidden">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="mx-4 mb-3 rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900/95 md:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10">
              {n.label}
            </Link>
          ))}
          <Link to="/emergency" onClick={() => setOpen(false)} className="mt-1 block rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">
            {t.sos || 'Emergency'}
          </Link>
        </div>
      )}
    </header>
  );
}
