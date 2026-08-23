```javascript
const CACHE_NAME = 'ojen-v1';
const assets = [
  '/The-AI-Core/',
  '/The-AI-Core/index.html',
  '/The-AI-Core/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
```
