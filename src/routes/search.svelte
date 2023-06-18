<script>
  import { clickOutside } from "./clickoutside";
  import { fade, slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  let inputvalue = "";
  export let AllCountriesData;
  let extendedsearch = undefined;
  let istyping = false;
  let dispatch = createEventDispatcher();
  let suggestionIndex = 0;

  function deepValueSearch(obj, value) {
    let AllMatches = [];
    let re = new RegExp(value, "gi");
    if (value !== "") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === "name") {
            let match = re.exec(obj[key]);
            if (
              match !== null &&
              match !== "" &&
              !match["input"].includes("[object Object]")
            ) {
              AllMatches.push({ value: match[0], input: match["input"] });
            }
          } else if (typeof obj[key] === "object") {
            AllMatches = AllMatches.concat(deepValueSearch(obj[key], value));
          }
        }
      }
    }
    return AllMatches;
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
    console.log(suggestionIndex);
  }

  function selectSuggestion() {
    const suggestions = deepValueSearch(AllCountriesData, inputvalue).slice(
      0,
      10
    );

    if (suggestions.length > 0) {
      dispatch("fetch", { message: inputvalue });
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
      extendedsearch = false;
      istyping = false;
      inputvalue = "";
    }}
    class:showsearch={extendedsearch === true}
    class:hidesearch={extendedsearch === false}
    class="search"
    class:typing={istyping === true}
    tabindex="0"
    on:keydown={handleKeyDown}
  >
    {#if extendedsearch}
      <input
        bind:value={inputvalue}
        type="text"
        on:input={() => {
          deepValueSearch(AllCountriesData, inputvalue);
          istyping = true;
        }}
        class="search-input"
        in:fade={{ delay: 800 }}
        out:fade
        placeholder="Search a city, country..."
      />
      {#if inputvalue.length > 0}
        <div transition:slide class="suggestions">
          {#each deepValueSearch(AllCountriesData, inputvalue) as match, i}
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <div
              on:click={() => {
                inputvalue = match.input;
                dispatch("fetch", { message: inputvalue });
              }}
              class:suggestion={i === suggestionIndex}
              class:selected={i === suggestionIndex}
              on:mouseover={() => {
                suggestionIndex = i;
              }}
            >
              {match.input}
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

  .search {
    position: relative;
    display: flex;
    transition: all 1s;
    text-align: center;
    width: 28px;
    height: 28px;
    background-color: rgba(255, 255, 255, 0.342);
    border-radius: 50%;
    margin: 10px;
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
    background-color: rgba(211, 211, 211, 0.507);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .suggestions::-webkit-scrollbar {
    width: 0;
    background-color: transparent;
  }
  .suggestion:hover,
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
