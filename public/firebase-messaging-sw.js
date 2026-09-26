/* global firebase */
/* Firebase SDK version matches the web application's installed SDK. */
const openPushStore = () => new Promise((resolve, reject) => {
  const request = indexedDB.open("vuior-push", 1);
  request.onupgradeneeded = () => request.result.createObjectStore("state");
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});
async function state(key, value) {
  const db = await openPushStore();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("state", value === undefined ? "readonly" : "readwrite");
      const store = tx.objectStore("state");
      const request = value === undefined ? store.get(key) : store.put(value, key);
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally { db.close(); }
}
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("message", (event) => {
  if (event.data?.type !== "VUIOR_PUSH_OWNER") return;
  event.waitUntil((async () => {
    await state("owner", String(event.data.userId || ""));
    const notifications = await self.registration.getNotifications();
    for (const notification of notifications) {
      if (notification.data?.userId !== event.data.userId) notification.close();
    }
    event.ports[0]?.postMessage({ ok: true });
  })());
});
// Register before Firebase so clicks follow our same-origin routing policy.
self.addEventListener("notificationclick", (event) => {
  event.stopImmediatePropagation();
  event.notification.close();
  event.waitUntil((async () => {
    const data = event.notification.data || {};
    const owner = await state("owner");
    const requested = new URL(owner === data.userId ? (data.url || "/dashboard") : "/login", self.location.origin);
    const url = requested.origin === self.location.origin ? requested.href : self.location.origin + "/dashboard";
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clients) {
      if (new URL(client.url).origin === self.location.origin) {
        await client.navigate(url);
        await client.focus();
        return;
      }
    }
    await self.clients.openWindow(url);
  })());
});
importScripts("https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js");
importScripts("/firebase-messaging-config");
firebase.initializeApp(self.FIREBASE_CONFIG);
let delivery = Promise.resolve();
firebase.messaging().onBackgroundMessage((payload) => {
  // Serialize deliveries so retries of the same event cannot race display.
  delivery = delivery.catch(() => {}).then(async () => {
    const data = payload.data || {};
    if (!data.notificationId || !data.userId || await state("owner") !== data.userId) return;
    const seen = (await state("seen")) || [];
    const key = data.userId + ":" + data.notificationId;
    if (seen.includes(key)) return;
    await self.registration.showNotification(data.title || "Vuior update", {
      body: data.body || "",
      icon: "/favicon.png",
      badge: "/favicon.png",
      tag: data.notificationId,
      data: { url: data.url, userId: data.userId },
    });
    await state("seen", [...seen, key].slice(-200));
  });
  return delivery;
});
