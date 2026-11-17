/* HVAC Bros — rooftop run. Two techs. Not a plumber game.
   Stomp the dust. Don't eat the ice. Close the call at the disconnect. */
(function (global) {
  "use strict";

  var TILE = 48;
  var MAP = [
    "................................................................................................",
    "................................................................................................",
    "....................====...............................................====.....................",
    "................................................................................................",
    "..........o..............o................o......................................o..............",
    "........====...........====.............====..............o..............====..................",
    "......................................................====......................................",
    ".................^^^^...........................................................................",
    "P......e......e..........e........^^....e......e...........e.............i.................G....",
    "################....########################....#############################....################",
    "################....########################....#############################....################",
  ];

  function start(host, opts) {
    opts = opts || {};
    var rows = MAP.map(function (r) { return r.split(""); });
    var H = rows.length;
    var W = rows[0].length;
    var worldW = W * TILE;
    var worldH = H * TILE;
    var viewW = 960;
    var viewH = 540;

    var keys = {};
    var touch = { left: false, right: false, jump: false };
    var caps = 0;
    var lives = 3;
    var won = false;
    var deadTimer = 0;
    var camX = 0;
    var raf = 0;
    var last = 0;
    var running = true;
    var spawnX = 80;
    var spawnY = 240;

    var player = {
      x: 80, y: 200, w: 28, h: 42, vx: 0, vy: 0,
      facing: 1, grounded: false, coyote: 0, buffer: 0, invuln: 0,
    };
    var trail = [];
    var enemies = [];
    var capsOnMap = [];
    var goal = null;

    function spawnWorld() {
      enemies = [];
      capsOnMap = [];
      goal = null;
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var ch = rows[y][x];
          if (ch === "P") {
            spawnX = x * TILE + 8;
            spawnY = y * TILE;
            player.x = spawnX;
            player.y = spawnY;
            player.vx = 0;
            player.vy = 0;
            rows[y][x] = ".";
          } else if (ch === "e" || ch === "i") {
            enemies.push({
              x: x * TILE + 6,
              y: y * TILE + (ch === "i" ? 16 : 14),
              w: ch === "i" ? 36 : 32,
              h: ch === "i" ? 30 : 30,
              vx: ch === "i" ? 90 : 46,
              kind: ch === "i" ? "ice" : "dust",
              alive: true,
            });
            rows[y][x] = ".";
          } else if (ch === "o") {
            capsOnMap.push({ x: x * TILE + 16, y: y * TILE + 14, got: false });
            rows[y][x] = ".";
          } else if (ch === "G") {
            goal = { x: x * TILE, y: y * TILE, w: TILE, h: TILE };
            rows[y][x] = ".";
          }
        }
      }
    }
    spawnWorld();

    host.innerHTML =
      '<div class="hb">' +
      '<canvas id="hb-canvas" width="960" height="540"></canvas>' +
      '<header class="hb-hud"><button type="button" class="btn" id="hb-hub">Shop floor</button>' +
      '<strong>HVAC BROS</strong><span id="hb-caps">0 caps</span><span id="hb-lives">♥ ♥ ♥</span></header>' +
      '<p class="hb-banner" id="hb-banner"></p>' +
      '<div class="hb-pad">' +
      '<button type="button" data-k="left">◀</button>' +
      '<button type="button" data-k="right">▶</button>' +
      '<button type="button" data-k="jump">JUMP</button></div>' +
      "</div>" +
      "<style>" +
      "#bros-root .hb{position:absolute;inset:0;background:#87c6ea;overflow:hidden;display:flex;align-items:center;justify-content:center}" +
      "#bros-root canvas{width:100%;height:100%;max-height:100%;object-fit:contain;display:block;background:#87c6ea;touch-action:none}" +
      "#bros-root .hb-hud{position:absolute;left:8px;right:8px;top:8px;display:flex;gap:10px;align-items:center;color:#102033;font-weight:800;text-shadow:0 1px 0 #fff}" +
      "#bros-root .hb-hud strong{letter-spacing:.08em}" +
      "#bros-root .hb-banner{position:absolute;left:50%;top:22%;transform:translateX(-50%);margin:0;font-size:28px;font-weight:900;color:#102033;text-shadow:0 2px 0 #fff;pointer-events:none}" +
      "#bros-root .hb-pad{position:absolute;left:8px;right:8px;bottom:10px;display:flex;gap:8px}" +
      "#bros-root .hb-pad button{min-height:52px;min-width:64px;font-weight:800;border:3px solid #102033;background:#f4efe6;border-radius:12px}" +
      "#bros-root .hb-pad button:last-child{margin-left:auto;min-width:96px;background:#e8c450}" +
      "</style>";

    var canvas = host.querySelector("#hb-canvas");
    var ctx = canvas.getContext("2d");
    var banner = host.querySelector("#hb-banner");

    function solidAt(tx, ty) {
      if (tx < 0 || ty < 0 || tx >= W || ty >= H) return ty >= H;
      var ch = rows[ty][tx];
      return ch === "#" || ch === "=" || ch === "b";
    }

    function rectTiles(x, y, w, h, fn) {
      var x0 = Math.floor(x / TILE);
      var x1 = Math.floor((x + w - 1) / TILE);
      var y0 = Math.floor(y / TILE);
      var y1 = Math.floor((y + h - 1) / TILE);
      for (var ty = y0; ty <= y1; ty++) {
        for (var tx = x0; tx <= x1; tx++) fn(tx, ty);
      }
    }

    function overlap(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function die() {
      lives -= 1;
      player.vx = 0;
      player.vy = -280;
      player.invuln = 1.2;
      if (lives <= 0) {
        lives = 3;
        caps = 0;
        rows = MAP.map(function (r) { return r.split(""); });
        spawnWorld();
        deadTimer = 0;
        banner.textContent = "Callback. From the truck.";
        return;
      }
      deadTimer = 0.7;
      banner.textContent = "Watch the ice.";
    }

    function bump(tx, ty) {
      if (rows[ty][tx] !== "=") return;
      rows[ty][tx] = "b";
      capsOnMap.push({ x: tx * TILE + 16, y: (ty - 1) * TILE + 10, got: false, vy: -80 });
    }

    function step(dt) {
      if (won) return;
      dt = Math.min(dt, 0.033);
      if (deadTimer > 0) {
        deadTimer -= dt;
        player.vy += 1400 * dt;
        player.y += player.vy * dt;
        if (deadTimer <= 0) {
          player.x = spawnX;
          player.y = spawnY;
          player.vx = 0;
          player.vy = 0;
        }
        return;
      }

      var left = keys.ArrowLeft || keys.KeyA || touch.left;
      var right = keys.ArrowRight || keys.KeyD || touch.right;
      var jump = keys.Space || keys.ArrowUp || keys.KeyW || touch.jump;
      player.vx = left && !right ? -210 : right && !left ? 210 : 0;
      if (player.vx) player.facing = player.vx > 0 ? 1 : -1;
      player.coyote = player.grounded ? 0.08 : Math.max(0, player.coyote - dt);
      player.buffer = jump ? 0.1 : Math.max(0, player.buffer - dt);
      if (player.buffer > 0 && player.coyote > 0) {
        player.vy = -560;
        player.grounded = false;
        player.coyote = 0;
        player.buffer = 0;
      }
      player.vy = Math.min(720, player.vy + 1500 * dt);
      if (player.invuln > 0) player.invuln -= dt;

      player.x += player.vx * dt;
      rectTiles(player.x, player.y, player.w, player.h, function (tx, ty) {
        if (!solidAt(tx, ty)) return;
        if (player.vx > 0) player.x = tx * TILE - player.w;
        else if (player.vx < 0) player.x = (tx + 1) * TILE;
        player.vx = 0;
      });

      var wasVy = player.vy;
      player.y += player.vy * dt;
      player.grounded = false;
      rectTiles(player.x, player.y, player.w, player.h, function (tx, ty) {
        if (!solidAt(tx, ty)) return;
        if (wasVy > 0) {
          player.y = ty * TILE - player.h;
          player.vy = 0;
          player.grounded = true;
        } else if (wasVy < 0) {
          player.y = (ty + 1) * TILE;
          player.vy = 0;
          bump(tx, ty);
        }
      });

      if (player.y > worldH + 20) die();

      trail.push({ x: player.x, y: player.y, f: player.facing });
      if (trail.length > 14) trail.shift();

      enemies.forEach(function (en) {
        if (!en.alive) return;
        en.x += en.vx * dt;
        var ahead = en.vx > 0 ? en.x + en.w + 2 : en.x - 2;
        var foot = en.y + en.h + 2;
        var wall = solidAt(Math.floor(ahead / TILE), Math.floor((en.y + 4) / TILE));
        var floor = solidAt(Math.floor(ahead / TILE), Math.floor(foot / TILE));
        if (wall || !floor) en.vx *= -1;
        var box = { x: player.x, y: player.y, w: player.w, h: player.h };
        if (overlap(box, en) && player.invuln <= 0 && deadTimer <= 0) {
          var stomp = en.kind !== "ice" && player.vy > 40 && player.y + player.h - en.y < 18;
          if (stomp) {
            en.alive = false;
            player.vy = -320;
            caps += 5;
          } else die();
        }
      });

      capsOnMap.forEach(function (c) {
        if (c.got) return;
        if (c.vy) {
          c.y += c.vy * dt;
          c.vy += 200 * dt;
        }
        if (overlap({ x: player.x, y: player.y, w: player.w, h: player.h }, { x: c.x - 8, y: c.y - 8, w: 24, h: 24 })) {
          c.got = true;
          caps += 1;
        }
      });

      if (goal && overlap({ x: player.x, y: player.y, w: player.w, h: player.h }, goal)) {
        won = true;
        banner.textContent = "Call closed.";
        if (!awarded && opts.onXp) {
          awarded = true;
          opts.onXp(30);
        }
      }

      camX = Math.max(0, Math.min(worldW - viewW, player.x - viewW * 0.4));
      host.querySelector("#hb-caps").textContent = caps + " caps";
      host.querySelector("#hb-lives").textContent = lives > 0 ? new Array(lives + 1).join("♥ ") : "";
    }

    function tech(x, y, facing, shirt) {
      ctx.save();
      ctx.translate(x + 14, y);
      ctx.scale(facing, 1);
      ctx.fillStyle = "#1a120c";
      ctx.fillRect(-8, -40, 16, 8);
      ctx.fillStyle = "#f0c9a0";
      ctx.fillRect(-7, -34, 14, 12);
      ctx.fillStyle = shirt;
      ctx.fillRect(-9, -22, 18, 16);
      ctx.fillStyle = "#c9a15b";
      ctx.fillRect(-9, -10, 18, 4);
      ctx.fillStyle = "#2a241c";
      ctx.fillRect(-8, -6, 6, 8);
      ctx.fillRect(2, -6, 6, 8);
      ctx.restore();
    }

    function draw() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, viewW, viewH);
      var sky = ctx.createLinearGradient(0, 0, 0, viewH);
      sky.addColorStop(0, "#8fd0f0");
      sky.addColorStop(1, "#d7ecb8");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, viewW, viewH);
      ctx.save();
      ctx.translate(-camX, 0);

      for (var ty = 0; ty < H; ty++) {
        for (var tx = 0; tx < W; tx++) {
          var ch = rows[ty][tx];
          var x = tx * TILE;
          var y = ty * TILE;
          if (ch === "#") {
            ctx.fillStyle = "#6d624f";
            ctx.fillRect(x, y, TILE, TILE);
            ctx.fillStyle = "#8a7b62";
            ctx.fillRect(x, y, TILE, 8);
            ctx.strokeStyle = "#3e3428";
            ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
          } else if (ch === "=" || ch === "b") {
            ctx.fillStyle = ch === "=" ? "#f4efe6" : "#c8bfb0";
            ctx.fillRect(x + 2, y + 8, TILE - 4, TILE - 12);
            ctx.strokeStyle = "#102033";
            ctx.strokeRect(x + 2.5, y + 8.5, TILE - 5, TILE - 13);
            ctx.fillStyle = "#9bb0c4";
            for (var g = 0; g < 3; g++) ctx.fillRect(x + 8, y + 14 + g * 8, TILE - 16, 3);
          }
        }
      }

      capsOnMap.forEach(function (c) {
        if (c.got) return;
        ctx.fillStyle = "#c0c6ce";
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e8c450";
        ctx.fillRect(c.x - 7, c.y - 4, 14, 5);
      });

      enemies.forEach(function (en) {
        if (!en.alive) return;
        if (en.kind === "ice") {
          ctx.fillStyle = "#d7f3ff";
          ctx.fillRect(en.x, en.y, en.w, en.h);
          ctx.strokeStyle = "#7eb6ff";
          ctx.strokeRect(en.x + 0.5, en.y + 0.5, en.w - 1, en.h - 1);
        } else {
          ctx.fillStyle = "#8d8478";
          ctx.beginPath();
          ctx.ellipse(en.x + en.w / 2, en.y + en.h / 2, en.w / 2, en.h / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#1a120c";
          ctx.fillRect(en.x + 8, en.y + 10, 4, 4);
          ctx.fillRect(en.x + 18, en.y + 10, 4, 4);
        }
      });

      if (goal) {
        ctx.fillStyle = "#f0d24a";
        ctx.fillRect(goal.x + 10, goal.y - 28, 28, 64);
        ctx.fillStyle = "#1a7a3a";
        ctx.fillRect(goal.x + 16, goal.y - 16, 16, 10);
        ctx.fillStyle = "#102033";
        ctx.font = "700 11px sans-serif";
        ctx.fillText("DISC", goal.x + 10, goal.y + 28);
      }

      var bro = trail[0];
      if (bro) tech(bro.x - 18, bro.y, bro.f, "#CE0034");
      if (deadTimer <= 0 && (player.invuln <= 0 || Math.floor(player.invuln * 12) % 2 === 0)) {
        tech(player.x, player.y, player.facing, "#1f6feb");
      }
      ctx.restore();
    }

    function frame(t) {
      if (!running) return;
      if (!last) last = t;
      var dt = (t - last) / 1000;
      last = t;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }

    function onKey(e, down) {
      keys[e.code] = down;
      if (down && (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowLeft" || e.code === "ArrowRight")) {
        e.preventDefault();
      }
    }
    function kd(e) { onKey(e, true); }
    function ku(e) { onKey(e, false); }
    document.addEventListener("keydown", kd);
    document.addEventListener("keyup", ku);

    host.querySelector("#hb-hub").onclick = function () {
      if (opts.onHub) opts.onHub();
    };
    host.querySelectorAll(".hb-pad button").forEach(function (b) {
      var k = b.getAttribute("data-k");
      function set(v) {
        touch[k] = v;
      }
      b.onpointerdown = function (e) {
        set(true);
        try { b.setPointerCapture(e.pointerId); } catch (err) {}
      };
      b.onpointerup = function () { set(false); };
      b.onpointercancel = function () { set(false); };
    });

    banner.textContent = "Stomp the dust. Jump the ice. Hit the disconnect.";
    raf = requestAnimationFrame(frame);

    return {
      stop: function () {
        running = false;
        cancelAnimationFrame(raf);
        document.removeEventListener("keydown", kd);
        document.removeEventListener("keyup", ku);
        host.innerHTML = "";
      },
    };
  }

  global.HvacBros = { start: start };
})(window);
