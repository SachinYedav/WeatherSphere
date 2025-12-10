// Weather code → icon + type mapping
export const weatherIconMap = Object.freeze({
  0: { icon: "clear-day.svg", type: "Clear Sky" },
  1: { icon: "partly-cloudy-day.svg", type: "Mainly Clear" },
  2: { icon: "cloudy.svg", type: "Partly Cloudy" },
  3: { icon: "overcast.svg", type: "Overcast" },
  45: { icon: "fog.svg", type: "Fog" },
  48: { icon: "fog.svg", type: "Depositing Rime Fog" },
  51: { icon: "drizzle.svg", type: "Light Drizzle" },
  53: { icon: "drizzle.svg", type: "Moderate Drizzle" },
  55: { icon: "drizzle.svg", type: "Dense Drizzle" },
  56: { icon: "drizzle.svg", type: "Light Freezing Drizzle" },
  57: { icon: "drizzle.svg", type: "Dense Freezing Drizzle" },
  61: { icon: "rain.svg", type: "Light Rain" },
  63: { icon: "rain.svg", type: "Moderate Rain" },
  65: { icon: "rain.svg", type: "Heavy Rain" },
  66: { icon: "rain.svg", type: "Light Freezing Rain" },
  67: { icon: "rain.svg", type: "Heavy Freezing Rain" },
  71: { icon: "snow.svg", type: "Light Snow" },
  73: { icon: "snow.svg", type: "Moderate Snow" },
  75: { icon: "snow.svg", type: "Heavy Snow" },
  77: { icon: "snowflake.svg", type: "Snow Grains" },
  80: { icon: "partly-cloudy-day-rain.svg", type: "Light Rain Showers" },
  81: { icon: "partly-cloudy-day-rain.svg", type: "Moderate Rain Showers" },
  82: { icon: "partly-cloudy-day-rain.svg", type: "Violent Rain Showers" },
  85: { icon: "partly-cloudy-day-snow.svg", type: "Light Snow Showers" },
  86: { icon: "partly-cloudy-day-snow.svg", type: "Heavy Snow Showers" },
  95: { icon: "thunderstorms.svg", type: "Thunderstorm" },
  96: { icon: "hail.svg", type: "Thunderstorm with Light Hail" },
  99: { icon: "hail.svg", type: "Thunderstorm with Heavy Hail" }
});

// Safe getter for icon + type
export function getWeatherIcon(code) {
  return weatherIconMap[code] || { icon: "cloudy.svg", type: "Unknown" };
}

// Format hour for hourly cards
export function formatHour(timeStr) {
  if (!timeStr) return "";
  const date = new Date(timeStr);
  const now = new Date();

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const hour = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return isSameDay && hour === now.getHours().toString().padStart(2, "0")
    ? "Now"
    : `${hour}:${minutes}`;
}

export const weatherTypeToClass = {
  "Clear Sky": "sunny",
  "Mainly Clear": "sunny",
  "Partly Cloudy": "cloudy",
  "Overcast": "cloudy",
  "Fog": "cloudy",
  "Light Rain": "rain",
  "Moderate Rain": "rain",
  "Heavy Rain": "rain",
  "Light Snow": "snow",
  "Moderate Snow": "snow",
  "Heavy Snow": "snow",
  "Thunderstorm": "thunder"
};

// Debounce helper
export function debounce(fn, wait = 350) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
