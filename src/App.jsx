import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { WeatherProvider } from './context/WeatherContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import IncidentsPage from './pages/IncidentsPage';
import AlertsPage from './pages/AlertsPage';
import { EvacuationPage, ResidentsPage } from './pages/EvacResidents';
import { ResourcesPage, ReportsPage, IntelligencePage, UsersPage, ActivityPage } from './pages/OtherPages';

// Hardcoded local credentials — no database required
const CREDENTIALS = [
  { email: 'admin@kauswagan.gov.ph', password: 'admin123', name: 'Admin', role: 'Admin' },
  { email: 'staff@kauswagan.gov.ph', password: 'admin123', name: 'Staff User', role: 'Staff' },
];

function AppInner() {
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage,  setActivePage]  = useState('dashboard');

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActivePage('dashboard');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} credentials={CREDENTIALS} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <Dashboard />;
      case 'map':          return <MapPage />;
      case 'incidents':    return <IncidentsPage />;
      case 'alerts':       return <AlertsPage />;
      case 'evacuation':   return <EvacuationPage />;
      case 'residents':    return <ResidentsPage />;
      case 'resources':    return <ResourcesPage />;
      case 'reports':      return <ReportsPage />;
      case 'intelligence': return <IntelligencePage />;
      case 'users':        return <UsersPage />;
      case 'activity':     return <ActivityPage />;
      default:             return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        <Topbar activePage={activePage} currentUser={currentUser} onLogout={handleLogout} />
        <main className="page-body">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <WeatherProvider>
        <AppInner />
      </WeatherProvider>
    </AppProvider>
  );
}
