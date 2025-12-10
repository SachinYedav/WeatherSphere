import { fetchCityCoordinates, fetchCoordinatesInfo, fetchWeather } from "./api.js";
import { updateUI } from "./ui.js";
import {debounce} from "./helper.js";

const searchInput = document.getElementById("searchInput");
const searchIcon = document.getElementById("searchIcon");
const loading = document.getElementById("loading");

//  show Loading & hide loading
function showLoading() {
  if (loading) { 
    loading.setAttribute('aria-busy', 'true'); 
    loading.classList.add("active"); 
  }
}
function hideLoading() {
  if (loading) { 
    loading.removeAttribute('aria-busy'); 
    loading.classList.remove("active"); 
  }
}


// Search Handling
async function searchQuery() {
  if (!searchInput.classList.contains("active")) {
    searchInput.classList.add("active");
    searchInput.focus();
    return;
  }

  const query = searchInput.value.trim();
  if (query) await getWeatherByCity(query);

  searchInput.value = "";
  searchInput.classList.remove("active");
}

const debouncedSearch = debounce(async () => {
  const q = searchInput.value.trim();
  if (q) await getWeatherByCity(q);
}, 450);

searchInput.addEventListener("keypress", e => { if (e.key === "Enter") searchQuery(); });
searchIcon.addEventListener("click", searchQuery);
searchInput.addEventListener("keyup", debouncedSearch);

// Fetch Weather by City
async function getWeatherByCity(cityName) {
  showLoading();
  const geo = await fetchCityCoordinates(cityName);
  if (!geo) { hideLoading(); return; }
  const weather = await fetchWeather(geo.latitude, geo.longitude, geo.cityInfo.timezone);
  if (weather) updateUI(weather, geo.cityInfo);
  hideLoading();
}

// Fetch Weather by Coords
async function getWeatherByCoords(lat, lon) {
  showLoading();
  const geo = await fetchCoordinatesInfo(lat, lon);
  const weather = await fetchWeather(geo.latitude, geo.longitude, geo.cityInfo.timezone);
  if (weather) updateUI(weather, geo.cityInfo);
  hideLoading();
}

// On Page Load - Geolocation
window.addEventListener("load", () => {
  const canUseGeo = navigator.geolocation && (location.protocol === "https:" || location.hostname === "localhost");
  if (canUseGeo) {
    navigator.geolocation.getCurrentPosition(
      pos => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => getWeatherByCity("Delhi"),
      { maximumAge: 600000, timeout: 10000 }
    );
  } else {
    getWeatherByCity("Delhi");
  }
});
