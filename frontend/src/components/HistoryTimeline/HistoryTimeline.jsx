import { useEffect, useState } from 'react';
import { fetchHistory } from '../../services/api.js';
import { useLang } from '../../context/LanguageContext.jsx';

export function HistoryTimeline() {
  const { t } = useLang();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchHistory(40)
      .then((d) => setItems(d.history || []))
      .catch(() => setErr(t.history_load_error));
  }, []);

  if (err) return <p className="text-sm text-amber-600">{err}</p>;
  if (!items.length) return <p className="text-sm text-slate-500">{t.no_incidents}</p>;

  return (
    <ul className="space-y-3">
      {items.map((h) => (
        <li key={h.id} className="rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="font-mono text-xs text-slate-400">{h.at}</span>
          <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">{h.type}</span>
          <pre className="mt-2 max-h-40 overflow-auto text-xs">{JSON.stringify(h, null, 2)}</pre>
        </li>
      ))}
    </ul>
  );
}
