<script>
  import { fade } from "svelte/transition";
  import thunder from "./vids/thunder.mp4";
  import cloudy from "./vids/cloudy.mp4";
  import fog from "./vids/fog.mp4";
  import drizzle from "./vids/drizzle.mp4";
  import lightStorm from "./vids/light_thunder.mp4";
  import night from "./vids/night.mp4";
  import rain from "./vids/rain.mp4";
  import snowy from "./vids/snow.mp4";
  import clear from "./vids/clear.mp4";
  export let code;
  export let weatherDesc;
  export let weatherData;
  export let weatherIcon;
  let source;
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let DaysForecastTime = weatherData.daily.time;
  export let finalAr = [];

  function getCurrentWeather(weatherCode) {
    let dayIcon;
    let nightIcon;
    let description;
    let videoSrc;

    switch (weatherCode) {
      case 0:
        dayIcon = "01d.png";
        nightIcon = "01n.png";
        videoSrc = clear;
        description = "Clear sky";
        break;
      case 1:
      case 2:
      case 3:
        dayIcon = "02d.png";
        nightIcon = "02n.png";
        videoSrc = cloudy;
        description = "Partly cloudy";
        break;
      case 45:
      case 48:
        dayIcon = "50d.png";
        nightIcon = "50n.png";
        videoSrc = fog;
        description = "Fog";
        break;
      case 51:
      case 53:
      case 55:
        dayIcon = "09d.png";
        nightIcon = "09n.png";
        videoSrc = drizzle;
        description = "Drizzle";
        break;
      case 61:
      case 63:
      case 65:
      case 77:
        dayIcon = "10d.png";
        nightIcon = "10n.png";
        videoSrc = rain;
        description = "Rain";
        break;
      case 71:
      case 73:
      case 75:
      case 80:
      case 81:
      case 82:
      case 85:
      case 86:
        dayIcon = "13d.png";
        nightIcon = "13n.png";
        videoSrc = snowy;
        description = "Snow/Rain showers";
        break;
      case 95:
        dayIcon = "11d.png";
        nightIcon = "11n.png";
        videoSrc = lightStorm;
        description = "Thunderstorm (slight)";
        break;
      case 96:
      case 99:
        dayIcon = "11d.png";
        nightIcon = "11n.png";
        videoSrc = thunder;
        description = "Thunderstorm (heavy)";
        break;
      default:
        dayIcon = "night.png";
        nightIcon = "night.png";
        videoSrc = night;
        description = "Unknown weather";
        break;
    }

    return { description, dayIcon, nightIcon, videoSrc };
  }
  weatherDesc = getCurrentWeather(code).description;
  weatherIcon = {
    day: getCurrentWeather(code).dayIcon,
    night: getCurrentWeather(code).nightIcon,
  };
  source = getCurrentWeather(code).videoSrc;
  for (let i = 0; i < DaysForecastTime.length; i++) {
    let curIt = DaysForecastTime[i];
    let DateEl = new Date(curIt);
    finalAr.push({
      icon: "http://openweathermap.org/img/wn/" + weatherIcon.day,
      minTemp: weatherData.daily.temperature_2m_min[i],
      maxTemp: weatherData.daily.temperature_2m_max[i],
      day: weekdays[DateEl.getDay()],
    });
  }
</script>

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
  <source src={source} type="video/mp4" />
</video>

<style>
  #video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    object-fit: cover;
    z-index: -1;
  }
</style>
