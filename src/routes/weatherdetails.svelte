<script>
  import chartjs from "chart.js/auto";
  import { onMount } from "svelte";

  export let weatherData;
  export let finalAr;

  let chartValues = weatherData.hourly.temperature_2m;
  let chartLabels = weatherData.hourly.time;
  let followingTemps = [];
  let followingHours = [];

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

  let ctx;
  let chartCanvas;
  onMount(async (promise) => {
    ctx = chartCanvas.getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 0, 0, 500);
    gradientStroke.addColorStop(0, "rgb(255, 0, 0)");
    gradientStroke.addColorStop(1, "rgb(0, 0, 255)");
    var myChart = new chartjs(ctx, {
      type: "line",
      data: {
        labels: followingHours,
        datasets: [
          {
            label: "",
            borderColor: gradientStroke,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
            pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            pointBorderWidth: 2,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointRadius: 1,
            fill: false,
            borderWidth: 4,
            borderCapStyle: "round",
            data: followingTemps,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
        },
        scales: {
          y: {
            min: 0,
            grid: {
              color: "white",
            },
          },
          x: {
            grid: {
              color: "white",
            },
          },
        },
      },
    });
  });
</script>

<div class="container">
  <div class="graph-container">
    <h1 class="title">Temperature next 12 hours</h1>
    <canvas bind:this={chartCanvas} id="myChart" />
  </div>
  <div class="days-container">
    {#each finalAr as dayitem}
      <div class="day">
        <img src={dayitem.icon} alt="day img" class="day-img" />
        <div class="temp-container">{dayitem.minTemp}/{dayitem.maxTemp}</div>
        <div class="weekday">{dayitem.day}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    transition: all 3s;
    background-color: rgb(31, 29, 29);
    display: flex;
    flex-direction: row;
  }
  .container:before {
    transition: all 3s;
    content: "";
    position: absolute;
    background-color: rgb(31, 29, 29);
    height: 10px;
    width: 100%;
    top: -10px;
    box-shadow: 0px 4px 40px 40px rgb(31, 29, 29);
  }
  .graph-container {
    z-index: 1;
    width: auto;
    border-radius: 25px;
    background-image: linear-gradient(72deg, rgb(63, 63, 63), black);
    margin: 5px;
  }
  .days-container {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 700px;
    gap: 10px;
  }
  .days-container::-webkit-scrollbar {
    width: 0;
    background-color: transparent;
  }
  .day {
    padding: 50px;
    background-color: rgb(63, 63, 63);
    border-radius: 20px;
    width: 100px;
    height: 67px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .weekday {
    position: absolute;
    bottom: 0;
    font-size: 28px;
  }
  .title {
    color: white;
    margin-top: 50px;
    text-align: center;
  }
</style>
