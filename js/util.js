// util.js — small helpers shared by every module (no dependencies besides d3 globals when noted).

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Create an element: el('div', {class:'x', onclick:fn}, child, 'text', …) */
export function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(c));
  return n;
}

export function debounce(fn, ms) {
  let t;
  const d = (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  d.cancel = () => clearTimeout(t);
  return d;
}

export const reducedMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isMobile = () => window.matchMedia && matchMedia('(max-width: 759px)').matches;

// ---------- seeded randomness ----------
/** FNV-1a string hash → 32-bit unsigned int */
export function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
/** mulberry32 PRNG: returns () => float in [0,1) */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- colour ----------
export function hex2rgb(h) {
  h = h.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
export const rgb2css = (c, a = 1) => a >= 1 ? `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})` : `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
/** Mix two #hex colours (t=0 → a, t=1 → b) and return [r,g,b] */
export function mix(a, b, t) {
  const A = typeof a === 'string' ? hex2rgb(a) : a, B = typeof b === 'string' ? hex2rgb(b) : b;
  return [lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)];
}
export const mixHex = (a, b, t) => rgb2css(mix(a, b, t));

// The one palette (palette A)
export const PAL = {
  forest: '#33393B', indigo: '#49546D', raindrops: '#B2ABB4', vapor: '#DFDDD7',
  vgvar: '#F6F4EF', dew: '#EEDED1', water: '#CCD6E6', soft: '#5B6264'
};

// ---------- years ----------
const fmt = n => Math.round(n).toLocaleString('en-GB');
/** Short label: "65,000 BP", "3000 BCE", "671 CE", "1824" */
export function formatYear(y) {
  if (y == null) return '';
  if (y <= -10000) return `${fmt(-y)} BP`;
  if (y < 0) return `${fmt(-y).replace(/,/g, '')} BCE`;
  if (y < 1500) return `${Math.round(y) || 1} CE`;
  return String(Math.round(y));
}
/** Long label for the era header: "c. 65,000 years ago" */
export function formatYearLong(y) {
  if (y <= -10000) return `c. ${fmt(-y)} years ago`;
  return formatYear(y);
}
export function formatRange(a, b) {
  if (b == null || b === a) return formatYear(a);
  const fa = formatYear(a), fb = formatYear(b);
  // compress "1300 CE – 1620" style: drop repeated CE/BCE/BP suffix on the first
  const sa = fa.split(' '), sb = fb.split(' ');
  if (sa.length === 2 && sb.length === 2 && sa[1] === sb[1]) return `${sa[0]} – ${fb}`;
  return `${fa} – ${fb}`;
}

// ---------- storage (always safe) ----------
const memStore = {};
export const store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); if (v != null) return JSON.parse(v); } catch (e) { /* fall through */ }
    return key in memStore ? JSON.parse(memStore[key]) : fallback;
  },
  set(key, val) {
    const s = JSON.stringify(val);
    memStore[key] = s;
    try { localStorage.setItem(key, s); } catch (e) { /* memory only */ }
  }
};

// ---------- tiny pub/sub state ----------
export function createState(initial) {
  let s = initial; const subs = new Set();
  return {
    get: () => s,
    set(patch) { const prev = s; s = { ...s, ...patch }; subs.forEach(f => f(s, prev, patch)); },
    on(f) { subs.add(f); return () => subs.delete(f); }
  };
}

export function downloadFile(name, text, type = 'application/json') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; document.body.append(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/** Add U+FE0E so emoji-capable glyphs (⚓ ⚖ ⚙ ⛏ ⛓ …) render as monochrome text. */
export const textGlyph = g => (g || '•') + '︎';

// ---------- SVG helper ----------
const SVGNS = 'http://www.w3.org/2000/svg';
export const svgEl = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
  if (parent) parent.append(n);
  return n;
};

/** Longitudes ≥ 180 are used by the Pacific routes; points stored with negative lon (Fiji, Samoa…) are shifted east so they sit next to them. */
export const unwrapLon = lon => (lon < -100 ? lon + 360 : lon);

// ---------- IndexedDB key/value (always safe: falls back to memory) ----------
const idbMem = new Map();
let idbPromise = null;
function idb() {
  if (idbPromise) return idbPromise;
  idbPromise = new Promise(res => {
    try {
      const rq = indexedDB.open('vih-v2', 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore('kv');
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => res(null);
    } catch (e) { res(null); }
  });
  return idbPromise;
}
export const kv = {
  async get(key) {
    const db = await idb(); if (!db) return idbMem.get(key) ?? null;
    return new Promise(res => { try { const r = db.transaction('kv').objectStore('kv').get(key); r.onsuccess = () => res(r.result ?? null); r.onerror = () => res(idbMem.get(key) ?? null); } catch (e) { res(idbMem.get(key) ?? null); } });
  },
  async set(key, val) {
    idbMem.set(key, val);
    const db = await idb(); if (!db) return false;
    return new Promise(res => { try { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(val, key); tx.oncomplete = () => res(true); tx.onerror = () => res(false); } catch (e) { res(false); } });
  },
  async del(key) {
    idbMem.delete(key);
    const db = await idb(); if (!db) return;
    return new Promise(res => { try { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').delete(key); tx.oncomplete = () => res(); tx.onerror = () => res(); } catch (e) { res(); } });
  },
  async keys(prefix = '') {
    const db = await idb(); const mem = [...idbMem.keys()].filter(k => k.startsWith(prefix));
    if (!db) return mem;
    return new Promise(res => { try { const r = db.transaction('kv').objectStore('kv').getAllKeys(); r.onsuccess = () => res([...new Set([...r.result.filter(k => String(k).startsWith(prefix)), ...mem])]); r.onerror = () => res(mem); } catch (e) { res(mem); } });
  }
};
