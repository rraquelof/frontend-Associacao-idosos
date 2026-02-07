const CACHE_NOME = "login-cache-v1";
const urlsCache = [
  "/",
  "/index.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NOME).then(cache => {
      return cache.addAll(urlsCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
