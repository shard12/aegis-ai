import { motion } from 'framer-motion';

export function ActionCard({ title, description, badge, icon: Icon, onAction, actionLabel = 'Quick Action', urgent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group animated-border rounded-2xl border bg-white/90 p-4 shadow-sm backdrop-blur-xl transition hover:border-cyan-300/50 hover:shadow-lg dark:bg-slate-900/80 dark:shadow-none ${
        urgent ? 'pulse-soft border-rose-300/40 dark:border-rose-300/25' : 'border-slate-200 dark:border-white/10'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-700 dark:text-cyan-200">
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        {badge ? (
          <span className="rounded-full border border-rose-300/40 bg-rose-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-rose-700 dark:border-rose-300/20 dark:text-rose-200">
            {badge}
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{description}</p>
      <button onClick={onAction} className="ripple-btn mt-4 w-full rounded-lg border border-cyan-300/40 bg-cyan-500/10 py-2 text-xs font-semibold text-cyan-700 transition group-hover:bg-cyan-500/20 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-100 dark:group-hover:bg-cyan-400/20">
        {actionLabel}
      </button>
    </motion.div>
  );
}
