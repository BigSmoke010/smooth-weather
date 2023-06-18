<script>
  import Chart from "./chart.svelte";
  import { onMount } from "svelte";
  export let weatherData;
  export let finalAr;
  export let colors;
  let chartValues = weatherData.hourly.temperature_2m;
  let chartLabels = weatherData.hourly.time;

  let followingTemps = [];
  let followingHours = [];
  let hideBoxShadow = false;

  onMount(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  function handleScroll() {
    if (window.scrollY >= 100) {
      hideBoxShadow = true;
    } else {
      hideBoxShadow = false;
    }
  }
  const currentTimedef = new Date();
  const currentTime = currentTimedef.getTime();
  const twelveHoursAgo = currentTimedef.getTime() - 12 * 60 * 60 * 1000;

  for (let i = 0; i < chartLabels.length; i++) {
    let curItem = chartLabels[i];

    const timestamp = new Date(curItem).getTime();

    if (timestamp >= twelveHoursAgo && timestamp <= currentTime) {
      followingHours.push(curItem);
      followingTemps.push(chartValues[i]);
    }
  }
  followingHours = followingHours.map((x) => {
    return x.substring(x.indexOf("T") + 1);
  });
</script>

<div
  class="container"
  style="background-image: linear-gradient(-45deg, {colors.one}, {colors.two});"
>
  <div
    class="container-shadow"
    style={`
  box-shadow: ${hideBoxShadow ? "none" : "0px 4px 40px 40px rgb(31, 29, 29)"};
  `}
  />
  <div class="chart-container">
    <Chart {weatherData} />
    <div class="days-container">
      {#each finalAr as dayitem}
        <div
          class="day box"
          style="background:radial-gradient(#5D6666FF var(--p),#2A2E2EFF)"
        >
          <img src={dayitem.icon} alt="day img" class="day-img" />
          <div class="temp-container">
            {dayitem.minTemp}C°/{dayitem.maxTemp}C°
          </div>
          <div class="weekday">{dayitem.day}</div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  @property --p {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 10%;
  }
  .box {
    --p: 10%;
    cursor: pointer;
    width: 250px;
    height: 200px;
    margin: 15px;
    display: inline-block;
    transition: --p 0.5s, --l 0.5s, --a 0.5s, transform 0.5s;
    background: linear-gradient(red var(--p), blue);
  }
  .chart-container {
    background-color: rgb(90, 87, 87);
    border-radius: 30px;
    margin: 10px;
    flex-grow: 1;
  }
  .box:hover {
    --p: 80%;
    transform: scale(125%);
    z-index: 1;
  }
  .container {
    position: relative;
    display: flex;
    background-size: 400% 400%;
    flex-direction: column;
    transition: all 3s;
    background-color: rgba(31, 23, 23, 0.644);
    display: flex;
    flex-direction: row;
    gap: 10px;
    animation: gradient 15s ease infinite;
  }
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .container-shadow {
    transition: all 0.25s;
    content: "";
    position: absolute;
    background-color: rgb(31, 29, 29);
    height: 1px;
    width: 100%;
    top: 0;
  }
  .days-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 10px;
    overflow-x: auto;
    background-color: rgba(46, 46, 46, 0.507);
    border-radius: 30px;
    gap: 10px;
  }
  .days-container::-webkit-scrollbar {
    width: 0;
    background-color: transparent;
  }
  .day {
    padding: 50px;
    border-radius: 20px;
    width: 50px;
    height: 100px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .day-img {
    position: absolute;
    top: 0;
    width: 50px;
    height: 50px;
  }
  .weekday {
    position: absolute;
    bottom: 0;
    font-size: 28px;
  }
</style>
