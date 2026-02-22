# IDRMS — Intelligent Disaster Risk Management System
## Barangay Kauswagan, Cagayan de Oro City

### 🚀 Quick Start

```bash
npm install
npm run dev
```

Open: http://localhost:5173

### 🔑 Login Credentials
| Email | Password |
|-------|----------|
| admin@kauswagan.gov.ph | admin123 |
| staff@kauswagan.gov.ph | admin123 |

### ✅ Features
- **GIS Hazard Map** — Leaflet map locked to Barangay Kauswagan with red hazard zone polygons, purok/subdivision labels
- **Incident Management** — Report, track, update and resolve incidents
- **Alert System** — Emergency broadcast with quick templates
- **Evacuation Centers** — Capacity & occupancy tracking
- **Resident Management** — Vulnerability tagging, evacuation status
- **Resource Management** — Equipment, medical, food supply tracking
- **Reports & Analytics** — Live stats, charts, data export
- **Risk Intelligence** — Zone risk assessment engine
- **User Management** — Role-based access control
- **Activity Log** — Complete audit trail, CSV export
- **Live Weather** — Real-time weather from OpenWeatherMap for CDO
- **Dark/Light Mode** — Toggle in topbar or settings
- **Clickable Notifications** — Bell icon shows active alerts
- **Clickable Profile** — View profile, settings, sign out

### 📁 Project Structure
```
src/
  components/
    Sidebar.jsx       — Navigation sidebar
    Topbar.jsx        — Top bar with weather, clock, notifications, profile
    SharedComponents.jsx — StatCard, AlertBanner, ConfirmModal
  context/
    AppContext.jsx     — Global state (no database)
    WeatherContext.jsx — Live weather data
  data/
    mockData.js        — Constants and zone data
  pages/
    Login.jsx
    Dashboard.jsx
    MapPage.jsx
    IncidentsPage.jsx
    AlertsPage.jsx
    EvacResidents.jsx
    OtherPages.jsx     — Resources, Reports, Intelligence, Users, Activity
  styles/
    index.css          — All styles in one file
```

### ⚠️ No Database Required
All data is stored in local React state. No Supabase or external database needed.
Data resets on page refresh — connect to Supabase later when ready.

### 🗺️ Map
- Strictly bounded to Barangay Kauswagan area
- Red polygons mark high-risk flood zones
- Orange polygons mark landslide-prone zones  
- Yellow polygons mark fire risk zones
- Purok/subdivision labels visible on map
- Color-coded resident pins by zone risk level
