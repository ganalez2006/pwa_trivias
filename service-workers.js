var CACHEVERSION = "v1";
var CACHESEPARATOR = "-";
var CACHENAME = "cachestore" + CACHESEPARATOR + CACHEVERSION;
var FILES = [
	"./"
	, "./index.html"
	, "./js/scripts.js"
	, "./data/questions.json"
];

self.addEventListener("install", function(event) {
	self.skipWaiting();
	event.waitUntil(
		caches.open(CACHENAME).then(function(cache) {
			return cache.addAll(FILES);
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys()
		.then(cacheNames =>
			Promise.all(
				cacheNames
				.map(c => c.split(CACHESEPARATOR))
				.filter(c => c[0] === CACHENAME)
				.filter(c => c[1] !== CACHEVERSION)
				.map(c => caches.delete(c.join(CACHESEPARATOR)))
				)
			)
		);
});

// (estrategia offline) cacheFirst con página de error
self.addEventListener("fetch", function(event) {
	event.respondWith(
		fetch(event.request).catch(function() {
			return caches.match(event.request).then(function(response) {
				return response || caches.match("./offline.html");
			});
		})
		);
});
/**/

/*/ (estrategia offline) networkFirst
self.addEventListener("fetch", function(event) {
	event.respondWith(
		fetch(event.request).catch(function() {
			return caches.match(event.request);
		})
		);
});
/**/