import { Hero } from '../../components/Hero/Hero.jsx';
import { EmergencyCards } from '../../components/EmergencyCards/EmergencyCards.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export function Home() {
  const { bystander, setBystander } = useApp();
  const { t } = useLang();

  return (
    <main className="pb-10">
      <Hero />
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass-card gradient-ring rounded-2xl p-4 sm:p-5">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.bystander}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enable when you are assisting someone else.</p>
            </div>
            <input
              type="checkbox"
              checked={bystander}
              onChange={(e) => setBystander(e.target.checked)}
              className="h-5 w-5 accent-teal-600"
            />
          </label>
        </div>
      </div>
      <EmergencyCards />
    </main>
  );
}
