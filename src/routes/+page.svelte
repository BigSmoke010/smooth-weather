<script>
  import Main from "$lib/main.svelte";
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
    overflow-x: hidden;
    scrollbar-width: auto;
    scrollbar-color: #49444b #ffffff;
  }

  :global(body)::-webkit-scrollbar {
    width: 5px;
  }

  :global(body)::-webkit-scrollbar-track {
    background: #c4c4c4;
  }

  :global(body)::-webkit-scrollbar-thumb {
    background-color: #49444b;
    border-radius: 5px;
    border: 3px none #ffffff;
  }
</style>
