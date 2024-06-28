const CACHE_NAME = 'next-agilts-staging-v2.2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/vi/', '/en/']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch((error) => {
          console.error('Fetch failed:', error);
          throw error;
        })
      );
    })
  );
});
