import { useLang } from '../../context/LanguageContext.jsx';

export function FollowUpQuestions({ questions, answers, onChange, onSubmit, loading }) {
  const { t } = useLang();
  if (!questions?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t.followups_title}</h3>
      <p className="text-sm text-slate-500">{t.followups_subtitle}</p>
      <div className="mt-4 space-y-4">
        {questions.map((q, i) => (
          <label key={i} className="block text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">{q}</span>
            <input
              value={answers[i] || ''}
              onChange={(e) => {
                const next = [...answers];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        disabled={loading}
        onClick={onSubmit}
        className="mt-6 w-full rounded-xl bg-aegis-teal py-3 font-semibold text-white hover:bg-aegis-tealDark disabled:opacity-50"
      >
        {loading ? t.analyzing : t.analyze}
      </button>
    </div>
  );
}
