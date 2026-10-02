/* Background shop tasks — PT trend, shuffle. No DOM. */
const N = 48;
const hi = new Float32Array(N);
const lo = new Float32Array(N);
const shA = new Float32Array(N);
const scA = new Float32Array(N);
let cursor = 0;
let filled = 0;

function pushTrend(s) {
  const pH = Number(s && s.pHigh) || 0;
  const pL = Number(s && s.pLow) || 0;
  const sh = Number(s && s.sh) || 0;
  const sc = Number(s && s.sc) || 0;
  hi[cursor] = pH;
  lo[cursor] = pL;
  shA[cursor] = sh;
  scA[cursor] = sc;
  cursor = (cursor + 1) % N;
  if (filled < N) filled += 1;
  const outHi = [];
  const outLo = [];
  const start = filled < N ? 0 : cursor;
  for (let n = 0; n < filled; n++) {
    const k = (start + n) % N;
    outHi.push(hi[k]);
    outLo.push(lo[k]);
  }
  let walking = false;
  if (filled > 8) {
    const spreadNow = Math.abs(outHi[filled - 1] - outLo[filled - 1]);
    const spreadWas = Math.abs(outHi[Math.max(0, filled - 9)] - outLo[Math.max(0, filled - 9)]);
    walking = spreadWas - spreadNow > 25;
  }
  return { hi: outHi, lo: outLo, sh: shA[ (cursor + N - 1) % N ], sc: scA[(cursor + N - 1) % N], walking };
}

function shuffle(items) {
  const a = Array.isArray(items) ? items.slice() : [];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

self.onmessage = function (e) {
  const msg = e.data || {};
  const id = msg.id;
  const type = msg.type;
  const payload = msg.payload || {};
  if (type === "ping") {
    self.postMessage({ id: id, type: "pong" });
    return;
  }
  if (type === "trend") {
    self.postMessage({ id: id, type: "trend", spark: pushTrend(payload) });
    return;
  }
  if (type === "shuffle") {
    self.postMessage({ id: id, type: "shuffle", items: shuffle(payload.items) });
    return;
  }
  if (type === "reset") {
    cursor = 0;
    filled = 0;
    self.postMessage({ id: id, type: "reset" });
  }
};
