const FILES_TO_CACHE = [
  "../",  
  "../index.html",
  "../css/style.css",
  "./index.js",
  "./idb.js",
  "../manifest.json",
  "../icons/icon-72x72.png",
  "../icons/icon-96x96.png",
  "../icons/icon-128x128.png",
  "../icons/icon-144x144.png",
  "../icons/icon-152x152.png",
  "../icons/icon-192x192.png",
  "../icons/icon-384x384.png",
  "../icons/icon-512x512.png"
];

  const CACHE_NAME = 'budget-tracker-cache-v1';
  const DATA_CACHE_NAME = 'data-cache-v1';
  

self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log('installing cache : ' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
    );
    self.skipWaiting();
});

// Activate the service worker and remove old data from the cache
self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Removing old cache data', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});


self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
      caches.match(e.request).then(function (request) {
        if (request) { // if cache is available, respond with cache
          console.log('responding with cache : ' + e.request.url)
          return request
        } else {       // if there are no cache, try fetching request
          console.log('file is not cached, fetching : ' + e.request.url)
          return fetch(e.request)
        }
  
        // You can omit if/else for console.log & put one line below like this too.
        // return request || fetch(e.request)
      })
    )
});