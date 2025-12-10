import { weatherIconMap,weatherTypeToClass } from "./helper.js";
import { renderHourlyCards, updateTomorrow, updateWeekDays, lazyLoadImages, updateCardTextColors } from "./utilities.js";

const weatherClasses = Object.values(weatherTypeToClass);

function applyWeatherClass(mappedClass) {
  weatherClasses.forEach(c => document.body.classList.remove(c));
  document.body.classList.add(mappedClass);
}

export function updateUI(weatherData, cityInfo) {
  // --- Location ---
  const locationEl = document.getElementById("location");
  if (locationEl) {
    const name = cityInfo?.name || "Current Location";
    const country = cityInfo?.country ? `, ${cityInfo.country}` : "";
    locationEl.textContent = name + country;
  }

  // --- Date ---
  const dateEl = document.querySelector(".date");
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  // --- Main Temperature ---
  const mainTempEl = document.querySelector(".main-temp");
  if (mainTempEl) {
    mainTempEl.innerHTML = `${weatherData.current_weather.temperature}<sup>°</sup>`;
  }

  // --- Wind speed ---
  const windEl = document.getElementById("windSpeed");
  if (windEl) {
    windEl.textContent = `${weatherData.current_weather.windspeed} Km/h`;
  }

  // --- Main Icon ---
  const code = weatherData.current_weather.weathercode;
  const info = weatherIconMap[code] || {};
  const iconEl = document.getElementById("weatherIcon");
  if (iconEl) {
    iconEl.dataset.src = `images/${info.icon || "cloudy.svg"}`;
    iconEl.alt = info.type || "Weather icon";
    iconEl.classList.add("lazy");
  }

  // --- Weather Type ---
  const typeEl = document.querySelector(".weather-type");
  if (typeEl) typeEl.textContent = info?.type || "Unknown";

  // --- Rain + Humidity ---
  const rainEl = document.getElementById("rainfall");
  const humEl = document.getElementById("humidity");
  if (rainEl) rainEl.textContent = `${weatherData.hourly.precipitation[0] ?? "-"} cm`;
  if (humEl) humEl.textContent = `${weatherData.hourly.relativehumidity_2m[0] ?? "-"} %`;

  // --- Hourly Cards ---
  renderHourlyCards(weatherData.hourly, weatherIconMap);
  // --- Tomorrow Card ---
  updateTomorrow(weatherData);
  // --- Week Forecast ---
  updateWeekDays(weatherData);
  // --- Lazy load main icon ---
  lazyLoadImages(document);
    // Apply background class
  applyWeatherClass(weatherTypeToClass[info?.type] || "cloudy");
  // Update text colors inside cards dynamically
  updateCardTextColors();

}
