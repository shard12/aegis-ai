import { useLang } from '../../context/LanguageContext.jsx';
import { jsPDF } from 'jspdf';
import { formatDateTime, getTimeZoneLabel } from '../../utils/datetime.js';
import aegisMark from '../../assets/aegis-mark.svg';

export function ReportCard({ report, onCopy, onDownloadPdf }) {
  const { t } = useLang();
  if (!report) return null;

  const text = JSON.stringify(report, null, 2);

  async function svgUrlToPngDataUrl(url, size = 80) {
    const svgText = await fetch(url).then((r) => r.text());
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
    const svgObjectUrl = URL.createObjectURL(svgBlob);
    try {
      const img = new Image();
      img.decoding = 'async';
      img.src = svgObjectUrl;
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
      });
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      return canvas.toDataURL('image/png');
    } finally {
      URL.revokeObjectURL(svgObjectUrl);
    }
  }

  async function downloadPdf() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const pageW = doc.internal.pageSize.getWidth();
    const maxW = pageW - margin * 2;
    let y = 44;

    // Header bar
    doc.setFillColor(6, 182, 212); // cyan-500
    doc.rect(0, 0, pageW, 72, 'F');

    // Logo
    try {
      const logo = await svgUrlToPngDataUrl(aegisMark, 52);
      doc.addImage(logo, 'PNG', margin, 12, 52, 52);
    } catch {
      // ignore logo failures
    }

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(report.title || 'Aegis Emergency Report', margin + 64, 36);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generated: ${formatDateTime(report.generated_at, { includeSeconds: true })}`, margin + 64, 54);
    doc.text(`Time zone: ${getTimeZoneLabel()}`, pageW - margin, 54, { align: 'right' });

    y = 98;

    // Section helper
    function sectionTitle(title) {
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(title, margin, y);
      y += 10;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageW - margin, y);
      y += 16;
    }

    function kvRow(label, value) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text(`${label}`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const lines = doc.splitTextToSize(String(value || '—'), maxW - 160);
      doc.text(lines, margin + 160, y);
      y += Math.max(16, lines.length * 13);
      if (y > 770) {
        doc.addPage();
        y = 60;
      }
    }

    sectionTitle('Patient & context');
    kvRow('Patient', report.patient?.profileName || report.patient?.fullName || '—');
    kvRow('Age / DOB', [report.patient?.age, report.patient?.dob].filter(Boolean).join(' / ') || '—');
    kvRow('Allergies', Array.isArray(report.patient?.allergies) ? report.patient.allergies.join(', ') : '—');
    kvRow('Medications', Array.isArray(report.patient?.medications) ? report.patient.medications.join(', ') : '—');
    kvRow(
      'Chronic conditions',
      Array.isArray(report.patient?.chronicConditions) ? report.patient.chronicConditions.join(', ') : '—',
    );
    kvRow('Emergency notes', report.patient?.emergencyNotes || report.patient?.notes || '—');

    sectionTitle('Triage summary');
    kvRow('Summary', report.presentation?.medical_summary || '—');
    kvRow('Category', report.presentation?.intent || '—');
    kvRow('Urgency', report.presentation?.risk_level || '—');
    kvRow('Recommended action', report.presentation?.recommended_action || '—');
    kvRow('Map link', report.location?.maps_url || '—');

    if (Array.isArray(report.nearest_hospitals) && report.nearest_hospitals.length) {
      sectionTitle('Nearest facilities');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      for (const h of report.nearest_hospitals.slice(0, 6)) {
        const line = `${h.name || 'Facility'}${h.distance_km != null ? ` • ${h.distance_km.toFixed(1)} km` : ''}`;
        const lines = doc.splitTextToSize(line, maxW);
        doc.text(lines, margin, y);
        y += lines.length * 13;
        if (y > 760) {
          doc.addPage();
          y = 60;
        }
      }
    }

    // Footer disclaimer
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const disclaimer = report.disclaimer || '';
    const dLines = doc.splitTextToSize(disclaimer, maxW);
    if (y > 740) {
      doc.addPage();
      y = 60;
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
          <p className="text-xs text-slate-500">{formatDateTime(report.generated_at, { includeSeconds: true })}</p>
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
              onClick={() => downloadPdf()}
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
