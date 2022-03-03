const timestamp = 1646314074310;
const build = [
  "/_app/start-2fd940c9.js",
  "/_app/pages/__layout.svelte-bfe8f9c1.js",
  "/_app/assets/pages/__layout.svelte-ee4679ba.css",
  "/_app/error.svelte-f772cec3.js",
  "/_app/pages/index.svelte-20bab31c.js",
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
const toCache = build.concat(files);
const staticAssets = new Set(toCache);
worker.addEventListener("install", (event) => {
  event.waitUntil(caches.open(assets).then((cache) => cache.addAll(toCache)).then(() => {
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
async function fetchAndCache(request) {
  const cache = await caches.open(`offline${timestamp}`);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const response = await cache.match(request);
    if (response)
      return response;
    throw err;
  }
}
worker.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.headers.has("range"))
    return;
  const url = new URL(event.request.url);
  const isHttp = url.protocol.startsWith("http");
  const isDevServerRequest = url.hostname === self.location.hostname && url.port !== self.location.port;
  const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname);
  const skipBecauseUncached = event.request.cache === "only-if-cached" && !isStaticAsset;
  if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
    event.respondWith((async () => {
      const cachedAsset = isStaticAsset && await caches.match(event.request);
      return cachedAsset || fetchAndCache(event.request);
    })());
  }
});
