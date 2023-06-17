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
  let source;
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
  weatherDesc = getCurrentWeather(code).description;
  source = getCurrentWeather(code).videoSrc;
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
