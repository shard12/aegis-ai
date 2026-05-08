import { Link } from 'react-router-dom';
import { FamilyProfiles } from '../../components/FamilyProfiles/FamilyProfiles.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export function Profiles() {
  const { t } = useLang();
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="text-sm text-aegis-teal underline">
        {t.home}
      </Link>
      <h1 className="mt-4 font-display text-2xl font-bold">{t.profile_page_title}</h1>
      <p className="text-sm text-slate-500">{t.profile_page_caption}</p>
      <div className="mt-6">
        <FamilyProfiles />
      </div>
    </main>
  );
}
