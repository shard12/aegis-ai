import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ReportCard } from '../../components/ReportCard/ReportCard.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { generateReport } from '../../services/api.js';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { useLang } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { SkeletonList } from '../../components/ui/SkeletonList.jsx';
import { GlassPanel } from '../../components/dashboard/GlassPanel.jsx';
import { StateCard } from '../../components/ui/StateCard.jsx';

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
    <main className="app-page max-w-6xl">
      <GlassPanel title={t.report_title}>
        <Link to="/triage" className="text-sm text-cyan-700 underline dark:text-cyan-300">
          ← Triage
        </Link>
        {!triage && <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">{t.report_requires_triage}</p>}
        <button
          type="button"
          disabled={loading || !triage}
          onClick={gen}
          className="ripple-btn mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50"
        >
          {loading ? t.generating : t.generate_handoff}
        </button>
      </GlassPanel>
      {error ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {error}
        </div>
      ) : null}
      {loading ? <div className="mt-6"><SkeletonList rows={2} /></div> : null}
      {!loading && !report && !triage ? (
        <div className="mt-6">
          <StateCard
            tone="warning"
            title={t.report_requires_triage}
            message={t.report_empty_hint || 'Start triage first, then come back to generate a clinician-ready report.'}
            action={
              <Link to="/triage" className="app-btn-secondary">
                {t.triage}
              </Link>
            }
          />
        </div>
      ) : null}
      {report && <ReportCard report={report} onCopy={copy} onDownloadPdf={pdf} />}
    </main>
  );
}
