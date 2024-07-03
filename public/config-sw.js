const CACHE_NAME = 'next-agilts-staging-v2.6';
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
    event.respondWith(
      cacheClone(event).catch(() => caches.match(event.request))
    );
  });
};

fetchEvent();
