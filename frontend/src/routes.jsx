import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home.jsx';
import { Triage } from './pages/Triage/Triage.jsx';
import { Emergency } from './pages/Emergency/Emergency.jsx';
import { Hospitals } from './pages/Hospitals/Hospitals.jsx';
import { Reports } from './pages/Reports/Reports.jsx';
import { Profiles } from './pages/Profiles/Profiles.jsx';
import { History } from './pages/History/History.jsx';
import { Settings } from './pages/Settings/Settings.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/triage" element={<Triage />} />
      <Route path="/emergency" element={<Emergency />} />
      <Route path="/hospitals" element={<Hospitals />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      {/* Kept as routes, accessed via Settings (not top nav). */}
      <Route path="/profiles" element={<Profiles />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}
