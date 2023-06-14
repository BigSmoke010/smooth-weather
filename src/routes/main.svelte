<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import thunder from "./vids/thunder.mp4";
  import cloudy from "./vids/cloudy.mp4";
  import fog from "./vids/fog.mp4";
  import drizzle from "./vids/drizzle.mp4";
  import lightStorm from "./vids/light_thunder.mp4";
  import night from "./vids/night.mp4";
  import rain from "./vids/rain.mp4";
  import snowy from "./vids/snow.mp4";
  import clear from "./vids/clear.mp4";
  import Winddir from "./svgs/wind-direction.svg";
  import Circle from "./svgs/circle.svg";
  import { LoadRing } from "svelte-loading-animation";
  import { clickOutside } from "./clickoutside";
  import fuzzysort from "fuzzysort";
  let weatherData;
  let currentWeatherVideo;
  let weatherTemp;
  let city = "";
  let country = "";
  let wind;
  let inputvalue;
  let AllCountriesData;
  let extendedsearch = undefined;
  onMount(async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,weathercode,windspeed_10m,temperature_80m,is_day&daily=temperature_2m_max,weathercode,temperature_2m_min,sunrise,sunset,windspeed_10m_max&current_weather=true&timezone=auto`
          );
          const data = await response.json();

          const geoResponse = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${
              import.meta.env.VITE_OPENCAGE_API
            }`
          );
          const geoData = await geoResponse.json();
          const AllCountries = await fetch(
            "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates.json"
          );
          AllCountriesData = await AllCountries.json();

          if (geoData.results.length > 0) {
            const result = geoData.results[0];
            city = result.components.city || "";
            country = result.components.country || "";
          }

          if (response.ok) {
            weatherData = data;
            const weatherCode = weatherData.current_weather.weathercode;
            weatherTemp = weatherData.current_weather.temperature;
            wind = {
              speed: weatherData.current_weather.windspeed,
              dir: weatherData.current_weather.winddirection,
              compdir: convertWindDirection(
                weatherData.current_weather.winddirection
              ),
            };
            currentWeatherVideo = getCurrentWeather(weatherCode);
          } else {
            console.error("Request failed with status:", response.status);
          }
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  });

  function getCurrentWeather(weatherCode) {
    let videoSrc;
    let description;
    switch (weatherCode) {
      case 0:
        videoSrc = clear;
        description = "Clear sky";
        break;
      case 1:
      case 2:
      case 3:
        videoSrc = cloudy;
        description = "Partly cloudy";
        break;
      case 45:
      case 48:
        videoSrc = fog;
        description = "Fog";
        break;
      case 51:
      case 53:
      case 55:
        videoSrc = drizzle;
        description = "Drizzle";
        break;
      case 61:
      case 63:
      case 65:
      case 77:
        videoSrc = rain;
        description = "Rain";
        break;
      case 71:
      case 73:
      case 75:
      case 80:
      case 81:
      case 82:
        videoSrc = snowy;
        description = "Snow/Rain showers";
        break;
      case 85:
      case 86:
        videoSrc = snowy;
        description = "Snow/Rain showers";
        break;
      case 95:
        videoSrc = lightStorm;
        description = "Thunderstorm (slight)";
        break;
      case 96:
      case 99:
        videoSrc = thunder;
        description = "Thunderstorm (heavy)";
        break;
      default:
        videoSrc = night;
        description = "Unknown weather";
        break;
    }
    return { description, videoSrc };
  }
  function convertWindDirection(windDirection) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const degrees = windDirection % 360;
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  function searchJSON(obj, key, val) {
    let results = [];
    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        if (k === key && obj[k] === val) {
          results.push(obj);
        } else if (typeof obj[k] === "object") {
          results = results.concat(searchJSON(obj[k], key, val));
        }
      }
    }
    return results;
  }
</script>

