const timestamp = 1646329059151;
const build = [
  "/AmadeusUI/_app/start-a60fdc72.js",
  "/AmadeusUI/_app/pages/__layout.svelte-bfe8f9c1.js",
  "/AmadeusUI/_app/assets/pages/__layout.svelte-ee4679ba.css",
  "/AmadeusUI/_app/error.svelte-f772cec3.js",
  "/AmadeusUI/_app/pages/index.svelte-3a0f1cf3.js",
  "/AmadeusUI/_app/assets/pages/index.svelte-5f182718.css",
  "/AmadeusUI/_app/chunks/vendor-dc7df7c6.js",
  "/AmadeusUI/_app/chunks/paths-4b3c6e7e.js",
  "/AmadeusUI/_app/chunks/preload-helper-1ae1ff14.js",
  "/AmadeusUI/_app/chunks/hls-ab311cfe.js"
];
const files$1 = [
  "/AmadeusUI/fonts/blokk.woff2",
  "/AmadeusUI/images/favicon.png",
  "/AmadeusUI/images/icon.jpg",
  "/AmadeusUI/images/logo.jpg",
  "/AmadeusUI/images/logo.svg",
  "/AmadeusUI/images/splash-5.jpg",
  "/AmadeusUI/images/splash-8.jpg",
  "/AmadeusUI/images/splash-X.jpg",
  "/AmadeusUI/images/splash-plus.jpg",
  "/AmadeusUI/manifest.json"
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
