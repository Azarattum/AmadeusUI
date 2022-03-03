const timestamp = 1646314232113;
const build = [
  "/AmadeusUI/_app/start-b4644228.js",
  "/AmadeusUI/_app/pages/__layout.svelte-bfe8f9c1.js",
  "/AmadeusUI/_app/assets/pages/__layout.svelte-ee4679ba.css",
  "/AmadeusUI/_app/error.svelte-f772cec3.js",
  "/AmadeusUI/_app/pages/index.svelte-f41538ee.js",
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
