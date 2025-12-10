import { formatHour, weatherIconMap } from "./helper.js";

  // Render Hourly Cards
export function renderHourlyCards(hourly, iconMap) {
  const container = document.getElementById("hourlyContainer");
  if (!container || !hourly) return;

  container.innerHTML = ""; // clear previous
  const fragment = document.createDocumentFragment();
  const count = Math.min(24, hourly.time?.length || 0);

  for (let i = 0; i < count; i++) {
    const temp = hourly.temperature_2m?.[i] ?? "-";
    const code = hourly.weathercode?.[i];
    const time = formatHour(hourly.time?.[i]);
    const info = iconMap[code] || weatherIconMap[code] || {};

    const card = document.createElement("article");
    card.className = "weather-card hourly-card";
    card.dataset.hour = i;

    // Use lazy loading for image
    const imgSrc = `images/${info.icon || "cloudy.svg"}`;
    card.innerHTML = `
      <p class="title">${time}</p>
      <div class="info">
        <img data-src="${imgSrc}" alt="${info.type || "Weather icon"}" class="lazy"/>
        <p class="big">${temp}°</p>
      </div>
    `;

    fragment.appendChild(card);

    // Animate show
    setTimeout(() => card.classList.add("show"), i * 70);
  }

  container.appendChild(fragment);
  lazyLoadImages(container);
}

  // Update Tomorrow Card
export function updateTomorrow(data) {
  if (!data?.daily || !data?.hourly) return;

  const topCard = document.querySelector(".card-top");
  const detailsCard = document.querySelector(".card-details");
  if (!topCard || !detailsCard) return;

  const temp = data.daily.temperature_2m_max?.[1] ?? "-";
  const code = data.daily.weathercode?.[1];
  const icon = weatherIconMap[code]?.icon || "cloudy.svg";

  // Update temperature
  topCard.querySelector(".temp").textContent = `${temp}°`;

  // Update icon
  const topIcon = topCard.querySelector(".icon-big");
  topIcon.src = `images/${icon}`;         
  topIcon.dataset.src = `images/${icon}`; 
  topIcon.alt = weatherIconMap[code]?.type || "Weather icon";

  // Update details
  const rainEl = detailsCard.querySelector("#tRainfall");
  const humEl = detailsCard.querySelector("#tHumidity");
  const windEl = detailsCard.querySelector("#tWind");

  rainEl.textContent = `${data.hourly.precipitation[24] ?? "-"} cm`;
  humEl.textContent = `${data.hourly.relativehumidity_2m[24] ?? "-"} %`;
  windEl.textContent = `${data.current_weather.windspeed ?? "-"} Km/h`;

  // Animate card
  topCard.classList.remove("show");
  detailsCard.classList.remove("show");
  setTimeout(() => {
    topCard.classList.add("show");
    detailsCard.classList.add("show");
  }, 80);
}

// Update Week Forecast Cards
export function updateWeekDays(data) {
  if (!data?.daily) return;

  const cards = document.querySelectorAll(".day-card");
  const daily = data.daily;

  cards.forEach((card, i) => {
    const date = new Date(daily.time?.[i] || Date.now());
    const daySpan = card.querySelector("span");
    const tempSpan = card.querySelector(".card-info span");
    const imgEl = card.querySelector("img");

    if (!daySpan || !tempSpan || !imgEl) return;

    // Update day name
    daySpan.textContent = date.toLocaleDateString("en-US", { weekday: "long" });

    // Update temperature
    tempSpan.textContent = daily.temperature_2m_max?.[i] != null
      ? `${daily.temperature_2m_max[i]}°` : "-";

    // Correctly set icon and alt
    const code = daily.weathercode?.[i];
    const info = weatherIconMap[code] || {};
    const iconFile = info.icon || "cloudy.svg";
    imgEl.dataset.src = `images/${iconFile}`;
    imgEl.alt = info.type || "Weather icon";
    imgEl.classList.add("lazy"); // ensure lazy loading

    // Animate card
    card.classList.remove("show");
    setTimeout(() => card.classList.add("show"), i * 120);

    // Lazy load this image
    lazyLoadImages(card);
  });
}

  // Lazy load images inside a container or element
export function lazyLoadImages(container = document) {
  const imgs = container.querySelectorAll("img.lazy");
  if (!imgs.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        obs.unobserve(img);
      }
    });
  }, { rootMargin: "100px" });

  imgs.forEach(img => observer.observe(img));
}

// Map body classes to readable colors
const themeTextColor = {
  sunny: "#333",
  cloudy: "#fff",
  rain: "#fff",
  snow: "#000",
  thunder: "#fff"
};

// Apply text color to cards & labels
export function updateCardTextColors() {
  const bodyClass = document.body.className; // e.g., "rain"
  const color = themeTextColor[bodyClass] || "#000";

  const dynamicEls = document.querySelectorAll(
    ".card-tomorrow, .day-card, .stats-card, .temperature-wrap, .weather-wrap"
  );
  
  dynamicEls.forEach(el => el.style.color = color);
}
