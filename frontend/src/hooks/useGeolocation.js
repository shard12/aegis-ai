import { useEffect, useState, useCallback } from 'react';
import { getCurrentPosition, watchPosition } from '../services/geolocation';

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const c = await getCurrentPosition();
      setCoords(c);
      return c;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);

  useEffect(() => {
    if (!tracking) return undefined;
    setError(null);
    const stop = watchPosition(
      (c) => setCoords(c),
      (e) => setError(e.message),
    );
    return stop;
  }, [tracking]);

  return { coords, error, refresh, tracking, setTracking };
}
