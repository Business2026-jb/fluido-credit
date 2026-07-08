const CACHE_NAME = "fluido-credit-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        "/",
        "/login",
        "/dashboard",
        "/manifest.json",
        "/alogo.png"
      ])
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

self.addEventListener("push", (event) => {
  let data = {
    title: "Fluido Credit",
    body: "You have a new notification.",
    url: "/notifications"
  };

  if (event.data) {
    data = event.data.json();
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Fluido Credit", {
      body: data.body || "You have a new notification.",
      icon: "/alogo.png",
      badge: "/alogo.png",
      vibrate: [200, 100, 200],
      data: {
        url: data.url || "/notifications"
      }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/notifications";

  event.waitUntil(
    clients.openWindow(url)
  );
});