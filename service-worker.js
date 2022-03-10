const timestamp = 1646897271360;
const build = [
  "/_app/start-4d805eb6.js",
  "/_app/pages/__layout.svelte-bfe8f9c1.js",
  "/_app/assets/pages/__layout.svelte-ee4679ba.css",
  "/_app/error.svelte-f772cec3.js",
  "/_app/pages/index.svelte-9e88d3b5.js",
  "/_app/assets/pages/index.svelte-5f182718.css",
  "/_app/chunks/vendor-dc7df7c6.js",
  "/_app/chunks/paths-4b3c6e7e.js",
  "/_app/chunks/preload-helper-e4860ae8.js",
  "/_app/chunks/hls-ab311cfe.js"
];
const files$1 = [
  "/fonts/blokk.woff2",
  "/images/favicon.png",
  "/images/icon.jpg",
  "/images/logo.jpg",
  "/images/logo.svg",
  "/images/splash-5.jpg",
  "/images/splash-8.jpg",
  "/images/splash-X.jpg",
  "/images/splash-plus.jpg",
  "/manifest.json"
];
const files = files$1.filter((x) => x != "/.DS_Store");
const worker = self;
const assets = `cache${timestamp}`;
const bundleFiles = build.concat(files);
const bundleSet = new Set(bundleFiles);
worker.addEventListener("install", (event) => {
  event.waitUntil(caches.open(assets).then((cache) => cache.addAll(bundleFiles)).then(() => {
    worker.skipWaiting();
  }));
});
worker.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(async (keys) => {
    for (const key of keys) {
      if (key !== assets)
        await caches.delete(key);
    }
    worker.clients.claim();
  }));
});
function isCacheable(request) {
  const url = new URL(request.url);
  if (bundleSet.has(url.pathname))
    return true;
  if (request.destination === "image")
    return true;
  return false;
}
async function fetchAndCache(request) {
  const cache = await caches.open(`offline${timestamp}`);
  try {
    const response = await fetch(request);
    if (isCacheable(request))
      cache.put(request, response.clone());
    return response;
  } catch (error) {
    const response = await cache.match(request);
    if (response)
      return response;
    throw error;
  }
}
worker.addEventListener("fetch", async (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (!url.protocol.startsWith("http"))
    return;
  if (request.headers.has("range"))
    return;
  if (request.method !== "GET")
    return;
  const response = async () => {
    const cached2 = isCacheable(request) && await caches.match(event.request);
    return cached2 || fetchAndCache(event.request);
  };
  event.respondWith(response());
});
