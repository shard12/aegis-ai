import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HospitalList } from '../../components/HospitalList/HospitalList.jsx';
import { loadHospitals } from '../../services/hospitalFinder.js';
import { getCurrentPosition } from '../../services/geolocation.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useLang } from '../../context/LanguageContext.jsx';
import { GlassPanel } from '../../components/dashboard/GlassPanel.jsx';

const FALLBACK_COORDS = { lat: 12.9716, lng: 77.5946 }; // Bengaluru center

export function Hospitals() {
  const { t } = useLang();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();

  async function fetchHospitals() {
    setLoading(true);
    setError('');
    try {
      const pos = await getCurrentPosition();
      const res = await loadHospitals(pos);
      setHospitals(res.hospitals || []);
    } catch (e) {
      // Graceful fallback: still load live hospitals using default regional coordinates.
      try {
        const res = await loadHospitals(FALLBACK_COORDS);
        setHospitals(res.hospitals || []);
        const msg = t.hospitals_fallback_notice || 'Location unavailable. Showing nearby hospitals for a default region.';
        toast.push({ tone: 'neutral', message: msg });
      } catch (fallbackErr) {
        const msg = fallbackErr?.message || e?.message || t.hospitals_fetch_error;
        setError(msg);
        setHospitals([]);
        toast.push({ tone: 'danger', message: msg });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchHospitals();
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="app-page max-w-6xl">
      <GlassPanel title={t.nearby_facilities} subtitle={t.hospitals_realtime_caption} className="mb-6">
        <Link to="/" className="text-sm text-cyan-700 underline dark:text-cyan-300">
          {t.home}
        </Link>
      </GlassPanel>
      <div className="mt-6">
        <HospitalList hospitals={hospitals} loading={loading} error={error} onRetry={fetchHospitals} />
      </div>
    </main>
  );
}
