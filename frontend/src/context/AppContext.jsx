import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AppContext = createContext(null);

const defaultProfile = {
  id: 'default',
  profileName: '',
  age: '',
  dob: '',
  gender: '',
  bloodGroup: '',
  allergies: [],
  chronicConditions: [],
  medications: [],
  notes: '',
  emergencyNotes: '',
  primaryLanguage: 'en',
  address: '',
  city: '',
  gpsConsent: 'ask', // ask | granted | denied
  preferredHospitalRadiusKm: 8,
  insuranceNotes: '',
};

const defaultSettings = {
  accessibility: {
    largeText: false,
    reduceMotion: false,
    highContrast: false,
  },
  notifications: {
    quietMode: false,
    vibration: true,
  },
  telegramRecipients: [], // { id, name, relationship, phone, chatId, enabled, primary }
  emergencyContacts: [], // { id, name, relationship, phone, chatId, enabled, primary, priority }
};

function safeParseJson(s, fallback) {
  try {
    if (!s) return fallback;
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('aegis_lang') || 'en');
  const [careMode, setCareMode] = useState(() => localStorage.getItem('aegis_care') === '1');
  const [bystander, setBystander] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('aegis_dark') === '1');
  const [profile, setProfile] = useState(() => safeParseJson(localStorage.getItem('aegis_profile'), defaultProfile));
  const [settings, setSettings] = useState(() =>
    safeParseJson(localStorage.getItem('aegis_settings'), defaultSettings),
  );
  const [triageSession, setTriageSession] = useState(null);

  useEffect(() => {
    localStorage.setItem('aegis_lang', lang);
  }, [lang]);
  useEffect(() => {
    localStorage.setItem('aegis_care', careMode ? '1' : '0');
  }, [careMode]);
  useEffect(() => {
    localStorage.setItem('aegis_dark', dark ? '1' : '0');
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  useEffect(() => {
    localStorage.setItem('aegis_profile', JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem('aegis_settings', JSON.stringify(settings));
  }, [settings]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      careMode,
      setCareMode,
      bystander,
      setBystander,
      dark,
      setDark,
      profile,
      setProfile,
      settings,
      setSettings,
      triageSession,
      setTriageSession,
    }),
    [lang, careMode, bystander, dark, profile, settings, triageSession],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp inside AppProvider');
  return ctx;
}
