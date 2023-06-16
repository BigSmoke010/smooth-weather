<script>
  import { onMount } from "svelte";
  import Search from "./search.svelte";
  import Video from "./video.svelte";
  import { LoadRing } from "svelte-loading-animation";
  import WeatherInfo from "./weatherinfo.svelte";

  let weatherData, AllCountriesData, weatherDesc;
  let state = "";
  let country = "";

  onMount(async () => {
    const location = await fetch(
      `https://api.ipdata.co/?api-key=${process.env.VITE_IPDATA_API}`
    );
    const locationdata = await location.json();
    fetchLocation(locationdata.longitude, locationdata.latitude);
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
    } else {
      console.error("Request failed with status:", response.status);
    }
  }
</script>

<div class="wrapper">
  {#if weatherData}
    <WeatherInfo
      weatherData={{
        weatherD: weatherData,
        descript: weatherDesc,
      }}
    />
    <Search
      {AllCountriesData}
      on:fetch={(e) => {
        fetchLocation(0, 0, e.detail.message);
      }}
    />
    <div style="width: 211.63px;">
      <div class="country-city">{state}, {country}</div>
    </div>
    {#key weatherData.current_weather.weathercode}
      <Video bind:weatherDesc code={weatherData.current_weather.weathercode} />
    {/key}
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
  .wrapper {
    display: flex;
  }
  .loading-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .country-city {
    position: absolute;
    margin: 10px;
    color: white;
    color: rgba(255, 255, 255, 0.281);
    right: 0;
    top: 0;
  }
  @media (max-width: 657px) {
    .wrapper {
      flex-direction: column;
    }
    .country-city {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: unset;
    }
  }
</style>
