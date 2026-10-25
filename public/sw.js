// Shows "<creator> is live" notifications. Sent by the Shelby Studio server only.
self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Someone you follow is live", {
      body: data.body || "",
      icon: "/icon.png",
      tag: "shelby-live",
      data: { url: typeof data.url === "string" && data.url.startsWith("/") ? data.url : "/discover" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = (event.notification.data && event.notification.data.url) || "/discover";

  event.waitUntil(self.clients.openWindow(url));
});
