import { useState, useEffect } from 'react';
import '../styles/index.css';

export default function Login({ onLogin, credentials }) {
  const [form,     setForm]     = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [theme,    setTheme]    = useState('dark');

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
  };

  const handleSubmit = () => {
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const match = credentials.find(
        c => c.email === form.email && c.password === form.password
      );
      if (match) {
        onLogin({ id: 'local-1', name: match.name, role: match.role, email: match.email });
      } else {
        setError('Incorrect email or password. Try: admin@kauswagan.gov.ph / admin123');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="login-screen">
      <div className="login-grid"></div>

      <button className="login-theme-toggle" onClick={toggleTheme}>
        <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
      </button>

      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon"><i className="fa-solid fa-shield-heart"></i></div>
          <h1 className="login-brand-name">IDRMS</h1>
          <p className="login-brand-desc">Intelligent Disaster Risk Management System</p>
          <div className="login-barangay"><i className="fa-solid fa-location-dot"></i> Barangay Kauswagan, Cagayan de Oro City</div>
        </div>
        <div className="login-feature-list">
          {[
            { icon: 'fa-map-location-dot', label: 'GIS Hazard Mapping — OpenStreetMap + Leaflet' },
            { icon: 'fa-bell',             label: 'Real-Time Alert Broadcast System' },
            { icon: 'fa-house-flag',       label: 'Evacuation Center Management' },
            { icon: 'fa-brain',            label: 'Risk Intelligence Engine' },
            { icon: 'fa-users',            label: 'Resident & Vulnerability Database' },
            { icon: 'fa-file-pdf',         label: 'Branded PDF Report Export' },
          ].map(f => (
            <div key={f.label} className="login-feature-item">
              <i className={`fa-solid ${f.icon}`}></i>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Admin Login</h2>
            <p>Sign in with your IDRMS credentials</p>
          </div>

          {error && (
            <div className="login-error">
              <i className="fa-solid fa-circle-exclamation"></i>{error}
            </div>
          )}

          <div className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-envelope"></i>
                <input
                  className="form-control"
                  type="email"
                  placeholder="admin@kauswagan.gov.ph"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-lock"></i>
                <input
                  className="form-control"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <button className="toggle-pass" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <button className="btn btn-primary login-btn" onClick={handleSubmit} disabled={loading}>
              {loading
                ? <><i className="fa-solid fa-spinner fa-spin"></i> Signing in...</>
                : <><i className="fa-solid fa-right-to-bracket"></i> Sign In</>
              }
            </button>
          </div>

          <div className="login-hint">
            <i className="fa-solid fa-circle-info"></i>
            <div>
              <strong>Default credentials:</strong><br />
              <code style={{ fontSize: 12, color: 'var(--accent-blue)' }}>admin@kauswagan.gov.ph</code><br />
              <code style={{ fontSize: 12, color: 'var(--accent-green)' }}>admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
