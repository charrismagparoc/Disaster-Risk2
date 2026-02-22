import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useWeather } from '../context/WeatherContext';

const PAGE_TITLES = {
  dashboard:'Dashboard Overview', map:'GIS Hazard Map', incidents:'Incident Management',
  alerts:'Alert System', evacuation:'Evacuation Centers', residents:'Resident Management',
  resources:'Resource Management', reports:'Reports & Analytics',
  intelligence:'Risk Intelligence', users:'User Management', activity:'Activity Log',
};

function SettingsModal({ onClose, theme, onToggleTheme }) {
  const [notifSounds, setNotifSounds] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className="fa-solid fa-gear" style={{ color: 'var(--accent-blue)', marginRight: 8 }}></i>System Settings</h3>
          <button className="modal-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="settings-group">
          <h4>Appearance</h4>
          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Dark Mode</strong>
              <span>Toggle between dark and light theme</span>
            </div>
            <div className={`toggle-switch ${theme === 'dark' ? 'on' : ''}`} onClick={onToggleTheme}></div>
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Compact View</strong>
              <span>Reduce spacing for more data density</span>
            </div>
            <div className={`toggle-switch ${compactMode ? 'on' : ''}`} onClick={() => setCompactMode(!compactMode)}></div>
          </div>
        </div>
        <div className="settings-group">
          <h4>Notifications</h4>
          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Alert Sounds</strong>
              <span>Play sound when new alert is received</span>
            </div>
            <div className={`toggle-switch ${notifSounds ? 'on' : ''}`} onClick={() => setNotifSounds(!notifSounds)}></div>
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Auto Refresh</strong>
              <span>Automatically refresh weather every 10 min</span>
            </div>
            <div className={`toggle-switch ${autoRefresh ? 'on' : ''}`} onClick={() => setAutoRefresh(!autoRefresh)}></div>
          </div>
        </div>
        <div className="settings-group">
          <h4>System Information</h4>
          <div className="settings-row">
            <div className="settings-row-info"><strong>Version</strong><span>IDRMS v1.0.0</span></div>
            <span style={{ fontSize: 12, color: 'var(--accent-green)' }}>● Active</span>
          </div>
          <div className="settings-row">
            <div className="settings-row-info"><strong>Location</strong><span>Barangay Kauswagan, CDO</span></div>
          </div>
          <div className="settings-row">
            <div className="settings-row-info"><strong>Coordinates</strong><span>8.490°N, 124.656°E</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-primary" onClick={onClose}><i className="fa-solid fa-check"></i> Save Settings</button>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ currentUser, onClose, onLogout }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className="fa-solid fa-user-circle" style={{ color: 'var(--accent-blue)', marginRight: 8 }}></i>My Profile</h3>
          <button className="modal-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
          <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg,var(--accent-blue),#3a9bbf)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 auto 16px' }}>
            {(currentUser?.name || 'A')[0].toUpperCase()}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{currentUser?.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{currentUser?.email}</div>
          <span className={`badge badge-${currentUser?.role === 'Admin' ? 'danger' : 'info'}`} style={{ marginTop: 10 }}>{currentUser?.role}</span>
        </div>
        <div className="detail-grid" style={{ marginBottom: 20 }}>
          <div className="detail-item"><span>Organization</span><strong>BDRRMC Kauswagan</strong></div>
          <div className="detail-item"><span>Access Level</span><strong>{currentUser?.role === 'Admin' ? 'Full Access' : 'Read + Edit'}</strong></div>
          <div className="detail-item"><span>Last Login</span><strong>{new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></div>
          <div className="detail-item"><span>Status</span><span className="badge badge-success">Active</span></div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn" style={{ background: 'rgba(230,57,70,.12)', color: 'var(--accent-red)', border: '1px solid rgba(230,57,70,.3)' }} onClick={onLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Topbar({ activePage, currentUser, onLogout }) {
  const { alerts } = useApp();
  const weather = useWeather();
  const [now, setNow] = useState(new Date());
  const [showNotifs,   setShowNotifs]   = useState(false);
  const [showProfile,  setShowProfile]  = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('idrms-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('idrms-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setShowSettings(false);
  };

  const activeAlerts = alerts.filter(a => a.level !== 'Resolved').slice(0, 5);
  const unread = activeAlerts.length;

  const getLevelColor = l => ({ Danger:'#e63946', Warning:'#f4a261', Advisory:'#4cc9f0', Resolved:'#06d6a0' }[l] || '#888');
  const riskCls = weather.riskLevel === 'High' ? 'high' : weather.riskLevel === 'Medium' ? 'medium' : 'low';
  const riskIcon = weather.riskLevel === 'High' ? 'fa-circle-exclamation' : weather.riskLevel === 'Medium' ? 'fa-triangle-exclamation' : 'fa-circle-check';

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dateStr = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <i className="fa-solid fa-chevron-right" style={{ fontSize: 10, opacity: .4 }}></i>
          <div className="page-breadcrumb">{PAGE_TITLES[activePage] || 'Dashboard'}</div>

          {/* Live Weather in topbar */}
          {!weather.loading && (
            <div className="topbar-weather">
              <div className="topbar-weather-item">
                <i className={`fa-solid ${weather.icon}`} style={{ color: 'var(--accent-blue)' }}></i>
                <span>{weather.condition}</span>
              </div>
              <div className="topbar-weather-item">
                <i className="fa-solid fa-temperature-half" style={{ color: 'var(--accent-orange)' }}></i>
                <span><strong>{weather.temperature}</strong>°C</span>
              </div>
              <div className="topbar-weather-item">
                <i className="fa-solid fa-wind"></i>
                <span><strong>{weather.windSpeed}</strong> km/h</span>
              </div>
              <div className={`topbar-risk-pill ${riskCls}`}>
                <i className={`fa-solid ${riskIcon}`}></i>
                {weather.riskLevel.toUpperCase()} RISK
              </div>
            </div>
          )}
        </div>

        <div className="topbar-right">
          {/* Live Date & Time */}
          <div className="topbar-datetime">
            <div className="topbar-date">{dateStr}</div>
            <div className="topbar-time">{timeStr}</div>
          </div>

          {/* Theme Toggle */}
          <button className="topbar-icon-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          {/* Notifications */}
          <div className="topbar-notif-wrap">
            <button className="topbar-icon-btn" onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}>
              <i className="fa-solid fa-bell"></i>
              {unread > 0 && <span className="notif-badge">{unread}</span>}
            </button>
            {showNotifs && (
              <>
                <div className="notif-overlay" onClick={() => setShowNotifs(false)}></div>
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <strong>Active Alerts</strong>
                    <span className="notif-count">{unread}</span>
                  </div>
                  <div className="notif-list">
                    {activeAlerts.length === 0 && (
                      <div className="notif-empty">
                        <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-green)' }}></i>
                        <p>No active alerts</p>
                      </div>
                    )}
                    {activeAlerts.map(alert => (
                      <div key={alert.id} className="notif-item">
                        <div className="notif-dot" style={{ background: getLevelColor(alert.level) }}></div>
                        <div className="notif-content">
                          <div className="notif-level" style={{ color: getLevelColor(alert.level) }}>{alert.level}</div>
                          <div className="notif-message">{alert.message}</div>
                          <div className="notif-meta">
                            <i className="fa-solid fa-location-dot"></i> {alert.zone} &nbsp;·&nbsp;
                            {alert.sentAt ? new Date(alert.sentAt).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {activeAlerts.length > 0 && (
                    <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-color)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                      Showing {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="topbar-profile-wrap">
            <button className="topbar-profile-btn" onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}>
              <div className="profile-avatar">{(currentUser?.name || 'A')[0].toUpperCase()}</div>
              <div className="profile-info">
                <div className="profile-name">{currentUser?.name || 'Admin'}</div>
                <div className="profile-role">{currentUser?.role || 'Administrator'}</div>
              </div>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: 11, opacity: .6 }}></i>
            </button>
            {showProfile && (
              <>
                <div className="notif-overlay" onClick={() => setShowProfile(false)}></div>
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <strong>{currentUser?.name}</strong>
                    <span>{currentUser?.email}</span>
                  </div>
                  <div className="profile-dropdown-item" onClick={() => { setShowProfile(false); setShowProfileModal(true); }}>
                    <i className="fa-solid fa-user"></i> My Profile
                  </div>
                  <div className="profile-dropdown-item" onClick={() => { setShowProfile(false); setShowSettings(true); }}>
                    <i className="fa-solid fa-gear"></i> Settings
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <div className="profile-dropdown-item logout" onClick={onLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfileModal(false)}
          onLogout={() => { setShowProfileModal(false); onLogout(); }}
        />
      )}
    </>
  );
}
