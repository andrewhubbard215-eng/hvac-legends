/* HVAC BROS — original HVAC Legends 8-bit platformer (not Nintendo IP) */
(function (global) {
  "use strict";

  const T = 32;
  const CREW = {
    hub: {
      id: "hub",
      name: "Professor HUB",
      role: "Red tech",
      img: "hub-portrait.jpg?v=3",
      shirt: "#CE0034",
      pants: "#1b2a6b",
      hair: "#3a2418",
      cap: "#CE0034",
      skin: "#e6b089",
      glasses: false,
      tall: 1,
      jump: 1,
      blurb: "Lead installer. Hits the rooftop curb first.",
    },
    engle: {
      id: "engle",
      name: "Professor ENGLE",
      role: "Red tech",
      img: "engle.jpg",
      shirt: "#b91c1c",
      pants: "#1b2a6b",
      hair: "#4a3728",
      cap: "#7f1d1d",
      skin: "#efc4a0",
      glasses: true,
      tall: 1,
      jump: 0.96,
      blurb: "Reads the print, sizes the condenser, never skips SH/SC.",
    },
    starr: {
      id: "starr",
      name: "Professor STARR",
      role: "Green tech",
      img: "starr.jpg",
      shirt: "#15803d",
      pants: "#1b2a6b",
      hair: "#1f1a14",
      cap: "#166534",
      skin: "#d9a57a",
      glasses: false,
      tall: 1.12,
      jump: 1.12,
      blurb: "Higher jump for lineset hangers and mini-split heads.",
    },
    labono: {
      id: "labono",
      name: "Professor LABONO",
      role: "Green tech",
      img: "labono.jpg",
      shirt: "#3f7d3a",
      pants: "#1b2a6b",
      hair: "#6b6258",
      cap: "#365c32",
      skin: "#e8c3a0",
      glasses: false,
      tall: 1.08,
      jump: 1.08,
      blurb: "Recovery tank on the hip. Commissioning specialist.",
    },
  };

  const LEVELS = [
    {
      id: "1-1",
      name: "Brazing bay",
      rows: [
        "                                                                                                                          F",
        "                                                                                                                          #",
        "                         ?     o o                              ?                                                         #",
        "                                                                                                                          #",
        "              o     ====              ####           o o     ==========          ?    o                                   #",
        "                                                                                        f                                 #",
        "     P                           e            i                      e                         f          ====            #",
        "###########################################################################################################################",
      ],
    },
    {
      id: "1-2",
      name: "Lineset alley",
      rows: [
        "                                                                                                    F",
        "                                                                                                    #",
        "              ?           o     o          ?                  o o o                                 #",
        "         ====                  ====               ====                     ===                      #",
        "                                                                                                    #",
        "    P        e        i              f     ####        e           i           f     ====           #",
        "#######    ######   ########     ###########    #############    #######    ############    #########",
        "#######~~~~######~~~########~~~~~###########~~~~#############~~~~#######~~~~############~~~~#########",
      ],
    },
    {
      id: "1-3",
      name: "Rooftop RTU",
      rows: [
        "                                                                                         F",
        "                                                         ?                               #",
        "                         o o o                     ====                                  #",
        "                   ====                e                                                 #",
        "              ?              ====            ####        o o        ====                 #",
        "         e            i                 f           e          i            f            #",
        "    P                                                                                    #",
        "##########################################################################################",
      ],
    },
  ];

  let root = null;
  let hooks = {};
  let canvas, ctx;
  let raf = 0;
  let last = 0;
  let phase = "select"; // select | play | win | dead
  let redId = "hub";
  let greenId = "starr";
  let twoP = true;
  let keys = {};
  let camX = 0;
  let levelI = 0;
  let map = [];
  let W = 0;
  let H = 0;
  let players = [];
  let enemies = [];
  let items = [];
  let particles = [];
  let score = 0;
  let coins = 0;
  let lives = 3;
  let timeLeft = 300;
  let msg = "";
  let msgT = 0;
  let finishing = false;

  function beep(f, d, type) {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type || "square";
      o.frequency.value = f;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ac.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + (d || 0.12));
      o.stop(ac.currentTime + (d || 0.12) + 0.02);
    } catch (_) {}
  }

  function parseLevel(def) {
    map = def.rows.map((r) => r.split(""));
    H = map.length;
    W = Math.max.apply(null, map.map((r) => r.length));
    map.forEach((r) => {
      while (r.length < W) r.push(" ");
    });
    players = [];
    enemies = [];
    items = [];
    particles = [];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const c = map[y][x];
        if (c === "P") {
          spawnPlayer(x, y, redId, 0);
          spawnPlayer(x + 1.35, y, greenId, 1);
          map[y][x] = " ";
        } else if (c === "e" || c === "i" || c === "f") {
          enemies.push({
            x: x,
            y: y - 0.2,
            vx: c === "i" ? -0.9 : -1.5,
            w: c === "f" ? 0.95 : 0.85,
            h: c === "f" ? 0.95 : 0.85,
            kind: c === "i" ? "ice" : c === "f" ? "filter" : "leak",
            alive: true,
          });
          map[y][x] = " ";
        } else if (c === "o") {
          items.push({ x: x, y: y, kind: "can", got: false });
          map[y][x] = " ";
        }
      }
    }
    camX = 0;
    timeLeft = 280;
    finishing = false;
  }

  function spawnPlayer(tx, ty, crewId, slot) {
    const c = CREW[crewId];
    players.push({
      id: crewId,
      slot,
      x: tx,
      y: ty - 1,
      vx: 0,
      vy: 0,
      w: 0.72,
      h: 0.95 * c.tall,
      onGround: false,
      facing: 1,
      frame: 0,
      dead: false,
      inv: 0,
      crew: c,
    });
  }

  function solid(c) {
    return c === "#" || c === "=" || c === "?" || c === "F";
  }
  function cellAt(px, py) {
    const x = Math.floor(px);
    const y = Math.floor(py);
    if (y < 0 || y >= H || x < 0 || x >= W) return x < 0 || x >= W ? "#" : " ";
    return map[y][x];
  }
  function hitsSolid(x, y, w, h) {
    const x0 = x;
    const y0 = y;
    const x1 = x + w;
    const y1 = y + h;
    for (let iy = Math.floor(y0); iy <= Math.floor(y1 - 0.001); iy++) {
      for (let ix = Math.floor(x0); ix <= Math.floor(x1 - 0.001); ix++) {
        if (solid(cellAt(ix, iy))) return { x: ix, y: iy, c: cellAt(ix, iy) };
      }
    }
    return null;
  }

  function bumpBox(ix, iy) {
    if (map[iy][ix] !== "?") return;
    map[iy][ix] = "=";
    items.push({ x: ix, y: iy - 1, kind: "gauge", got: false });
    score += 50;
    coins += 1;
    beep(620, 0.08);
    pop(ix + 0.5, iy, "#e8c450");
  }

  function pop(x, y, col) {
    for (let i = 0; i < 8; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 4 - 1,
        t: 0.4,
        col,
      });
    }
  }

  function killPlayer(p) {
    if (p.dead || p.inv > 0) return;
    p.dead = true;
    beep(110, 0.3, "sawtooth");
    lives -= 1;
    msg = p.crew.name.split(" ")[1] + " down";
    msgT = 1.4;
    if (lives <= 0) {
      phase = "dead";
      if (hooks.onOver) hooks.onOver({ score, coins, win: false });
    } else {
      setTimeout(() => {
        if (phase !== "play") return;
        parseLevel(LEVELS[levelI]);
      }, 900);
    }
  }

  function finishLevel() {
    if (finishing || phase !== "play") return;
    finishing = true;
    beep(880, 0.15);
    setTimeout(() => beep(1170, 0.2), 120);
    score += Math.floor(timeLeft) * 5;
    levelI += 1;
    if (levelI >= LEVELS.length) {
      phase = "win";
      msg = "CAMPUS CLEAR";
      if (hooks.onOver) hooks.onOver({ score, coins, win: true });
    } else {
      msg = LEVELS[levelI].name;
      msgT = 2;
      parseLevel(LEVELS[levelI]);
      finishing = false;
    }
  }

  function inputFor(slot) {
    if (slot === 0) {
      return {
        left: keys.ArrowLeft,
        right: keys.ArrowRight,
        jump: keys.Space || keys.ArrowUp || keys.KeyZ,
      };
    }
    return {
      left: keys.KeyA || keys.KeyJ,
      right: keys.KeyD || keys.KeyL,
      jump: keys.KeyW || keys.KeyI || keys.KeyK,
    };
  }

  function updatePlayer(p, dt) {
    if (p.dead) return;
    p.inv = Math.max(0, p.inv - dt);
    const inn = p.slot === 0 ? inputFor(0) : twoP ? inputFor(1) : followAI(p);
    const acc = 28;
    const max = 6.4;
    if (inn.left) { p.vx -= acc * dt; p.facing = -1; }
    if (inn.right) { p.vx += acc * dt; p.facing = 1; }
    if (!inn.left && !inn.right) p.vx *= Math.pow(0.0015, dt);
    p.vx = Math.max(-max, Math.min(max, p.vx));
    p.vy += 28 * dt;
    if (inn.jump && p.onGround) {
      p.vy = -11.2 * p.crew.jump;
      p.onGround = false;
      beep(340, 0.06);
    }
    // horizontal
    p.x += p.vx * dt;
    let hit = hitsSolid(p.x, p.y, p.w, p.h);
    if (hit) {
      if (p.vx > 0) p.x = hit.x - p.w - 0.001;
      else p.x = hit.x + 1.001;
      p.vx = 0;
    }
    // vertical
    p.y += p.vy * dt;
    hit = hitsSolid(p.x, p.y, p.w, p.h);
    p.onGround = false;
    if (hit) {
      if (p.vy > 0) {
        p.y = hit.y - p.h - 0.001;
        p.vy = 0;
        p.onGround = true;
      } else {
        p.y = hit.y + 1.001;
        p.vy = 0;
        if (hit.c === "?") bumpBox(hit.x, hit.y);
      }
    }
    if (cellAt(p.x + p.w / 2, p.y + p.h / 2) === "F" || cellAt(p.x + p.w, p.y) === "F") finishLevel();
    if (p.y > H + 1) killPlayer(p);
    p.frame += Math.abs(p.vx) * dt * 6;
    // coins
    items.forEach((it) => {
      if (it.got) return;
      if (Math.abs(it.x + 0.5 - (p.x + p.w / 2)) < 0.55 && Math.abs(it.y + 0.5 - (p.y + p.h / 2)) < 0.7) {
        it.got = true;
        coins += 1;
        score += 20;
        beep(980, 0.05);
      }
    });
  }

  function followAI(p) {
    const lead = players[0];
    if (!lead || lead.dead) return { left: false, right: false, jump: false };
    const dx = lead.x - 1.2 - p.x;
    return {
      left: dx < -0.4,
      right: dx > 0.4,
      jump: lead.vy < -2 && p.onGround,
    };
  }

  function updateEnemies(dt) {
    enemies.forEach((e) => {
      if (!e.alive) return;
      e.vy = (e.vy || 0) + 28 * dt;
      e.x += e.vx * dt;
      if (solid(cellAt(e.x + (e.vx > 0 ? e.w : 0), e.y + 0.4))) {
        e.vx *= -1;
      }
      e.y += e.vy * dt;
      const hit = hitsSolid(e.x, e.y, e.w, e.h);
      if (hit && e.vy > 0) {
        e.y = hit.y - e.h - 0.001;
        e.vy = 0;
      }
      players.forEach((p) => {
        if (p.dead || !e.alive) return;
        const overlap =
          p.x < e.x + e.w &&
          p.x + p.w > e.x &&
          p.y < e.y + e.h &&
          p.y + p.h > e.y;
        if (!overlap) return;
        if (p.vy > 1.2 && p.y + p.h < e.y + e.h * 0.65) {
          e.alive = false;
          p.vy = -8;
          score += 100;
          pop(e.x + 0.4, e.y, "#8b5a2b");
          beep(200, 0.1);
        } else killPlayer(p);
      });
    });
  }

  function tick(ts) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.033, (ts - last) / 1000 || 0.016);
    last = ts;
    if (phase !== "play") {
      draw();
      return;
    }
    timeLeft = Math.max(0, timeLeft - dt);
    if (timeLeft <= 0) killPlayer(players[0] || { dead: true, inv: 0, crew: { name: "Tech" } });
    msgT = Math.max(0, msgT - dt);
    players.forEach((p) => updatePlayer(p, dt));
    updateEnemies(dt);
    particles.forEach((pt) => {
      pt.t -= dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy += 12 * dt;
    });
    particles = particles.filter((pt) => pt.t > 0);
    const focus = players.find((p) => !p.dead) || players[0];
    if (focus) {
      const target = focus.x * T - canvas.clientWidth * 0.35;
      camX += (target - camX) * Math.min(1, dt * 6);
      camX = Math.max(0, Math.min(camX, W * T - canvas.clientWidth));
    }
    draw();
  }

  function drawTech(ctx, p, sx, sy) {
    const c = p.crew;
    const bounce = p.onGround ? 0 : Math.max(-4, p.vy);
    ctx.save();
    ctx.translate(sx + (p.w * T) / 2, sy + bounce);
    ctx.scale(p.facing, 1);
    const h = p.h * T;
    const w = p.w * T;
    // cap
    ctx.fillStyle = c.cap;
    ctx.fillRect(-w * 0.38, -h * 0.08, w * 0.76, 7);
    ctx.fillRect(0, -h * 0.02, w * 0.42, 5);
    // head
    ctx.fillStyle = c.skin;
    ctx.fillRect(-w * 0.28, 4, w * 0.56, 14);
    ctx.fillStyle = c.hair;
    ctx.fillRect(-w * 0.28, 4, w * 0.56, 5);
    if (c.glasses) {
      ctx.strokeStyle = "#111";
      ctx.strokeRect(-6, 10, 6, 4);
      ctx.strokeRect(1, 10, 6, 4);
    }
    // shirt
    ctx.fillStyle = c.shirt;
    ctx.fillRect(-w * 0.34, 18, w * 0.68, 16);
    // LT badge
    ctx.fillStyle = "#fff";
    ctx.fillRect(-4, 22, 8, 6);
    ctx.fillStyle = "#CE0034";
    ctx.fillRect(-3, 23, 6, 4);
    // tool belt + manifold
    ctx.fillStyle = "#111";
    ctx.fillRect(-w * 0.36, 30, w * 0.72, 5);
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(-w * 0.22, 32, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#b91c1c";
    ctx.beginPath();
    ctx.arc(-w * 0.08, 32, 3.2, 0, Math.PI * 2);
    ctx.fill();
    // pants / boots
    ctx.fillStyle = c.pants;
    ctx.fillRect(-w * 0.28, 34, w * 0.22, 16 + (Math.sin(p.frame) * 3));
    ctx.fillRect(w * 0.04, 34, w * 0.22, 16 + (Math.cos(p.frame) * 3));
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(-w * 0.30, 48, w * 0.24, 5);
    ctx.fillRect(w * 0.02, 48, w * 0.24, 5);
    ctx.restore();
  }

  function draw() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const dusk = ctx.createLinearGradient(0, 0, 0, h);
    dusk.addColorStop(0, "#1e3a5f");
    dusk.addColorStop(0.45, "#4a6d8c");
    dusk.addColorStop(1, "#8aa3b5");
    ctx.fillStyle = dusk;
    ctx.fillRect(0, 0, w, h);
    // rooftop skyline — condensers / RTUs
    ctx.fillStyle = "#2a3540";
    for (let i = 0; i < 8; i++) {
      const bx = ((i * 180) - (camX * 0.18) % 1440);
      ctx.fillRect(bx, h - 90 - (i % 3) * 18, 70, 90);
      ctx.fillStyle = "#3d4c5a";
      ctx.fillRect(bx + 8, h - 108 - (i % 3) * 18, 54, 18); // condenser cap
      ctx.fillStyle = "#2a3540";
      ctx.strokeStyle = "#6b7c8a";
      for (let f = 0; f < 6; f++) ctx.fillRect(bx + 12 + f * 8, h - 70, 3, 28);
    }
    ctx.fillStyle = "#5a6570";
    ctx.fillRect(0, h - 28, w, 28);

    if (phase === "select") {
      drawSelect(w, h);
      return;
    }

    const originX = -camX;
    const originY = h - H * T - 8;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const c = map[y][x];
        const px = originX + x * T;
        const py = originY + y * T;
        if (c === "~") {
          ctx.fillStyle = "#0e7490";
          ctx.fillRect(px, py + 12, T, T - 12);
          ctx.fillStyle = "rgba(165,243,252,0.5)";
          ctx.fillRect(px, py + 10, T, 3);
          continue;
        }
        if (c === " ") continue;
        if (c === "#") {
          // rooftop curb / concrete
          ctx.fillStyle = "#6b7280";
          ctx.fillRect(px, py, T, T);
          ctx.fillStyle = "#9ca3af";
          ctx.fillRect(px, py, T, 6);
          ctx.fillStyle = "#4b5563";
          ctx.fillRect(px + 2, py + 10, T - 4, 4);
        } else if (c === "=") {
          // copper lineset platform
          ctx.fillStyle = "#b87333";
          ctx.fillRect(px, py + 10, T, 10);
          ctx.fillStyle = "#e0a45a";
          ctx.fillRect(px, py + 10, T, 3);
          ctx.fillStyle = "#7c4a1e";
          ctx.fillRect(px, py + 18, T, 2);
        } else if (c === "?") {
          // filter / drier crate
          ctx.fillStyle = "#d6d3d1";
          ctx.fillRect(px + 2, py + 2, T - 4, T - 4);
          ctx.strokeStyle = "#CE0034";
          ctx.strokeRect(px + 2.5, py + 2.5, T - 5, T - 5);
          ctx.fillStyle = "#CE0034";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText("TXV", px + 4, py + 20);
        } else if (c === "F") {
          // outdoor condenser to commission
          ctx.fillStyle = "#4b5563";
          ctx.fillRect(px - 6, py - 36, T + 12, 36 + T);
          ctx.fillStyle = "#6b7280";
          ctx.fillRect(px - 2, py - 44, T + 4, 10);
          ctx.fillStyle = "#94a3b8";
          for (let k = 0; k < 5; k++) ctx.fillRect(px, py - 28 + k * 8, T, 3);
          ctx.fillStyle = "#CE0034";
          ctx.fillRect(px + 6, py - 54, 20, 12);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 8px sans-serif";
          ctx.fillText("ODU", px + 7, py - 45);
        }
      }
    }
    items.forEach((it) => {
      if (it.got) return;
      const px = originX + it.x * T + 6;
      const py = originY + it.y * T + 6;
      if (it.kind === "gauge") {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(px + 2, py + 10, 16, 6);
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.arc(px + 6, py + 10, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#b91c1c";
        ctx.beginPath();
        ctx.arc(px + 16, py + 10, 6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // recovery can
        ctx.fillStyle = "#64748b";
        ctx.fillRect(px + 4, py + 2, 12, 18);
        ctx.fillStyle = "#ce0034";
        ctx.fillRect(px + 4, py + 2, 12, 6);
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(px + 8, py, 4, 4);
      }
    });
    enemies.forEach((e) => {
      if (!e.alive) return;
      const px = originX + e.x * T;
      const py = originY + e.y * T;
      if (e.kind === "ice") {
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(px, py + 4, e.w * T, e.h * T - 4);
        ctx.fillStyle = "#e0f2fe";
        ctx.fillRect(px + 4, py + 8, 8, 8);
        ctx.fillStyle = "#0ea5e9";
        ctx.fillRect(px + 6, py + 14, 4, 4);
        ctx.fillRect(px + 16, py + 14, 4, 4);
      } else if (e.kind === "filter") {
        ctx.fillStyle = "#a16207";
        ctx.fillRect(px, py, e.w * T, e.h * T);
        ctx.fillStyle = "#854d0e";
        for (let n = 0; n < 5; n++) ctx.fillRect(px + 3, py + 4 + n * 5, e.w * T - 6, 3);
        ctx.fillStyle = "#111";
        ctx.fillRect(px + 8, py + 10, 4, 4);
        ctx.fillRect(px + 16, py + 10, 4, 4);
      } else {
        ctx.fillStyle = "#3f2a14";
        ctx.beginPath();
        ctx.ellipse(px + 14, py + 18, 14, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#111";
        ctx.fillRect(px + 8, py + 14, 4, 4);
        ctx.fillRect(px + 16, py + 14, 4, 4);
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(px + 20, py + 8, 3, 6);
      }
    });
    players.forEach((p) => {
      if (p.dead && p.inv <= 0) return;
      if (p.inv > 0 && Math.floor(p.inv * 12) % 2 === 0) return;
      drawTech(ctx, p, originX + p.x * T, originY + p.y * T);
    });
    particles.forEach((pt) => {
      ctx.globalAlpha = Math.max(0, pt.t * 2);
      ctx.fillStyle = pt.col;
      ctx.fillRect(originX + pt.x * T, originY + pt.y * T, 4, 4);
      ctx.globalAlpha = 1;
    });

    // HUD
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, w, 36);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("HVAC BROS  " + (LEVELS[levelI] ? LEVELS[levelI].id : "CLEAR"), 12, 22);
    ctx.fillText("CANS x" + coins, 168, 22);
    ctx.fillText("SCORE " + score, 280, 22);
    ctx.fillText("TECHS " + lives, 410, 22);
    ctx.fillText(Math.ceil(timeLeft) + "s", w - 60, 22);
    if (msgT > 0 || phase === "win" || phase === "dead") {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(w / 2 - 160, 80, 320, 54);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(phase === "win" ? "RTU COMMISSIONED" : phase === "dead" ? "CALL FOR BACKUP" : msg, w / 2, 114);
      ctx.textAlign = "left";
    }
  }

  function drawSelect(w, h) {
    ctx.fillStyle = "rgba(10,14,18,0.55)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText("HVAC BROS", 28, 54);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#f2d07a";
    ctx.fillText("Two-tech rooftop run  ·  stomp iced coils, dirty filters, oil leaks  ·  commission the ODU", 28, 78);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Red tech  P1  ← →  jump SPACE     Green tech  P2  A D  jump W     recover cans · hit TXV crates", 28, 102);
  }

  function renderSelect() {
    const reds = ["hub", "engle"];
    const greens = ["starr", "labono"];
    const box = root.querySelector("#hb-select");
    if (!box) return;
    box.innerHTML =
      '<div class="hb-row">' +
      reds
        .map((id) => {
          const c = CREW[id];
          return `<button class="hb-card ${redId === id ? "on" : ""}" data-red="${id}">
            <img src="${c.img}" alt="${c.name}" />
            <strong>${c.name}</strong>
            <small>${c.role}</small>
            <p>${c.blurb}</p>
          </button>`;
        })
        .join("") +
      "</div><div class='hb-row'>" +
      greens
        .map((id) => {
          const c = CREW[id];
          return `<button class="hb-card ${greenId === id ? "on" : ""}" data-green="${id}">
            <img src="${c.img}" alt="${c.name}" />
            <strong>${c.name}</strong>
            <small>${c.role}</small>
            <p>${c.blurb}</p>
          </button>`;
        })
        .join("") +
      `</div>
      <label class="hb-2p"><input type="checkbox" id="hb-twop" ${twoP ? "checked" : ""}/> Two-tech on one keyboard (green follows if unchecked)</label>
      <div class="hb-actions">
        <button class="btn primary" id="hb-go">Clock the rooftop</button>
        <button class="btn" id="hb-hub">Shop floor</button>
      </div>`;
    box.querySelectorAll("[data-red]").forEach((b) => {
      b.onclick = () => {
        redId = b.getAttribute("data-red");
        renderSelect();
      };
    });
    box.querySelectorAll("[data-green]").forEach((b) => {
      b.onclick = () => {
        greenId = b.getAttribute("data-green");
        renderSelect();
      };
    });
    box.querySelector("#hb-twop").onchange = (e) => {
      twoP = e.target.checked;
    };
    box.querySelector("#hb-go").onclick = startPlay;
    box.querySelector("#hb-hub").onclick = () => hooks.onHub && hooks.onHub();
  }

  function startPlay() {
    phase = "play";
    levelI = 0;
    score = 0;
    coins = 0;
    lives = 3;
    root.querySelector("#hb-select").style.display = "none";
    root.querySelector("#hb-touch").classList.add("on");
    parseLevel(LEVELS[0]);
    msg = LEVELS[0].name;
    msgT = 2;
    beep(520, 0.1);
  }

  function onKey(e, down) {
    keys[e.code] = down;
    if (down && ["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(e.code)) e.preventDefault();
  }

  function bindTouch() {
    const t = root.querySelector("#hb-touch");
    if (!t) return;
    const hold = (code, el) => {
      const on = (ev) => {
        ev.preventDefault();
        keys[code] = true;
      };
      const off = (ev) => {
        ev.preventDefault();
        keys[code] = false;
      };
      el.addEventListener("touchstart", on, { passive: false });
      el.addEventListener("touchend", off);
      el.addEventListener("mousedown", on);
      el.addEventListener("mouseup", off);
      el.addEventListener("mouseleave", off);
    };
    hold("ArrowLeft", t.querySelector("[data-k='l']"));
    hold("ArrowRight", t.querySelector("[data-k='r']"));
    hold("Space", t.querySelector("[data-k='j']"));
  }

  function start(host, opts) {
    root = host;
    hooks = opts || {};
    phase = "select";
    redId = "hub";
    greenId = "starr";
    twoP = true;
    keys = {};
    root.innerHTML = `
      <div class="hb-shell">
        <header class="hb-head">
          <div>
            <p class="eyebrow">Shop arcade</p>
            <h2>HVAC BROS</h2>
          </div>
          <p class="hb-sub">Install crew platformer. Stomp iced coils, dirty filters, and oil leaks. Recover cans. Commission the outdoor unit.</p>
        </header>
        <canvas id="hb-canvas"></canvas>
        <div id="hb-select" class="hb-select"></div>
        <div id="hb-touch" class="hb-touch">
          <button data-k="l">◀</button>
          <button data-k="r">▶</button>
          <button data-k="j" class="jump">JUMP</button>
        </div>
      </div>`;
    canvas = root.querySelector("#hb-canvas");
    ctx = canvas.getContext("2d");
    renderSelect();
    bindTouch();
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    last = performance.now();
    raf = requestAnimationFrame(tick);
    return {
      stop() {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        window.removeEventListener("keydown", kd);
        window.removeEventListener("keyup", ku);
      },
    };
  }
  function kd(e) { onKey(e, true); }
  function ku(e) { onKey(e, false); }

  global.HVACBros = { start };
})(window);
