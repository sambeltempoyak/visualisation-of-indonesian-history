// core/archive.js — the Drive archive (tools/archive/Code.gs web app). config/archive.json holds the endpoint once
// Ejak has deployed the script; until then every call resolves to null and the app works from the repo alone.
let cfg;
export async function archiveConfig() {
  if (cfg !== undefined) return cfg;
  try { cfg = await fetch('config/archive.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null); } catch (e) { cfg = null; }
  return cfg;
}
async function call(params) {
  const c = await archiveConfig(); if (!c?.endpoint) return null;
  const u = new URL(c.endpoint); Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u, { redirect: 'follow' }); if (!r.ok) throw new Error('archive ' + r.status);
  const t = await r.text(); try { return JSON.parse(t); } catch (e) { return t; }
}
export const archive = {
  ready: async () => !!(await archiveConfig())?.endpoint,
  manifest: () => call({ action: 'manifest' }),
  list: path => call({ action: 'list', path }),
  file: path => call({ action: 'file', path }),
  search: q => call({ action: 'search', q })
};
