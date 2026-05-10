import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Ambulance,
  BrainCircuit,
  Flame,
  HeartPulse,
  HeartHandshake,
  Hospital,
  LocateFixed,
  MapPinned,
  ShieldCheck,
  Siren,
  Thermometer,
  TriangleAlert,
  Wind,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { loadHospitals } from '../../services/hospitalFinder.js';
import { getCurrentPosition } from '../../services/geolocation.js';
import { StatCard } from '../../components/dashboard/StatCard.jsx';
import { ActionCard } from '../../components/dashboard/ActionCard.jsx';
import { GlassPanel } from '../../components/dashboard/GlassPanel.jsx';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton.jsx';
import { useLang } from '../../context/LanguageContext.jsx';
import { formatTime } from '../../utils/datetime.js';

export function Home() {
  const { bystander, setBystander, profile, settings } = useApp();
  const { t } = useLang();
  const nav = useNavigate();
  const [mapCoords, setMapCoords] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('aegis_onboarding_dismissed') === '1';
    const hasProfile = Boolean(profile?.profileName);
    const hasContact = (settings?.emergencyContacts || []).length > 0;
    setShowOnboarding(!dismissed && (!hasProfile || !hasContact));
  }, [profile?.profileName, settings?.emergencyContacts]);

  const statusCards = useMemo(
    () => [
      {
        label: t.nearby_facilities,
        value: String(nearbyHospitals.length || 0),
        trend: mapLoading ? t.syncing : t.live,
        icon: Hospital,
      },
      {
        label: t.location_status,
        value: mapCoords ? t.available : t.pending,
        trend: mapCoords ? 'GPS' : t.awaiting,
        icon: LocateFixed,
      },
      {
        label: t.response_mode,
        value: bystander ? t.bystander_mode : t.self_mode,
        trend: t.user,
        icon: HeartHandshake,
      },
      {
        label: t.network,
        value: navigator.onLine ? t.online : t.offline,
        trend: navigator.onLine ? t.stable : t.check,
        icon: Activity,
      },
    ],
    [nearbyHospitals.length, mapCoords, mapLoading, bystander, t],
  );

  const emergencyCards = [
    { id: 'cardiac', title: t.cardiac_arrest, desc: t.cardiac_desc, icon: HeartPulse, badge: t.badge_critical },
    { id: 'breathing', title: t.breathing_issues, desc: t.breathing_desc, icon: Wind, badge: t.badge_high },
    { id: 'trauma', title: t.accident_trauma, desc: t.trauma_desc, icon: Ambulance, badge: t.badge_critical },
    { id: 'burn', title: t.burn_injury, desc: t.burn_desc, icon: Flame, badge: t.badge_high },
    { id: 'poison', title: t.poisoning_title, desc: t.poisoning_desc, icon: TriangleAlert, badge: t.badge_critical },
    { id: 'fever', title: t.high_fever, desc: t.high_fever_desc, icon: Thermometer, badge: t.badge_moderate },
    { id: 'stroke', title: t.stroke_title, desc: t.stroke_desc, icon: Activity, badge: t.badge_critical },
    { id: 'mental', title: t.mental_health_crisis, desc: t.mental_health_desc, icon: HeartHandshake, badge: t.badge_high },
  ];

  useEffect(() => {
    (async () => {
      setMapLoading(true);
      try {
        const pos = await getCurrentPosition();
        const res = await loadHospitals(pos);
        setMapCoords(pos);
        setNearbyHospitals((res?.hospitals || []).slice(0, 3));
        setLastUpdated(formatTime(new Date()));
      } catch {
        setMapCoords({ lat: 12.9716, lng: 77.5946 });
        setNearbyHospitals([]);
        setLastUpdated(formatTime(new Date()));
      } finally {
        setMapLoading(false);
      }
    })();
  }, []);

  const mapEmbedUrl = useMemo(() => {
    if (!mapCoords) return '';
    return `https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=14&output=embed`;
  }, [mapCoords]);

  return (
    <main className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(6,182,212,0.18),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(45,212,191,0.18),transparent_30%)]" />
      <div className="app-page relative max-w-7xl space-y-7 pb-28">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-xl backdrop-blur-xl dark:border-cyan-300/20 dark:bg-slate-900/70 dark:shadow-cyan-900/20">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">{t.brand} Command</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{t.tagline}</h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {t.home_intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => nav('/emergency')} className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-3 text-sm font-semibold shadow-xl shadow-red-500/30 transition hover:scale-[1.02]">
                {t.sos}
              </button>
              <button onClick={() => nav('/triage')} className="rounded-xl border border-cyan-300/40 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-500/15 dark:border-cyan-300/30 dark:bg-cyan-400/10 dark:text-cyan-200 dark:hover:bg-cyan-300/20">
                {t.triage}
              </button>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                [t.live_gps_tracking, LocateFixed],
                [t.ai_triage_enabled, BrainCircuit],
                [t.realtime_alerts, Siren],
                [t.hipaa_ready, ShieldCheck],
              ].map(([label, Icon]) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <Icon className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-300" />
                  {label}
                </span>
              ))}
            </div>
            <label className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <input
                type="checkbox"
                checked={bystander}
                onChange={(e) => setBystander(e.target.checked)}
                className="h-4 w-4 accent-cyan-500"
              />
              {t.bystander}
            </label>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="relative rounded-3xl border border-slate-200 bg-white/90 p-5 backdrop-blur-xl dark:border-cyan-300/20 dark:bg-slate-900/70">
            <div className="absolute right-6 top-6 h-16 w-16 rounded-full border border-cyan-300/40" />
            <div className="absolute right-4 top-4 h-20 w-20 animate-ping rounded-full border border-cyan-300/20" />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.live_status}</p>
              <p className="mt-1 text-lg font-semibold">{t.emergency_network_online}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-white p-3 dark:bg-slate-950/70"><span className="text-slate-500 dark:text-slate-400">{t.risk_score}</span><p className="text-xl font-bold text-cyan-500 dark:text-cyan-300">82</p></div>
                <div className="rounded-xl bg-white p-3 dark:bg-slate-950/70"><span className="text-slate-500 dark:text-slate-400">{t.triage_level}</span><p className="text-xl font-bold text-rose-500 dark:text-rose-300">{t.badge_high}</p></div>
              </div>
              <div className="mt-3 rounded-xl bg-white p-3 text-xs text-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                <p className="mb-1 text-slate-500 dark:text-slate-400">{t.ai_activity_feed}</p>
                <p>{t.ai_activity_feed_desc}</p>
              </div>
              <div className="mt-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-3 text-xs">{t.mini_live_map_preview}</div>
            </div>
          </motion.div>
        </section>

        {showOnboarding ? (
          <section className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-4">
            <h3 className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">{t.setup_checklist}</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{t.setup_checklist_hint}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => nav('/profiles')} className="app-btn-secondary">
                {t.edit_profile}
              </button>
              <button type="button" onClick={() => nav('/settings')} className="app-btn-secondary">
                {t.settings}
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('aegis_onboarding_dismissed', '1');
                  setShowOnboarding(false);
                }}
                className="rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/10"
              >
                {t.dismiss}
              </button>
            </div>
          </section>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statusCards.map((c) => (
            <StatCard key={c.label} label={c.label} value={c.value} trend={c.trend} icon={c.icon} />
          ))}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t.emergency_action_grid}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {emergencyCards.map((item) => (
              <ActionCard
                key={item.id}
                title={item.title}
                description={item.desc}
                badge={item.badge}
                icon={item.icon}
                urgent={item.badge === 'critical'}
                onAction={() => nav('/triage', { state: { preset: item.title } })}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <GlassPanel
            title={t.quick_intake_prompts}
            subtitle={t.quick_intake_subtitle}
            right={<BrainCircuit className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {[t.prompt_chest_sweat, t.prompt_unconscious, t.prompt_breathing_difficulty, t.prompt_heavy_bleeding].map((p) => (
                <button
                  key={p}
                  onClick={() => nav('/triage', { state: { preset: p } })}
                  className="ripple-btn rounded-xl border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  {p}
                </button>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel title={t.live_map_hospitals}>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_0.9fr]">
              <div className="rounded-xl border border-cyan-300/30 bg-gradient-to-br from-cyan-500/10 to-white p-4 dark:border-cyan-300/20 dark:to-slate-900">
                <div className="mb-2 flex items-center gap-2 text-xs text-cyan-800 dark:text-cyan-200">
                  <MapPinned className="h-4 w-4" /> {t.realtime_routes_markers}
                </div>
                {mapLoading ? (
                  <LoadingSkeleton className="h-36" />
                ) : mapEmbedUrl ? (
                  <iframe title="live-map" src={mapEmbedUrl} className="h-36 w-full rounded-lg border border-white/10" loading="lazy" />
                ) : (
                  <div className="grid h-36 place-items-center rounded-lg bg-slate-50 text-xs text-slate-600 dark:bg-slate-950/70 dark:text-slate-400">{t.map_unavailable}</div>
                )}
              </div>
              <div className="space-y-2">
                {mapLoading
                  ? [1, 2, 3].map((n) => <LoadingSkeleton key={n} className="h-10" />)
                  : nearbyHospitals.length > 0
                    ? nearbyHospitals.map((h) => (
                        <div key={h.id || h.name} className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300">
                          {h.name} • {h.distance_km != null ? `${h.distance_km.toFixed(1)}km` : t.nearby} • {t.beds} {h.capacity?.available_beds ?? 'N/A'} • {t.eta} {h.eta_min ?? '--'}m
                        </div>
                      ))
                    : <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-400">{t.no_nearby_hospitals_loaded}</div>}
              </div>
            </div>
          </GlassPanel>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <h3 className="mb-2 font-semibold">{t.system_feed}</h3>
          <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">
            {t.last_updated}: {lastUpdated || t.not_synced_yet}
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200">
              {mapLoading
                ? t.refreshing_location_hospitals
                : t.location_hospital_sync_complete}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200">
              {t.no_active_emergency_timeline}
            </div>
          </div>
        </section>
      </div>

      <button onClick={() => { setBystander(false); nav('/emergency'); }} className="fixed bottom-4 right-4 z-40 rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-red-500/30 md:hidden">
        {t.sos}
      </button>
    </main>
  );
}
