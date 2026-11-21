// peoples/words.js — plain-words labels for the precision / method codes in data/peoples/ethnic-areas.meta.json,
// shared by the Peoples page and the Analyse "Ethnic areas" layer.
export const METHOD_WORDS = {
  glottolog: 'located from the Glottolog language point of this group',
  'glottolog-language': 'Sumba only: each desa goes to the nearest Glottolog language point',
  'wm-map': 'read off the Kartapranata ethnolinguistic map',
  manual: 'placed by hand from published descriptions of where the group lives',
  'province-centroid': 'province centroid — rough, the group is only known at province level'
};
export const PRECISION_WORDS = {
  point: 'anchored on a single documented place',
  district: 'known to district (kabupaten) level',
  province: 'known to province level only — treat the area as rough',
  island: 'known to island level only'
};
export const methodWords = m => METHOD_WORDS[m] || m || 'unknown';
export const precisionWords = p => PRECISION_WORDS[p] || p || 'unknown';

export const ISLANDS = ['Sumatra', 'Jawa-Bali', 'Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku', 'Papua'];

/** Palette-A tint for a group: a mix of two palette colours chosen by the island, shifted along the pair by a hash of the id. */
const PAIRS = { // three-stop ramps inside palette A; 6 distinct steps so neighbouring groups separate clearly
  'Sumatra': ['#49546D', '#8C9BB8', '#CCD6E6'], 'Jawa-Bali': ['#8A4B3C', '#C99A84', '#EEDED1'], 'Nusa Tenggara': ['#7A5C4E', '#B2ABB4', '#EEDED1'],
  'Kalimantan': ['#33393B', '#6E7790', '#CCD6E6'], 'Sulawesi': ['#49546D', '#B2ABB4', '#EEDED1'], 'Maluku': ['#5A6684', '#CCD6E6', '#F6F4EF'], 'Papua': ['#5B6264', '#A9B7C9', '#EEDED1']
};
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
export function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return (h >>> 0) / 4294967295; }
export function tint(island, id) {
  const r = PAIRS[island] || PAIRS.Papua, step = Math.floor(hashStr(id) * 6) / 5, t = 0.15 + 0.8 * step;
  const [a, b, u] = t < .5 ? [r[0], r[1], t / .5] : [r[1], r[2], (t - .5) / .5], A = hex(a), B = hex(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, '0')).join('');
}
