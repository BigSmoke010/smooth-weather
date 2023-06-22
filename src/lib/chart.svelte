<script>
  import chartjs from "chart.js/auto";
  import { onMount } from "svelte";
  export let weatherData;
  export let colors;
  let chartData;
  let chartValues = weatherData.hourly.temperature_2m.slice(0, 13);
  let chartLabels = weatherData.hourly.time
    .slice(0, 13)
    .map((datetimeString) => {
      return datetimeString.substring(datetimeString.indexOf("T") + 1);
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
        labels: chartLabels,
        datasets: [
          {
            label: "",
            borderColor: gradientStroke,
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
            pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            borderColor: colors.one,
            pointRadius: 0,
            fill: false,
            borderWidth: 3,
            borderCapStyle: "round",
            data: chartValues,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
          responsive: true,
          tooltip: {
            enabled: true, // Enable tooltips
            mode: "index", // Display all tooltips when overlapping
            intersect: false, // Show tooltips even when not directly over a data point
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
              color: "transparent",
            },
          },
        },
      },
    });
  });
</script>

<div class="char-title">Temperature Next 12 hours</div>
<canvas bind:this={chartCanvas} id="myChart" />

<style>
  .char-title {
    margin: 10px;
    color: white;
    font-size: 21px;
  }
</style>
