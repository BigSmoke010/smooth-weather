<script>
  import { fly } from "svelte/transition";
  import Winddir from "./svgs/wind-direction.svg";
  import Circle from "./svgs/circle.svg";
  export let weatherData;
  let chosenIcon, iconurl;
  if (weatherData.icon) {
    if (weatherData.weatherD.current_weather.is_day) {
      chosenIcon = weatherData.icon.day;
    } else {
      chosenIcon = weatherData.icon.night;
    }
    iconurl = "http://openweathermap.org/img/wn/" + chosenIcon;
  }
  function convertWindDirection(windDirection) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const degrees = windDirection % 360;
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }
</script>

<div class="info-wrapper" in:fly={{ y: 150 }}>
  <div>
    <div class="weather-temp">
      {weatherData.weatherD.current_weather.temperature}°
    </div>
    <div class="weather-desc">{weatherData.descript}</div>
    <div class="wind-wrapper">
      <img src={iconurl} alt="weather Icon" />
      <img src={Circle} alt="sep" class="seperator" />
      <div class="dir-wrapper">
        <img
          src={Winddir}
          style="transform: rotate({weatherData.weatherD.current_weather
            .winddirection}deg);"
          alt="wind direction"
        />
        <div class="compass-dir">
          {convertWindDirection(
            weatherData.weatherD.current_weather.winddirection
          )}
        </div>
      </div>
      <img src={Circle} alt="sep" class="seperator" />
      <div class="weather-wind">
        {weatherData.weatherD.current_weather.windspeed}
      </div>
    </div>
  </div>
</div>

<style>
  .info-wrapper {
    display: flex;
    align-content: center;
    background-color: transparent;
  }
  .weather-temp,
  .weather-desc {
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
    gap: 3px;
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
  .seperator {
    margin: 10px;
    opacity: 0.4;
  }
</style>
