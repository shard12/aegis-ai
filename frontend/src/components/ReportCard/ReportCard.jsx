import { useLang } from '../../context/LanguageContext.jsx';
import { jsPDF } from 'jspdf';

export function ReportCard({ report, onCopy, onDownloadPdf }) {
  const { t } = useLang();
  if (!report) return null;

  const text = JSON.stringify(report, null, 2);

  function downloadPdf() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const pageW = doc.internal.pageSize.getWidth();
    const maxW = pageW - margin * 2;
    let y = 48;

    const heading = report.title || 'Aegis Emergency Report';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(heading, margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Generated: ${report.generated_at || ''}`, margin, y);
    y += 16;

    doc.setTextColor(20);
    doc.setFontSize(11);

    const blocks = [
      { label: 'Patient', value: report.patient?.profileName || report.patient?.fullName || '—' },
      { label: 'Age / DOB', value: [report.patient?.age, report.patient?.dob].filter(Boolean).join(' / ') || '—' },
      { label: 'Allergies', value: Array.isArray(report.patient?.allergies) ? report.patient.allergies.join(', ') : '—' },
      { label: 'Medications', value: Array.isArray(report.patient?.medications) ? report.patient.medications.join(', ') : '—' },
      { label: 'Chronic conditions', value: Array.isArray(report.patient?.chronicConditions) ? report.patient.chronicConditions.join(', ') : '—' },
      { label: 'Summary', value: report.presentation?.medical_summary || '—' },
      { label: 'Category', value: report.presentation?.intent || '—' },
      { label: 'Urgency', value: report.presentation?.risk_level || '—' },
      { label: 'Recommended action', value: report.presentation?.recommended_action || '—' },
      { label: 'Map', value: report.location?.maps_url || '—' },
    ];

    for (const b of blocks) {
      doc.setFont('helvetica', 'bold');
      doc.text(`${b.label}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(String(b.value || '—'), maxW - 110);
      doc.text(lines, margin + 110, y);
      y += Math.max(16, lines.length * 14);
      if (y > 760) {
        doc.addPage();
        y = 48;
      }
    }

    if (Array.isArray(report.nearest_hospitals) && report.nearest_hospitals.length) {
      doc.setFont('helvetica', 'bold');
      doc.text('Nearest facilities', margin, y);
      y += 14;
      doc.setFont('helvetica', 'normal');
      for (const h of report.nearest_hospitals.slice(0, 6)) {
        const line = `${h.name || 'Facility'}${h.distance_km != null ? ` • ${h.distance_km.toFixed(1)} km` : ''}`;
        const lines = doc.splitTextToSize(line, maxW);
        doc.text(lines, margin, y);
        y += lines.length * 14;
        if (y > 760) {
          doc.addPage();
          y = 48;
        }
      }
    }

    doc.setFontSize(9);
    doc.setTextColor(100);
    const disclaimer = report.disclaimer || '';
    const dLines = doc.splitTextToSize(disclaimer, maxW);
    if (y > 740) {
      doc.addPage();
      y = 48;
    }
    doc.text(dLines, margin, y + 18);

    const fname = `aegis-report-${String(report.generated_at || Date.now()).replace(/[:.]/g, '-')}.pdf`;
    doc.save(fname);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h3 className="font-display text-lg font-semibold">{report.title}</h3>
          <p className="text-xs text-slate-500">{report.generated_at}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onCopy(text)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
          >
            {t.copy_report}
          </button>
          {onDownloadPdf && (
            <button
              type="button"
              onClick={downloadPdf}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-slate-900"
            >
              {t.download_pdf}
            </button>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{report.disclaimer}</p>
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="font-medium text-slate-500">Summary</dt>
          <dd className="text-slate-900 dark:text-slate-100">{report.presentation?.medical_summary}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Risk</dt>
          <dd>{report.presentation?.risk_level}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Action</dt>
          <dd>{report.presentation?.recommended_action}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Maps</dt>
          <dd>
            {report.location?.maps_url ? (
              <a href={report.location.maps_url} className="text-aegis-teal underline" target="_blank" rel="noreferrer">
                Open
              </a>
            ) : (
              '—'
            )}
          </dd>
        </div>
      </dl>
      <pre className="mt-6 max-h-64 overflow-auto rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-950">{text}</pre>
    </div>
  );
}
