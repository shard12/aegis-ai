import { useApp } from '../../context/AppContext.jsx';

export function LanguageSwitcher() {
  const { lang, setLang } = useApp();
  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5 text-xs dark:border-slate-700 dark:bg-slate-900">
      {['en', 'hi', 'kn', 'zh', 'ja'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`rounded-full px-2 py-1 font-medium transition ${
            lang === l
              ? 'bg-aegis-teal text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
