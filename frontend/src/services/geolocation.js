export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      reject,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });
}

export function watchPosition(onUpdate, onError) {
  if (!navigator.geolocation) {
    onError?.(new Error('Geolocation not supported'));
    return () => {};
  }
  const id = navigator.geolocation.watchPosition(
    (pos) =>
      onUpdate({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        at: Date.now(),
      }),
    onError,
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
  );
  return () => navigator.geolocation.clearWatch(id);
}
