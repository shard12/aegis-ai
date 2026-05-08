export function SkeletonList({ rows = 3 }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}

