/// <reference lib="webworker" />
import { build, files as cached, timestamp } from "$service-worker";

const files = cached.filter((x: string) => x != "/.DS_Store");
const worker = self as unknown as ServiceWorkerGlobalScope;
const assets = `cache${timestamp}`;

const bundleFiles = build.concat(files);
const bundleSet = new Set(bundleFiles);

// Add all bundle files to the cache upon installation
worker.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(assets)
      .then((cache) => cache.addAll(bundleFiles))
      .then(() => {
        worker.skipWaiting();
      })
  );
});

// Delete old bundle cache files
worker.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      for (const key of keys) {
        if (key !== assets) await caches.delete(key);
      }
      worker.clients.claim();
    })
  );
});

function isCacheable(request: Request) {
  const url = new URL(request.url);

  if (bundleSet.has(url.pathname)) return true;
  if (request.destination === "image") return true;
  return false;
}

async function fetchAndCache(request: Request) {
  const cache = await caches.open(`offline${timestamp}`);

  try {
    const response = await fetch(request);
    if (isCacheable(request)) cache.put(request, response.clone());
    return response;
  } catch (error) {
    // Fallback to cache when offline
    const response = await cache.match(request);
    if (response) return response;
    throw error;
  }
}

worker.addEventListener("fetch", async (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (!url.protocol.startsWith("http")) return;
  if (request.headers.has("range")) return;
  if (request.method !== "GET") return;

  const response = async () => {
    const cached = isCacheable(request) && (await caches.match(event.request));
    return cached || fetchAndCache(event.request);
  };

  event.respondWith(response());
});
