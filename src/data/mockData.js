// IDRMS — UI Constants & Map Reference Data
export const ZONES = ['Zone 1','Zone 2','Zone 3','Zone 4','Zone 5','Zone 6'];
export const INCIDENT_TYPES    = ['Flood','Fire','Landslide','Storm','Earthquake'];
export const INCIDENT_STATUSES = ['Active','Pending','Verified','Responded','Resolved'];
export const RESOURCE_CATEGORIES  = ['Equipment','Medical','Food Supply','Vehicle','Safety Gear'];
export const VULNERABILITY_TAGS   = ['Senior Citizen','PWD','Pregnant','Infant','Bedridden'];
export const EVAC_FACILITIES      = ['Water','Restroom','Medical','Power','Food','Sleeping Area'];

export const zoneRiskLevels = [
  { zone:'Zone 1', riskLevel:'Medium', mainHazard:'Fire' },
  { zone:'Zone 2', riskLevel:'Low',    mainHazard:'Flood' },
  { zone:'Zone 3', riskLevel:'High',   mainHazard:'Flood' },
  { zone:'Zone 4', riskLevel:'Low',    mainHazard:'Earthquake' },
  { zone:'Zone 5', riskLevel:'High',   mainHazard:'Landslide' },
  { zone:'Zone 6', riskLevel:'Medium', mainHazard:'Storm' },
];

export const BARANGAY_HALL = { lat:8.4895, lng:124.6558, name:'Barangay Kauswagan Hall' };
export const MAP_CENTER    = [8.490, 124.656];

// Kauswagan subdivision / purok names for map labels
export const KAUSWAGAN_PUROKS = [
  { name: 'Purok 1 – Bayanihan',   lat: 8.4920, lng: 124.6520 },
  { name: 'Purok 2 – Pag-asa',     lat: 8.4910, lng: 124.6555 },
  { name: 'Purok 3 – Matahum',     lat: 8.4890, lng: 124.6575 },
  { name: 'Purok 4 – Masagana',    lat: 8.4875, lng: 124.6540 },
  { name: 'Purok 5 – Kalma-an',    lat: 8.4860, lng: 124.6510 },
  { name: 'Purok 6 – Mapayapa',    lat: 8.4870, lng: 124.6580 },
];
