// In-memory caches
const geoCache = new Map();      
const coordCache = new Map();    

  // Fetch geocoding info for city
export async function fetchCityCoordinates(cityName) {
  const key = cityName.toLowerCase();
  if (geoCache.has(key)) return geoCache.get(key);

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);

    const data = await res.json();
    if (!data.results?.length) return null;

    const city = data.results[0];
    const cityInfo = {
      name: city.name,
      country: city.country,
      timezone: city.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const result = { latitude: city.latitude, longitude: city.longitude, cityInfo };
    geoCache.set(key, result);
    return result;
  } catch (err) {
    console.error("fetchCityCoordinates error:", err);
    return null;
  }
}

  // Reverse geocode coordinates
export async function fetchCoordinatesInfo(lat, lon) {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  if (coordCache.has(key)) return coordCache.get(key);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    let cityInfo;

    if (!res.ok) {
      cityInfo = { name: "Current Location", country: "", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
    } else {
      const data = await res.json();
      const addr = data.address || {};
      let cityName = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || addr.county || addr.state;
      cityInfo = {
        name: cityName || "Current Location",
        country: addr.country || "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }

    const result = { latitude: lat, longitude: lon, cityInfo };
    coordCache.set(key, result);
    return result;
  } catch (err) {
    console.error("fetchCoordinatesInfo error:", err);
    return { latitude: lat, longitude: lon, cityInfo: { name: "Current Location", country: "", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } };
  }
}

  // Fetch weather from Open-Meteo
export async function fetchWeather(lat, lon, timezone) {
  try {
    const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=${encodeURIComponent(tz)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("fetchWeather error:", err);
    return null;
  }
}