<div class="wrapper">
  {#if currentWeatherVideo}
    <div class="info-wrapper" transition:fly={{ y: 50, duration: 500 }}>
      <div>
        <div class="weather-temp">{weatherTemp}°</div>
        <div class="weather-desc">{currentWeatherVideo.description}</div>

        <div class="wind-wrapper">
          <div class="dir-wrapper">
            <img
              src={Winddir}
              style="transform: rotate({wind.dir}deg);"
              alt="wind direction"
            />
            <div class="compass-dir">{wind.compdir}</div>
          </div>
          <img src={Circle} alt="sep" class="seperator" />
          <div class="weather-wind">{wind.speed}</div>
        </div>
      </div>
      <div class="secondary-wrapper">
        <div
          on:click={() => {
            extendedsearch = true;
          }}
          use:clickOutside={() => {
            extendedsearch = false;
          }}
          class:showsearch={extendedsearch === true}
          class:hidesearch={extendedsearch === false}
          class="search"
        >
          {#if extendedsearch}
            <input
              bind:value={inputvalue}
              type="text"
              class="search-input"
              in:fade={{ delay: 800 }}
              placeholder="Search a city,country..."
            />
          {/if}
        </div>
        <div class="country-city">{city}, {country}</div>
      </div>
      <div style="width: 211.63px;" />
    </div>
    <video
      transition:fade={{ duration: 1000 }}
      id="video-player"
      autoplay
      loop
      muted
      on:contextmenu={(e) => {
        e.preventDefault();
      }}
    >
      <source src={currentWeatherVideo.videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  {:else}
    <div class="loading-wrapper">
      <LoadRing color="#0000009E" />
    </div>
  {/if}
</div>

<style>
  :global(:body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
  }
  ::-webkit-input-placeholder {
    color: #fffbf76d;
  }
  :-moz-placeholder {
    color: #fffbf76d;
    opacity: 1;
  }
  ::-moz-placeholder {
    color: #fffbf76d;
    opacity: 1;
  }
  :-ms-input-placeholder {
    color: #fffbf76d;
  }
  ::-ms-input-placeholder {
    color: #fffbf76d;
  }
  ::placeholder {
    color: #fffbf76d;
  }
  #video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
  .info-wrapper {
    display: flex;
    align-content: center;
  }
  .loading-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .weather-temp,
  .weather-desc,
  .country-city {
    margin: 10px;
    color: white;
  }
  .weather-temp {
    font-size: 69px;
  }
  .weather-desc {
    font-size: 32px;
  }
  .wind-wrapper {
    display: flex;
    margin: 5px;
  }
  .dir-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .compass-dir {
    color: white;
  }
  .weather-wind {
    color: white;
    font-size: 30px;
  }
  .country-city {
    color: rgba(255, 255, 255, 0.281);
    text-align: center;
  }
  .seperator {
    margin: 10px;
    opacity: 0.4;
  }
  .search {
    position: relative;
    display: flex;
    transition: all 1s;
    text-align: center;
    width: 28px;
    height: 28px;
    background-color: rgba(255, 255, 255, 0.342);
    border-radius: 50%;
  }
  .search-input {
    width: 160px;
    background-color: transparent;
    border: none;
    margin-left: 5px;
  }
  input:focus {
    outline: none;
  }
  .showsearch {
    animation: extend 1s forwards;
  }
  .hidesearch {
    animation: hide 1s forwards;
  }
  @keyframes extend {
    0% {
      width: 28px;
      border-radius: 50%;
    }
    50% {
      border-radius: 28px;
    }
    100% {
      width: 200px;
      border-radius: 28px;
    }
  }
  @keyframes hide {
    0% {
      width: 200px;
      border-radius: 28px;
    }
    50% {
      border-radius: 50%;
    }
    100% {
      width: 28px;
      border-radius: 50%;
    }
  }
  .search::after {
    content: url("./svgs/search.svg");
    position: absolute;
    right: 0;
  }
  .search:hover {
    cursor: pointer;
  }
  .secondary-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
