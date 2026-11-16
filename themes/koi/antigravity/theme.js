// Antigravity Koi Pond Theme: live canvas pond (koi, lily pads, caustics, ripples)
// for Google Antigravity IDE (VS Code based). Supports both Dark & Light themes!
(() => {
  if (typeof window.__antigravityKoiCleanup === 'function') window.__antigravityKoiCleanup();
  window.__antigravityKoi = true;

  const isDark = () => {
    return document.body.classList.contains('vs-dark') || 
           document.documentElement.classList.contains('vs-dark') ||
           matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const darkMode = isDark();

  const css = `
:root {
  --cs-a: ${darkMode ? '0.62' : '0.52'};
  --ag-glass-bg: ${darkMode ? '16, 26, 25' : '246, 252, 250'};
  --ag-editor-bg: ${darkMode ? '12, 20, 19' : '250, 254, 253'};
  --ag-border: ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(20, 72, 68, 0.15)'};
}

/* Antigravity / Monaco Workbench Transparency */
body.monaco-workbench,
.monaco-workbench {
  background: transparent !important;
}

.monaco-workbench > .monaco-grid-view,
.monaco-workbench .monaco-grid-view .monaco-grid-branch-node,
.monaco-workbench .monaco-grid-view .monaco-grid-leaf-node,
.monaco-workbench .split-view-view {
  background-color: transparent !important;
}

/* Titlebar & Statusbar */
.monaco-workbench .part.titlebar {
  background: rgba(var(--ag-glass-bg), calc(var(--cs-a) + 0.15)) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--ag-border) !important;
}

.monaco-workbench .part.statusbar {
  background: rgba(var(--ag-glass-bg), calc(var(--cs-a) + 0.2)) !important;
  border-top: 1px solid var(--ag-border) !important;
}

/* Activity Bar & Sidebar */
.monaco-workbench .part.activitybar {
  background: rgba(var(--ag-glass-bg), calc(var(--cs-a) + 0.18)) !important;
  border-right: 1px solid var(--ag-border) !important;
}

.monaco-workbench .part.sidebar,
.monaco-workbench .part.auxiliarybar {
  background: rgba(var(--ag-glass-bg), var(--cs-a)) !important;
  border-right: 1px solid var(--ag-border) !important;
  border-left: 1px solid var(--ag-border) !important;
}

/* Editor Area */
.monaco-workbench .part.editor,
.monaco-workbench .part.editor > .content,
.monaco-workbench .part.editor > .content .editor-group-container,
.monaco-workbench .part.editor > .content .editor-group-container > .editor-container {
  background: transparent !important;
}

.monaco-editor,
.monaco-editor-background,
.monaco-editor .margin {
  background-color: rgba(var(--ag-editor-bg), var(--cs-a)) !important;
}

/* Tabs */
.tabs-and-actions-container,
.monaco-workbench .part.editor > .content .editor-group-container > .title {
  background: rgba(var(--ag-glass-bg), calc(var(--cs-a) + 0.08)) !important;
  border-bottom: 1px solid var(--ag-border) !important;
}

.tab {
  background: transparent !important;
}

.tab.active {
  background: rgba(var(--ag-editor-bg), calc(var(--cs-a) + 0.18)) !important;
  border-top: 2px solid #e2471f !important;
}

/* Bottom Panel (Terminal / Output) */
.monaco-workbench .part.panel {
  background: rgba(var(--ag-glass-bg), calc(var(--cs-a) + 0.08)) !important;
  border-top: 1px solid var(--ag-border) !important;
}

/* Backdrop Container */
#cs-backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background: ${darkMode ? '#091a18' : '#7fb3a8'};
}

#cs-pond {
  display: block;
  width: 100%;
  height: 100%;
}

#cs-toast {
  position: fixed;
  left: 50%;
  bottom: 60px;
  transform: translateX(-50%);
  z-index: 2147483647;
  pointer-events: none;
  padding: 8px 18px;
  border-radius: 999px;
  background: ${darkMode ? 'rgba(10, 30, 28, 0.9)' : 'rgba(18, 40, 38, 0.85)'};
  color: #f2fbf8;
  font: 500 13px system-ui, sans-serif;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  opacity: 0;
  transition: opacity .25s ease;
}
#cs-toast.show { opacity: 1; }
`;

  // ---- helpers -------------------------------------------------------------
  const TAU = Math.PI * 2;
  const MAXB = 0.36;
  let S = 1;
  const K = () => S / 0.5;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const wrapA = (a) => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let styleEl, backdrop, cv, g, bed, causPat, raf = 0, last = 0, T = 0, W = 0, H = 0, nextAmb = 2;
  const fish = [], pads = [], ripples = [];
  const ptr = { x: -1e4, y: -1e4, t: -1e9 };

  // ---- pond bed (early morning sunlight & crystalline water) ---------------
  function makeBed(w, h) {
    const c = new OffscreenCanvas(w, h), x = c.getContext('2d');
    const gr = x.createLinearGradient(0, 0, w, h);
    if (darkMode) {
      gr.addColorStop(0, '#154039'); gr.addColorStop(0.5, '#0e2b26'); gr.addColorStop(1, '#091e1a');
    } else {
      // Early morning pond water: luminous, crystalline, soft morning sunbeam glow
      gr.addColorStop(0, '#caeae0');      // Fresh early morning water with sunlight reflection
      gr.addColorStop(0.38, '#a3d2c5');   // Crystal morning aqua-sage
      gr.addColorStop(0.72, '#82bdae');   // Serene clear pond teal
      gr.addColorStop(1, '#61a295');      // Gentle depth moss-teal
    }
    x.fillStyle = gr; x.fillRect(0, 0, w, h);

    // Early morning sunbeams (subtle warm light washing across the surface from top-left)
    if (!darkMode) {
      const sun = x.createRadialGradient(w * 0.20, h * 0.12, 0, w * 0.20, h * 0.12, Math.max(w, h) * 0.70);
      sun.addColorStop(0, 'rgba(238, 255, 248, 0.30)');
      sun.addColorStop(0.45, 'rgba(230, 252, 244, 0.12)');
      sun.addColorStop(1, 'rgba(230, 252, 244, 0)');
      x.fillStyle = sun; x.fillRect(0, 0, w, h);
    }

    for (let i = 0; i < 6; i++) {
      const cx = Math.random() * w, cy = Math.random() * h, r = rnd(0.15, 0.35) * Math.max(w, h);
      const rg = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      rg.addColorStop(0, darkMode ? 'rgba(8, 48, 42, 0.25)' : 'rgba(28, 82, 76, 0.08)');
      rg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      x.fillStyle = rg; x.fillRect(0, 0, w, h);
    }
    const n = Math.round((w * h) / (2400 * K() * K()));
    for (let i = 0; i < n; i++) {
      const k = Math.random(), r = rnd(1.5, 7) * K();
      x.fillStyle = darkMode 
        ? `rgba(${k < 0.5 ? '28, 62, 55' : '52, 85, 78'}, ${rnd(0.18, 0.40)})`
        : `rgba(${k < 0.5 ? '102, 135, 126' : k < 0.8 ? '132, 159, 151' : '210, 232, 224'}, ${rnd(0.08, 0.20)})`;
      x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, r, r * rnd(0.55, 0.9), rnd(0, TAU), 0, TAU); x.fill();
    }
    const v = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.40, w / 2, h / 2, Math.max(w, h) * 0.78);
    v.addColorStop(0, 'rgba(0, 0, 0, 0)');
    v.addColorStop(1, darkMode ? 'rgba(3, 14, 12, 0.35)' : 'rgba(18, 52, 50, 0.14)');
    x.fillStyle = v; x.fillRect(0, 0, w, h);
    return c;
  }

  // ---- caustics ------------------------------------------------------------
  function makeCaustics() {
    const N = 192, P = 11, c = new OffscreenCanvas(N, N), x = c.getContext('2d');
    const pts = Array.from({ length: P }, () => [Math.random() * N, Math.random() * N]);
    const img = x.createImageData(N, N), d = img.data;
    for (let y = 0; y < N; y++) for (let X = 0; X < N; X++) {
      let f1 = 1e9, f2 = 1e9;
      for (const [qx, qy] of pts) {
        let dx = Math.abs(X - qx); dx = Math.min(dx, N - dx);
        let dy = Math.abs(y - qy); dy = Math.min(dy, N - dy);
        const dd = Math.sqrt(dx * dx + dy * dy);
        if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) f2 = dd;
      }
      const v = Math.max(0, 1 - (f2 - f1) / 10), i = (y * N + X) * 4;
      if (darkMode) {
        d[i] = 130; d[i + 1] = 230; d[i + 2] = 210; d[i + 3] = v * v * v * 120;
      } else {
        d[i] = 242; d[i + 1] = 255; d[i + 2] = 250; d[i + 3] = v * v * v * 255;
      }
    }
    x.putImageData(img, 0, 0);
    const soft = new OffscreenCanvas(N, N), y2 = soft.getContext('2d');
    y2.filter = 'blur(1.6px)';
    for (const ox of [-N, 0, N]) for (const oy of [-N, 0, N]) y2.drawImage(c, ox, oy);
    return soft;
  }

  // ---- lily pads -----------------------------------------------------------
  function padSprite(r, flower) {
    const R = Math.ceil(r * S), size = R * 2 + 6, c = new OffscreenCanvas(size, size), x = c.getContext('2d');
    x.translate(size / 2, size / 2);
    const notch = 0.34;
    x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, R, notch / 2, TAU - notch / 2); x.closePath();
    const gr = x.createRadialGradient(-R * 0.3, -R * 0.3, R * 0.1, 0, 0, R);
    if (darkMode) {
      gr.addColorStop(0, '#5a823c'); gr.addColorStop(0.7, '#3c6830'); gr.addColorStop(1, '#23441f');
    } else {
      gr.addColorStop(0, '#9ccc72'); gr.addColorStop(0.7, '#62a04c'); gr.addColorStop(1, '#40793a');
    }
    x.fillStyle = gr; x.fill();
    x.strokeStyle = darkMode ? 'rgba(15, 35, 12, 0.7)' : 'rgba(36, 76, 32, 0.55)';
    x.lineWidth = Math.max(1, R * 0.04); x.stroke();
    x.strokeStyle = darkMode ? 'rgba(160, 200, 140, 0.25)' : 'rgba(222, 242, 192, 0.38)';
    x.lineWidth = Math.max(0.6, R * 0.025);
    for (let k = 0; k < 9; k++) {
      const a = notch / 2 + ((TAU - notch) * (k + 0.5)) / 9;
      x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a) * R * 0.92, Math.sin(a) * R * 0.92); x.stroke();
    }
    if (flower) {
      for (const [cnt, len, col, rot] of [[9, R * 0.62, '#f4bccd', 0], [7, R * 0.42, '#fbe1e9', 0.35]]) {
        for (let k = 0; k < cnt; k++) {
          x.save(); x.rotate(rot + (k * TAU) / cnt);
          x.beginPath(); x.ellipse(len * 0.5, 0, len * 0.5, len * 0.21, 0, 0, TAU);
          x.fillStyle = col; x.fill();
          x.strokeStyle = 'rgba(196, 84, 118, 0.35)'; x.lineWidth = 0.8; x.stroke();
          x.restore();
        }
      }
      x.beginPath(); x.arc(0, 0, R * 0.12, 0, TAU); x.fillStyle = '#f2cc48'; x.fill();
    }
    return c;
  }

  // ---- Authentic ClaudeSkin Koi Breeds & Masterpiece Patterns --------------
  const PATTERNS = [
    { body: '#f7f3ec', spots: [[1.3, 0.1, 0.13, '#e2471f'], [3.7, -0.3, 0.15, '#e2471f'], [6, 0.25, 0.11, '#e2471f']] },   // 0: Kohaku (Sandan 3-step)
    { body: '#f6f1e8', spots: [[1.1, -0.2, 0.12, '#e04a22'], [4.2, 0.2, 0.14, '#e04a22'], [3, 0.55, 0.05, '#1c1c1e'], [6.3, -0.45, 0.05, '#1c1c1e']] }, // 1: Sanke (with sumi ink spots)
    { body: '#211e20', spots: [[1.1, 0, 0.125, '#e24d24'], [3.8, 0.35, 0.12, '#f4efe6'], [5.6, -0.3, 0.12, '#e24d24']], sheen: 0.28 },  // 2: Showa (Claude's authentic black koi: Menware crimson head mask, white flank, crimson caudal)
    { body: '#efb23b', spots: [], sheen: 0.5 },                                                                       // 3: Ogon (Yamabuki gold)
    { body: '#f2802e', spots: [[2.6, 0, 0.09, '#f8b45c']] },                                                           // 4: Benigoi / Orange
    { body: '#f8f5ef', spots: [[0.7, 0, 0.09, '#d93a1c']] },                                                           // 5: Tancho (Red-crowned crane)
    { body: '#ece5d7', spots: [[2, 0.3, 0.1, '#5d6f86'], [4.6, -0.3, 0.11, '#5d6f86'], [3.2, 0, 0.08, '#ec7a3c']] },    // 6: Asagi (Slate-blue & coral belly)
    { body: '#f7f3ec', spots: [[2.2, -0.1, 0.16, '#e5531f'], [5.2, 0.2, 0.1, '#e5531f']] },                         // 7: Kohaku (Nidan 2-step)
    { body: '#211e20', spots: [[1.0, 0, 0.12, '#f4efe6'], [3.6, -0.32, 0.12, '#f4efe6'], [5.5, 0.28, 0.11, '#f4efe6']], sheen: 0.30 }, // 8: Kumonryu (Dragon black koi: white head mask & dragon wings)
  ];

  function makeFish(i) {
    const L = rnd(105, 160), n = 12, seg = L / n;
    const x = rnd(0.1, 0.9) * W, y = rnd(0.1, 0.9) * H, a = rnd(-Math.PI, Math.PI);
    const sp = [];
    for (let k = 0; k < n; k++) sp.push([x - Math.cos(a) * seg * k, y - Math.sin(a) * seg * k]);
    return { L, n, seg, sp, a, v: rnd(30, 48), base: rnd(28, 48), wt: 0, ph: rnd(0, TAU),
      depth: rnd(0.7, 1), pat: PATTERNS[i % PATTERNS.length], flee: 0, lure: null };
  }

  function makePads() {
    pads.length = 0;
    const count = W * H > 1.6e6 ? 7 : 5;
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0;
      for (let t = 0; t < 30; t++) {
        x = Math.random() * W; y = Math.random() * H;
        if (!(x > W * 0.3 && x < W * 0.7 && y > H * 0.2 && y < H * 0.8)) break;
      }
      const r = rnd(32, 60), flower = i < 2;
      pads.push({ x, y, r, a: rnd(0, TAU), dx: rnd(-4, 4), dy: rnd(-3, 3), vx: 0, vy: 0, va: rnd(-0.03, 0.03),
        bob: rnd(0, TAU), spr: padSprite(r, flower) });
    }
    for (const p of pads) { p.vx = p.dx; p.vy = p.dy; }
  }

  const widthAt = (f, t) => f.L * (t < 0.18 ? 0.07 + 0.45 * t : 0.15 * Math.pow(1 - (t - 0.18) / 0.82, 1.1) + 0.012);
  function spinePt(f, si) {
    const i = clamp(Math.floor(si), 0, f.n - 2), u = si - i, a = f.sp[i], b = f.sp[i + 1];
    const ang = Math.atan2(a[1] - b[1], a[0] - b[0]);
    return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, ang, nx: -Math.sin(ang), ny: Math.cos(ang), w: widthAt(f, si / (f.n - 1)) };
  }

  // ---- simulation ----------------------------------------------------------
  function update(dt) {
    for (const f of fish) {
      const h = f.sp[0];
      let dx = Math.cos(f.a), dy = Math.sin(f.a);
      const m = 110;
      if (h[0] < m) dx += ((m - h[0]) / m) * 2.4; if (h[0] > W - m) dx -= ((h[0] - (W - m)) / m) * 2.4;
      if (h[1] < m) dy += ((m - h[1]) / m) * 2.4; if (h[1] > H - m) dy -= ((h[1] - (H - m)) / m) * 2.4;
      for (const o of fish) {
        if (o === f) continue;
        const ex = h[0] - o.sp[0][0], ey = h[1] - o.sp[0][1], dd = Math.hypot(ex, ey);
        if (dd > 0 && dd < f.L * 0.7) { dx += (ex / dd) * 0.8; dy += (ey / dd) * 0.8; }
      }
      let tgt = null, slow = 1;
      if (f.flee > 0) { f.flee -= dt; dx += Math.cos(f.fleeA) * 3; dy += Math.sin(f.fleeA) * 3; }
      else if (f.lure && f.lure.t > 0) { tgt = f.lure; f.lure.t -= dt; }
      else if (T - ptr.t < 4 && Math.hypot(ptr.x - h[0], ptr.y - h[1]) < 380) tgt = ptr;
      if (tgt) {
        const ex = tgt.x - h[0], ey = tgt.y - h[1], dd = Math.hypot(ex, ey) || 1, w = dd < 70 ? 0.3 : 1.4;
        dx += (ex / dd) * w; dy += (ey / dd) * w; if (dd < 90) slow = 0.45;
      }
      f.wt = clamp(f.wt * 0.995 + (Math.random() - 0.5) * 2.4 * dt, -0.9, 0.9);
      const maxT = (f.flee > 0 ? 3.4 : 1.8) * dt;
      f.a = wrapA(f.a + clamp(wrapA(Math.atan2(dy, dx) - f.a), -maxT, maxT) + f.wt * dt);
      const tv = f.flee > 0 ? 230 : f.base * slow * (tgt ? 1.25 : 1);
      f.v += (tv - f.v) * Math.min(1, dt * (f.flee > 0 ? 6 : 1.2));
      f.ph += dt * (3 + f.v / 22);
      const ma = f.a + Math.sin(f.ph) * 0.22;
      h[0] = clamp(h[0] + Math.cos(ma) * f.v * dt, -40, W + 40);
      h[1] = clamp(h[1] + Math.sin(ma) * f.v * dt, -40, H + 40);
      let back = ma + Math.PI;
      for (let k = 1; k < f.n; k++) {
        const p = f.sp[k], q = f.sp[k - 1];
        let ang = Math.atan2(p[1] - q[1], p[0] - q[0]);
        const bend = wrapA(ang - back);
        if (Math.abs(bend) > MAXB) ang = back + Math.sign(bend) * MAXB;
        p[0] = q[0] + Math.cos(ang) * f.seg; p[1] = q[1] + Math.sin(ang) * f.seg; back = ang;
      }
    }
    for (const p of pads) {
      p.vx += (p.dx - p.vx) * 0.25 * dt; p.vy += (p.dy - p.vy) * 0.25 * dt; p.va *= 1 - 0.3 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.va * dt;
      if (p.x < -p.r) p.x = W + p.r; else if (p.x > W + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = H + p.r; else if (p.y > H + p.r) p.y = -p.r;
    }
    for (const r of ripples) r.t += dt;
    while (ripples.length && ripples[0].t > ripples[0].life) ripples.shift();
    if (T > nextAmb) {
      const f = fish[(Math.random() * fish.length) | 0];
      const at = Math.random() < 0.6 && f ? f.sp[0] : [Math.random() * W, Math.random() * H];
      ripples.push({ x: at[0], y: at[1], t: 0, life: 1.6, R: 55, s: 0.6 });
      nextAmb = T + rnd(2.5, 6);
    }
  }

  // ---- drawing -------------------------------------------------------------
  function bodyPath(f, ox, oy) {
    const n = f.n, sp = f.sp, left = [], right = [];
    for (let k = 0; k < n; k++) {
      const p = sp[k], q = sp[Math.min(n - 1, k + 1)], r = sp[Math.max(0, k - 1)];
      let tx = r[0] - q[0], ty = r[1] - q[1];
      const d = Math.hypot(tx, ty) || 1; tx /= d; ty /= d;
      const w = widthAt(f, k / (n - 1));
      left.push([p[0] - ty * w + ox, p[1] + tx * w + oy]);
      right.push([p[0] + ty * w + ox, p[1] - tx * w + oy]);
    }
    const fa = Math.atan2(sp[0][1] - sp[1][1], sp[0][0] - sp[1][0]);
    g.beginPath();
    g.moveTo(left[0][0], left[0][1]);
    for (let k = 1; k < n; k++) g.lineTo(left[k][0], left[k][1]);
    for (let k = n - 1; k >= 0; k--) g.lineTo(right[k][0], right[k][1]);
    g.arc(sp[0][0] + ox, sp[0][1] + oy, widthAt(f, 0), fa - Math.PI / 2, fa + Math.PI / 2);
    g.closePath();
  }

  function tailPath(f, ox, oy) {
    const p = f.sp[f.n - 1], q = f.sp[f.n - 3];
    const A = Math.atan2(p[1] - q[1], p[0] - q[0]) + Math.sin(f.ph + 1.2) * 0.35, len = f.L * 0.26;
    const P = (da, d) => [p[0] + Math.cos(A + da) * d + ox, p[1] + Math.sin(A + da) * d + oy];
    g.beginPath(); g.moveTo(...P(0, 0));
    g.quadraticCurveTo(...P(-0.2, len * 0.6), ...P(-0.5, len));
    g.quadraticCurveTo(...P(-0.1, len * 0.78), ...P(0, len * 0.66));
    g.quadraticCurveTo(...P(0.1, len * 0.78), ...P(0.5, len));
    g.quadraticCurveTo(...P(0.2, len * 0.6), ...P(0, 0));
  }

  function fins(f, col) {
    const sw = Math.sin(f.ph * 0.5) * 0.3;
    for (const [si, len] of [[2.4, f.L * 0.17], [6, f.L * 0.09]]) {
      const s = spinePt(f, si);
      for (const side of [-1, 1]) {
        const a = s.ang + side * (Math.PI / 2 + 0.55 + sw), rx = s.x + side * s.nx * s.w * 0.75, ry = s.y + side * s.ny * s.w * 0.75;
        g.beginPath();
        g.ellipse(rx + Math.cos(a) * len * 0.5, ry + Math.sin(a) * len * 0.5, len * 0.5, len * 0.22, a, 0, TAU);
        g.fillStyle = col; g.fill();
      }
    }
  }

  function drawShadow(f) {
    g.globalAlpha = (darkMode ? 0.3 : 0.15) * f.depth;
    g.fillStyle = darkMode ? '#020908' : '#0b2826';
    bodyPath(f, 14, 20); g.fill(); tailPath(f, 14, 20); g.fill();
  }

  function drawFish(f) {
    const base = 0.65 + 0.35 * f.depth;
    const bf = f.pat.body;
    g.globalAlpha = base * 0.62; fins(f, bf); tailPath(f, 0, 0); g.fillStyle = bf; g.fill();
    g.globalAlpha = base;
    bodyPath(f, 0, 0); g.fillStyle = bf; g.fill();
    g.strokeStyle = darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(20, 30, 30, 0.14)';
    g.lineWidth = 1.2; g.stroke();
    g.save(); g.clip();
    for (const [si, off, rr, col] of f.pat.spots) {
      const s = spinePt(f, si);
      g.beginPath(); g.ellipse(s.x + s.nx * off * s.w, s.y + s.ny * off * s.w, rr * f.L, rr * f.L * 0.72, s.ang, 0, TAU);
      g.fillStyle = col; g.fill();
    }
    g.strokeStyle = `rgba(255, 255, 255, ${f.pat.sheen || 0.22})`; g.lineWidth = f.L * 0.035; g.lineCap = 'round';
    g.beginPath(); g.moveTo(f.sp[1][0], f.sp[1][1]);
    for (let k = 2; k < f.n - 2; k++) g.lineTo(f.sp[k][0], f.sp[k][1]);
    g.stroke();
    g.restore();
    const e = spinePt(f, 0.5);
    // Delicate pale iris ring so eyes are clearly visible & lifelike across all fish:
    g.fillStyle = 'rgba(255, 255, 255, 0.65)';
    for (const side of [-1, 1]) {
      g.beginPath();
      g.arc(e.x + side * e.nx * e.w * 0.72, e.y + side * e.ny * e.w * 0.72, f.L * 0.021, 0, TAU);
      g.fill();
    }
    // Crisp dark pupil:
    g.fillStyle = 'rgba(14, 14, 16, 0.9)';
    for (const side of [-1, 1]) {
      g.beginPath();
      g.arc(e.x + side * e.nx * e.w * 0.72, e.y + side * e.ny * e.w * 0.72, f.L * 0.016, 0, TAU);
      g.fill();
    }
  }

  function draw() {
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.drawImage(bed, 0, 0);
    g.setTransform(S, 0, 0, S, 0, 0);
    g.fillStyle = darkMode ? 'rgba(2, 10, 8, 0.3)' : 'rgba(10, 40, 36, 0.17)';
    for (const p of pads) { g.beginPath(); g.ellipse(p.x + 10, p.y + 14, p.r, p.r * 0.92, 0, 0, TAU); g.fill(); }
    for (const f of fish) drawShadow(f);
    for (const f of fish) drawFish(f);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter';
    for (const [sc, vx, vy, al] of [[1.7, 9, 5, darkMode ? 0.06 : 0.1], [2.6, -6, 8, darkMode ? 0.04 : 0.075]]) {
      causPat.setTransform(new DOMMatrix().translate(T * vx * K(), T * vy * K()).scale(sc * K()));
      g.globalAlpha = al; g.fillStyle = causPat; g.fillRect(0, 0, cv.width, cv.height);
    }
    g.globalCompositeOperation = 'source-over';
    g.setTransform(S, 0, 0, S, 0, 0);
    for (const r of ripples) {
      const k0 = r.t / r.life;
      for (let j = 0; j < 3; j++) {
        const k = k0 - j * 0.13; if (k <= 0 || k >= 1) continue;
        const rad = k * r.R;
        g.globalAlpha = (1 - k) * 0.35 * r.s; g.strokeStyle = darkMode ? '#0a2924' : '#123c38'; g.lineWidth = 2;
        g.beginPath(); g.arc(r.x + 1.5, r.y + 2, rad, 0, TAU); g.stroke();
        g.globalAlpha = (1 - k) * 0.7 * r.s; g.strokeStyle = darkMode ? '#8bf0d4' : '#f0fffa'; g.lineWidth = 2.4 * (1 - k) + 0.6;
        g.beginPath(); g.arc(r.x, r.y, rad, 0, TAU); g.stroke();
      }
    }
    g.globalAlpha = 1;
    for (const p of pads) {
      const sz = p.spr.width / S, b = 1 + 0.015 * Math.sin(T * 0.8 + p.bob);
      g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.scale(b, b);
      g.drawImage(p.spr, -sz / 2, -sz / 2, sz, sz); g.restore();
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < 14) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; T += dt;
    update(dt); draw();
  }

  // ---- events --------------------------------------------------------------
  function onMove(e) { ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = T; }
  function onDown(e) {
    if (!styleEl || styleEl.disabled) return;
    const x = e.clientX, y = e.clientY;
    ripples.push({ x, y, t: 0, life: 1.7, R: 170, s: 1 });
    for (const f of fish) {
      const h = f.sp[0], dd = Math.hypot(h[0] - x, h[1] - y);
      if (dd < 170) { f.flee = rnd(1.2, 2); f.fleeA = Math.atan2(h[1] - y, h[0] - x) + rnd(-0.4, 0.4); f.lure = null; }
      else if (dd < 520) f.lure = { x, y, t: rnd(2.5, 4) };
    }
    for (const p of pads) {
      const ex = p.x - x, ey = p.y - y, dd = Math.hypot(ex, ey) || 1;
      if (dd < 260) { const k = 40 * (1 - dd / 260); p.vx += (ex / dd) * k; p.vy += (ey / dd) * k; p.va += rnd(-0.3, 0.3); }
    }
  }
  function resize() {
    const ow = W || innerWidth, oh = H || innerHeight;
    W = innerWidth; H = innerHeight; S = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.max(1, Math.round(W * S)); cv.height = Math.max(1, Math.round(H * S));
    bed = makeBed(cv.width, cv.height);
    if (causPat) draw();
    for (const p of pads) { p.x *= W / ow; p.y *= H / oh; }
  }

  function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  function mount() {
    styleEl = document.createElement('style'); styleEl.id = 'cs-style'; styleEl.textContent = css;
    document.head.appendChild(styleEl);
    backdrop = document.createElement('div'); backdrop.id = 'cs-backdrop';
    cv = document.createElement('canvas'); cv.id = 'cs-pond'; backdrop.appendChild(cv);
    document.body.prepend(backdrop);
    g = cv.getContext('2d', { alpha: false });
    resize();
    causPat = g.createPattern(makeCaustics(), 'repeat');
    const count = W * H > 1.6e6 ? 8 : 7;
    for (let i = 0; i < count; i++) fish.push(makeFish(i));
    fish.sort((a, b) => a.depth - b.depth);
    makePads();

    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    addEventListener('resize', resize);
    update(0.033); draw(); start();
    window.__antigravityKoiState = 'on';
  }

  let glassA = darkMode ? 0.6 : 0.5, toastT = 0;
  function setGlass(a) {
    glassA = Math.round(clamp(a, 0.2, 0.95) * 100) / 100;
    document.documentElement.style.setProperty('--cs-a', String(glassA));
    let t = document.getElementById('cs-toast');
    if (!t) { t = document.createElement('div'); t.id = 'cs-toast'; document.body.appendChild(t); }
    t.textContent = `Glass Opacity: ${Math.round(glassA * 100)}%`; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1200);
  }

  const onKey = (e) => {
    // Ctrl+Alt+Up / Down: adjust glass opacity
    if (e.ctrlKey && e.altKey && (e.code === 'ArrowUp' || e.code === 'ArrowDown') && styleEl && !styleEl.disabled) {
      e.preventDefault(); setGlass(glassA + (e.code === 'ArrowUp' ? 0.05 : -0.05)); return;
    }
    // Ctrl+Alt+G: toggle theme on/off
    if (e.ctrlKey && e.altKey && e.code === 'KeyG' && styleEl) {
      styleEl.disabled = !styleEl.disabled;
      backdrop.style.display = styleEl.disabled ? 'none' : '';
      if (styleEl.disabled) stop(); else start();
      let t = document.getElementById('cs-toast');
      if (!t) { t = document.createElement('div'); t.id = 'cs-toast'; document.body.appendChild(t); }
      t.textContent = `Koi Pond: ${styleEl.disabled ? 'OFF' : 'ON'}`; t.classList.add('show');
      clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1200);
    }
  };

  addEventListener('keydown', onKey, true);

  window.__antigravityKoiCleanup = () => {
    removeEventListener('keydown', onKey, true);
    removeEventListener('pointermove', onMove);
    removeEventListener('pointerdown', onDown);
    removeEventListener('resize', resize);
    stop(); clearTimeout(toastT);
    document.documentElement.style.removeProperty('--cs-a');
    for (const el of document.querySelectorAll('[id^="cs-"]')) el.remove();
    window.__antigravityKoi = false; window.__antigravityKoiState = 'off';
    console.log('[Koi Pond] Uninstalled completely.');
  };

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount, { once: true });
  console.log('[Koi Pond] Mounted successfully! Use Ctrl+Alt+Up/Down to tune glass, Ctrl+Alt+G to toggle.');
})();
