console.log("Service Worker registered.");

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.", event);
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.", event);
});

self.addEventListener("fetch", (event) => {
  // This service worker doesn't do any caching yet.
  // It simply passes the fetch request through.
  // console.log('Fetching:', event.request.url);
  // event.respondWith(fetch(event.request));
});
