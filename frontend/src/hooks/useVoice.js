import { useCallback, useRef, useState } from 'react';

export function useVoice(lang = 'en-IN') {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const speak = useCallback(
    (text) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    },
    [lang],
  );

  const listen = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return Promise.reject(new Error('Speech recognition not supported'));

    return new Promise((resolve, reject) => {
      const rec = new SR();
      rec.lang = lang;
      rec.interimResults = false;
      rec.continuous = false;
      recRef.current = rec;
      rec.onresult = (ev) => {
        const t = ev.results[0][0].transcript;
        setListening(false);
        resolve(t);
      };
      rec.onerror = (ev) => {
        setListening(false);
        reject(new Error(ev.error));
      };
      rec.onend = () => setListening(false);
      setListening(true);
      rec.start();
    });
  }, [lang]);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    setListening(false);
  }, []);

  return { listen, speak, stop, listening };
}
