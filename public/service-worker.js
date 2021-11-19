const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    "/",
    "./index.html",
    "./styles.css",
    "./indexedDB.js",
    "./index.js",
    "./manifest.webmanifest",
    "./icons/icon-192x192.png",
    "./icons/icon-512x512.png"
];

// install
self.addEventListener("install", function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {//"static-cache-v2"
        console.log("Your files were pre-cached successfully!");
        return cache.addAll(FILES_TO_CACHE);//static content
      })
    )
});

// Set cached resources as response
self.addEventListener("fetch", function(evt) {
    // cache requests to the API routes
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {// to cache data from API calls
          return fetch(evt.request)
            .then(response => {
              // clone and store in cache if response was good
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              // try to get from cache if request failed
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }
  
    // if the request is not for the API, serve static assets using "offline-first" approach.
    evt.respondWith(
      caches.match(evt.request).then(function(response) {
        return response || fetch(evt.request);
      })
    );
  });

