import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { Header } from './components/Header/Header.jsx';
import { DisclaimerBanner } from './components/DisclaimerBanner/DisclaimerBanner.jsx';
import { AppRoutes } from './routes.jsx';

export default function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <DisclaimerBanner />
            <Header />
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    </AppProvider>
  );
}
