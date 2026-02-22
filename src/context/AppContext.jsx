import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

// Generate simple unique IDs
const uid = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export function AppProvider({ children }) {
  const [incidents,   setIncidents]   = useState([]);
  const [alerts,      setAlerts]      = useState([]);
  const [evacCenters, setEvacCenters] = useState([]);
  const [residents,   setResidents]   = useState([]);
  const [resources,   setResources]   = useState([]);
  const [users,       setUsers]       = useState([
    { id: uid(), name: 'Admin', email: 'admin@kauswagan.gov.ph', role: 'Admin', status: 'Active', lastLogin: new Date().toISOString() }
  ]);
  const [actLog,      setActLog]      = useState([]);

  const logAct = (action, type, userName = 'Admin') => {
    const entry = { id: uid(), action, type, user: userName, time: new Date().toISOString() };
    setActLog(p => [entry, ...p]);
  };

  // ── INCIDENTS ────────────────────────────────────────────
  const addIncident = (d) => {
    const inc = {
      ...d, id: uid(), status: 'Pending',
      dateReported: new Date().toISOString(),
      lat: 8.490 + (Math.random() - .5) * .01,
      lng: 124.656 + (Math.random() - .5) * .01,
    };
    setIncidents(p => [inc, ...p]);
    logAct(`Incident reported: ${inc.type} in ${inc.zone}`, 'Incident');
    return inc;
  };
  const updateIncident = (id, d) => {
    setIncidents(p => p.map(i => i.id === id ? { ...i, ...d } : i));
    logAct(`Incident updated`, 'Incident');
  };
  const deleteIncident = (id) => {
    setIncidents(p => p.filter(i => i.id !== id));
    logAct(`Incident removed`, 'Incident');
  };

  // ── ALERTS ───────────────────────────────────────────────
  const addAlert = (d) => {
    const a = {
      ...d, id: uid(), sentAt: new Date().toISOString(), sentBy: 'Admin',
      recipientsCount: d.zone === 'All Zones' ? 1284 : Math.floor(Math.random() * 250 + 100),
    };
    setAlerts(p => [a, ...p]);
    logAct(`${a.level} alert sent to ${a.zone}`, 'Alert');
    return a;
  };
  const deleteAlert = (id) => {
    setAlerts(p => p.filter(a => a.id !== id));
    logAct(`Alert removed`, 'Alert');
  };

  // ── EVAC CENTERS ─────────────────────────────────────────
  const addEvacCenter = (d) => {
    const c = {
      ...d, id: uid(),
      lat: 8.490 + (Math.random() - .5) * .015,
      lng: 124.656 + (Math.random() - .5) * .015,
    };
    setEvacCenters(p => [...p, c]);
    logAct(`Evac center "${c.name}" added`, 'Evacuation');
    return c;
  };
  const updateEvacCenter = (id, d) => {
    setEvacCenters(p => p.map(c => c.id === id ? { ...c, ...d } : c));
    logAct(`Evac center updated`, 'Evacuation');
  };
  const deleteEvacCenter = (id) => {
    setEvacCenters(p => p.filter(c => c.id !== id));
    logAct(`Evac center removed`, 'Evacuation');
  };

  // ── RESIDENTS ────────────────────────────────────────────
  const addResident = (d) => {
    const r = { ...d, id: uid() };
    setResidents(p => [...p, r]);
    logAct(`Resident "${r.name}" added`, 'Resident');
    return r;
  };
  const updateResident = (id, d) => {
    setResidents(p => p.map(r => r.id === id ? { ...r, ...d } : r));
    logAct(`Resident updated`, 'Resident');
  };
  const deleteResident = (id) => {
    setResidents(p => p.filter(r => r.id !== id));
    logAct(`Resident removed`, 'Resident');
  };

  // ── RESOURCES ────────────────────────────────────────────
  const addResource = (d) => {
    const r = { ...d, id: uid() };
    setResources(p => [...p, r]);
    logAct(`Resource "${r.name}" added`, 'Resource');
    return r;
  };
  const updateResource = (id, d) => {
    setResources(p => p.map(r => r.id === id ? { ...r, ...d } : r));
    logAct(`Resource updated`, 'Resource');
  };
  const deleteResource = (id) => {
    setResources(p => p.filter(r => r.id !== id));
    logAct(`Resource removed`, 'Resource');
  };

  // ── USERS ────────────────────────────────────────────────
  const addUser = (d) => {
    const u = { ...d, id: uid(), lastLogin: new Date().toISOString() };
    setUsers(p => [...p, u]);
    logAct(`User "${u.name}" created`, 'Resident');
    return u;
  };
  const updateUser = (id, d) => {
    setUsers(p => p.map(u => u.id === id ? { ...u, ...d } : u));
    logAct(`User updated`, 'Resident');
  };
  const deleteUser = (id) => {
    setUsers(p => p.filter(u => u.id !== id));
    logAct(`User removed`, 'Resident');
  };

  return (
    <AppContext.Provider value={{
      loading: false, dbError: null, refresh: () => {},
      incidents,   addIncident,   updateIncident,   deleteIncident,
      alerts,      addAlert,      deleteAlert,
      evacCenters, addEvacCenter, updateEvacCenter, deleteEvacCenter,
      residents,   addResident,   updateResident,   deleteResident,
      resources,   addResource,   updateResource,   deleteResource,
      users,       addUser,       updateUser,       deleteUser,
      actLog,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
