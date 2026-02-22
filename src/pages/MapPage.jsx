import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

const TYPE_COLOR = { Flood:'#4cc9f0', Fire:'#e63946', Landslide:'#f4a261', Storm:'#f9c74f', Earthquake:'#b39ddb' };

const FILTERS = [
  { key:'all',        label:'All Layers',   icon:'fa-layer-group' },
  { key:'hazard',     label:'Hazard Zones', icon:'fa-triangle-exclamation' },
  { key:'evacuation', label:'Evacuation',   icon:'fa-house-flag' },
  { key:'incidents',  label:'Incidents',    icon:'fa-circle-radiation' },
  { key:'residents',  label:'Residents',    icon:'fa-users' },
];

// Strictly Barangay Kauswagan area
const KAUSWAGAN_CENTER = [8.4895, 124.6558];
const KAUSWAGAN_BOUNDS = [[8.482, 124.648],[8.498, 124.668]];

// Red hazard zone polygons WITHIN Kauswagan
const HAZARD_ZONES = [
  {
    id:'hz-flood-3', label:'Zone 3 – High Flood Risk', color:'#e63946',
    coords:[[8.493,124.652],[8.495,124.658],[8.491,124.660],[8.489,124.654]],
  },
  {
    id:'hz-landslide-5', label:'Zone 5 – Landslide Prone', color:'#f4a261',
    coords:[[8.494,124.660],[8.497,124.665],[8.493,124.666],[8.491,124.661]],
  },
  {
    id:'hz-fire-1', label:'Zone 1 – Fire Risk Area', color:'#f9c74f',
    coords:[[8.486,124.652],[8.489,124.656],[8.487,124.658],[8.484,124.654]],
  },
];

// Kauswagan purok/subdivision labels
const PUROK_LABELS = [
  { name:'Purok 1\nBayanihan',  lat:8.4920, lng:124.6520 },
  { name:'Purok 2\nPag-asa',    lat:8.4910, lng:124.6555 },
  { name:'Purok 3\nMatahum',    lat:8.4890, lng:124.6575 },
  { name:'Purok 4\nMasagana',   lat:8.4875, lng:124.6540 },
  { name:'Purok 5\nKalma-an',   lat:8.4860, lng:124.6510 },
  { name:'Purok 6\nMapayapa',   lat:8.4870, lng:124.6580 },
];

const ZONE_RISK = {
  'Zone 1':'medium','Zone 2':'low','Zone 3':'high',
  'Zone 4':'low','Zone 5':'high','Zone 6':'medium',
};

