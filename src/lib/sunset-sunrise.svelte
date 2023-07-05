<!-- App.svelte -->
<script>
  import halfEclipse from "./svgs/half-ellipse.svg";
  export let weatherData;

  let curTime = weatherData.current_weather.time;
  let sunrise = weatherData.daily.sunrise[0];
  let sunset = weatherData.daily.sunset[0];
  let left = calculateLeft(curTime, sunrise, sunset);
  function calculateLeft(time, sunriseTime, sunsetTime) {
    const sunriseDate = new Date(sunriseTime);
    const sunsetDate = new Date(sunsetTime);
    const currentDate = new Date(time);

    const sunriseMinutes = getMinutesSinceMidnight(sunriseDate);
    const sunsetMinutes = getMinutesSinceMidnight(sunsetDate);
    const currentMinutes = getMinutesSinceMidnight(currentDate);
    const left =
      ((currentMinutes - sunriseMinutes) / (sunsetMinutes - sunriseMinutes)) *
      100;
    return Math.max(Math.min(left, 100), 0);
  }

  function calculateTopLimit(left) {
    const leftPercent = left / 100;
    const radius = 0.5;
    const verticalOffset = -Math.sqrt(
      radius * radius - (leftPercent - 0.5) * (leftPercent - 0.5)
    );
    let topLimit = (verticalOffset + radius) * 100;
    if (left === 0 || left === 100) {
      topLimit = 73;
    }
    return Math.max(Math.min(topLimit + 13, 100), 0);
  }

  function getMinutesSinceMidnight(date) {
    return date.getHours() * 60 + date.getMinutes();
  }
</script>

<div class="sun-container">
  <div class="circle-container">
    <img src={halfEclipse} alt="container" class="gradient" />
    <div
      class="circle-element"
      style="top: {calculateTopLimit(left)}%; left: {left}%;"
    />
    <div class="current-time-container" style=" left: {left - 11}%;">
      {new Date(curTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}
    </div>
    <div class="sunrise-container">
      {new Date(sunrise).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}
    </div>
    <div class="sunset-container">
      {new Date(sunset).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}
    </div>
  </div>
</div>

<style>
  .sun-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .circle-container {
    position: relative;
    border-radius: 100%;
  }
  .sunrise-container {
    font-size: 14px;
    position: absolute;
    left: -15px;
    color: rgba(255, 255, 255, 0.514);
    bottom: -15px;
  }
  .sunset-container {
    position: absolute;
    color: rgba(255, 255, 255, 0.514);
    font-size: 14px;
    right: -15px;
    bottom: -15px;
  }
  .current-time-container {
    color: rgba(255, 255, 255, 0.814);
    font-size: 16px;
    position: absolute;
    top: -15px;
  }
  .circle-element {
    position: absolute;
    top: 0;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: rgb(233, 96, 47);
    box-shadow: 0 0 5px 2px rgb(233, 96, 47);
  }
</style>
