export function StateCard({ tone = 'neutral', title, message, action }) {
  const cls =
    tone === 'danger'
      ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200'
      : tone === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200'
        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300';
  return (
    <div className={`rounded-2xl border p-4 ${cls}`}>
      {title ? <p className="text-sm font-semibold">{title}</p> : null}
      {message ? <p className="mt-1 text-sm">{message}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

