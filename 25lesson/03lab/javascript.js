function decodeWeatherCode(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    95: "Thunderstorm"
  };

  return map[code] || `Unknown (${code})`;
}

async function loadWeather() {
  const conditionEl = document.getElementById("condition");
  const tempEl = document.getElementById("temp");
  const detailsEl = document.getElementById("details");

  const url = "https://api.open-meteo.com/v1/forecast?latitude=40.0&longitude=-82.9&current_weather=true";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const weather = data.current_weather;

    if (!weather) {
      throw new Error("No current weather returned");
    }

    const tempF = (weather.temperature * 9) / 5 + 32;
    const windMph = weather.windspeed * 0.621371;
    const dayNight = weather.is_day === 1 ? "Day" : "Night";
    const condition = decodeWeatherCode(weather.weathercode);

    conditionEl.textContent = condition;
    tempEl.textContent = `${tempF.toFixed(1)}°F`;
    detailsEl.innerHTML = `
      <div>Wind: ${windMph.toFixed(1)} mph</div>
      <div>Day/Night: ${dayNight}</div>
      <div>Updated: ${weather.time}</div>
    `;

    console.log("Weather updated:", {
      condition,
      temperatureF: tempF,
      windMph,
      updated: weather.time
    });
  } catch (error) {
    console.error("Failed to load weather:", error);
    conditionEl.textContent = "Unable to load weather";
    tempEl.textContent = "--";
    detailsEl.innerHTML = `<div>${error.message}</div>`;
  }
}

document.addEventListener("DOMContentLoaded", loadWeather);