// Antigravity App Koi Theme Injector (Authentic ClaudeSkin Fish & Enhanced Controls Edition)

import fs from 'node:fs';
import path from 'node:path';

const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
const activePortFile = path.join(appData, 'Antigravity', 'DevToolsActivePort');
if (!fs.existsSync(activePortFile)) {
  console.log('[FAIL] Antigravity App is not running or DevToolsActivePort not found at:', activePortFile);
  process.exit(1);
}

const portInfo = fs.readFileSync(activePortFile, 'utf8').split('\n');
const port = portInfo[0].trim();
console.log('[INFO] Detected Antigravity App DevTools port:', port);

const list = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json()).catch(() => null);
if (!list) {
  console.log('[FAIL] Could not connect to Antigravity App on port ' + port);
  process.exit(1);
}

const targets = list.filter(t => t.type === 'page' && t.url.includes('127.0.0.1'));
if (targets.length === 0) {
  console.log('[FAIL] No active Antigravity App page window found.');
  process.exit(1);
}

console.log(`[INFO] Found ${targets.length} Antigravity App window(s).`);

const KOI_PAYLOAD = `(() => {
  if (typeof window.__antigravityKoiCleanup === 'function') {
    window.__antigravityKoiCleanup();
  }
  window.__antigravityKoi = true;

  const isDark = () => {
    if (document.body.classList.contains('theme-light')) return false;
    if (document.body.classList.contains('theme-dark') || 
        document.body.classList.contains('dark') || 
        document.documentElement.classList.contains('dark')) return true;
    return matchMedia('(prefers-color-scheme: dark)').matches;
  };

  let currentDark = isDark();
  let sheetA = 0.00; // Default sheet glass: 0% (clear, no haze)
  let brightness = 1.0;

  const css = \`
/* ============================================================ */
/* CSS VARIABLES & COLOR SCHEME                                 */
/* ============================================================ */
:root {
  --cs-sheet-a: 0.00;
  --cs-bubble-a: 0.50;
  --cs-b: 1.00;
}

:root,
body:not(.dark),
body.theme-light {
  /* Typography: serene sage/pine ink */
  --foreground: #1c3631 !important;
  --primary: #1c3631 !important;
  --primary-foreground: #ffffff !important;
  --secondary-foreground: #2d4c46 !important;
  --muted-foreground: #385952 !important;
  --link: #145248 !important;
  --code-foreground: #1c3631 !important;

  /* Left Sidebar & Toggle Side Panel: +20% Glass Opacity (0.65) */
  --cs-sidebar-glass-bg: rgba(220, 240, 234, 0.65);
  --cs-sidebar-blur: blur(20px);

  /* Chat Sheet Base RGB & Borders */
  --cs-sheet-rgb: 235 248 244;
  --cs-bubble-rgb: 255 255 255;
  --cs-border-col: rgba(255, 255, 255, 0.48);
  --cs-edge-highlight: rgba(255, 255, 255, 0.70);
  --cs-shadow-col: rgba(12, 48, 44, 0.08);

  --shell: transparent !important;
  --sidebar: transparent !important;
  --sidebar-secondary: transparent !important;
  --sidebar-muted: transparent !important;
  --card: transparent !important;
  --glass: transparent !important;
  --muted: rgba(220, 240, 234, 0.30) !important;

  --border: rgba(255, 255, 255, 0.40) !important;
  --glass-border: rgba(255, 255, 255, 0.40) !important;
  --card-border: rgba(255, 255, 255, 0.45) !important;
  --ag-border: rgba(255, 255, 255, 0.40) !important;

  /* Tranquil morning sage-mint pond base */
  --ag-backdrop-bg: #a3d2c5 !important;

  /* Dialogs / settings */
  --ag-modal-bg: rgba(255, 255, 255, 0.96) !important;
  --ag-modal-sidebar-bg: #eef6f3 !important;
}

body.dark, html.dark, .dark, body.theme-dark {
  /* Left Sidebar & Toggle Side Panel: +20% Glass Opacity in Dark (0.85) */
  --cs-sidebar-glass-bg: rgba(14, 28, 26, 0.85);
  --cs-sidebar-blur: blur(20px);

  --cs-sheet-rgb: 18 36 32;
  --cs-bubble-rgb: 24 48 42;
  --cs-border-col: rgba(255, 255, 255, 0.16);
  --cs-edge-highlight: rgba(255, 255, 255, 0.25);
  --cs-shadow-col: rgba(0, 0, 0, 0.35);

  --ag-modal-bg: #121816;
  --ag-modal-sidebar-bg: #0d1210;
  --ag-border: rgba(255, 255, 255, 0.12);
  --ag-backdrop-bg: #0a2420;

  --shell: transparent !important;
  --sidebar: transparent !important;
  --sidebar-secondary: transparent !important;
  --sidebar-muted: transparent !important;
  --card: transparent !important;
  --glass: transparent !important;
  --border: var(--ag-border) !important;
  --glass-border: var(--ag-border) !important;
}

/* ============================================================ */
/* SHELL TRANSPARENCY & WRAPPERS (ZERO INTERMEDIATE HAZE)       */
/* ============================================================ */
body,
#root,
.agy-shell,
.agy-shell > div,
.agy-inset-shell,
.agy-inset-shell > div,
.agy-inset-shell > div:first-child,
.agy-inset-shell > div:first-child > div:nth-child(3),
div.bg-sidebar {
  background-color: transparent !important;
  backdrop-filter: none !important;
}

:root {
  --background: transparent !important;
  --shell-canvas: transparent !important;
}

/* Top header / title bar */
.agy-shell > div.shrink-0:first-child {
  background-color: transparent !important;
  backdrop-filter: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.20) !important;
}

.agy-shell > div.shrink-0:first-child div.bg-sidebar {
  background-color: transparent !important;
  backdrop-filter: none !important;
}

/* Hover highlights on sidebar buttons/items */
div.bg-sidebar button:hover,
div.bg-sidebar [role="button"]:hover,
div.bg-sidebar [class*="hover:bg-"]:hover {
  background-color: rgba(255, 255, 255, 0.25) !important;
  border-radius: 8px !important;
}

/* ============================================================ */
/* 1. SIDEBAR BÊN TRÁI: +20% GLASS (0.65) - RÕ CHỮ & CODE HƠN  */
/* ============================================================ */
.agy-inset-shell > div:first-child > div:first-child {
  background-color: var(--cs-sidebar-glass-bg) !important;
  backdrop-filter: var(--cs-sidebar-blur) !important;
  border-radius: 16px !important;
  border: 1px solid var(--cs-border-col) !important;
  box-shadow: inset 0 1px 0 var(--cs-edge-highlight), 0 6px 24px var(--cs-shadow-col) !important;
  margin: 6px 0 6px 6px !important;
  overflow: hidden !important;
}

/* ============================================================ */
/* 2. PHẦN NỘI DUNG CHÍNH                                       */
/* ============================================================ */

/* Main outer sheet container: transparent wrapper for floating cards */
.agy-sheet {
  background-color: transparent !important;
  backdrop-filter: none !important;
  border: none !important;
  box-shadow: none !important;
  margin: 6px 6px 6px 6px !important;
}

/* 2A. NỀN CỦA PHẦN TIN NHẮN (LỚP NGAY DƯỚI TIN NHẮN)           */
.agy-sheet > div.relative.flex.w-full.h-full.outline-none > div.flex:first-child,
.agy-sheet:not(:has(> div.relative.flex.w-full.h-full.outline-none)) {
  background-color: rgb(var(--cs-sheet-rgb) / var(--cs-sheet-a)) !important;
  backdrop-filter: blur(calc(var(--cs-sheet-a) * 24px)) !important;
  border-radius: 18px !important;
  border: 1px solid var(--cs-border-col) !important;
  box-shadow: inset 0 1px 0 var(--cs-edge-highlight), 0 8px 32px var(--cs-shadow-col) !important;
  overflow: hidden !important;
}

/* 2B. TONGGEL SIDE PANEL: +20% GLASS (0.65) Y HỆT SIDEBAR TRÁI */
.agy-sheet > div.relative.flex.w-full.h-full.outline-none > div:nth-child(3),
.agy-sheet > div.relative.flex.w-full.h-full.outline-none > div:has(.agy-layout-vars),
.agy-sheet > div.relative.flex.w-full.h-full.outline-none > div:has(.agy-aux-tab) {
  background-color: var(--cs-sidebar-glass-bg) !important;
  backdrop-filter: var(--cs-sidebar-blur) !important;
  border-radius: 16px !important;
  border: 1px solid var(--cs-border-col) !important;
  box-shadow: inset 0 1px 0 var(--cs-edge-highlight), 0 6px 24px var(--cs-shadow-col) !important;
  margin-left: 6px !important;
  overflow: hidden !important;
}

.agy-layout-vars {
  border-bottom: 1px solid var(--cs-border-col) !important;
  background-color: transparent !important;
}

.file-viewer-root,
.agy-sheet [class*="file-viewer"] {
  background-color: transparent !important;
}

/* 2C. HỘP GÕ TIN NHẮN: GIỮ NGUYÊN MÀU (SOLID WHITE PILL)       */
.agy-inset-shell div:has(> textarea),
.agy-inset-shell div:has(> [contenteditable="true"]) {
  background: #ffffff !important;
  border-radius: 9999px !important;
  border: 1px solid rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 4px 24px rgba(12, 48, 44, 0.10), 0 1px 3px rgba(0,0,0,0.05) !important;
  color: #1c3631 !important;
  padding: 4px 12px !important;
}

body.dark .agy-inset-shell div:has(> textarea),
body.dark .agy-inset-shell div:has(> [contenteditable="true"]) {
  background: #182824 !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: #e2f5ee !important;
}

.agy-inset-shell textarea,
.agy-inset-shell [contenteditable="true"] {
  color: inherit !important;
  background: transparent !important;
}

.agy-inset-shell textarea::placeholder,
.agy-inset-shell [contenteditable="true"]::placeholder {
  color: #557870 !important;
}

/* 2D. TIN NHẮN, SUY LUẬN & CONVERSATION TITLE                     */
/* Glass LUÔN cao hơn nền phần tin nhắn khoảng 50%               */
.agy-user-bubble-frame {
  background: transparent !important;
  border: none !important;
}

/* User Message Bubble */
.agy-user-bubble {
  background-color: rgba(255, 255, 255, var(--cs-bubble-a)) !important;
  border-radius: 20px !important;
  border: 1px solid var(--cs-border-col) !important;
  box-shadow: inset 0 1px 0 var(--cs-edge-highlight), 0 6px 20px var(--cs-shadow-col) !important;
  backdrop-filter: blur(calc(var(--cs-bubble-a) * 18px)) !important;
  padding: 10px 16px !important;
  color: var(--foreground) !important;
}

/* Assistant Message Bubble */
.agy-sheet div.text-base.leading-relaxed {
  background-color: rgba(255, 255, 255, calc(var(--cs-bubble-a) * 0.90)) !important;
  border-radius: 20px !important;
  border: 1px solid var(--cs-border-col) !important;
  box-shadow: inset 0 1px 0 var(--cs-edge-highlight), 0 6px 20px var(--cs-shadow-col) !important;
  backdrop-filter: blur(calc(var(--cs-bubble-a) * 18px)) !important;
  padding: 16px 20px !important;
  color: var(--foreground) !important;
}

/* PHẦN SUY LUẬN (THINKING / REASONING BLOCK): Glass y hệt ô tin nhắn */
div[data-step-list="true"],
div:has(> [data-testid="worked-for-collapsible"]) {
  background-color: rgba(255, 255, 255, var(--cs-bubble-a)) !important;
  border-radius: 16px !important;
  border: 1px solid var(--cs-border-col) !important;
  box-shadow: inset 0 1px 0 var(--cs-edge-highlight), 0 6px 20px var(--cs-shadow-col) !important;
  backdrop-filter: blur(calc(var(--cs-bubble-a) * 18px)) !important;
  padding: 4px 10px !important;
  margin: 6px 0 !important;
  color: var(--foreground) !important;
}

div[data-step-list="true"] [data-step-rows="true"] {
  background-color: transparent !important;
}

/* CONVERSATION TITLE (NGAY Ô NỘI DUNG): Glass y hệt ô tin nhắn */
.agy-sheet > div.relative.flex > div.flex:first-child .agy-layout-vars > div.flex.items-center.min-w-0,
.agy-sheet .agy-layout-vars > div.flex.items-center.min-w-0 {
  background-color: rgba(255, 255, 255, var(--cs-bubble-a)) !important;
  border-radius: 9999px !important;
  border: 1px solid var(--cs-border-col) !important;
  box-shadow: inset 0 1px 0 var(--cs-edge-highlight), 0 4px 16px var(--cs-shadow-col) !important;
  backdrop-filter: blur(calc(var(--cs-bubble-a) * 18px)) !important;
  padding: 2px 10px !important;
  color: var(--foreground) !important;
}

/* Dark mode overrides for Bubbles, Thinking & Title */
body.dark .agy-user-bubble,
body.dark div[data-step-list="true"],
body.dark div:has(> [data-testid="worked-for-collapsible"]),
body.dark .agy-sheet > div.relative.flex > div.flex:first-child .agy-layout-vars > div.flex.items-center.min-w-0,
body.dark .agy-sheet .agy-layout-vars > div.flex.items-center.min-w-0 {
  background-color: rgba(24, 48, 42, var(--cs-bubble-a)) !important;
}

body.dark .agy-sheet div.text-base.leading-relaxed {
  background-color: rgba(20, 42, 38, calc(var(--cs-bubble-a) * 0.90)) !important;
}

/* Code & card elements */
.agy-sheet pre,
.agy-sheet .files-changed-header {
  background-color: rgba(255, 255, 255, calc(var(--cs-bubble-a) * 0.95)) !important;
  border-radius: 14px !important;
  border: 1px solid var(--cs-border-col) !important;
  box-shadow: inset 0 1px 0 var(--cs-edge-highlight) !important;
}

body.dark .agy-sheet pre,
body.dark .agy-sheet .files-changed-header {
  background-color: rgba(14, 28, 24, calc(var(--cs-bubble-a) * 0.95)) !important;
}

/* ============================================================ */
/* 3. ENHANCED ICONS & CONTROLS (TINH CHỈNH DỄ NHÌN, TONE CHUẨN) */
/* ============================================================ */

/* 3A. TOP MENU BAR BUTTONS: "View", "Window", "Antigravity", "Workspace" */
div.flex.items-center.gap-1.px-2.h-full.bg-sidebar.w-full button,
.agy-shell > div.shrink-0:first-child button {
  color: #1c3631 !important;
  background: rgba(255, 255, 255, 0.38) !important;
  border: 1px solid rgba(255, 255, 255, 0.50) !important;
  border-radius: 7px !important;
  padding: 2px 10px !important;
  font-weight: 500 !important;
  transition: all 0.15s ease !important;
  box-shadow: 0 1px 3px rgba(12, 48, 44, 0.06) !important;
}

div.flex.items-center.gap-1.px-2.h-full.bg-sidebar.w-full button:hover,
.agy-shell > div.shrink-0:first-child button:hover {
  color: #0d2622 !important;
  background: rgba(255, 255, 255, 0.80) !important;
  border-color: rgba(255, 255, 255, 0.90) !important;
  box-shadow: 0 2px 8px rgba(12, 48, 44, 0.12) !important;
  transform: translateY(-1px);
}

/* 3B. TOGGLE OVERVIEW PANEL & TOGGLE SIDEBAR BUTTONS */
button[aria-label*="Overview"],
button[aria-label*="Toggle Side"],
button[aria-label*="Toggle side"],
button[title*="Overview"] {
  color: #1c3631 !important;
  background: rgba(255, 255, 255, 0.40) !important;
  border: 1px solid rgba(255, 255, 255, 0.55) !important;
  border-radius: 8px !important;
  transition: all 0.15s ease !important;
  box-shadow: 0 1px 3px rgba(12, 48, 44, 0.06) !important;
}

button[aria-label*="Overview"]:hover,
button[aria-label*="Toggle Side"]:hover,
button[aria-label*="Toggle side"]:hover,
button[title*="Overview"]:hover {
  color: #0b2420 !important;
  background: rgba(255, 255, 255, 0.85) !important;
  box-shadow: 0 2px 8px rgba(12, 48, 44, 0.14) !important;
  transform: translateY(-1px);
}

button[aria-label*="Overview"] svg,
button[aria-label*="Toggle Side"] svg,
button[aria-label*="Toggle side"] svg,
button[title*="Overview"] svg {
  fill: currentColor !important;
}

/* 3C. COPY BUTTONS (Message actions & code blocks) */
button[aria-label*="Copy"],
button[title*="Copy"],
button:has(svg):is([aria-label*="Copy"], [title*="Copy"]),
.agy-sheet pre button {
  color: #1c3631 !important;
  background: rgba(255, 255, 255, 0.45) !important;
  border: 1px solid rgba(255, 255, 255, 0.55) !important;
  border-radius: 7px !important;
  transition: all 0.15s ease !important;
  box-shadow: 0 1px 3px rgba(12, 48, 44, 0.06) !important;
}

button[aria-label*="Copy"]:hover,
button[title*="Copy"]:hover,
.agy-sheet pre button:hover {
  color: #0b2420 !important;
  background: rgba(255, 255, 255, 0.90) !important;
  box-shadow: 0 2px 8px rgba(12, 48, 44, 0.14) !important;
  transform: translateY(-1px);
}

button[aria-label*="Copy"] svg,
button[title*="Copy"] svg,
.agy-sheet pre button svg {
  fill: currentColor !important;
}

/* 3D. GOOD / BAD RESPONSE FEEDBACK BUTTONS */
button[aria-label="Good response"],
button[aria-label="Bad response"],
button[aria-label*="response"] {
  color: #1c3631 !important;
  background: rgba(255, 255, 255, 0.40) !important;
  border: 1px solid rgba(255, 255, 255, 0.55) !important;
  border-radius: 7px !important;
  transition: all 0.15s ease !important;
  box-shadow: 0 1px 3px rgba(12, 48, 44, 0.06) !important;
}

button[aria-label="Good response"] svg,
button[aria-label="Bad response"] svg,
button[aria-label*="response"] svg {
  fill: currentColor !important;
}

/* Good response hover: Tranquil fresh mint highlight */
button[aria-label="Good response"]:hover {
  background: rgba(186, 235, 218, 0.92) !important;
  border-color: rgba(60, 160, 135, 0.55) !important;
  color: #0c4d40 !important;
  box-shadow: 0 2px 8px rgba(12, 75, 60, 0.16) !important;
  transform: translateY(-1px);
}

/* Bad response hover: Gentle soft coral highlight */
button[aria-label="Bad response"]:hover {
  background: rgba(252, 222, 218, 0.92) !important;
  border-color: rgba(220, 100, 90, 0.55) !important;
  color: #8b251e !important;
  box-shadow: 0 2px 8px rgba(120, 30, 20, 0.16) !important;
  transform: translateY(-1px);
}

/* 3E. DARK MODE OVERRIDES FOR BUTTONS & ICONS */
body.dark div.flex.items-center.gap-1.px-2.h-full.bg-sidebar.w-full button,
body.dark .agy-shell > div.shrink-0:first-child button,
body.dark button[aria-label*="Overview"],
body.dark button[aria-label*="Toggle Side"],
body.dark button[aria-label*="Toggle side"],
body.dark button[aria-label*="Copy"],
body.dark button[title*="Copy"],
body.dark button[aria-label*="response"] {
  color: #cbe6dd !important;
  background: rgba(22, 48, 44, 0.65) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

body.dark button[aria-label*="Overview"]:hover,
body.dark button[aria-label*="Toggle Side"]:hover,
body.dark button[aria-label*="Copy"]:hover {
  color: #ffffff !important;
  background: rgba(32, 68, 62, 0.85) !important;
}

body.dark button[aria-label="Good response"]:hover {
  background: rgba(30, 80, 70, 0.85) !important;
  color: #9fe2d0 !important;
}

body.dark button[aria-label="Bad response"]:hover {
  background: rgba(85, 30, 28, 0.85) !important;
  color: #f7a8a0 !important;
}

/* Dropdown / context menu / environment picker card */
div[data-side],
[role="menu"],
[role="listbox"],
[data-radix-popper-content-wrapper] > div {
  background-color: var(--cs-sidebar-glass-bg) !important;
  border-radius: 14px !important;
  border: 1px solid var(--cs-border-col) !important;
  box-shadow: inset 0 1px 0 var(--cs-edge-highlight), 0 12px 32px rgba(12, 48, 44, 0.15) !important;
  backdrop-filter: var(--cs-sidebar-blur) !important;
  color: var(--foreground) !important;
}

/* Settings Modal: Solid and clean */
.agy-dialog,
.settings-modal-container,
[role="dialog"] {
  background-color: var(--ag-modal-bg) !important;
  opacity: 1 !important;
  backdrop-filter: blur(28px) !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--ag-border) !important;
}

.settings-modal-container .bg-background,
.settings-modal-container [class*="bg-background"],
[role="dialog"] .bg-background {
  background-color: var(--ag-modal-bg) !important;
}

.settings-modal-container .bg-sidebar,
.settings-modal-container [class*="bg-sidebar"],
[role="dialog"] .bg-sidebar {
  background-color: var(--ag-modal-sidebar-bg) !important;
}

/* ============================================================ */
/* BACKDROP CANVAS                                              */
/* ============================================================ */
#cs-backdrop {
  position: fixed;
  inset: 0;
  z-index: -1000;
  pointer-events: none;
  overflow: hidden;
  background: var(--ag-backdrop-bg);
  filter: brightness(var(--cs-b)) contrast(1.02);
  transition: filter 0.15s ease, background-color 0.3s ease;
}

#cs-pond {
  display: block;
  width: 100%;
  height: 100%;
}

#cs-toast {
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%);
  z-index: 2147483647;
  pointer-events: none;
  padding: 8px 22px;
  border-radius: 999px;
  background: rgba(28, 54, 49, 0.90);
  color: #f2fbf8;
  font: 500 13px system-ui, -apple-system, sans-serif;
  box-shadow: 0 6px 28px rgba(0,0,0,0.25);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  opacity: 0;
  transition: opacity .22s ease;
}
#cs-toast.show { opacity: 1; }
\`;

  // ==========================================================================
  // AUTHENTIC CLAUDESKIN KOI POND ENGINE (1:1 CODE FROM CLAUDESKIN)
  // ==========================================================================
  const TAU = Math.PI * 2;
  const MAXB = 0.36;                              // max bend per spine joint (rad)
  let S = 1;                                       // render scale = devicePixelRatio
  const K = () => S / 0.5;                          // sizes tuned at S = 0.5
  const rnd = (a, b) => a + Math.random() * (b - a);
  const wrapA = (a) => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let styleEl, backdrop, cv, g, bed, causPat, raf = 0, last = 0, T = 0, W = 0, H = 0, nextAmb = 2;
  const fish = [], pads = [], ripples = [];
  const ptr = { x: -1e4, y: -1e4, t: -1e9 };

  // ---- Pond Bed (Early Morning Sunlight & Crystalline Water) ---------------
  function makeBed(w, h) {
    const c = new OffscreenCanvas(w, h), x = c.getContext('2d');
    const gr = x.createLinearGradient(0, 0, w, h);
    if (currentDark) {
      gr.addColorStop(0, '#154039');
      gr.addColorStop(0.5, '#0e2b26');
      gr.addColorStop(1, '#091e1a');
    } else {
      // Early morning pond water: luminous, crystalline, soft morning sunbeam glow
      gr.addColorStop(0, '#caeae0');      // Fresh early morning water with sunlight reflection
      gr.addColorStop(0.38, '#a3d2c5');   // Crystal morning aqua-sage
      gr.addColorStop(0.72, '#82bdae');   // Serene clear pond teal
      gr.addColorStop(1, '#61a295');      // Gentle depth moss-teal
    }
    x.fillStyle = gr; x.fillRect(0, 0, w, h);

    // Early morning sunbeams (subtle warm light washing across the surface from top-left)
    if (!currentDark) {
      const sun = x.createRadialGradient(w * 0.20, h * 0.12, 0, w * 0.20, h * 0.12, Math.max(w, h) * 0.70);
      sun.addColorStop(0, 'rgba(238, 255, 248, 0.30)');
      sun.addColorStop(0.45, 'rgba(230, 252, 244, 0.12)');
      sun.addColorStop(1, 'rgba(230, 252, 244, 0)');
      x.fillStyle = sun; x.fillRect(0, 0, w, h);
    }

    for (let i = 0; i < 6; i++) {
      const cx = Math.random() * w, cy = Math.random() * h, r = rnd(0.15, 0.35) * Math.max(w, h);
      const rg = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      rg.addColorStop(0, currentDark ? 'rgba(8, 48, 42, 0.25)' : 'rgba(28, 82, 76, 0.08)');
      rg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      x.fillStyle = rg; x.fillRect(0, 0, w, h);
    }

    const n = Math.round((w * h) / (2400 * K() * K()));
    for (let i = 0; i < n; i++) {
      const k = Math.random(), r = rnd(1.5, 7) * K();
      x.fillStyle = currentDark 
        ? \`rgba(\${k < 0.5 ? '28, 62, 55' : '52, 85, 78'}, \${rnd(0.18, 0.40)})\`
        : \`rgba(\${k < 0.5 ? '102, 135, 126' : k < 0.8 ? '132, 159, 151' : '210, 232, 224'}, \${rnd(0.08, 0.20)})\`;
      x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, r, r * rnd(0.55, 0.9), rnd(0, TAU), 0, TAU); x.fill();
    }

    // Light morning vignette (much lighter so the pond stays open, bright & fresh)
    const v = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.40, w / 2, h / 2, Math.max(w, h) * 0.78);
    v.addColorStop(0, 'rgba(0, 0, 0, 0)');
    v.addColorStop(1, currentDark ? 'rgba(3, 14, 12, 0.35)' : 'rgba(18, 52, 50, 0.14)');
    x.fillStyle = v; x.fillRect(0, 0, w, h);
    return c;
  }

  // ---- Tileable Voronoi Caustics (from ClaudeSkin) -------------------------
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
      if (currentDark) {
        d[i] = 100; d[i + 1] = 240; d[i + 2] = 220; d[i + 3] = v * v * v * 150;
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

  // ---- Lily Pads (from ClaudeSkin) -----------------------------------------
  function padSprite(r, flower) {
    const R = Math.ceil(r * S), size = R * 2 + 6, c = new OffscreenCanvas(size, size), x = c.getContext('2d');
    x.translate(size / 2, size / 2);
    const notch = 0.34;
    x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, R, notch / 2, TAU - notch / 2); x.closePath();
    const gr = x.createRadialGradient(-R * 0.3, -R * 0.3, R * 0.1, 0, 0, R);
    gr.addColorStop(0, '#9ccc72'); gr.addColorStop(0.7, '#62a04c'); gr.addColorStop(1, '#40793a');
    x.fillStyle = gr; x.fill();
    x.strokeStyle = 'rgba(36, 76, 32, 0.55)'; x.lineWidth = Math.max(1, R * 0.04); x.stroke();
    x.strokeStyle = 'rgba(222, 242, 192, 0.38)'; x.lineWidth = Math.max(0.6, R * 0.025);
    for (let k = 0; k < 9; k++) {
      const a = notch / 2 + ((TAU - notch) * (k + 0.5)) / 9;
      x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a) * R * 0.92, Math.sin(a) * R * 0.92); x.stroke();
    }
    if (flower) {
      for (const [cnt, len, col, rot] of [[9, R * 0.62, '#f4bccd', 0], [7, R * 0.42, '#fbe1e9', 0.35]]) {
        for (let k = 0; k < cnt; k++) {
          x.save(); x.rotate(rot + (k * TAU) / cnt);
          x.beginPath(); x.ellipse(len * 0.5, 0, len * 0.5, len * 0.21, 0, 0, TAU);
          x.fillStyle = col; x.fill(); x.strokeStyle = 'rgba(196, 84, 118, 0.35)'; x.lineWidth = 0.8; x.stroke();
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

  const pick = (a) => a[(Math.random() * a.length) | 0];
  const REDS = ['#e2471f', '#d93a1c', '#e5531f', '#ec6a2a', '#c8321a'], INK = '#1c1c1e', WHITES = ['#f7f3ec', '#f8f5ef', '#f2ede4'];
  const GRADS = [['#5fd3c6', '#7a8cf0', '#d67ad8'], ['#f6c445', '#f07a3a', '#d8406a'], ['#bfe9f2', '#4fa3d9', '#2f5fa8'], ['#fbe3ea', '#f4a3bd', '#c95d8a'], ['#f3e7b0', '#9fd8a4', '#3f9c8c']];

  function getPattern(i) {
    const g0 = Math.random(), force = window.__koiForceRare;
    if (force === 'rainbow' || (!force && g0 < 0.005)) return { body: '#f4eee6', rare: 'rainbow', spots: [], sheen: 0.6 };
    if (force === 'gradient' || (!force && g0 < 0.035)) return { body: '#f4eee6', rare: 'gradient', grad: pick(GRADS), spots: [], sheen: 0.5 };
    return PATTERNS[i % PATTERNS.length];
  }

  function makeFish(i) {
    const L = rnd(95, 150), n = 12, seg = L / n;
    const x = rnd(0.12, 0.88) * W, y = rnd(0.12, 0.88) * H, a = rnd(-Math.PI, Math.PI);
    const sp = [];
    for (let k = 0; k < n; k++) sp.push([x - Math.cos(a) * seg * k, y - Math.sin(a) * seg * k]);
    return { L, n, seg, sp, a, v: rnd(28, 44), base: rnd(26, 44), wt: 0, ph: rnd(0, TAU),
      depth: rnd(0.68, 1), pat: getPattern(i), flee: 0, lure: null };
  }

  function makePads() {
    pads.length = 0;
    const count = W * H > 1.6e6 ? 7 : 6;
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0;
      for (let t = 0; t < 30; t++) {
        x = Math.random() * W; y = Math.random() * H;
        if (!(x > W * 0.28 && x < W * 0.78 && y > H * 0.18 && y < H * 0.82)) break;
      }
      const r = rnd(30, 58), flower = i < 2;
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

  // ---- ClaudeSkin Anatomical Body, Tail, Fins & Sheen ----------------------
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
    g.globalAlpha = 0.15 * f.depth; g.fillStyle = currentDark ? '#041210' : '#0b2826';
    bodyPath(f, 14, 20); g.fill(); tailPath(f, 14, 20); g.fill();
  }

  function bodyFill(f) {
    const p = f.pat; if (!p.rare) return p.body;
    const a = f.sp[0], z = f.sp[f.n - 1], lg = g.createLinearGradient(a[0], a[1], z[0], z[1]);
    if (p.rare === 'rainbow') { const h0 = (performance.now() / 30) % 360; for (let i = 0; i <= 6; i++) lg.addColorStop(i / 6, \`hsl(\${(h0 + i * 55) % 360}, 85%, 62%)\`); }
    else p.grad.forEach((col, i) => lg.addColorStop(i / (p.grad.length - 1), col));
    return lg;
  }

  function drawFish(f) {
    const base = 0.55 + 0.45 * f.depth;
    g.globalAlpha = base * 0.62; const bf = bodyFill(f); fins(f, bf); tailPath(f, 0, 0); g.fillStyle = bf; g.fill();
    g.globalAlpha = base;
    bodyPath(f, 0, 0); g.fillStyle = bf; g.fill();
    g.strokeStyle = currentDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(20, 30, 30, 0.14)'; g.lineWidth = 1.2; g.stroke();
    g.save(); g.clip();
    for (const [si, off, rr, col] of f.pat.spots) {
      const s = spinePt(f, si);
      g.beginPath(); g.ellipse(s.x + s.nx * off * s.w, s.y + s.ny * off * s.w, rr * f.L, rr * f.L * 0.72, s.ang, 0, TAU);
      g.fillStyle = col; g.fill();
    }
    g.strokeStyle = \`rgba(255, 255, 255, \${f.pat.sheen || 0.22})\`; g.lineWidth = f.L * 0.035; g.lineCap = 'round';
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

  // ---- Simulation (Undulation, Schooling, Surface Ripples) -----------------
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

  function draw() {
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.drawImage(bed, 0, 0);
    g.setTransform(S, 0, 0, S, 0, 0);
    g.fillStyle = currentDark ? 'rgba(4, 18, 16, 0.30)' : 'rgba(10, 40, 36, 0.17)';
    for (const p of pads) { g.beginPath(); g.ellipse(p.x + 10, p.y + 14, p.r, p.r * 0.92, 0, 0, TAU); g.fill(); }
    for (const f of fish) drawShadow(f);
    for (const f of fish) drawFish(f);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter';
    if (causPat) {
      for (const [sc, vx, vy, al] of [[1.7, 9, 5, 0.1], [2.6, -6, 8, 0.075]]) {
        causPat.setTransform(new DOMMatrix().translate(T * vx * K(), T * vy * K()).scale(sc * K()));
        g.globalAlpha = currentDark ? al * 0.8 : al; g.fillStyle = causPat; g.fillRect(0, 0, cv.width, cv.height);
      }
    }
    g.globalCompositeOperation = 'source-over';
    g.setTransform(S, 0, 0, S, 0, 0);
    for (const r of ripples) {
      const k0 = r.t / r.life;
      for (let j = 0; j < 3; j++) {
        const k = k0 - j * 0.13; if (k <= 0 || k >= 1) continue;
        const rad = k * r.R;
        g.globalAlpha = (1 - k) * 0.35 * r.s; g.strokeStyle = currentDark ? '#082822' : '#123c38'; g.lineWidth = 2;
        g.beginPath(); g.arc(r.x + 1.5, r.y + 2, rad, 0, TAU); g.stroke();
        g.globalAlpha = (1 - k) * 0.7 * r.s; g.strokeStyle = currentDark ? '#b0efe2' : '#f0fffa'; g.lineWidth = 2.4 * (1 - k) + 0.6;
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
    if (now - last < 13) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; T += dt;
    update(dt); draw();
  }

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
    causPat = g.createPattern(makeCaustics(), 'repeat');
    for (const p of pads) { p.x *= W / ow; p.y *= H / oh; }
  }

  function refreshThemeColors() {
    currentDark = isDark();
    bed = makeBed(cv.width, cv.height);
    causPat = g.createPattern(makeCaustics(), 'repeat');
    makePads();
  }

  let themeObserver = null;
  function watchThemeMode() {
    themeObserver = new MutationObserver(() => {
      const darkNow = isDark();
      if (darkNow !== currentDark) {
        refreshThemeColors();
        showToast(darkNow ? '🌙 Dark Mode: Jade Pond' : '☀️ Sage Mint Pond');
      }
    });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
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

    const count = W * H > 1.6e6 ? 8 : 7;
    for (let i = 0; i < count; i++) fish.push(makeFish(i));
    fish.sort((a, b) => a.depth - b.depth);
    makePads();

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('resize', resize);
    watchThemeMode();

    update(0.033); draw(); start();
    window.__antigravityKoiState = 'on';

    setGlass(sheetA, false);
    setBrightness(brightness, false);
  }

  let toastT = 0;
  function showToast(msg) {
    let t = document.getElementById('cs-toast');
    if (!t) { t = document.createElement('div'); t.id = 'cs-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1400);
  }

  function setGlass(a, notify = true) {
    sheetA = Math.round(clamp(a, 0.00, 0.50) * 100) / 100;
    const bubbleA = Math.round(Math.min(1.00, sheetA + 0.50) * 100) / 100;

    document.documentElement.style.setProperty('--cs-sheet-a', String(sheetA));
    document.documentElement.style.setProperty('--cs-bubble-a', String(bubbleA));
    if (document.body) {
      document.body.style.setProperty('--cs-sheet-a', String(sheetA));
      document.body.style.setProperty('--cs-bubble-a', String(bubbleA));
    }
    if (notify) {
      showToast(\`🔍 Nền chat: \${Math.round(sheetA * 100)}% | Tin nhắn: \${Math.round(bubbleA * 100)}%\`);
    }
  }

  function setBrightness(b, notify = true) {
    brightness = Math.round(clamp(b, 0.5, 2.0) * 100) / 100;
    document.documentElement.style.setProperty('--cs-b', String(brightness));
    if (document.body) {
      document.body.style.setProperty('--cs-b', String(brightness));
    }
    if (notify) showToast(\`☀️ Brightness: \${Math.round(brightness * 100)}%\`);
  }

  const onKey = (e) => {
    // Ctrl+Alt+Up / Down: adjust glass opacity of sheet (bubbles follow with +50%)
    if (e.ctrlKey && e.altKey && (e.code === 'ArrowUp' || e.code === 'ArrowDown') && styleEl && !styleEl.disabled) {
      e.preventDefault();
      setGlass(sheetA + (e.code === 'ArrowUp' ? 0.05 : -0.05));
      return;
    }
    // Ctrl+Alt+Right / Left: adjust brightness
    if (e.ctrlKey && e.altKey && (e.code === 'ArrowRight' || e.code === 'ArrowLeft') && styleEl && !styleEl.disabled) {
      e.preventDefault();
      setBrightness(brightness + (e.code === 'ArrowRight' ? 0.1 : -0.1));
      return;
    }
    // Ctrl+Alt+G: toggle theme on/off
    if (e.ctrlKey && e.altKey && e.code === 'KeyG' && styleEl) {
      styleEl.disabled = !styleEl.disabled;
      backdrop.style.display = styleEl.disabled ? 'none' : '';
      if (styleEl.disabled) stop(); else start();
      showToast(\`🎏 Koi Pond: \${styleEl.disabled ? 'OFF' : 'ON'}\`);
    }
  };

  window.addEventListener('keydown', onKey, true);

  window.__antigravityKoiCleanup = () => {
    window.removeEventListener('keydown', onKey, true);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onDown);
    window.removeEventListener('resize', resize);
    if (themeObserver) themeObserver.disconnect();
    stop(); clearTimeout(toastT);
    document.documentElement.style.removeProperty('--cs-sheet-a');
    document.documentElement.style.removeProperty('--cs-bubble-a');
    document.documentElement.style.removeProperty('--cs-b');
    if (document.body) {
      document.body.style.removeProperty('--cs-sheet-a');
      document.body.style.removeProperty('--cs-bubble-a');
      document.body.style.removeProperty('--cs-b');
    }
    for (const el of document.querySelectorAll('[id^="cs-"]')) el.remove();
    window.__antigravityKoi = false; window.__antigravityKoiState = 'off';
  };

  mount();
  return 'OK';
})()`;

for (const target of targets) {
  console.log(`[INFO] Injecting into: "${target.title}" (${target.id})`);
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: KOI_PAYLOAD,
          awaitPromise: true,
          returnByValue: true
        }
      }));
    };
    ws.onmessage = (e) => {
      const res = JSON.parse(e.data);
      if (res.error || res.result?.exceptionDetails) {
        console.error('[FAIL] Error injecting:', res.error || res.result?.exceptionDetails);
      } else {
        console.log('[SUCCESS] Applied +20% Side Glass & Enhanced Controls to Antigravity App!');
      }
      ws.close();
      resolve();
    };
    ws.onerror = (err) => {
      console.error('[FAIL] WebSocket connection error:', err);
      resolve();
    };
  });
}
