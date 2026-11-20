// verify.js — live verification of bibliography entries against open scholarly APIs (no API keys, no custom headers).
//   DOI  → Crossref (title/year match) + OpenAlex (citations, open-access)
//   ISBN → Open Library (title match)
//   else → OpenAlex title search, clearly labelled "search match"
// Results are cached in memory + localStorage (`vih.verify.v1`). Offline failures are reported, never cached.
import { store } from './util.js';

const KEY = 'vih.verify.v1', TTL = 7 * 864e5;
const mem = new Map(Object.entries(store.get(KEY, {})));
const bus = new EventTarget();
export const onVerify = fn => bus.addEventListener('verify', e => fn(e.detail));
export const cached = id => { const r = mem.get(id); return r && Date.now() - r.at < TTL ? r : null; };
function persist() { try { store.set(KEY, Object.fromEntries(mem)); } catch (e) { /* ignore */ } }

// ---------- title matching ----------
const STOP = new Set(['the', 'a', 'an', 'of', 'and', 'in', 'on', 'to', 'for', 'de', 'la']);
export function words(s) {
  return new Set(String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/<[^>]+>/g, ' ').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w && !STOP.has(w)));
}
/** Jaccard on word sets; also accepts near-containment (subtitle / edition differences). */
export function titleScore(a, b) {
  const A = words(a), B = words(b); if (!A.size || !B.size) return 0;
  let inter = 0; for (const w of A) if (B.has(w)) inter++;
  const jac = inter / (A.size + B.size - inter), cont = Math.min(A.size, B.size) >= 3 ? inter / Math.min(A.size, B.size) : 0;
  return Math.max(jac, cont >= 0.9 ? 0.6 + (cont - 0.9) : 0);
}
const MATCH = 0.6;

async function getJSON(url, ms = 14000) {
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
  try { const r = await fetch(url, { signal: ac.signal }); return { status: r.status, json: r.ok ? await r.json() : null }; }
  finally { clearTimeout(t); }
}
const encDoi = d => d.split('/').map(encodeURIComponent).join('/');

async function openAlexDoi(doi) {
  try { const { status, json } = await getJSON(`https://api.openalex.org/works/doi:${encDoi(doi)}`); return status === 200 ? json : null; } catch (e) { return null; }
}
const oaText = w => w?.open_access ? (w.open_access.is_oa ? `open access (${w.open_access.oa_status || 'oa'})` : 'closed access') : '';

async function verifyDoi(src) {
  const doi = src.doi.trim();
  let cr = null;
  const res = await getJSON(`https://api.crossref.org/works/${encDoi(doi)}`);
  if (res.status === 200) cr = res.json.message;
  const oa = await openAlexDoi(doi);
  if (!cr && !oa) return { status: 'notfound', detail: '✕ DOI not found' };
  const title = cr ? [cr.title?.[0], cr.subtitle?.[0]].filter(Boolean).join(': ') : oa.title;
  const alt = cr?.title?.[0] || oa?.title || '';
  const score = Math.max(titleScore(src.title, title), titleScore(src.title, alt), cr?.['container-title']?.[0] ? titleScore(src.title, cr['container-title'][0]) : 0);
  const yr = cr ? (cr.issued?.['date-parts']?.[0]?.[0] ?? cr['published-print']?.['date-parts']?.[0]?.[0] ?? cr['published-online']?.['date-parts']?.[0]?.[0]) : oa?.publication_year;
  const cites = oa?.cited_by_count;
  const extra = [cites != null ? `cited by ${cites.toLocaleString('en-GB')} (OpenAlex)` : null, oa ? oaText(oa) : null].filter(Boolean).join(' · ');
  const base = { crossrefTitle: title, year: yr, cited: cites, oa: oa?.open_access?.is_oa, score: +score.toFixed(2) };
  if (score < MATCH) return { ...base, status: 'mismatch', detail: `⚠ title mismatch: ${title}` + (extra ? ` · ${extra}` : '') };
  if (yr && src.year && Math.abs(yr - src.year) > 1) return { ...base, status: 'warn', detail: `⚠ title matches but year differs (registry says ${yr})` + (extra ? ` · ${extra}` : '') };
  return { ...base, status: 'ok', detail: `✓ DOI resolves${cr ? '' : ' (non-Crossref registry)'} · title matches` + (extra ? ` · ${extra}` : '') };
}

async function verifyIsbn(src) {
  const isbn = src.isbn.replace(/[^0-9Xx]/g, '');
  const { status, json } = await getJSON(`https://openlibrary.org/isbn/${isbn}.json`);
  if (status !== 200 || !json) return null;
  const t = [json.title, json.subtitle].filter(Boolean).join(': ');
  const score = Math.max(titleScore(src.title, t), titleScore(src.title, json.title));
  return score >= MATCH ? { status: 'ok', score, detail: `✓ ISBN found (Open Library) · title matches` }
    : { status: 'mismatch', score, detail: `⚠ ISBN title mismatch: ${t}` };
}

async function verifySearch(src) {
  const { status, json } = await getJSON(`https://api.openalex.org/works?search=${encodeURIComponent(src.title)}&per-page=1`);
  if (status !== 200) throw new Error('OpenAlex ' + status);
  const w = json.results?.[0];
  if (!w) return { status: 'weak', detail: '? search match: no result in OpenAlex' };
  const score = titleScore(src.title, w.title);
  const cites = w.cited_by_count != null ? ` · cited by ${w.cited_by_count.toLocaleString('en-GB')}` : '';
  return score >= MATCH
    ? { status: 'search', score, cited: w.cited_by_count, detail: `≈ search match (OpenAlex): “${w.title}” (${w.publication_year})${cites}` }
    : { status: 'weak', score, cited: w.cited_by_count, detail: `? search match is weak — best hit: “${w.title}” (${w.publication_year})${cites}` };
}

/** Verify one source. Resolves to {id,status,detail,…}. Never throws. */
export async function verifySource(src, { force = false } = {}) {
  if (!force) { const c = cached(src.id); if (c) return c; }
  let out;
  try {
    if (src.doi) out = await verifyDoi(src);
    else {
      if (src.isbn) out = await verifyIsbn(src);
      if (!out) out = await verifySearch(src);
    }
  } catch (e) {
    out = { status: 'offline', detail: `⚠ could not reach the verification service (${navigator.onLine === false ? 'offline' : e.name === 'AbortError' ? 'timeout' : 'network error'})` };
  }
  out = { id: src.id, ...out, at: Date.now() };
  if (out.status !== 'offline') { mem.set(src.id, out); persist(); }
  bus.dispatchEvent(new CustomEvent('verify', { detail: out }));
  return out;
}

/** Verify every source (4 in parallel). Returns [{id,status,detail}] */
export async function verifyAll(sources, { force = true, onProgress } = {}) {
  const out = new Array(sources.length); let i = 0, done = 0;
  async function worker() {
    while (i < sources.length) {
      const idx = i++; const r = await verifySource(sources[idx], { force });
      out[idx] = { id: r.id, status: r.status, detail: r.detail }; onProgress?.(++done, sources.length);
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  return out;
}
