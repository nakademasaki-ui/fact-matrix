// Service Worker for FACT MATRIX PWA
const CACHE_NAME = 'fact-matrix-v1.0.0';

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './manifest.json',
  './icons/icon-512.svg',
  './js/app.js',
  './js/data/countries.js',
  './js/data/centralBanks.js',
  './js/data/stockMarkets.js',
  './js/data/balanceSheets.js',
  './js/data/sovereignBalanceSheets.js',
  './js/data/sovereignSolvency.js',
  './js/data/globalNews.js',
  './js/data/unResolutions.js',
  './js/services/worldBank.js',
  './js/components/worldMap.js',
  './js/components/macroMatrix.js',
  './js/components/stockMarkets.js',
  './js/components/balanceSheetMatrix.js',
  './js/components/sovereignBalanceSheet.js',
  './js/components/sovereignSolvency.js',
  './js/components/globalNews.js',
  './js/components/economicChart.js',
  './js/components/unTracker.js',
  './js/components/countryDetail.js',
  './js/components/sourceInspector.js'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Stale-while-revalidate for local assets, Network-first for APIs)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // If external API (World Bank, etc.), try network first, then cache
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Local Static Assets: Cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
