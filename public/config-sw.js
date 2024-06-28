const CACHE_NAME = 'next-agilts-staging-v2.3';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log(API_URL);
const cacheClone = async (event) => {
  try {
    const response = await fetch(event.request);
    if (event.request.method === 'GET') {
      const responseClone = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(event.request, responseClone);
    }
    return response;
  } catch (error) {
    console.error('Fetch failed; returning offline page instead.', error);
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    return cachedResponse || Promise.reject('no-match');
  }
};

const fetchEvent = () => {
  self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.origin !== location.origin && url.origin === API_URL) {
      event.respondWith(
        fetch(event.request).catch((error) => {
          console.error('API fetch failed:', error);
          return new Response('API fetch failed', { status: 500 });
        })
      );
      return;
    }

    event.respondWith(
      cacheClone(event).catch(() => caches.match(event.request))
    );
  });
};

fetchEvent();
