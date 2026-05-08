import { Link } from 'react-router-dom';
import { HistoryTimeline } from '../../components/HistoryTimeline/HistoryTimeline.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export function History() {
  const { t } = useLang();
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="text-sm text-aegis-teal underline">
        {t.home}
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold">{t.incident_history_title}</h1>
      <div className="mt-6">
        <HistoryTimeline />
      </div>
    </main>
  );
}
