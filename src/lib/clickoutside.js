export function clickOutside(node, onEventFunction) {
  const handleClick = (event) => {
    var path = event.composedPath();

    if (!path.includes(node)) {
      onEventFunction();
    }
  };

  // Wait for the element to be added to the DOM before attaching the event listener
  setTimeout(() => {
    document.addEventListener("click", handleClick);
  }, 10);

  return {
    destroy() {
      document.removeEventListener("click", handleClick);
    },
  };
}