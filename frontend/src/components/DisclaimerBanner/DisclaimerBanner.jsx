import { useLang } from '../../context/LanguageContext.jsx';

export function DisclaimerBanner() {
  const { t } = useLang();
  return (
    <div className="border-b border-slate-200/70 bg-white/70 px-4 py-2.5 text-center text-xs text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
      <span className="mx-auto inline-flex max-w-4xl items-center justify-center rounded-full bg-slate-100/80 px-3 py-1 font-medium dark:bg-slate-800/80">
        {t.disclaimer_short}
      </span>
    </div>
  );
}
