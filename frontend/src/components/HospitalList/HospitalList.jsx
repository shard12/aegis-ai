import { SkeletonList } from '../ui/SkeletonList.jsx';
import { StateCard } from '../ui/StateCard.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export function HospitalList({ hospitals, loading, error, onRetry }) {
  const { t } = useLang();
  if (loading) return <SkeletonList rows={4} />;
  if (error) {
    return (
      <StateCard
        tone="danger"
        title={t.hospitals_load_failed}
        message={error}
        action={
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-900 hover:bg-red-50 dark:border-red-800 dark:bg-slate-900 dark:text-red-200 dark:hover:bg-red-950/50"
          >
            {t.try_again}
          </button>
        }
      />
    );
  }
  if (!hospitals?.length) {
    return <StateCard title={t.no_facilities_found} message={t.check_location_and_retry} />;
  }

  return (
    <ul className="space-y-3">
      {hospitals.map((h) => (
        <li
          key={h.id}
          className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <span className="font-medium text-slate-900 dark:text-white">{h.name}</span>
            {h.distance_km != null && (
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-aegis-tealDark dark:bg-teal-950 dark:text-teal-400">
                {h.distance_km.toFixed(1)} km
              </span>
            )}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <div>
              {(h.category || t.medical).toString()}
              {h.phone ? ` · ${h.phone}` : ''}
            </div>
            {h.address ? <div className="mt-1">{h.address}</div> : null}
            {h.website ? (
              <a
                href={h.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block font-medium text-aegis-teal hover:underline"
              >
                Website
              </a>
            ) : null}
          </div>
          {h.maps_url && (
            <a href={h.maps_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-aegis-teal hover:underline">
              Directions
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
