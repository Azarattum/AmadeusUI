const build = [
  "/_app/start-571f03a3.js",
  "/_app/pages/__layout.svelte-f6a6addb.js",
  "/_app/assets/pages/__layout.svelte-ee4679ba.css",
  "/_app/error.svelte-c6411e1f.js",
  "/_app/pages/index.svelte-700a5e39.js",
  "/_app/assets/pages/index.svelte-79fd83c9.css",
  "/_app/chunks/index-571d3ec7.js",
  "/_app/chunks/preload-helper-0e672089.js",
  "/_app/chunks/paths-396f020f.js",
  "/_app/chunks/hls-86082839.js"
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
const version = "1659002862614";
const files = files$1.filter((x) => x != "/.DS_Store");
const worker = self;
const assets = `cache${version}`;
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
  const cache = await caches.open(`offline${version}`);
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
