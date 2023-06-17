<script>
  import chartjs from "chart.js/auto";
  import { onMount } from "svelte";
  export let weatherData;
  let chartData;
  let chartValues = weatherData.hourly.temperature_2m;
  let chartLabels = weatherData.hourly.time;
  let followingTemps = [];
  let followingHours = [];
  const currentTimedef = new Date();
  const currentTime = currentTimedef.getTime(); // Get the current time in milliseconds
  const twelveHoursAgo = currentTimedef.getTime() - 12 * 60 * 60 * 1000; // Calculate the timestamp 12 hours ago

  for (let i = 0; i < chartLabels.length; i++) {
    let curItem = chartLabels[i];

    const timestamp = new Date(curItem).getTime(); // Get the timestamp of the current item in the loop

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
    gradientStroke.addColorStop(0, "rgb(255, 0, 0)"); // Hot color
    gradientStroke.addColorStop(1, "rgb(0, 0, 255)"); // Cold color
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
  <h1 class="title">Temperature next 12 hours</h1>
  <canvas bind:this={chartCanvas} id="myChart" />
</div>

<style>
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    transition: all 3s;
    background-color: rgb(31, 29, 29);
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
  .title {
    color: white;
    margin-top: 50px;
    text-align: center;
  }
</style>
