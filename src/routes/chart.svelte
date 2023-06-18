<script>
  import { onMount } from "svelte";
  import { GoogleCharts } from "google-charts";

  export let weatherData;
  let chartValues = weatherData.hourly.temperature_2m;
  let chartLabels = weatherData.hourly.time;

  let followingTemps = [];
  let followingHours = [];

  const currentTimedef = new Date();
  const currentTime = currentTimedef.getTime();
  const twelveHoursAfter = currentTime + 12 * 60 * 60 * 1000;

  for (let i = 0; i < chartLabels.length; i++) {
    let curItem = chartLabels[i];
    const timestamp = new Date(curItem).getTime();

    if (timestamp >= currentTime && timestamp <= twelveHoursAfter) {
      followingHours.push(curItem);
      followingTemps.push(chartValues[i]);
    }
  }
  followingHours = followingHours.map((x) => {
    return x.substring(x.indexOf("T") + 1);
  });
  onMount(() => {
    GoogleCharts.load(drawChart);

    function drawChart() {
      const chartData = [
        ["Time", "Temperature"],
        ...followingHours.map((hour, index) => [hour, followingTemps[index]]),
      ];
      const data = GoogleCharts.api.visualization.arrayToDataTable(chartData);

      const options = {
        title: "Temperature next 12 hours",
        legend: "none",
        height: "350",
        curveType: "function",
        colors: ["#FF0000"],
        vAxis: {
          title: "Temperature",
          minValue: 0,
          gridlines: {
            color: "white",
          },
          textStyle: {
            color: "light-grey",
          },
        },
        hAxis: {
          title: "Time",
          gridlines: {
            color: "white",
          },
          textStyle: {
            color: "#0026FFFF",
          },
        },
        backgroundColor: {
          fill: "none",
        },
      };

      const chart = new GoogleCharts.api.visualization.LineChart(
        document.getElementById("chart1")
      );
      chart.draw(data, options);
    }
  });
</script>

<div id="chart1" />

<style>
</style>
