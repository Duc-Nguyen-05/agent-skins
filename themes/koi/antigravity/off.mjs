// Removes the Koi Pond theme from Antigravity App windows
import fs from 'node:fs';

import path from 'node:path';
const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
const activePortFile = path.join(appData, 'Antigravity', 'DevToolsActivePort');
if (!fs.existsSync(activePortFile)) {
  console.log('[FAIL] Antigravity App is not running.');
  process.exit(1);
}

const portInfo = fs.readFileSync(activePortFile, 'utf8').split('\n');
const port = portInfo[0].trim();
const list = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json()).catch(() => null);
if (!list) {
  console.log('[FAIL] Could not connect to Antigravity App.');
  process.exit(1);
}

const targets = list.filter(t => t.type === 'page' && t.url.includes('127.0.0.1'));
for (const target of targets) {
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: 'if (typeof window.__antigravityKoiCleanup === "function") { window.__antigravityKoiCleanup(); "CLEANED"; } else { "NOT_APPLIED"; }',
          returnByValue: true
        }
      }));
    };
    ws.onmessage = (e) => {
      const res = JSON.parse(e.data);
      console.log(`[INFO] Window "${target.title}":`, res.result?.result?.value);
      ws.close();
      resolve();
    };
    ws.onerror = () => resolve();
  });
}
console.log('[DONE] Koi Pond theme removed from Antigravity App.');
