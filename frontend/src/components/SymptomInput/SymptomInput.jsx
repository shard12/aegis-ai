export function SymptomInput({ value, onChange, placeholder, large, micButton }) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={large ? 6 : 4}
        aria-label={placeholder}
        className={`w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 pr-14 text-slate-900 shadow-inner outline-none ring-aegis-teal/30 placeholder:text-slate-400 focus:border-aegis-teal focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${large ? 'text-xl leading-relaxed' : ''}`}
      />
      {micButton ? <div className="absolute bottom-3 right-3">{micButton}</div> : null}
    </div>
  );
}
