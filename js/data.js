// data.js — load every JSON file (data/… with fallback to dev-fixtures/…), index, and validate.
import { rng } from './util.js';

const FILES = ['eras', 'themes', 'languages', 'events', 'routes', 'peoples', 'sources', 'notes'];
const GEO = ['countries', 'rivers'];

async function getJSON(path, fallbackPath) {
  try {
    const r = await fetch(path, { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    return { json: await r.json(), from: path };
  } catch (e) {
    if (!fallbackPath) throw e;
    console.info(`[data] ${path} unavailable → using ${fallbackPath}`);
    const r = await fetch(fallbackPath, { cache: 'no-cache' });
    if (!r.ok) throw new Error(`Missing ${path} and ${fallbackPath}`);
    return { json: await r.json(), from: fallbackPath };
  }
}

export async function loadAll() {
  const out = { _from: {} };
  const jobs = [
    ...FILES.map(n => getJSON(`data/${n}.json`, `dev-fixtures/${n}.json`).then(r => { out[n] = r.json; out._from[n] = r.from; }).catch(e => {
      // notes.json may legitimately be absent; everything else gets an empty list and a warning
      console.warn(`[data] could not load ${n}.json`, e.message); out[n] = n === 'languages' ? { families: {}, cols: [], rows: [] } : []; })),
    ...GEO.map(n => getJSON(`data/geo/${n}.topo.json`).then(r => { out[n] = r.json; }))
  ];
  await Promise.all(jobs);
  return index(out);
}

/** Build lookup maps, derived fields, and warn about unresolved ids. */
function index(D) {
  const by = a => new Map(a.map(x => [x.id, x]));
  D.eraById = by(D.eras); D.themeById = by(D.themes); D.eventById = by(D.events);
  D.routeById = by(D.routes); D.peopleById = by(D.peoples); D.sourceById = by(D.sources);
  D.events.sort((a, b) => a.start - b.start || a.id.localeCompare(b.id));
  D.events.forEach((e, i) => { e._i = i; e.end = e.end ?? null; });
  D.routes.forEach(r => { r.end = r.end ?? r.start; });
  D.peoples.forEach((p, i) => { p._rank = i; });
  D.eventsByTheme = new Map(D.themes.map(t => [t.id, 0]));
  D.events.forEach(e => D.eventsByTheme.set(e.theme, (D.eventsByTheme.get(e.theme) || 0) + 1));

  // events mentioning each people; events + routes per route
  D.eventsOfPeople = new Map(D.peoples.map(p => [p.id, []]));
  D.events.forEach(e => (e.peoples || []).forEach(id => D.eventsOfPeople.get(id)?.push(e)));
  D.routesOfEvent = new Map(D.events.map(e => [e.id, []]));
  D.routes.forEach(r => { if (r.event && D.routesOfEvent.has(r.event)) D.routesOfEvent.get(r.event).push(r); });
  D.events.forEach(e => (e.routes || []).forEach(id => {
    const r = D.routeById.get(id); const list = D.routesOfEvent.get(e.id);
    if (r && !list.includes(r)) list.push(r);
  }));

  // who cites each source: [{kind,id,title}]
  D.citedBy = new Map(D.sources.map(s => [s.id, []]));
  const cite = (ref, kind, obj, title) => (ref || []).forEach(s => { const sid = s.id ?? s; D.citedBy.get(sid)?.push({ kind, id: obj.id, title }); });
  D.events.forEach(e => cite(e.sources, 'event', e, e.title));
  D.peoples.forEach(p => { cite(p.sources, 'people', p, p.name); (p.impacts || []).forEach(i => cite(i.sources, 'people', p, p.name)); });
  D.routes.forEach(r => cite(r.sources, 'route', r, r.title));
  D.eras.forEach(e => cite((e.sources || []).map(id => ({ id })), 'era', e, e.name));
  D.citedBy.forEach((list, k) => { const seen = new Set(); D.citedBy.set(k, list.filter(x => { const key = x.kind + x.id; if (seen.has(key)) return false; seen.add(key); return true; })); });

  validate(D);
  return D;
}

function validate(D) {
  const warn = (...a) => { console.warn('[data]', ...a); D.warnings.push(a.join(' ')); };
  D.warnings = [];
  const chkSrc = (ctx, list) => (list || []).forEach(s => { const id = s.id ?? s; if (!D.sourceById.has(id)) warn(`${ctx}: unresolved source "${id}"`); });
  D.eras.forEach(e => chkSrc(`era ${e.id}`, e.sources));
  D.events.forEach(e => {
    if (!D.eraById.has(e.era)) warn(`event ${e.id}: unknown era "${e.era}"`);
    if (!D.themeById.has(e.theme)) warn(`event ${e.id}: unknown theme "${e.theme}"`);
    if (typeof e.lat !== 'number' || typeof e.lon !== 'number') warn(`event ${e.id}: missing lat/lon`);
    (e.peoples || []).forEach(p => { if (!D.peopleById.has(p)) warn(`event ${e.id}: unknown people "${p}"`); });
    (e.routes || []).forEach(r => { if (!D.routeById.has(r)) warn(`event ${e.id}: unknown route "${r}"`); });
    (e.related || []).forEach(r => { if (!D.eventById.has(r)) warn(`event ${e.id}: unknown related "${r}"`); });
    if (!(e.sources || []).length) warn(`event ${e.id}: no sources`);
    chkSrc(`event ${e.id}`, e.sources);
  });
  D.routes.forEach(r => {
    if (!r.path || r.path.length < 2) warn(`route ${r.id}: path needs ≥2 points`);
    if (r.event && !D.eventById.has(r.event)) warn(`route ${r.id}: unknown event "${r.event}"`);
    chkSrc(`route ${r.id}`, r.sources);
  });
  D.peoples.forEach(p => { chkSrc(`people ${p.id}`, p.sources); (p.impacts || []).forEach(i => chkSrc(`people ${p.id} impact`, i.sources)); });
  (D.notes || []).forEach(n => {
    const [k, id] = (n.target || '').split(':');
    if (k === 'event' && !D.eventById.has(id)) warn(`note ${n.id}: unknown event "${id}"`);
    if (k === 'people' && !D.peopleById.has(id)) warn(`note ${n.id}: unknown people "${id}"`);
    chkSrc(`note ${n.id}`, n.sources);
  });
  if (D.warnings.length) console.warn(`[data] ${D.warnings.length} validation warning(s)`);
}

/** Human readable citation line (plain text) — used for BibTeX/search. */
export const srcLabel = s => s ? `${s.authors} (${s.year}) ${s.title}` : '';

/** Era id for a given year. */
export function eraOf(D, year) {
  for (const e of D.eras) if (year >= e.start && year < e.end) return e;
  return year < D.eras[0].start ? D.eras[0] : D.eras[D.eras.length - 1];
}

// Target → notes (repo notes). `target` strings are "event:id", "people:id", "general".
export function notesFor(D, target) { return (D.notes || []).filter(n => n.target === target); }
