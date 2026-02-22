// ── StatCard ──────────────────────────────────────────────────
const COLORS = {
  red:    { bg:'rgba(230,57,70,0.12)',  border:'rgba(230,57,70,0.25)',  text:'#e63946' },
  blue:   { bg:'rgba(76,201,240,0.1)', border:'rgba(76,201,240,0.25)', text:'#4cc9f0' },
  green:  { bg:'rgba(6,214,160,0.1)',  border:'rgba(6,214,160,0.25)',  text:'#06d6a0' },
  orange: { bg:'rgba(244,162,97,0.12)',border:'rgba(244,162,97,0.25)', text:'#f4a261' },
  purple: { bg:'rgba(123,94,167,0.12)',border:'rgba(123,94,167,0.25)', text:'#b39ddb' },
  yellow: { bg:'rgba(249,199,79,0.1)', border:'rgba(249,199,79,0.25)', text:'#f9c74f' },
};

export function StatCard({ title, value, icon, color }) {
  const c = COLORS[color] || COLORS.blue;
  return (
    <div className="stat-card" style={{ borderColor: c.border }}>
      <div className="stat-icon-wrap" style={{ background: c.bg }}>
        <i className={`fa-solid ${icon}`} style={{ color: c.text }}></i>
      </div>
      <div className="stat-body">
        <div className="stat-title">{title}</div>
        <div className="stat-value" style={{ color: c.text }}>{value}</div>
      </div>
    </div>
  );
}

// ── AlertBanner ───────────────────────────────────────────────
const ALERT_CFG = {
  Danger:   { icon:'fa-circle-radiation',     cls:'alert-danger',   label:'DANGER'   },
  Warning:  { icon:'fa-triangle-exclamation', cls:'alert-warning',  label:'WARNING'  },
  Advisory: { icon:'fa-circle-info',          cls:'alert-advisory', label:'ADVISORY' },
  Resolved: { icon:'fa-circle-check',         cls:'alert-resolved', label:'RESOLVED' },
};

export function AlertBanner({ level, message, zone, time, sentBy, onDismiss, compact }) {
  const cfg = ALERT_CFG[level] || ALERT_CFG.Advisory;
  return (
    <div className={`alert-banner ${cfg.cls}${compact ? ' compact' : ''}`}>
      <div className="alert-icon"><i className={`fa-solid ${cfg.icon}`}></i></div>
      <div className="alert-content">
        <div className="alert-header-row">
          <span className="alert-level-tag">{cfg.label}</span>
          <span className="alert-zone">{zone}</span>
          {time && <span className="alert-time">{new Date(time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</span>}
        </div>
        <p className="alert-message">{message}</p>
        {sentBy && !compact && <div className="alert-meta"><i className="fa-solid fa-user"></i> Sent by {sentBy}</div>}
      </div>
      {onDismiss && <button className="alert-dismiss" onClick={onDismiss}><i className="fa-solid fa-xmark"></i></button>}
    </div>
  );
}

// ── ConfirmModal ──────────────────────────────────────────────
export function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = 'Delete', confirmColor = 'var(--accent-red)' }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ color: confirmColor }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 8 }}></i>{title}
          </h3>
          <button className="modal-close" onClick={onCancel}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" style={{ background: `rgba(230,57,70,.2)`, color: confirmColor, border: `1px solid rgba(230,57,70,.4)` }} onClick={onConfirm}>
            <i className="fa-solid fa-trash"></i> {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
