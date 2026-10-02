/* Gauges of God — HVAC Jesus side-scroller DLC. Not Mario. */
(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const TILE = 48;
  const VIEW_W = 960;
  const VIEW_H = 540;

  const LEVEL = [
    "................................................................................................................",
    "................................................................................................................",
    "......................o..........................................o..............................................",
    ".....................====......................................====......................o......................",
    "...............................................o.......................................====.....................",
    ".............................................====...............................................................",
    ".............o....................o......................................o......................................",
    "...........====.................====.....................=======................................................",
    "...........................................................................................................G....",
    "P.......e.............e....^^..........e................e..............e.................e......................",
    "#######################....##########################....#######################################################",
    "#######################^^^^##########################^^^^#######################################################",
  ];

  const H = LEVEL.length;
  const W = LEVEL[0].length;
  const WORLD_W = W * TILE;
  const WORLD_H = H * TILE;

  const keys = new Set();
  const touch = { left: false, right: false, jump: false };

  const player = {
    x: 64,
    y: 200,
    w: 30,
    h: 46,
    vx: 0,
    vy: 0,
    facing: 1,
    grounded: false,
    coyote: 0,
    buffer: 0,
    dead: 0,
    invuln: 0,
    spawnX: 64,
    spawnY: 200,
  };

  const enemies = [];
  const pickups = [];
  let goal = null;
  let recovered = 0;
  let recoveredNeed = 0;
  let lives = 3;
  let won = false;
  let started = false;
  let shake = 0;
  let camX = 0;
  let animT = 0;
  let acc = 0;
  let last = 0;
  const STEP = 1 / 60;
  const particles = [];

  const img = {};
  const loadList = [];
  function addImg(key, src) {
    loadList.push(
      new Promise((res) => {
        const i = new Image();
        i.crossOrigin = "anonymous";
        i.onload = () => res();
        i.onerror = () => res();
        i.src = src;
        img[key] = i;
      }),
    );
  }
  for (let n = 1; n <= 4; n++) {
    addImg("idle" + n, "sprites/jesus-idle-" + n + ".png");
    addImg("run" + n, "sprites/jesus-run-" + n + ".png");
    addImg("jump" + n, "sprites/jesus-jump-" + n + ".png");
    addImg("coil" + n, "sprites/coil-" + n + ".png");
  }
  addImg("tank", "sprites/tank.png");
  addImg("bg", "bg.jpg");

  function cell(tx, ty) {
    if (ty < 0 || tx < 0 || tx >= W || ty >= H) return "#";
    return LEVEL[ty][tx];
  }
  function solidAt(tx, ty, falling, prevBottom) {
    const c = cell(tx, ty);
    if (c === "#" || c === "^") return true;
    if (c === "=") {
      if (!falling) return false;
      const top = ty * TILE;
      return prevBottom <= top + 4;
    }
    return false;
  }
  function isHazard(tx, ty) {
    return cell(tx, ty) === "^";
  }

  function parseLevel() {
    enemies.length = 0;
    pickups.length = 0;
    recoveredNeed = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const c = LEVEL[y][x];
        const wx = x * TILE;
        const wy = y * TILE;
        if (c === "P") {
          player.spawnX = wx + 8;
          player.spawnY = wy - 8;
        }
        if (c === "e") {
          enemies.push({
            x: wx + 6,
            y: wy + 8,
            w: 36,
            h: 36,
            vx: 40 * (enemies.length % 2 === 0 ? 1 : -1),
            alive: true,
            squash: 0,
            frame: 0,
          });
        }
        if (c === "o") {
          recoveredNeed += 1;
          pickups.push({ x: wx + 8, y: wy + 4, w: 28, h: 36, got: false, bob: Math.random() * 6 });
        }
        if (c === "G") {
          goal = { x: wx, y: wy - 24, w: 48, h: 72 };
        }
      }
    }
    resetPlayer(true);
  }

  function resetPlayer(full) {
    player.x = player.spawnX;
    player.y = player.spawnY;
    player.vx = 0;
    player.vy = 0;
    player.dead = 0;
    player.invuln = full ? 0 : 0.8;
    player.grounded = false;
    player.coyote = 0;
    player.buffer = 0;
  }

  function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function wantLeft() {
    return keys.has("KeyA") || keys.has("ArrowLeft") || touch.left;
  }
  function wantRight() {
    return keys.has("KeyD") || keys.has("ArrowRight") || touch.right;
  }
  function wantJump() {
    return keys.has("Space") || keys.has("KeyW") || keys.has("ArrowUp") || touch.jump;
  }

  function spawnBurst(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 220,
        vy: -40 - Math.random() * 180,
        life: 0.4 + Math.random() * 0.4,
        color,
      });
    }
  }

  let audioCtx = null;
  function beep(freq, dur, type) {
    try {
      if (!audioCtx) audioCtx = new AudioContext();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type || "square";
      o.frequency.value = freq;
      g.gain.value = 0.05;
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + dur);
    } catch {
      /* ignore */
    }
  }

  function moveAABB(body, dt, opts) {
    const falling = body.vy >= 0;
    const prevBottom = body.y + body.h;
    const maxStep = TILE * 0.45;
    let remX = body.vx * dt;
    let remY = body.vy * dt;
    body.grounded = false;

    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(remX), Math.abs(remY)) / maxStep));
    const sx = remX / steps;
    const sy = remY / steps;

    for (let s = 0; s < steps; s++) {
      body.x += sx;
      const x0 = Math.floor(body.x / TILE);
      const x1 = Math.floor((body.x + body.w - 1) / TILE);
      const y0 = Math.floor(body.y / TILE);
      const y1 = Math.floor((body.y + body.h - 1) / TILE);
      for (let ty = y0; ty <= y1; ty++) {
        for (let tx = x0; tx <= x1; tx++) {
          if (!solidAt(tx, ty, false, prevBottom)) continue;
          const tileL = tx * TILE;
          const tileR = tileL + TILE;
          if (sx > 0) body.x = tileL - body.w;
          else if (sx < 0) body.x = tileR;
          body.vx = 0;
        }
      }

      body.y += sy;
      const x2 = Math.floor(body.x / TILE);
      const x3 = Math.floor((body.x + body.w - 1) / TILE);
      const y2 = Math.floor(body.y / TILE);
      const y3 = Math.floor((body.y + body.h - 1) / TILE);
      for (let ty = y2; ty <= y3; ty++) {
        for (let tx = x2; tx <= x3; tx++) {
          if (!solidAt(tx, ty, falling, prevBottom)) continue;
          const tileT = ty * TILE;
          const tileB = tileT + TILE;
          if (sy > 0) {
            body.y = tileT - body.h;
            body.vy = 0;
            body.grounded = true;
          } else if (sy < 0) {
            body.y = tileB;
            body.vy = 0;
          }
        }
      }
    }

    if (opts && opts.hazard) {
      const hx0 = Math.floor(body.x / TILE);
      const hx1 = Math.floor((body.x + body.w - 1) / TILE);
      const hy0 = Math.floor((body.y + body.h * 0.5) / TILE);
      const hy1 = Math.floor((body.y + body.h - 1) / TILE);
      for (let ty = hy0; ty <= hy1; ty++) {
        for (let tx = hx0; tx <= hx1; tx++) {
          if (isHazard(tx, ty)) return true;
        }
      }
    }
    return false;
  }

  function jumpNow() {
    player.vy = -620;
    player.grounded = false;
    player.coyote = 0;
    player.buffer = 0;
    beep(520, 0.08, "square");
  }

  function killPlayer() {
    if (player.dead || player.invuln > 0 || won) return;
    lives -= 1;
    player.dead = 0.7;
    shake = 10;
    beep(140, 0.2, "sawtooth");
    spawnBurst(player.x + player.w / 2, player.y + player.h / 2, "#e8c450", 12);
  }

  function step(dt) {
    if (!started || won) return;
    animT += dt;
    if (shake > 0) shake = Math.max(0, shake - dt * 28);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 800 * dt;
      if (p.life <= 0) particles.splice(i, 1);
    }

    if (player.dead > 0) {
      player.dead -= dt;
      if (player.dead <= 0) {
        if (lives <= 0) {
          finish(false);
          return;
        }
        resetPlayer(false);
      }
      return;
    }

    player.invuln = Math.max(0, player.invuln - dt);
    if (player.grounded) player.coyote = 0.1;
    else player.coyote = Math.max(0, player.coyote - dt);
    player.buffer = Math.max(0, player.buffer - dt);

    const left = wantLeft();
    const right = wantRight();
    let ax = 0;
    if (left) ax -= 1;
    if (right) ax += 1;
    if (ax < 0) player.facing = -1;
    if (ax > 0) player.facing = 1;

    const accel = player.grounded ? 2200 : 1400;
    const maxRun = 260;
    if (ax !== 0) player.vx += ax * accel * dt;
    else {
      const fr = player.grounded ? 1800 : 400;
      if (Math.abs(player.vx) <= fr * dt) player.vx = 0;
      else player.vx -= Math.sign(player.vx) * fr * dt;
    }
    if (player.vx > maxRun) player.vx = maxRun;
    if (player.vx < -maxRun) player.vx = -maxRun;

    if (player.vy < 0 && !wantJump()) player.vy *= Math.pow(0.45, dt * 8);
    const grav = player.vy < 0 ? 1550 : 2700;
    const hang = Math.abs(player.vy) < 80 ? 0.65 : 1;
    player.vy += grav * hang * dt;
    if (player.vy > 980) player.vy = 980;

    if ((player.buffer > 0 && (player.grounded || player.coyote > 0))) jumpNow();

    const hitHazard = moveAABB(player, dt, { hazard: true });
    if (player.y > WORLD_H + 80) killPlayer();
    if (hitHazard) killPlayer();

    for (const e of enemies) {
      if (!e.alive) {
        e.squash = Math.max(0, e.squash - dt);
        continue;
      }
      e.frame += dt;
      const before = e.x;
      e.x += e.vx * dt;
      const footX = e.vx > 0 ? e.x + e.w + 2 : e.x - 2;
      const footY = e.y + e.h + 2;
      const tx = Math.floor(footX / TILE);
      const ty = Math.floor(footY / TILE);
      const wall = solidAt(Math.floor((e.vx > 0 ? e.x + e.w : e.x) / TILE), Math.floor((e.y + e.h / 2) / TILE), false, 0);
      const ledge = !solidAt(tx, ty, true, e.y + e.h);
      if (wall || ledge || e.x < 8 || e.x + e.w > WORLD_W - 8) {
        e.x = before;
        e.vx *= -1;
      }
      if (player.invuln > 0 || player.dead) continue;
      if (overlap(player, e)) {
        const fromAbove = player.vy > 80 && player.y + player.h - e.y < 22;
        if (fromAbove) {
          e.alive = false;
          e.squash = 0.45;
          player.vy = -380;
          recovered += 0;
          shake = 6;
          beep(380, 0.09, "triangle");
          spawnBurst(e.x + e.w / 2, e.y, "#9fe7ff", 10);
        } else {
          killPlayer();
        }
      }
    }

    for (const p of pickups) {
      if (p.got) continue;
      p.bob += dt * 3;
      if (overlap(player, p)) {
        p.got = true;
        recovered += 1;
        beep(660, 0.1, "sine");
        spawnBurst(p.x + 14, p.y + 14, "#e8c450", 8);
      }
    }

    if (goal && overlap(player, goal)) finish(true);

    const deadzone = 90;
    const look = player.facing * 70;
    const target = player.x + player.w / 2 - VIEW_W * 0.38 + look;
    if (target > camX + deadzone) camX += (target - (camX + deadzone)) * Math.min(1, dt * 6);
    if (target < camX - 40) camX += (target - (camX - 40)) * Math.min(1, dt * 6);
    camX = Math.max(0, Math.min(WORLD_W - VIEW_W, camX));
  }

  function finish(ok) {
    won = true;
    started = true;
    document.getElementById("end").classList.remove("hidden");
    document.getElementById("end-title").textContent = ok ? "Gauges seated" : "Callback";
    document.getElementById("end-copy").textContent = ok
      ? "HVAC Jesus recovered " + recovered + " cylinders and seated the Gauges of God."
      : "Iced coils win this round. Run the pad again.";
    if (ok) beep(880, 0.25, "sine");
  }

  function playerFrame() {
    if (!player.grounded) {
      if (player.vy < -80) return img.jump2;
      if (player.vy < 80) return img.jump3;
      return img.jump4;
    }
    if (Math.abs(player.vx) > 28) {
      const f = 1 + (Math.floor(animT * 10) % 4);
      return img["run" + f];
    }
    const f = 1 + (Math.floor(animT * 4) % 4);
    return img["idle" + f];
  }

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const sx = w / VIEW_W;
    const sy = h / VIEW_H;
    ctx.setTransform(sx, 0, 0, sy, 0, 0);

    const ox = Math.round(camX);
    const oy = 0;
    const shx = shake ? (Math.random() - 0.5) * shake : 0;
    const shy = shake ? (Math.random() - 0.5) * shake : 0;
    ctx.translate(shx, shy);

    if (img.bg && img.bg.width) {
      const para = ox * 0.35;
      const bw = img.bg.width;
      const bh = img.bg.height;
      const scale = VIEW_H / bh;
      const dw = bw * scale;
      let x = -((para * scale) % dw);
      while (x < VIEW_W) {
        ctx.drawImage(img.bg, x, 0, dw, VIEW_H);
        x += dw - 1;
      }
    } else {
      ctx.fillStyle = "#1a2436";
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }

    const t0 = Math.floor(ox / TILE) - 1;
    const t1 = Math.floor((ox + VIEW_W) / TILE) + 1;
    for (let ty = 0; ty < H; ty++) {
      for (let tx = t0; tx <= t1; tx++) {
        if (tx < 0 || tx >= W) continue;
        const c = cell(tx, ty);
        const x = tx * TILE - ox;
        const y = ty * TILE - oy;
        if (c === "#" || c === "^") {
          ctx.fillStyle = "#5a6168";
          ctx.fillRect(x, y, TILE + 1, TILE + 1);
          ctx.fillStyle = "#c08a5a";
          ctx.fillRect(x, y, TILE + 1, 8);
          ctx.fillStyle = "#3d444c";
          ctx.fillRect(x + 6, y + 16, TILE - 12, 8);
          if (c === "^") {
            ctx.fillStyle = "#e8c450";
            ctx.beginPath();
            ctx.moveTo(x + 8, y + TILE);
            ctx.lineTo(x + TILE / 2, y + 10);
            ctx.lineTo(x + TILE - 8, y + TILE);
            ctx.fill();
            ctx.fillStyle = "#1a1408";
            ctx.fillRect(x + TILE / 2 - 3, y + 22, 6, 14);
          }
        } else if (c === "=") {
          ctx.fillStyle = "#b07a48";
          ctx.fillRect(x, y + 18, TILE + 1, 12);
          ctx.fillStyle = "#e0a05a";
          ctx.fillRect(x, y + 18, TILE + 1, 4);
        }
      }
    }

    for (const p of pickups) {
      if (p.got) continue;
      const bob = Math.sin(p.bob) * 5;
      if (img.tank && img.tank.width) {
        ctx.drawImage(img.tank, p.x - ox - 4, p.y - oy + bob - 8, 40, 48);
      } else {
        ctx.fillStyle = "#e8c450";
        ctx.fillRect(p.x - ox, p.y - oy + bob, 22, 30);
      }
    }

    if (goal) {
      ctx.save();
      ctx.translate(goal.x - ox + 24, goal.y - oy + 36);
      ctx.fillStyle = "rgba(232,196,80,0.25)";
      ctx.beginPath();
      ctx.arc(0, 0, 28 + Math.sin(animT * 3) * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e8c450";
      ctx.fillRect(-16, -8, 12, 22);
      ctx.fillRect(4, -8, 12, 22);
      ctx.fillStyle = "#c08a5a";
      ctx.fillRect(-18, 14, 36, 8);
      ctx.restore();
    }

    for (const e of enemies) {
      if (!e.alive && e.squash <= 0) continue;
      const frame = !e.alive ? img.coil3 : img["coil" + (1 + (Math.floor(e.frame * 6) % 2))];
      const h = !e.alive ? 22 : 48;
      const y = e.y - oy + (e.h - h) + 6;
      if (frame && frame.width) ctx.drawImage(frame, e.x - ox - 6, y, 48, h);
      else {
        ctx.fillStyle = "#9fe7ff";
        ctx.fillRect(e.x - ox, y, e.w, h);
      }
    }

    if (player.dead <= 0.55) {
      ctx.save();
      if (player.invuln > 0 && Math.floor(animT * 20) % 2 === 0) ctx.globalAlpha = 0.45;
      const fr = playerFrame();
      const dw = 64;
      const dh = 72;
      const dx = player.x - ox + player.w / 2;
      const dy = player.y - oy + player.h - dh + 6;
      ctx.translate(dx, dy + dh);
      ctx.scale(player.facing, 1);
      if (fr && fr.width) ctx.drawImage(fr, -dw / 2, -dh, dw, dh);
      else {
        ctx.fillStyle = "#f4ead2";
        ctx.fillRect(-15, -46, 30, 46);
      }
      ctx.restore();
    }

    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - ox, p.y - oy, 4, 4);
      ctx.globalAlpha = 1;
    }

    const hudRec = document.getElementById("hud-rec");
    const hudLives = document.getElementById("hud-lives");
    if (hudRec) hudRec.textContent = "Recovery " + recovered + " / " + recoveredNeed;
    if (hudLives) hudLives.textContent = "Lives " + lives;
  }

  function loop(ts) {
    if (!last) last = ts;
    let dt = (ts - last) / 1000;
    last = ts;
    if (dt > 0.1) dt = 0.1;
    acc += dt;
    while (acc >= STEP) {
      step(STEP);
      acc -= STEP;
    }
    draw();
    requestAnimationFrame(loop);
  }

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
  }

  window.addEventListener("keydown", (e) => {
    keys.add(e.code);
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
      player.buffer = 0.13;
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => keys.delete(e.code));
  window.addEventListener("blur", () => keys.clear());
  window.addEventListener("resize", resize);

  function bindTouch() {
    const root = document.getElementById("touch");
    const map = { left: "left", right: "right", jump: "jump" };
    root.querySelectorAll("button").forEach((btn) => {
      const act = map[btn.getAttribute("data-act")];
      const on = (ev) => {
        ev.preventDefault();
        touch[act] = true;
        if (act === "jump") player.buffer = 0.13;
      };
      const off = (ev) => {
        ev.preventDefault();
        touch[act] = false;
      };
      btn.addEventListener("pointerdown", on);
      btn.addEventListener("pointerup", off);
      btn.addEventListener("pointerleave", off);
      btn.addEventListener("pointercancel", off);
    });
  }

  function startGame() {
    document.getElementById("start").classList.add("hidden");
    document.getElementById("end").classList.add("hidden");
    document.getElementById("hud").hidden = false;
    document.getElementById("touch").hidden = false;
    recovered = 0;
    lives = 3;
    won = false;
    started = true;
    parseLevel();
    try {
      if (!audioCtx) audioCtx = new AudioContext();
      audioCtx.resume();
    } catch {
      /* ignore */
    }
    beep(440, 0.08, "sine");
  }

  document.getElementById("btn-play").addEventListener("click", startGame);
  document.getElementById("btn-again").addEventListener("click", startGame);
  bindTouch();
  parseLevel();
  resize();

  window.__controlsTest = {
    getX: () => player.x,
    getVx: () => player.vx,
    getFacing: () => player.facing,
    setKeys: (codes) => {
      keys.clear();
      (codes || []).forEach((c) => keys.add(c));
    },
    start: () => {
      if (!started) startGame();
    },
  };

  Promise.all(loadList).then(() => requestAnimationFrame(loop));
})();
