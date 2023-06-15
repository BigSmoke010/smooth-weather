<script>
  import { fade } from "svelte/transition";
  export let source;
</script>

{#key source}
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
{/key}

<style>
  #video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
</style>
