// Service Worker for FACT MATRIX PWA
const CACHE_NAME = 'fact-matrix-v1.2.0';

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './manifest.json',
  './icons/icon-512.svg',
  './js/app.js',
  './js/data/syncMeta.js',
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
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event - purge old caches immediately
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

// Fetch Event: Network-First with Cache Fallback for instant updates
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

