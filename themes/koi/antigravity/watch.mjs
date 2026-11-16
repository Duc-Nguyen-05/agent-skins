// Antigravity Watcher: Keeps running in background and automatically applies Koi theme
// whenever Antigravity App is opened or reloaded.

import fs from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
const activePortFile = path.join(appData, 'Antigravity', 'DevToolsActivePort');
const nodePath = process.execPath;

let lastTargetId = null;

async function checkAndInject() {
  if (!fs.existsSync(activePortFile)) {
    lastTargetId = null;
    return;
  }

  let port;
  try {
    const portInfo = fs.readFileSync(activePortFile, 'utf8').split('\n');
    port = portInfo[0].trim();
  } catch (e) {
    return;
  }

  if (!port) return;

  const list = await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(2000) })
    .then(r => r.json())
    .catch(() => null);

  if (!list) return;

  const target = list.find(t => t.type === 'page' && t.url.includes('127.0.0.1'));
  if (!target) return;

  if (target.id === lastTargetId) return;

  // Let the window finish initial DOM render
  await new Promise(r => setTimeout(r, 3000));

  const p = spawn(nodePath, [path.join(HERE, 'inject.mjs')], {
    stdio: 'ignore',
    windowsHide: true
  });

  p.on('close', (code) => {
    if (code === 0) {
      lastTargetId = target.id;
      console.log(new Date().toISOString(), '[AUTO-APPLIED] Koi theme injected successfully.');
    }
  });
}

console.log('[WATCHER STARTED] Monitoring Antigravity App...');
for (;;) {
  await checkAndInject().catch(() => {});
  await new Promise(r => setTimeout(r, 6000));
}
