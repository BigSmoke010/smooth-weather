<script>
  import Main from "./main.svelte";
</script>

<title>Smooth Weather</title>
<div class="main-wrapper">
  <Main />
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@500&display=swap");
  * {
    font-family: "IBM Plex Sans";
  }

  :global(body) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
</style>
