<script>
  import { clickOutside } from "./clickoutside";
  import { fade, fly, slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  let inputvalue = "";
  export let AllCountriesData;
  export let blacktheme = false;
  let extendedsearch = undefined;
  let istyping = false;
  let dispatch = createEventDispatcher();
  let suggestionIndex = 0;
  let matchesArray = [];
  let searchStyle, suggestionStyle;
  let showLoad = false;
  let typingTimeout;
  if (blacktheme) {
    searchStyle = "background-color: rgba(0, 0, 0, 0.342)";
    suggestionStyle = "background-color: rgba(11, 11, 11, 0.507)";
  }
  function deepValueSearch(arr, value, re = new RegExp(value, "gi")) {
    if (!Array.isArray(arr)) {
      return [];
    }

    if (value === "") {
      return [];
    }

    const allMatches = [];

    for (let val of arr) {
      if (typeof val === "string") {
        let match = re.exec(val);
        if (match) {
          allMatches.push(match.input);
        }
      }
    }
    showLoad = false;
    return allMatches;
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      navigateSuggestions(event.key);
      setTimeout(() => {
        const suggestionElement = document.querySelector(".selected");
        if (suggestionElement) {
          suggestionElement.scrollIntoView({
            block: "nearest",
            inline: "nearest",
          });
        }
      }, 100);
    }
    if (event.key === "Enter") {
      selectSuggestion();
    }
  }

  function navigateSuggestions(key) {
    const suggestions = deepValueSearch(AllCountriesData, inputvalue);
    const numSuggestions = suggestions.length;
    if (numSuggestions === 0) return;

    if (key === "ArrowUp") {
      suggestionIndex = (suggestionIndex - 1 + numSuggestions) % numSuggestions;
    } else if (key === "ArrowDown") {
      suggestionIndex = (suggestionIndex + 1) % numSuggestions;
    }
  }

  function selectSuggestion() {
    const suggestions = deepValueSearch(AllCountriesData, inputvalue);
    if (suggestions.length > 0) {
      dispatch("fetch", { message: suggestions[suggestionIndex] });
    }
  }
</script>

<div class="secondary-wrapper">
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div
    on:click={() => {
      extendedsearch = true;
    }}
    use:clickOutside={() => {
      clearTimeout(typingTimeout);
      extendedsearch = false;
      istyping = false;
      showLoad = false;
      inputvalue = "";
    }}
    class:showsearch={extendedsearch === true}
    class:hidesearch={extendedsearch === false}
    class="search"
    class:typing={istyping === true}
    style={searchStyle}
    tabindex="0"
    on:keydown={handleKeyDown}
  >
    {#if extendedsearch}
      <input
        bind:value={inputvalue}
        type="text"
        on:input={() => {
          istyping = true;
          showLoad = true;
          clearTimeout(typingTimeout);
          typingTimeout = setTimeout(() => {
            matchesArray = deepValueSearch(AllCountriesData, inputvalue);
          }, 500);
        }}
        class="search-input"
        in:fade={{ delay: 800 }}
        out:fade
        placeholder="Search a city, country..."
      />
      {#if showLoad && istyping && inputvalue.length > 0}
        <div class="load-results" in:fly={{ y: -50 }}>
          <div class="lds-ring">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      {/if}
      {#if showLoad === false && inputvalue.length > 0}
        <div transition:slide class="suggestions">
          {#each matchesArray as match, i}
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <div
              on:click={() => {
                selectSuggestion();
              }}
              class="suggestion"
              class:selected={i === suggestionIndex}
              style={suggestionStyle}
              on:mouseover={() => {
                suggestionIndex = i;
              }}
            >
              {#if match.toLowerCase().includes(inputvalue.toLowerCase())}
                {#each match.split(new RegExp(`(${inputvalue})`, "gi")) as segment}
                  {#if segment.toLowerCase() === inputvalue.toLowerCase()}
                    <strong>{segment}</strong>
                  {:else}
                    {segment}
                  {/if}
                {/each}
              {:else}
                {match}
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  ::-webkit-input-placeholder {
    color: #fffbf76d;
  }
  :-moz-placeholder {
    color: #fffbf76d;
    opacity: 1;
  }
  ::-moz-placeholder {
    color: #fffbf76d;
    opacity: 1;
  }
  :-ms-input-placeholder {
    color: #fffbf76d;
  }
  ::-ms-input-placeholder {
    color: #fffbf76d;
  }
  ::placeholder {
    color: #fffbf76d;
  }
  .lds-ring {
    display: inline-block;
    position: relative;
    width: 28px;
    height: 28px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 25px;
    height: 25px;
    border: 2px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .search {
    position: relative;
    display: flex;
    transition: all 1s;
    text-align: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.342);
    margin: 10px;
  }
  .load-results {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0.342);
    border-radius: 50%;
    left: 50%;
    top: 50px;
    transform: translateX(-50%);
  }
  .search-input {
    width: 160px;
    background-color: transparent;
    border: none;
    margin-left: 5px;
  }
  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    height: auto;
    display: flex;
    flex-direction: column;
    background-color: rgba(211, 211, 211, 0.507);
  }
  .suggestions::-webkit-scrollbar {
    width: 0;
    background-color: transparent;
  }
  .suggestion {
    display: block;
    margin-bottom: 3px;
    font-size: 17px;
  }
  .selected:hover,
  .selected {
    background-color: white;
  }
  input:focus {
    outline: none;
  }
  .showsearch {
    animation: extend 1s forwards;
  }
  .hidesearch {
    animation: hide 1s forwards;
  }
  .search::after {
    content: url("./svgs/search.svg");
    position: absolute;
    right: 0;
  }
  .search:hover {
    cursor: pointer;
  }
  .secondary-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .typing {
    animation: unround 0.25s forwards;
  }
  @keyframes extend {
    0% {
      width: 28px;
      border-radius: 50%;
    }
    50% {
      border-radius: 28px;
    }
    100% {
      width: 200px;
      border-radius: 28px;
    }
  }
  @keyframes hide {
    0% {
      width: 200px;
      border-radius: 28px;
    }
    50% {
      border-radius: 14px;
    }
    100% {
      width: 28px;
      border-radius: 50%;
    }
  }
  @keyframes unround {
    0% {
      width: 200px;
      border-radius: 28px;
    }
    100% {
      width: 200px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }
</style>
