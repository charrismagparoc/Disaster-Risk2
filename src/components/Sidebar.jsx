const MENU_ITEMS = [
  { id:'dashboard',    label:'Dashboard',           icon:'fa-gauge-high',           gradient:'linear-gradient(135deg,#4cc9f0,#3a9bbf)' },
  { id:'map',          label:'GIS Hazard Map',      icon:'fa-map-location-dot',     gradient:'linear-gradient(135deg,#06d6a0,#04a87a)' },
  { id:'incidents',    label:'Incidents',           icon:'fa-triangle-exclamation', gradient:'linear-gradient(135deg,#f4a261,#d88a45)' },
  { id:'alerts',       label:'Alerts',              icon:'fa-bell',                 gradient:'linear-gradient(135deg,#e63946,#c9303c)' },
  { id:'evacuation',   label:'Evacuation Centers',  icon:'fa-house-flag',           gradient:'linear-gradient(135deg,#f9c74f,#e0b239)' },
  { id:'residents',    label:'Residents',           icon:'fa-users',                gradient:'linear-gradient(135deg,#7b5ea7,#634a87)' },
  { id:'resources',    label:'Resources',           icon:'fa-box',                  gradient:'linear-gradient(135deg,#06d6a0,#04a87a)' },
  { id:'reports',      label:'Reports & Analytics', icon:'fa-chart-line',           gradient:'linear-gradient(135deg,#4cc9f0,#3a9bbf)' },
  { id:'intelligence', label:'Risk Intelligence',   icon:'fa-brain',                gradient:'linear-gradient(135deg,#b39ddb,#9575cd)' },
];
const SYSTEM_ITEMS = [
  { id:'users',    label:'User Management', icon:'fa-user-gear',       gradient:'linear-gradient(135deg,#88929c,#6a7581)' },
  { id:'activity', label:'Activity Log',    icon:'fa-clock-rotate-left',gradient:'linear-gradient(135deg,#88929c,#6a7581)' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo"><i className="fa-solid fa-shield-heart"></i></div>
        <div>
          <div className="sidebar-brand-name">IDRMS</div>
          <div className="sidebar-brand-desc">BRGY. KAUSWAGAN</div>
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-section-label">MAIN MENU</div>
        {MENU_ITEMS.map(item => (
          <button key={item.id} className={`sidebar-item ${activePage === item.id ? 'active' : ''}`} onClick={() => onNavigate(item.id)}>
            <div className="sidebar-icon" style={{ background: item.gradient }}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-section-label">SYSTEM</div>
        {SYSTEM_ITEMS.map(item => (
          <button key={item.id} className={`sidebar-item ${activePage === item.id ? 'active' : ''}`} onClick={() => onNavigate(item.id)}>
            <div className="sidebar-icon" style={{ background: item.gradient }}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
