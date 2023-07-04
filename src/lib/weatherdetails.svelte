<script>
  import Chart from "./chart.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  export let weatherData;
  export let finalAr;
  export let colors;
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
  {#if hideBoxShadow}
    <div
      class="chart-container"
      style="background-color: {colors.two}10;"
      in:fly={{ duration: 550, y: 100 }}
    >
      <Chart {weatherData} {colors} />
    </div>

    <div class="days-container" in:fly={{ duration: 550, y: 100 }}>
      {#each finalAr as dayitem}
        <div class="day" style="background-color: {colors.one}25;">
          <img src={dayitem.icon} alt="day img" class="day-img" />
          <div class="temp-container">
            {dayitem.minTemp}C°/{dayitem.maxTemp}C°
          </div>
          <div class="day-code">{dayitem.description}</div>
          <div class="weekday">{dayitem.day}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  @property --p {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 10%;
  }
  .container {
    position: relative;
    display: flex;
    background-size: 400% 400%;
    flex-direction: column;
    transition: all 3s;
    min-height: 400px;
    width: 100vw;
    background-color: rgba(31, 23, 23, 0.644);
    display: flex;
    flex-direction: row;
    gap: 5px;
    animation: gradient 15s ease infinite;
  }
  .chart-container {
    transition: transform 0.5s, margin-left 0.4s;
    background-color: rgba(94, 70, 70, 0.726);
    border-radius: 30px;
    box-shadow: 0px 5px 2.2px rgba(0, 0, 0, 0.02),
      0px 9.3px 5.3px rgba(0, 0, 0, 0.028), 0px 13.6px 10px rgba(0, 0, 0, 0.035),
      0px 19px 17.9px rgba(0, 0, 0, 0.042),
      0px 27.6px 33.4px rgba(0, 0, 0, 0.05), 0px 51px 80px rgba(0, 0, 0, 0.07);
    width: 450px;
    height: 100%;
    margin: 10px;
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
    width: 500px;
    flex-grow: 1;
    height: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
    background-color: rgba(255, 255, 255, 0.171);
    border-radius: 30px;
    margin: 10px;
    gap: 10px;
  }
  .day {
    border-radius: 20px;
    min-height: 250px;
    min-width: 180px;
    margin: 10px;
    position: relative;
    box-shadow: 9px 10px 78.5px rgba(0, 0, 0, 0.036),
      17.3px 19.3px 102px rgba(0, 0, 0, 0.054),
      44px 49px 184px rgba(0, 0, 0, 0.09);
  }
  .days-container::-webkit-scrollbar {
    height: 4px;
  }
  .days-container::-webkit-scrollbar-track {
    background: #c4c4c4;
  }

  .days-container::-webkit-scrollbar-thumb {
    background-color: #49444b;
    border-radius: 5px;
  }
  .day-img {
    position: absolute;
    top: 0;
    width: 50px;
    height: 50px;
    left: 50%;
    transform: translateX(-50%);
  }
  .weekday {
    position: absolute;
    bottom: 0;
    font-size: 20px;
    color: white;
    width: 100%;

    text-align: center;
  }
  .day-code {
    color: white;
    word-wrap: none;
    width: 100%;
    position: absolute;
    bottom: 50px;
    text-align: center;
    font-size: 22px;
  }
  .temp-container {
    color: white;
    position: absolute;
    width: 100%;
    text-align: center;
    top: 60px;
  }
  @media (max-width: 600px) {
    .container {
      flex-direction: column;
    }
    .chart-container {
      width: 95%;
    }
    .days-container {
      width: 95%;
    }
  }
</style>
