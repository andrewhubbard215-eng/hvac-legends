/* Tiny WebGL 3D vapor-compression loop — Canvas 2D stays the shop floor. */
(function (global) {
  "use strict";

  const VS = [
    "attribute vec3 aPos;",
    "attribute vec3 aCol;",
    "uniform mat4 uMVP;",
    "varying vec3 vCol;",
    "void main(){",
    "  gl_Position = uMVP * vec4(aPos,1.0);",
    "  gl_PointSize = 9.0;",
    "  vCol = aCol;",
    "}",
  ].join("\n");

  const FS = [
    "precision mediump float;",
    "varying vec3 vCol;",
    "void main(){",
    "  // vCol is GPU-interpolated (perspective-correct) between vertices",
    "  gl_FragColor = vec4(vCol, 1.0);",
    "}",
  ].join("\n");

  function shaders(webgl2, flat) {
    if (!webgl2) {
      return {
        vs: VS,
        fs: FS,
      };
    }
    const q = flat ? "flat" : "smooth";
    return {
      vs: [
        "#version 300 es",
        "in vec3 aPos;",
        "in vec3 aCol;",
        "uniform mat4 uMVP;",
        q + " out vec3 vCol;",
        "void main(){",
        "  gl_Position = uMVP * vec4(aPos,1.0);",
        "  gl_PointSize = 9.0;",
        "  vCol = aCol;",
        "}",
      ].join("\n"),
      fs: [
        "#version 300 es",
        "precision mediump float;",
        q + " in vec3 vCol;",
        "out vec4 fragColor;",
        "void main(){ fragColor = vec4(vCol, 1.0); }",
      ].join("\n"),
    };
  }

  function linkProg(gl, webgl2, flat) {
    const src = shaders(webgl2, flat);
    const vs = compile(gl, gl.VERTEX_SHADER, src.vs);
    const fs = compile(gl, gl.FRAGMENT_SHADER, src.fs);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(prog));
      return null;
    }
    return {
      prog: prog,
      aPos: gl.getAttribLocation(prog, "aPos"),
      aCol: gl.getAttribLocation(prog, "aCol"),
      uMVP: gl.getUniformLocation(prog, "uMVP"),
    };
  }

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function mul(a, b) {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        o[c * 4 + r] =
          a[0 * 4 + r] * b[c * 4 + 0] +
          a[1 * 4 + r] * b[c * 4 + 1] +
          a[2 * 4 + r] * b[c * 4 + 2] +
          a[3 * 4 + r] * b[c * 4 + 3];
      }
    }
    return o;
  }

  function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const m = new Float32Array(16);
    m[0] = f / aspect;
    m[5] = f;
    m[10] = (far + near) / (near - far);
    m[11] = -1;
    m[14] = (2 * far * near) / (near - far);
    return m;
  }

  function lookAt(ex, ey, ez, tx, ty, tz) {
    let zx = ex - tx,
      zy = ey - ty,
      zz = ez - tz;
    let len = Math.hypot(zx, zy, zz) || 1;
    zx /= len;
    zy /= len;
    zz /= len;
    let xx = zz,
      xy = 0,
      xz = -zx;
    len = Math.hypot(xx, xy, xz) || 1;
    xx /= len;
    xy /= len;
    xz /= len;
    const yx = zy * xz - zz * xy;
    const yy = zz * xx - zx * xz;
    const yz = zx * xy - zy * xx;
    const m = new Float32Array(16);
    m[0] = xx;
    m[4] = xy;
    m[8] = xz;
    m[1] = yx;
    m[5] = yy;
    m[9] = yz;
    m[2] = zx;
    m[6] = zy;
    m[10] = zz;
    m[12] = -(xx * ex + xy * ey + xz * ez);
    m[13] = -(yx * ex + yy * ey + yz * ez);
    m[14] = -(zx * ex + zy * ey + zz * ez);
    m[15] = 1;
    return m;
  }

  function cube(x, y, z, sx, sy, sz, r, g, b) {
    const hx = sx / 2,
      hy = sy / 2,
      hz = sz / 2;
    const p = [
      [-hx, -hy, hz],
      [hx, -hy, hz],
      [hx, hy, hz],
      [-hx, hy, hz],
      [-hx, -hy, -hz],
      [hx, -hy, -hz],
      [hx, hy, -hz],
      [-hx, hy, -hz],
    ];
    const faces = [
      [0, 1, 2, 0, 2, 3],
      [1, 5, 6, 1, 6, 2],
      [5, 4, 7, 5, 7, 6],
      [4, 0, 3, 4, 3, 7],
      [3, 2, 6, 3, 6, 7],
      [4, 5, 1, 4, 1, 0],
    ];
    const pos = [];
    const col = [];
    faces.forEach(function (f, fi) {
      const shade = 0.55 + (fi % 3) * 0.15;
      f.forEach(function (i) {
        pos.push(p[i][0] + x, p[i][1] + y, p[i][2] + z);
        col.push(r * shade, g * shade, b * shade);
      });
    });
    return { pos: pos, col: col };
  }

  const UNITS = [
    { name: "compressor", x: -0.7, y: 0.05, z: 0.1, sx: 0.32, sy: 0.36, sz: 0.32, c: [0.8, 0.1, 0.2] },
    { name: "condenser", x: 0.05, y: 0.35, z: -0.65, sx: 0.7, sy: 0.22, sz: 0.28, c: [0.77, 0.31, 0.32] },
    { name: "metering", x: 0.75, y: -0.05, z: 0.05, sx: 0.18, sy: 0.22, sz: 0.18, c: [0.2, 0.55, 0.7] },
    { name: "evaporator", x: 0.05, y: -0.35, z: 0.7, sx: 0.7, sy: 0.22, sz: 0.28, c: [0.18, 0.83, 0.75] },
  ];

  function attach(canvas) {
    if (!canvas) return null;
    const gl =
      canvas.getContext("webgl2", { antialias: true, alpha: false }) ||
      canvas.getContext("webgl", { antialias: true, alpha: false }) ||
      canvas.getContext("experimental-webgl");
    if (!gl) return null;
    const webgl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
    const progSmooth = linkProg(gl, webgl2, false);
    const progFlat = webgl2 ? linkProg(gl, true, true) : null;
    if (!progSmooth) return null;
    let loc = progSmooth;
    let flat = false;

    function meshFrom(parts) {
      const pos = [];
      const col = [];
      parts.forEach(function (p) {
        pos.push.apply(pos, p.pos);
        col.push.apply(col, p.col);
      });
      const pb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pb);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
      const cb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, cb);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(col), gl.STATIC_DRAW);
      return { pb: pb, cb: cb, n: pos.length / 3 };
    }

    const boxes = meshFrom(
      UNITS.map(function (u) {
        return cube(u.x, u.y, u.z, u.sx, u.sy, u.sz, u.c[0], u.c[1], u.c[2]);
      })
    );

    const floor = meshFrom([
      {
        pos: [-1.15, -0.72, -1.15, 1.15, -0.72, -1.15, 0.0, -0.72, 1.2],
        col: [1, 0.12, 0.12, 0.12, 1, 0.2, 0.15, 0.35, 1],
      },
    ]);

    const loopPos = [];
    const loopCol = [];
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const ang = t * Math.PI * 2;
      const x = Math.sin(ang) * 0.72;
      const z = -Math.cos(ang) * 0.72;
      const y = Math.sin(ang * 2) * 0.12;
      loopPos.push(x, y, z);
      const hot = t < 0.45;
      loopCol.push(hot ? 0.94 : 0.18, hot ? 0.44 : 0.83, hot ? 0.47 : 0.75);
    }
    const loop = {
      pb: gl.createBuffer(),
      cb: gl.createBuffer(),
      n: loopPos.length / 3,
    };
    gl.bindBuffer(gl.ARRAY_BUFFER, loop.pb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(loopPos), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, loop.cb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(loopCol), gl.STATIC_DRAW);

    const ptBuf = gl.createBuffer();
    const ptCol = gl.createBuffer();

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.05, 0.08, 0.11, 1);

    function bindMesh(m) {
      gl.bindBuffer(gl.ARRAY_BUFFER, m.pb);
      gl.enableVertexAttribArray(loc.aPos);
      gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, m.cb);
      gl.enableVertexAttribArray(loc.aCol);
      gl.vertexAttribPointer(loc.aCol, 3, gl.FLOAT, false, 0, 0);
    }

    function resize() {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const w = canvas.clientWidth || 640;
      const h = canvas.clientHeight || 360;
      const bw = Math.max(1, Math.floor(w * dpr));
      const bh = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      return w / h;
    }

    function draw(opts) {
      const aspect = resize();
      const running = !!(opts && opts.running);
      const t = ((opts && opts.t) || 0) / 1000;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(loc.prog);
      const eyeA = t * 0.35;
      const ex = Math.sin(eyeA) * 2.4;
      const ez = Math.cos(eyeA) * 2.4;
      const mvp = mul(perspective(0.9, aspect, 0.1, 20), lookAt(ex, 1.15, ez, 0, 0, 0));
      gl.uniformMatrix4fv(loc.uMVP, false, mvp);

      bindMesh(floor);
      gl.drawArrays(gl.TRIANGLES, 0, floor.n);

      bindMesh(boxes);
      gl.drawArrays(gl.TRIANGLES, 0, boxes.n);

      bindMesh(loop);
      gl.lineWidth(3);
      gl.drawArrays(gl.LINE_STRIP, 0, loop.n);

      if (running) {
        const n = 14;
        const pos = [];
        const col = [];
        for (let i = 0; i < n; i++) {
          const u = (t * 0.25 + i / n) % 1;
          const ang = u * Math.PI * 2;
          pos.push(Math.sin(ang) * 0.72, Math.sin(ang * 2) * 0.12, -Math.cos(ang) * 0.72);
          const hot = u < 0.45;
          col.push(hot ? 1 : 0.2, hot ? 0.5 : 0.9, hot ? 0.5 : 0.85);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(loc.aPos);
        gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, ptCol);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(col), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(loc.aCol);
        gl.vertexAttribPointer(loc.aCol, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, 0, n);
      }
    }

    return {
      draw: draw,
      ok: true,
      webgl2: webgl2,
      isFlat: function () {
        return flat;
      },
      setFlat: function (on) {
        if (!webgl2 || !progFlat) return false;
        flat = !!on;
        loc = flat ? progFlat : progSmooth;
        return true;
      },
    };
  }

  global.LtWebGLCycle = { attach: attach };
})(window);
