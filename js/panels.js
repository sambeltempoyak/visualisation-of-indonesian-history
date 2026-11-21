// panels.js — Layers panel, Questions (guided tour), About, and the search box.
import { el, esc, formatYear, textGlyph, PAL } from './util.js';
import { openModal } from './cards.js';

// ---------------------------------------------------------------- Search
export function createSearch({ D, actions, reg, ethno, map, ctx }) {
  const input = document.getElementById('search'), box = document.getElementById('searchResults');
  const idx = [
    ...D.events.map(e => ({ kind: 'Event', id: e.id, label: e.title, sub: `${formatYear(e.start)} · ${e.place || ''}`, hay: `${e.title} ${e.place} ${e.summary} ${e.id}`.toLowerCase(), go: () => actions.select('event', e.id) })),
    ...D.peoples.map(p => ({ kind: 'People', id: p.id, label: p.name, sub: p.family || '', hay: `${p.name} ${p.autonym} ${p.region} ${p.family}`.toLowerCase(), go: () => actions.select('people', p.id) })),
    ...D.sources.map(s => ({ kind: 'Source', id: s.id, label: s.title, sub: `${s.authors} (${s.year})`, hay: `${s.title} ${s.authors} ${s.year} ${s.id}`.toLowerCase(), go: () => actions.openSources(s.title) }))
  ];
  // v3: groups + suku labels are not in memory at boot; they load (once) when the search box is first focused
  let lazyIdx = [], lazyState = 0;
  const buildLazy = () => { lazyIdx = [
    ...(ethno?.groups || []).map(g => ({ kind: 'Group', id: g.id, label: g.name, sub: [g.island, g.place || (g.precision === 'none' ? 'not mapped' : '')].filter(Boolean).join(' · '), hay: `${g.name} ${(g.aliases || []).join(' ')} ${(g.codes || []).map(c => c.label).join(' ')} ${g.place || ''} ${g.island || ''} ${g.glottocode || ''}`.toLowerCase(), go: () => ethno.focus(g.id) })),
    ...(ethno?.labels || []).map((l, i) => ({ kind: 'Suku', id: 'wm' + i, label: l.label, sub: 'Kartapranata map label', hay: l.label.toLowerCase(), go: async () => { await reg.setVisible('wm-suku-labels', true); map.flyToView([l.lat, l.lon], Math.max(map.map.getZoom(), 7), { duration: 1 }); } }))
  ]; };
  const loadLazy = () => { if (lazyState) return; lazyState = 1; ethno?.loadSearch?.().then(() => { buildLazy(); lazyState = 2; if (input.value.trim().length >= 2) run(); }).catch(e => { console.info('[search] ethnic index unavailable', e.message); }); };
  /** layers (always) and the feature names of user / result vector layers (live: they change at run time) */
  const dynamic = terms => {
    const out = [];
    for (const d of reg.list()) {
      if (d.kind === 'builtin') { if (terms.every(t => d.name.toLowerCase().includes(t))) out.push({ kind: 'Layer', id: d.id, label: d.name, sub: d.group, hay: '', go: () => { reg.setVisible(d.id, true); reg.zoomTo(d.id); } }); continue; }
      if (terms.every(t => d.name.toLowerCase().includes(t))) out.push({ kind: 'Layer', id: d.id, label: d.name, sub: d.group, go: () => { reg.setVisible(d.id, true); reg.zoomTo(d.id); } });
      const fc = d.kind !== 'catalogue' || d.data ? (d.data || null) : null;
      if (fc) for (const f of fc.features) { const nm = f.properties && (f.properties.name ?? f.properties.label ?? f.properties.title); if (nm != null && terms.every(t => String(nm).toLowerCase().includes(t))) out.push({ kind: 'Feature', id: d.id, label: String(nm), sub: d.name, go: () => { reg.setVisible(d.id, true); const b = L.geoJSON(f, { coordsToLatLng: c => L.latLng(c[1], c[0]) }).getBounds(); b.getSouthWest().equals(b.getNorthEast()) ? map.flyToView(b.getCenter(), Math.max(map.map.getZoom(), 9), { duration: 1 }) : map.flyToBounds(b, { pad: 60, maxZoom: 12 }); } }); if (out.length > 30) break; }
    }
    return out;
  };
  let items = [], sel = -1;
  const close = () => { box.hidden = true; sel = -1; };
  const paint = () => { [...box.children].forEach((c, i) => c.classList.toggle('on', i === sel)); };
  function run() {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) return close();
    const terms = q.split(/\s+/);
    const rank = x => (x.label.toLowerCase().startsWith(q) ? 0 : 1);
    items = [...[...idx, ...lazyIdx].filter(x => terms.every(t => x.hay.includes(t))), ...dynamic(terms)].sort((a, b) => rank(a) - rank(b)).slice(0, 16);
    box.replaceChildren(...(items.length ? items.map((x, i) => el('button', { class: 'sr', role: 'option', onclick: () => pick(i) }, el('span', { class: 'sr-kind' }, x.kind), el('span', { class: 'sr-main' }, el('b', {}, x.label), el('small', {}, x.sub)))) : [el('div', { class: 'sr-none' }, 'No matches')]));
    box.hidden = false; sel = -1;
  }
  function pick(i) { const x = items[i]; if (!x) return; close(); input.blur(); x.go(); }
  input.addEventListener('focus', loadLazy); input.addEventListener('input', () => { loadLazy(); run(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); paint(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); paint(); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(sel >= 0 ? sel : 0); }
    else if (e.key === 'Escape') { close(); input.blur(); e.stopPropagation(); }
  });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('.search')) close(); });
  return { focus: () => input.focus() };
}

