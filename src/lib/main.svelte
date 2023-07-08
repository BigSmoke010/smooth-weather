<script>
  import { onMount } from "svelte";
  import Down from "./arrow.svelte";
  import Search from "./search.svelte";
  import Video from "./video.svelte";
  import { LoadRing } from "svelte-loading-animation";
  import WeatherInfo from "./weatherinfo.svelte";
  import Details from "./weatherdetails.svelte";
  let weatherData,
    AllCountriesData,
    weatherDesc,
    weatherIcon,
    geoData,
    finalAr = [],
    colors = {},
    state = "",
    country = "",
    intervalId,
    countrySelect = false,
    showSearch = false;
  onMount(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchLocation(position.coords.longitude, position.coords.latitude);
      });
    }
    const AllCountries = await fetch(
      "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates.json"
    );
    AllCountriesData = await AllCountries.json();
    AllCountriesData = getAllNameValues(AllCountriesData);
    checkperm();
    intervalId = setInterval(checkperm, 1000);
  });

  async function checkperm() {
    navigator.permissions.query({ name: "geolocation" }).then(async (x) => {
      if (x.state === "denied") {
        try {
          const location = await fetch(
            `https://api.ipdata.co/?api-key=${import.meta.env.VITE_IPDATA_API}`
          );
          const locationdata = await location.json();
          fetchLocation(locationdata.longitude, locationdata.latitude);
        } catch (error) {
          countrySelect = true;
        }
      }
      clearInterval(intervalId);
    });
  }
  async function fetchLocation(lon, lat, locationname = "") {
    let response, geoResponse, data, result;
    if (lon && lat) {
      response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,weathercode,windspeed_10m,is_day&daily=temperature_2m_max,weathercode,temperature_2m_min,sunrise,sunset,windspeed_10m_max&current_weather=true&timezone=auto`
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
    if (response.ok) {
      weatherData = data;
    }
  }
  function getAllNameValues(obj) {
    const nameValues = [];

    function extractNameValues(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === "name") {
            nameValues.push(obj[key]);
          } else if (typeof obj[key] === "object") {
            extractNameValues(obj[key]);
          }
        }
      }
    }

    extractNameValues(obj);
    return nameValues;
  }
</script>

<div class="wrapper">
  {#if weatherData}
    <div class="container">
      {#key weatherIcon}
        <WeatherInfo
          weatherData={{
            weatherD: weatherData,
            descript: weatherDesc,
            icon: weatherIcon,
          }}
        />
      {/key}
      <Search
        {AllCountriesData}
        on:fetch={(e) => {
          fetchLocation(0, 0, e.detail.message);
        }}
        blacktheme={false}
      />
      <div style="width: 211.63px;">
        <div class="country-city">
          {state}
          {country}
          {geoData.results[0].annotations.flag}
        </div>
      </div>

      {#key weatherData}
        <Video
          {weatherData}
          bind:weatherDesc
          bind:weatherIcon
          bind:finalAr
          bind:colors
          code={weatherData.current_weather.weathercode}
        />
      {/key}
    </div>
    <Down />
    {#key weatherData}
      <Details {weatherData} {finalAr} {colors} />
    {/key}
  {:else}
    <div class="loading-wrapper">
      <LoadRing color="#0000009E" size="120px" />
      {#if countrySelect}
        <p class="choosefallback">
          It looks like we cannot get your location. Try <span
            on:click={() => {
              showSearch = true;
            }}
            class="selectcountry-fallback"
          >
            Selecting a country
          </span>
        </p>
        {#if showSearch}
          <Search
            {AllCountriesData}
            on:fetch={(e) => {
              fetchLocation(0, 0, e.detail.message);
            }}
            blacktheme={true}
          />{/if}
      {/if}
    </div>
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100vw;
  }
  .container {
    display: flex;
    position: relative;
    width: 100vw;
    overflow: hidden;
    height: 100vh;
    background-color: transparent;
  }
  .loading-wrapper {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .selectcountry-fallback {
    text-decoration: underline;
  }
  .selectcountry-fallback:hover {
    color: #00000060;
    cursor: pointer;
  }
  .country-city {
    position: absolute;
    margin: 10px;
    color: white;
    color: rgba(255, 255, 255, 0.581);
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
      z-index: 1;
    }
  }
</style>
