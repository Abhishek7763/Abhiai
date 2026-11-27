const CACHE='abhiai-offline-v1';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/offline.html','/icon.svg']))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('abhiai-offline-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.mode!=='navigate'||new URL(r.url).origin!==self.location.origin||new URL(r.url).pathname!=='/')return;e.respondWith(fetch(r).catch(()=>caches.match('/offline.html')))});
