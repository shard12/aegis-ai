import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { saveContext } from '../../services/api.js';
import { useLang } from '../../context/LanguageContext.jsx';

export function FamilyProfiles() {
  const { t } = useLang();
  const { profile, setProfile } = useApp();
  const [status, setStatus] = useState('');
  const emergencyContacts = Array.isArray(profile.emergencyContacts) ? profile.emergencyContacts : [];

  async function save() {
    setStatus(t.saving);
    try {
      await saveContext(profile);
      setStatus(t.save_success);
    } catch {
      setStatus(t.save_local);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <label className="block text-sm">
        <span className="text-slate-600">{t.name_label}</span>
        <input
          value={profile.profileName}
          onChange={(e) => setProfile({ ...profile, profileName: e.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">{t.age_label}</span>
        <input
          value={profile.age}
          onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">{t.allergies_label}</span>
        <input
          value={profile.allergies.join(', ')}
          onChange={(e) =>
            setProfile({
              ...profile,
              allergies: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">{t.contacts_phone_label}</span>
        <input
          value={emergencyContacts.join(', ')}
          onChange={(e) =>
            setProfile({
              ...profile,
              emergencyContacts: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">{t.notes_label}</span>
        <textarea
          value={profile.notes}
          onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
        />
      </label>
      <button type="button" onClick={save} className="rounded-xl bg-aegis-teal px-4 py-2 font-semibold text-white">
        {t.save_profile}
      </button>
      {status && <p className="text-xs text-slate-500">{status}</p>}
    </div>
  );
}
