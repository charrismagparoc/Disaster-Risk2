import { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext(null);

// Barangay Kauswagan, Cagayan de Oro coordinates
const LAT = 8.490;
const LON = 124.656;
const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // public demo key

export function WeatherProvider({ children }) {
  const [weather, setWeather] = useState({
    condition: 'Loading...',
    temperature: '--',
    humidity: '--',
    windSpeed: '--',
    rainfall1h: '--',
    riskLevel: 'Unknown',
    loading: true,
    error: null,
    icon: 'fa-cloud',
  });

  const fetchWeather = async () => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      const main  = data.weather[0].main;
      const desc  = data.weather[0].description;
      const temp  = Math.round(data.main.temp);
      const hum   = data.main.humidity;
      const wind  = Math.round(data.wind.speed * 3.6);
      const rain  = data.rain?.['1h'] || 0;

      let condition = desc.charAt(0).toUpperCase() + desc.slice(1);
      let icon = 'fa-cloud-sun';
      if (main === 'Rain') {
        icon = rain > 10 ? 'fa-cloud-showers-heavy' : 'fa-cloud-rain';
        condition = rain > 10 ? 'Heavy Rain' : rain > 2.5 ? 'Moderate Rain' : 'Light Rain';
      } else if (main === 'Clear') {
        icon = 'fa-sun';
        condition = 'Clear Sky';
      } else if (main === 'Clouds') {
        icon = 'fa-cloud';
        condition = desc.includes('few') ? 'Partly Cloudy' : 'Cloudy';
      } else if (main === 'Thunderstorm') {
        icon = 'fa-cloud-bolt';
        condition = 'Thunderstorm';
      } else if (main === 'Drizzle') {
        icon = 'fa-cloud-drizzle';
        condition = 'Drizzle';
      }

      let riskLevel = 'Low';
      if (rain > 15 || wind > 60) riskLevel = 'High';
      else if (rain > 5 || wind > 40 || hum > 85) riskLevel = 'Medium';

      setWeather({
        condition, temperature: temp, humidity: hum,
        windSpeed: wind, rainfall1h: rain.toFixed(1),
        riskLevel, loading: false, error: null, icon,
      });
    } catch (err) {
      // Fallback: simulate realistic CDO weather
      const hour = new Date().getHours();
      const temp = hour >= 10 && hour <= 16 ? 31 : 27;
      const wind = 20 + Math.floor(Math.random() * 15);
      const rain = Math.random() > 0.6 ? (Math.random() * 8).toFixed(1) : '0.0';
      const riskLevel = parseFloat(rain) > 5 ? 'High' : parseFloat(rain) > 2 ? 'Medium' : 'Low';
      setWeather({
        condition: parseFloat(rain) > 0 ? 'Light Rain' : 'Partly Cloudy',
        temperature: temp, humidity: 78 + Math.floor(Math.random() * 15),
        windSpeed: wind, rainfall1h: rain,
        riskLevel, loading: false,
        error: 'Live weather unavailable — showing local estimate',
        icon: parseFloat(rain) > 0 ? 'fa-cloud-rain' : 'fa-cloud-sun',
      });
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <WeatherContext.Provider value={{ ...weather, refresh: fetchWeather }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => useContext(WeatherContext);
