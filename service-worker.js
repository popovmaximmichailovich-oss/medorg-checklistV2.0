/* service-worker.js — v27 full app */
const CACHE_NAME = 'medorg-checklist-v27-full-app';
const APP_ASSETS = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', function(event){event.waitUntil(caches.open(CACHE_NAME).then(function(cache){return cache.addAll(APP_ASSETS);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate', function(event){event.waitUntil(caches.keys().then(function(names){return Promise.all(names.map(function(name){return name!==CACHE_NAME?caches.delete(name):Promise.resolve();}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch', function(event){
  const req=event.request; if(req.method!=='GET') return; const url=new URL(req.url); if(url.origin!==self.location.origin) return;
  if(req.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html')){
    event.respondWith(fetch(req).then(function(res){return caches.open(CACHE_NAME).then(function(cache){cache.put('./index.html',res.clone());return res;});}).catch(function(){return caches.match('./index.html');})); return;
  }
  if(url.pathname.endsWith('/manifest.webmanifest')){event.respondWith(fetch(req).then(function(res){return caches.open(CACHE_NAME).then(function(cache){cache.put(req,res.clone());return res;});}).catch(function(){return caches.match(req);})); return;}
  event.respondWith(caches.match(req).then(function(cached){if(cached) return cached; return fetch(req).then(function(res){return caches.open(CACHE_NAME).then(function(cache){cache.put(req,res.clone());return res;});});}));
});
