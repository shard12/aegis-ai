export function GlassPanel({ title, subtitle, right, children, className = '' }) {
  return (
    <section className={`animated-border rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-cyan-300/20 dark:bg-slate-900/75 ${className}`}>
      {(title || subtitle || right) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p> : null}
          </div>
          {right || null}
        </div>
      )}
      {children}
    </section>
  );
}
