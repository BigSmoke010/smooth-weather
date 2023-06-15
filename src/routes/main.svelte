<script>
  import { onMount } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
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
  import Video from "./video.svelte";
  import { LoadRing } from "svelte-loading-animation";
  import { clickOutside } from "./clickoutside";

  let weatherData,
    currentWeatherVideo,
    inputvalue = "",
    AllCountriesData;
  let state = "";
  let country = "";
  let extendedsearch = undefined;
  let istyping = false;
  onMount(async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocation(longitude, latitude);
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  });
  async function fetchLocation(lon, lat, locationname = "") {
    let response, geoResponse, data, geoData, result;
    if (lon && lat) {
      response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,weathercode,windspeed_10m,temperature_80m,is_day&daily=temperature_2m_max,weathercode,temperature_2m_min,sunrise,sunset,windspeed_10m_max&current_weather=true&timezone=auto`
      );
      data = await response.json();
      geoResponse = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${
          import.meta.env.VITE_OPENCAGE_API
        }`
      );
      geoData = await geoResponse.json();

      if (geoData.results.length > 0) {
        result = geoData.results[0];
        state = result.components.state || "";
        country = result.components.country || "";
      }
    } else {
      geoResponse = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${locationname}&key=${
          import.meta.env.VITE_OPENCAGE_API
        }`
      );
      geoData = await geoResponse.json();
      if (geoData.results.length > 0) {
        result = geoData.results[0];
        state = result.components.state || "";
        country = result.components.country || "";
        response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${result.geometry.lat}&longitude=${result.geometry.lng}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,weathercode,windspeed_10m,temperature_80m,is_day&daily=temperature_2m_max,weathercode,temperature_2m_min,sunrise,sunset,windspeed_10m_max&current_weather=true&timezone=auto`
        );
        data = await response.json();
      }
    }
    const AllCountries = await fetch(
      "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates.json"
    );
    AllCountriesData = await AllCountries.json();

    if (response.ok) {
      weatherData = data;
      currentWeatherVideo = getCurrentWeather(
        weatherData.current_weather.weathercode
      );
    } else {
      console.error("Request failed with status:", response.status);
    }
  }
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
  function deepValueSearch(obj, value) {
    let AllMatches = [];
    let re = new RegExp(value, "gi");

    if (value !== "") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let match = re.exec(obj[key]);

          if (
            match !== null &&
            match !== "" &&
            !match["input"].includes("[object Object]")
          ) {
            AllMatches.push({ value: match[0], input: match["input"] });
          } else if (typeof obj[key] === "object") {
            AllMatches = AllMatches.concat(deepValueSearch(obj[key], value));
          }
        }
      }
    }

    return AllMatches;
  }
</script>

<div class="wrapper">
  {#if weatherData}
    <div class="info-wrapper" transition:fly={{ y: 50, duration: 500 }}>
      <div>
        <div class="weather-temp">
          {weatherData.current_weather.temperature}°
        </div>
        <div class="weather-desc">{currentWeatherVideo.description}</div>

        <div class="wind-wrapper">
          <div class="dir-wrapper">
            <img
              src={Winddir}
              style="transform: rotate({weatherData.current_weather
                .winddirection}deg);"
              alt="wind direction"
            />
            <div class="compass-dir">
              {convertWindDirection(weatherData.current_weather.winddirection)}
            </div>
          </div>
          <img src={Circle} alt="sep" class="seperator" />
          <div class="weather-wind">
            {weatherData.current_weather.windspeed}
          </div>
        </div>
      </div>
      <div class="secondary-wrapper">
        <div
          on:click={() => {
            extendedsearch = true;
          }}
          use:clickOutside={() => {
            extendedsearch = false;
            istyping = false;
            inputvalue = "";
          }}
          class:showsearch={extendedsearch === true}
          class:hidesearch={extendedsearch === false}
          class="search"
          class:typing={istyping === true}
        >
          {#if extendedsearch}
            <input
              bind:value={inputvalue}
              type="text"
              on:input={() => {
                deepValueSearch(AllCountriesData, inputvalue);
                istyping = true;
              }}
              class="search-input"
              in:fade={{ delay: 800 }}
              out:fade
              placeholder="Search a city,country..."
            />
            {#if inputvalue.length > 0}
              <div transition:slide class="suggestions">
                {#each deepValueSearch(AllCountriesData, inputvalue).slice(0, 10) as match}
                  <div
                    on:click={() => {
                      inputvalue = match.input;
                      fetchLocation(0, 0, inputvalue);
                    }}
                    class="suggestion"
                  >
                    {match.input}
                  </div>
                {/each}
              </div>
            {/if}
          {/if}
        </div>
        <div class="country-city">{state}, {country}</div>
      </div>
      <div style="width: 211.63px;" />
    </div>
    <Video source={currentWeatherVideo.videoSrc} />
  {:else}
    <div class="loading-wrapper">
      <LoadRing color="#0000009E" size="120px" />
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
    position: absolute;
    color: rgba(255, 255, 255, 0.281);
    right: 0;
    top: 0;
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
  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 100px;
    background-color: rgba(211, 211, 211, 0.507);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .suggestion:hover {
    background-color: white;
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
  @keyframes unround {
    0% {
      width: 200px;
      border-radius: 28px;
    }
    100% {
      width: 200px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
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
  .typing {
    animation: unround 1s forwards;
  }
</style>
