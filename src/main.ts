import App from "./App.svelte";

document.addEventListener("touchstart", function () {}, false);
export default new App({ target: document.body });