export default function MapPage() {
  const mapRef    = useRef(null);
  const mapInst   = useRef(null);
  const layerRefs = useRef({});
  const [filter, setFilter] = useState('all');
  const [legend, setLegend] = useState(true);
  const { evacCenters, incidents, residents } = useApp();

  useEffect(() => {
    const build = () => {
      if (mapInst.current || !window.L || !mapRef.current) return;
      const L = window.L;

      mapInst.current = L.map(mapRef.current, {
        center: KAUSWAGAN_CENTER,
        zoom: 16,
        minZoom: 15,
        maxZoom: 18,
        maxBounds: KAUSWAGAN_BOUNDS,
        maxBoundsViscosity: 1.0,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInst.current);

      // ── Hazard zones (red boxes) ──────────────────────────
      const hazardGrp = L.layerGroup();
      HAZARD_ZONES.forEach(z => {
        L.polygon(z.coords, {
          color: z.color,
          fillColor: z.color,
          fillOpacity: 0.25,
          weight: 2,
          dashArray: z.color === '#e63946' ? null : '6,4',
        }).addTo(hazardGrp).bindPopup(
          `<div style="font-weight:700;color:${z.color};margin-bottom:4px">${z.label}</div>` +
          `<div style="font-size:12px;color:#888">Click incidents layer to see active reports</div>`
        );
      });
      layerRefs.current.hazard = hazardGrp;
      hazardGrp.addTo(mapInst.current);

      // ── Purok / Subdivision labels ────────────────────────
      PUROK_LABELS.forEach(p => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:rgba(20,27,45,0.85);color:#4cc9f0;border:1px solid rgba(76,201,240,0.4);border-radius:6px;padding:3px 8px;font-size:10px;font-weight:700;white-space:pre;text-align:center;line-height:1.4;pointer-events:none;">${p.name}</div>`,
          iconAnchor: [40, 20],
        });
        L.marker([p.lat, p.lng], { icon, interactive: false }).addTo(mapInst.current);
      });

      // ── Evac centers ──────────────────────────────────────
      const evacGrp = L.layerGroup();
      evacCenters.forEach(e => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:#06d6a0;color:#fff;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.5);white-space:nowrap">🏫 ${e.name}</div>`,
        });
        L.marker([e.lat, e.lng], { icon }).addTo(evacGrp)
          .bindPopup(`<b>${e.name}</b><br>Status: <b>${e.status}</b><br>Occupancy: ${e.occupancy}/${e.capacity}`);
      });
      layerRefs.current.evacuation = evacGrp;
      evacGrp.addTo(mapInst.current);

      // ── Incidents ─────────────────────────────────────────
      const incGrp = L.layerGroup();
      incidents.forEach(inc => {
        const c = TYPE_COLOR[inc.type] || '#888';
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${c};color:#000;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)">⚠</div>`,
        });
        L.marker([inc.lat, inc.lng], { icon }).addTo(incGrp)
          .bindPopup(`<b>${inc.type}</b><br>${inc.location}<br>Status: <b>${inc.status}</b><br>Severity: ${inc.severity}`);
      });
      layerRefs.current.incidents = incGrp;
      incGrp.addTo(mapInst.current);

      // ── Residents (color-coded by zone risk) ──────────────
      const resGrp = L.layerGroup();
      residents.forEach(r => {
        const lat = 8.482 + Math.random() * 0.016;
        const lng = 124.648 + Math.random() * 0.020;
        const risk = ZONE_RISK[r.zone] || 'low';
        const pinColor = risk === 'high' ? '#e63946' : risk === 'medium' ? '#f4a261' : '#06d6a0';
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${pinColor};width:10px;height:10px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
        });
        L.marker([lat, lng], { icon }).addTo(resGrp)
          .bindPopup(`<b>${r.name}</b><br>Zone: ${r.zone}<br>Status: ${r.evacuationStatus}`);
      });
      layerRefs.current.residents = resGrp;
      resGrp.addTo(mapInst.current);

      // ── Barangay Hall ─────────────────────────────────────
      const hallIcon = L.divIcon({
        className: '',
        html: '<div style="background:#7b5ea7;color:#fff;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.5)">🏛 BRGY HALL</div>',
      });
      L.marker([8.4895, 124.6558], { icon: hallIcon })
        .addTo(mapInst.current)
        .bindPopup('<b>Barangay Kauswagan Hall</b><br>BDRRMC Command Center');
    };

    if (window.L) { build(); }
    else {
      const t = setInterval(() => { if (window.L) { clearInterval(t); build(); } }, 200);
      return () => clearInterval(t);
    }
    return () => {
      if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }
    };
  }, [evacCenters, incidents, residents]);

  useEffect(() => {
    if (!mapInst.current) return;
    ['hazard','evacuation','incidents','residents'].forEach(k => {
      const g = layerRefs.current[k];
      if (!g) return;
      if (filter === 'all' || filter === k) { if (!mapInst.current.hasLayer(g)) g.addTo(mapInst.current); }
      else { if (mapInst.current.hasLayer(g)) mapInst.current.removeLayer(g); }
    });
  }, [filter]);

  return (
    <div className="map-page">
      <div className="page-header">
        <div>
          <div className="page-title">GIS Hazard Map</div>
          <div className="page-subtitle">Barangay Kauswagan, Cagayan de Oro City — 8.490°N, 124.656°E</div>
        </div>
      </div>
      <div className="map-toolbar">
        {FILTERS.map(f => (
          <button key={f.key} className={`btn ${filter === f.key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f.key)}>
            <i className={`fa-solid ${f.icon}`}></i> {f.label}
          </button>
        ))}
        <button className="btn btn-outline ml-auto" onClick={() => setLegend(!legend)}>
          <i className="fa-solid fa-list"></i> {legend ? 'Hide' : 'Show'} Legend
        </button>
      </div>
      <div className="map-container-wrap">
        <div ref={mapRef} className="leaflet-map-div"></div>
        {legend && (
          <div className="map-legend">
            <div className="legend-title"><i className="fa-solid fa-circle-info"></i> Legend</div>
            {[['#e63946','High Flood Risk (Zone 3)'],['#f4a261','Landslide Zone (Zone 5)'],['#f9c74f','Fire Risk (Zone 1)']].map(([c,l])=>(
              <div key={l} className="legend-item">
                <span className="legend-dot" style={{background:c,border:`2px solid ${c}`,opacity:.85}}></span>{l}
              </div>
            ))}
            <div className="legend-divider"></div>
            <div className="legend-item"><span className="legend-square" style={{background:'#06d6a0'}}>🏫</span>Evac Center</div>
            <div className="legend-item"><span className="legend-square" style={{background:'#4cc9f0',color:'#000'}}>⚠</span>Incident</div>
            <div className="legend-item"><span className="legend-square" style={{background:'#7b5ea7'}}>🏛</span>Brgy Hall</div>
            <div className="legend-divider"></div>
            <div className="legend-title" style={{fontSize:11,marginTop:4}}>Residents by Risk</div>
            <div className="legend-item"><span className="legend-dot" style={{background:'#e63946'}}></span>High Risk Zone</div>
            <div className="legend-item"><span className="legend-dot" style={{background:'#f4a261'}}></span>Medium Risk Zone</div>
            <div className="legend-item"><span className="legend-dot" style={{background:'#06d6a0'}}></span>Low Risk Zone</div>
            <div className="legend-divider"></div>
            <div className="legend-title" style={{fontSize:11,marginTop:4}}>Purok Labels</div>
            <div style={{fontSize:11,color:'var(--text-muted)'}}>Blue labels show Purok & subdivision names in Kauswagan</div>
          </div>
        )}
      </div>
    </div>
  );
}
