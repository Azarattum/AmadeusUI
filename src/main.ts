import App from "./App.svelte";
import smoothscroll from "smoothscroll-polyfill";

smoothscroll.polyfill();
document.addEventListener("touchstart", function () {}, false);
export default new App({ target: document.body });
