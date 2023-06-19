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
  export let colors;
  export let finalAr = [];
  finalAr = [];

  let source, color1, color2;
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
  function getCurrentWeather(weatherCode) {
    let dayIcon;
    let nightIcon;
    let description;
    let videoSrc;

    switch (weatherCode) {
      case 0:
        dayIcon = "01d.png";
        nightIcon = "01n.png";
        if (weatherData.current_weather.is_day) {
          color1 = "#87CEEB";
          color2 = "#e07b2e";
        } else {
          color2 = "#0E2954";
          color1 = "#18122B";
        }
        videoSrc = clear;
        description = "Clear sky";
        break;
      case 1:
      case 2:
      case 3:
        dayIcon = "02d.png";
        nightIcon = "02n.png";
        color1 = "#7F8487";
        color2 = "#B3AAAA";
        videoSrc = cloudy;
        description = "Partly cloudy";
        break;
      case 45:
      case 48:
        dayIcon = "50d.png";
        nightIcon = "50n.png";
        color1 = "#C2C9CF";
        color2 = "#F8F0FF";
        videoSrc = fog;
        description = "Fog";
        break;
      case 51:
      case 53:
      case 55:
        dayIcon = "09d.png";
        nightIcon = "09n.png";
        color1 = "#252426";
        color2 = "#757178";
        videoSrc = drizzle;
        description = "Drizzle";
        break;
      case 61:
      case 63:
      case 65:
      case 77:
        dayIcon = "10d.png";
        nightIcon = "10n.png";
        color1 = "#86BDB4";
        color2 = "#26BDA4";
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
        color1 = "#dadfec";
        color2 = "#b2b6c2";
        videoSrc = snowy;
        description = "Snow/Rain showers";
        break;
      case 95:
        dayIcon = "11d.png";
        nightIcon = "11n.png";
        color1 = "#001C54";
        color2 = "#033254";
        videoSrc = lightStorm;
        description = "Thunderstorm (slight)";
        break;
      case 96:
      case 99:
        dayIcon = "11d.png";
        nightIcon = "11n.png";
        color1 = "#001C54";
        color2 = "#033254";
        videoSrc = thunder;
        description = "Thunderstorm (heavy)";
        break;
      default:
        dayIcon = "night.png";
        nightIcon = "night.png";
        color1 = "#1E00FF";
        color2 = "#03001A";
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
  colors = { one: color1, two: color2 };
  if (!weatherData.current_weather.is_day && weatherDesc === "Clear sky") {
    source = night;
  } else {
    source = getCurrentWeather(code).videoSrc;
  }
  for (let i = 0; i < DaysForecastTime.length; i++) {
    let curIt = DaysForecastTime[i];
    let DateEl = new Date(curIt);
    finalAr.push({
      icon:
        "http://openweathermap.org/img/wn/" +
        getCurrentWeather(weatherData.daily.weathercode[i]).dayIcon,
      description: getCurrentWeather(weatherData.daily.weathercode[i])
        .description,
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
