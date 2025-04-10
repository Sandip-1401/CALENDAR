self.addEventListener('install', event => {
   console.log('Service worker installed!');
   event.waitUntil(
     caches.open('anya-cache').then(cache => {
       return cache.addAll([
         './',
         './index.html',
         './style.css',
         './script.js'
       ]);
     })
   );
 });
 
 self.addEventListener('fetch', event => {
   event.respondWith(
     caches.match(event.request).then(response => {
       return response || fetch(event.request);
     })
   );
 });
 