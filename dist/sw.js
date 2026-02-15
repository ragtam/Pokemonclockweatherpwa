const CACHE_NAME = 'pokemon-weather-clock-v1';
const urlsToCache = [
  '/Pokemonclockweatherpwa/',
  '/Pokemonclockweatherpwa/index.html',
  '/Pokemonclockweatherpwa/src/app/App.tsx',
  '/Pokemonclockweatherpwa/src/styles/index.css',
  '/Pokemonclockweatherpwa/src/styles/tailwind.css',
  '/Pokemonclockweatherpwa/src/styles/theme.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
