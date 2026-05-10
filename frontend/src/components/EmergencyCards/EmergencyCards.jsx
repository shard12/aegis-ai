import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Ambulance, Flame, HeartPulse, Siren, ThermometerSun, Wind } from 'lucide-react';
import { EMERGENCY_QUICK } from '../../utils/constants.js';
import { useLang } from '../../context/LanguageContext.jsx';
import chestImage from '../../assets/emergency/chest.svg';
import breathImage from '../../assets/emergency/breath.svg';
import accidentImage from '../../assets/emergency/accident.svg';
import burnImage from '../../assets/emergency/burn.svg';
import poisonImage from '../../assets/emergency/poison.svg';
import feverImage from '../../assets/emergency/fever.svg';

export function EmergencyCards() {
  const { t } = useLang();
  const nav = useNavigate();
  const cardMeta = {
    chest: { icon: HeartPulse, image: chestImage },
    breath: { icon: Wind, image: breathImage },
    accident: { icon: Ambulance, image: accidentImage },
    burn: { icon: Flame, image: burnImage },
    poison: { icon: AlertTriangle, image: poisonImage },
    fever: { icon: ThermometerSun, image: feverImage },
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
        {EMERGENCY_QUICK.map((c) => {
          const Icon = cardMeta[c.id]?.icon || Siren;
          const image = cardMeta[c.id]?.image || chestImage;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => nav('/triage', { state: { preset: c.hint } })}
              className="tap-scale glass-card gradient-ring group flex min-h-[220px] flex-col overflow-hidden rounded-3xl p-0 text-left transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="h-28 w-full overflow-hidden">
                <img src={image} alt={`${t[c.labelKey]} emergency`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100/80 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-aegis-teal/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-aegis-tealDark dark:text-teal-300">
                    urgent
                  </span>
                </div>
                <span className="mt-4 font-semibold text-slate-900 dark:text-white">{t[c.labelKey]}</span>
                <span className="mt-1 text-xs text-slate-500 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">→ {t.triage}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
