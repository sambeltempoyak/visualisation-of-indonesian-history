// story/data.js — loading and normalising stories (data/stories/ first, dev-fixtures/stories/ as fallback).
export const DEV = new URLSearchParams(location.search).has('dev');

async function getJ(url) {
  const r = await fetch(url, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
}
const asList = j => Array.isArray(j) ? j : (j && Array.isArray(j.stories) ? j.stories : null);

/** {list: entries to show in the picker, lookup: id → entry (demo only with ?dev)} */
export async function loadIndex() {
  let real = null, dev = null;
  try { real = asList(await getJ('data/stories/index.json')); } catch (e) { /* not built yet */ }
  try { dev = asList(await getJ('dev-fixtures/stories/index.json')); } catch (e) { /* no fixtures */ }
  const list = real || dev || [];
  const lookup = new Map(list.map(e => [e.id, e]));
  if (DEV && dev) dev.forEach(e => { if (!lookup.has(e.id)) lookup.set(e.id, { ...e, _dev: true }); });
  return { list, lookup };
}

export async function loadStory(entry) {
  const file = entry.file || `${entry.id}.json`;
  let raw;
  try { if (entry._dev) throw new Error('fixture-only story'); raw = await getJ(`data/stories/${file}`); }
  catch (e) { if (!entry._dev) console.info(`[story] data/stories/${file} unavailable → dev-fixtures/stories/${file}`); raw = await getJ(`dev-fixtures/stories/${file}`); }
  return normaliseStory(raw, entry);
}

const isNum = v => typeof v === 'number' && isFinite(v);
function normYear(y) {
  if (Array.isArray(y)) { const a = +y[0], b = y.length > 1 ? +y[1] : a; return isNum(a) ? [a, isNum(b) ? b : a] : null; }
  if (isNum(y)) return [y, y];
  if (y && typeof y === 'object') { const a = +(y.start ?? y.from), b = +(y.end ?? y.to ?? a); return isNum(a) ? [a, isNum(b) ? b : a] : null; }
  return null;
}
const normCam = c => {
  if (Array.isArray(c) && c.length >= 2) return [+c[0], +c[1], isNum(+c[2]) ? +c[2] : 8];
  if (c && c.center) return [+c.center[0], +c.center[1], isNum(+c.zoom) ? +c.zoom : 8];
  return null;
};
function normSlide(s, i) {
  const o = { ...s };
  o.year = normYear(s.year ?? s.period) || [0, 0];
  o.label = s.label ?? s.period?.label ?? '';
  o.camera = normCam(s.camera);
  o.places = (s.places || []).map(p => ({ ...p, lat: p.lat ?? p.at?.[0], lon: p.lon ?? p.at?.[1] })).filter(p => isNum(+p.lat) && isNum(+p.lon));
  o.flows = (s.flows || []).map(f => {
    const path = f.path || (f.from && f.to ? [f.from, ...(f.via || []), f.to] : null);
    return path && path.length > 1 ? { ...f, path } : null;
  }).filter(Boolean);
  o.areas = (s.areas || []).map(a => {
    if (a.pack && a.key) return a;
    const k = String(a.ref || '').indexOf(':');
    return k > 0 ? { ...a, pack: a.ref.slice(0, k), key: a.ref.slice(k + 1) } : null;
  }).filter(Boolean);
  o.sources = (s.sources || s.citations || []).map(c => {
    if (typeof c === 'string') return { id: c };
    if (c.id || c.cite) return { ...c, id: c.id || c.source_id };
    const [id, pages] = Object.entries(c)[0] || []; return { id: c.source_id || id, pages: c.source_id ? undefined : pages, cite: c.cite };
  });
  o.id = s.id || `s${i + 1}`;
  o.title = s.title || '';
  o.text = s.text || '';
  o.words = `${o.text}`.trim().split(/\s+/).filter(Boolean).length;
  return o;
}
export function normaliseStory(raw, entry = {}) {
  const st = { ...raw };
  st.slides = (raw.slides || raw.chapters || []).map(normSlide);
  st.geo = raw.geo || [];
  st.basemap = raw.basemap || entry.basemap || 'relief';
  st.region = raw.region || entry.region || [[-11, 94], [6, 141]];
  const ys = st.slides.flatMap(s => s.year);
  st.span = ys.length ? [Math.min(...ys), Math.max(...ys)] : (entry.span || [0, 0]);
  st.subtitle = raw.subtitle || ''; st.intro = raw.intro || '';
  return st;
}

// ---- bibliography (lazy) ----
let srcPromise;
export function loadSources() {
  if (!srcPromise) {
    const one = (u, f) => getJ(u).catch(() => (f ? getJ(f).catch(() => []) : []));
    srcPromise = Promise.all([one('data/sources.json', 'dev-fixtures/sources.json'), one('data/sources-mendeley.json')]).then(([a, b]) => {
      const m = new Map();
      [...(Array.isArray(b) ? b : []), ...(Array.isArray(a) ? a : [])].forEach(s => m.set(s.id, s)); // sources.json wins
      return m;
    });
  }
  return srcPromise;
}
export function tierOf(src, entry) {
  if (entry?.tier && ['peer-reviewed', 'primary', 'other'].includes(entry.tier)) return entry.tier;
  if (src) return src.peer_reviewed ? 'peer-reviewed' : src.type === 'primary' ? 'primary' : 'other';
  return entry?.tier || 'other';
}
