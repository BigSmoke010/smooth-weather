<script>
  import Arrow from "./svgs/arrow-down-bold.svg";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  onMount(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  let opacity, translateY;
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    opacity = 1 - scrollTop / 30;
    translateY = (-6 * scrollTop) / 30;
  }
</script>

<img
  src={Arrow}
  class="downarrow"
  transition:fly={{ y: -50, delay: 500 }}
  alt="Go Down"
  style="opacity: {opacity};transform: translate(-50%,{translateY}px);"
/>

<style>
  .downarrow {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0px);
    bottom: 20px;
    z-index: 1;
    transition: opacity 0.25s ease;
  }
</style>
