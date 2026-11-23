// Cofrivo — mantém o app funcionando offline. Aumente a versão ao publicar mudanças.
const CACHE = 'cofrivo-v18';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'manifest-dark.webmanifest',
  'icon-light-180.png', 'icon-light-192.png', 'icon-light-512.png', 'icon-light-maskable-512.png', 'icon-light-64.png',
  'icon-dark-180.png', 'icon-dark-192.png', 'icon-dark-512.png', 'icon-dark-maskable-512.png', 'icon-dark-64.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Rede primeiro (pega atualizações), cache se estiver offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
