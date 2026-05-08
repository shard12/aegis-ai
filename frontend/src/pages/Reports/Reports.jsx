import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ReportCard } from '../../components/ReportCard/ReportCard.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { generateReport } from '../../services/api.js';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { SkeletonList } from '../../components/ui/SkeletonList.jsx';

export function Reports() {
  const { profile, settings } = useApp();
  const { t } = useLang();
  const toast = useToast();
  const loc = useLocation();
  const triage = loc.state?.triage;
  const { coords, refresh } = useGeolocation();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function gen() {
    setLoading(true);
    setError('');
    try {
      let c = coords;
      if (!c) {
        try {
          c = await refresh();
        } catch {
          /* */
        }
      }
      const res = await generateReport({
        triage,
        patient: profile,
        location: c ? { lat: c.lat, lng: c.lng } : null,
        contacts_alerted: (settings?.emergencyContacts || []).filter((x) => x.enabled !== false),
        telegram_sent: false,
      });
      setReport(res.report);
      toast.push({ tone: 'success', message: 'Report generated.' });
    } catch (e) {
      setError(e.message || 'Report generation failed');
      toast.push({ tone: 'danger', message: e.message || 'Report generation failed' });
    } finally {
      setLoading(false);
    }
  }

  function copy(txt) {
    navigator.clipboard.writeText(txt);
    toast.push({ tone: 'success', message: 'Copied to clipboard.' });
  }

  function pdf() {
    // handled inside ReportCard (client-side PDF export)
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/triage" className="text-sm text-aegis-teal underline">
        ← Triage
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold">{t.report_title}</h1>
      {!triage && <p className="mt-2 text-sm text-amber-700">{t.report_requires_triage}</p>}
      <button
        type="button"
        disabled={loading || !triage}
        onClick={gen}
        className="mt-4 rounded-xl bg-aegis-teal px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {loading ? t.generating : t.generate_handoff}
      </button>
      {error ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {error}
        </div>
      ) : null}
      {loading ? <div className="mt-6"><SkeletonList rows={2} /></div> : null}
      {report && <ReportCard report={report} onCopy={copy} onDownloadPdf={pdf} />}
    </main>
  );
}