// ---------------------------------------------------------------- Questions + tour
export const QUESTIONS = [
  'Geography of the region', 'Migrations: Taiwan, Malay, Orang Asli', 'First Indian (Hindu) influence', 'Buddhist influence: India or China?',
  'Slave networks and urban centres', 'First contact with the West', 'Portuguese, Spanish, VOC, British', 'Formation of colonial states',
  'Interaction, indenture, plantations, mining', 'Independence', '20th-century development', 'Impacts on indigenous peoples'];

export function createTour({ D, actions }) {
  const hud = document.getElementById('tourHud'), pop = document.getElementById('popover');
  let timer = null, tour = null;
  const eventsFor = n => D.events.filter(e => (e.q || []).includes(n));

  function stop() {
    clearTimeout(timer); tour = null; hud.hidden = true; hud.replaceChildren();
  }
  function go(i) {
    clearTimeout(timer);
    if (!tour) return;
    i = Math.max(0, Math.min(tour.list.length - 1, i)); tour.i = i;
    const e = tour.list[i];
    actions.select('event', e.id, { tour: true });
    hud.replaceChildren(
      el('div', { class: 'tour-top' }, el('b', {}, `Q${tour.n}`), el('span', {}, QUESTIONS[tour.n - 1]), el('span', { class: 'muted' }, `${i + 1} / ${tour.list.length}`)),
      el('div', { class: 'tour-bar' }, el('i', { style: `animation-duration:${tour.ms}ms` })),
      el('div', { class: 'tour-btns' },
        el('button', { class: 'btn btn-sm', onclick: () => go(i - 1), 'aria-label': 'Previous stop' }, '‹ Prev'),
        el('button', { class: 'btn btn-sm', onclick: () => go(i + 1), 'aria-label': 'Next stop' }, 'Next ›'),
        el('button', { class: 'btn btn-sm btn-primary', onclick: stop }, 'Stop tour')));
    hud.hidden = false;
    if (i < tour.list.length - 1) timer = setTimeout(() => go(i + 1), tour.ms); else timer = setTimeout(stop, tour.ms);
  }
  function start(n) {
    const list = eventsFor(n); if (!list.length) return;
    tour = { n, list, i: 0, ms: 6000 }; pop.hidden = true; go(0);
  }
  function togglePopover(anchor) {
    if (!pop.hidden) { pop.hidden = true; return; }
    pop.replaceChildren(el('div', { class: 'pop-h' }, 'Guided questions'), el('p', { class: 'muted pop-sub' }, 'Pick a question: the map flies through the events that answer it, six seconds each.'),
      el('ol', { class: 'q-list' }, QUESTIONS.map((t, i) => { const n = eventsFor(i + 1).length; return el('li', {}, el('button', { class: 'q-btn', disabled: n ? null : true, onclick: () => start(i + 1) },
        el('span', { class: 'q-n' }, i + 1), el('span', { class: 'q-t' }, t), el('span', { class: 'q-c' }, n ? `${n} card${n > 1 ? 's' : ''}` : '—'))); })));
    const r = anchor.getBoundingClientRect();
    pop.style.top = (r.bottom + 8) + 'px'; pop.style.right = Math.max(12, window.innerWidth - r.right - 60) + 'px';
    pop.hidden = false;
  }
  document.addEventListener('pointerdown', e => { if (!pop.hidden && !e.target.closest('#popover') && !e.target.closest('[data-open="questions"]')) pop.hidden = true; });
  return { start, stop, togglePopover, active: () => !!tour };
}

