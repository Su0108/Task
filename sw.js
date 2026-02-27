const CACHE_NAME = 'taskmgmt-v1';
const ASSETS = [
  '/',
  '/index.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // For API calls (Supabase), always go to network
  if (e.request.url.includes('supabase.co')) {
    return e.respondWith(fetch(e.request));
  }
  // For app shell, try cache first then network
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
