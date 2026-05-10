import { motion } from 'framer-motion';

export function StatCard({ label, value, trend, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="animated-border rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 dark:border-cyan-300/20 dark:bg-slate-900/75"
    >
      <div className="flex items-center justify-between">
        {Icon ? <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-300" /> : <span />}
        {trend ? <span className="text-xs text-emerald-700 dark:text-emerald-300">{trend}</span> : null}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="text-xs text-slate-600 dark:text-slate-400">{label}</p>
    </motion.div>
  );
}
