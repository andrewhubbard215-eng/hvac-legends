/* HVAC Legends — offline copy. Network first for labs. Pictures can come from the phone. */
const APP = "lt-legends";
const VER = APP;

function localFiles(html) {
  const urls = new Set();
  const re = /(?:src|href)="([^"]+)"/g;
  let match;
  while ((match = re.exec(html))) {
    const url = match[1];
    if (/^(https?:)?\/\//.test(url)) continue;
    if (/\.(js|css|webmanifest|png|jpe?g|webp|gif|svg|ico)(\?|#|$)/i.test(url)) urls.add(url);
  }
  return urls;
}

async function fillCore(cache) {
  const pages = ["./index.html", "./desk.html"];
  const urls = new Set(["./", "./index.html", "./desk.html"]);
  await Promise.all(pages.map(async (page) => {
    try {
      const res = await fetch(page, { cache: "no-cache" });
      if (!res.ok) return;
      localFiles(await res.text()).forEach((url) => urls.add(url));
    } catch (e) {}
  }));
  await Promise.all([...urls].map(async (url) => {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (res && res.ok) await cache.put(url, res);
    } catch (e) {}
  }));
}

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VER).then(fillCore));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(APP) && k !== VER).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cacheReply(event, data) {
  if (event.ports && event.ports[0]) event.ports[0].postMessage(data);
}

self.addEventListener("message", (event) => {
  const type = event.data && event.data.type;
  if (!type) return;
  if (type === "cache-status" || type === "cache-refresh") {
    event.waitUntil(
      caches.open(VER).then(async (cache) => {
        if (type === "cache-refresh") await fillCore(cache);
        const keys = await cache.keys();
        cacheReply(event, { type: "cache-status", ver: VER, count: keys.length, note: type === "cache-refresh" ? "Saved." : "" });
      })
    );
    return;
  }
  if (type === "cache-clear") {
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.filter((k) => k.startsWith(APP)).map((k) => caches.delete(k))))
        .then(() => cacheReply(event, { type: "cache-status", ver: VER, count: 0, note: "Cleared. Save again before you leave Wi-Fi." }))
    );
  }
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const picture = /\.(png|jpe?g|webp|gif|svg|ico)(\?|$)/i.test(url.pathname);
  if (picture) {
    e.respondWith((async () => {
      const cache = await caches.open(VER);
      const hit = await cache.match(req);
      const fresh = fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      return hit || (await fresh) || Response.error();
    })());
    return;
  }
  const nav = req.mode === "navigate" || url.pathname === "/" || /index\.html$/i.test(url.pathname);
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok && (nav || res.type === "basic" || res.type === "cors")) {
          const copy = res.clone();
          caches.open(VER).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || (nav ? caches.match("./index.html") : undefined)))
  );
});
