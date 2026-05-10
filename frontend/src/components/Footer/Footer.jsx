import { Globe, Link2, Shield } from 'lucide-react';
import { useLang } from '../../context/LanguageContext.jsx';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6 dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-cyan-300" />
          <span className="font-semibold text-slate-900 dark:text-slate-200">Aegis AI</span>
          <span>Emergency Intelligence Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200">Emergency Support</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200">Privacy</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200">Terms</a>
        </div>
        <div className="flex items-center gap-2">
          <a href="#" className="grid h-8 w-8 place-items-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"><Globe className="h-4 w-4" /></a>
          <a href="#" className="grid h-8 w-8 place-items-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"><Link2 className="h-4 w-4" /></a>
        </div>
        <p className="w-full text-xs text-slate-500 dark:text-slate-500">{t.disclaimer_short}</p>
      </div>
    </footer>
  );
}
