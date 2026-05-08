import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HospitalList } from '../../components/HospitalList/HospitalList.jsx';
import { loadHospitals } from '../../services/hospitalFinder.js';
import { getCurrentPosition } from '../../services/geolocation.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

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
    <main className="mx-auto max-w-xl px-4 py-8">
      <Link to="/" className="text-sm text-aegis-teal underline">
        {t.home}
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold">{t.nearby_facilities}</h1>
      <p className="text-sm text-slate-500">{t.hospitals_realtime_caption}</p>
      <div className="mt-6">
        <HospitalList hospitals={hospitals} loading={loading} error={error} onRetry={fetchHospitals} />
      </div>
    </main>
  );
}