// ---------------------------------------------------------------- About
export function openAbout(D) {
  const nEg = D.ethnic?.groups?.length || 633;
  const c = el('div', { class: 'panel-body prose' },
    el('p', { class: 'lede' }, 'An interactive web map that follows indigenous peoples of the Southeast Asian world and the long web of migration, trade, religion, slavery, empire, plantation and independence that connected them — from the first crossings to Sahul, c. 65,000 years ago, to today.'),
    el('h3', { class: 'sec-h' }, 'Purpose'),
    el('p', {}, 'Built as a research companion: every event is a card with a summary, the scholarly debate around it, the peoples involved and the sources it rests on. Sources carry a Verify button that checks the DOI against Crossref and OpenAlex (and ISBNs against Open Library) in your browser. Stories walk through one place chapter by chapter.'),
    el('h3', { class: 'sec-h' }, 'Method'),
    el('p', {}, 'The map is a standard web map built with Leaflet, with a Bhumi-style layer manager and GIS tools (Leaflet-Geoman for drawing, Turf for analysis, leaflet.heat for density, esri-leaflet for ArcGIS services, shpjs and togeojson for uploads). Historical layers follow the timeline; every card cites its sources and carries a certainty flag (Established, Debated, Estimate). The 633 ethnic groups are those of the 2010 census as listed by Ananta et al. (2014); each is placed with the honest precision it allows (point, district, province, island) and the method is stated in its popup. The Kartapranata map is georeferenced by a least-squares fit on 17 control points (rms ≈ 0.22°). “Language areas” are Voronoi cells of Glottolog points clipped to land — indicative, not historical territories.'),
    el('h3', { class: 'sec-h' }, 'Data & basemap credits'),
    el('ul', {}, el('li', {}, 'Basemaps: Esri (World Light/Dark Gray Canvas, World Topographic, World Shaded Relief, World Imagery), © OpenStreetMap contributors. “Ejak (palette)” is Esri Light Gray Canvas recoloured in the browser.'),
      el('li', {}, 'Natural Earth — coastlines, countries, rivers (public domain); also the offline fallback map.'),
      el('li', {}, 'Glottolog 5.4 — language locations and families (CC BY 4.0).'),
      el('li', {}, 'Ananta, Utami, Handayani & Arifin (2014/2015) — the 633 ethnic groups of Indonesia, 2010 census.'),
      el('li', {}, 'Gunawan Kartapranata — “Peta Suku Bangsa, Bahasa, dan Aksara di Indonesia”, Wikimedia Commons (CC BY-SA): map image and suku labels.'),
      el('li', {}, 'Crossref, OpenAlex and Open Library — live verification of citations.')),
    el('h3', { class: 'sec-h' }, 'Adding to the map'),
    el('p', {}, 'Ask Claude in the chat: ', el('code', {}, '“add to the map: …”'), ' — Claude edits data/*.json and pushes to GitHub. Layers you add in the browser (files, WMS, tiles, ArcGIS) stay on this device until you use “Catalogue entry” and ask Claude to make them permanent. Notes you write on a card stay in this browser until you export them from the Notes panel. Private story quotes never leave your browser.'),
    el('p', { class: 'muted' }, `Currently ${D.events.length} events, ${D.routes.length} routes, ${D.peoples.length} peoples, ${nEg} ethnic groups, ${D.sources.length} sources.` + (D.warnings.length ? ` ${D.warnings.length} data warning(s) — see the browser console.` : '')),
    el('h3', { class: 'sec-h' }, 'Keyboard'),
    el('p', {}, el('kbd', {}, 'Space'), ' play / pause · ', el('kbd', {}, '←'), ' ', el('kbd', {}, '→'), ' previous / next event · ', el('kbd', {}, 'Esc'), ' close · ', el('kbd', {}, '/'), ' search'));
  openModal('About this map', c);
}
