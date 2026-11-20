// panels.js — Layers panel, Questions (guided tour), About, and the search box.
import { el, esc, formatYear, textGlyph, PAL } from './util.js';
import { openModal } from './cards.js';

// ---------------------------------------------------------------- Layers
export function createLayers({ D, state, map }) {
  const root = document.getElementById('layers');
  const header = el('button', { class: 'layers-toggle', 'aria-expanded': 'true', 'aria-controls': 'layers-body', onclick: () => { const c = root.classList.toggle('collapsed'); header.setAttribute('aria-expanded', !c); } },
    el('span', {}, 'Layers'), el('span', { class: 'caret' }, '▾'));
  const body = el('div', { id: 'layers-body', class: 'layers-body' });
  root.replaceChildren(header, body);

  const toggleLayer = (key) => state.set({ layers: { ...state.get().layers, [key]: !state.get().layers[key] } });
  const row = (id, label, checked, onChange, glyph, count, color) => {
    const input = el('input', { type: 'checkbox', id, checked: checked || null });
    input.addEventListener('change', () => onChange(input.checked));
    return el('label', { class: 'lyr', for: id }, input, el('span', { class: 'switch' }),
      glyph ? el('span', { class: 'lyr-glyph', style: `--c:${color}` }, textGlyph(glyph)) : null,
      el('span', { class: 'lyr-name' }, label), count != null ? el('span', { class: 'lyr-count' }, count) : null);
  };
  const themesBox = el('div', { class: 'lyr-group' }, el('div', { class: 'lyr-h' }, el('span', {}, 'Themes'),
    el('span', { class: 'lyr-all' }, el('button', { class: 'link-btn', onclick: () => state.set({ themesOn: new Set(D.themes.map(t => t.id)) }) }, 'all'), ' · ',
      el('button', { class: 'link-btn', onclick: () => state.set({ themesOn: new Set() }) }, 'none'))));
  D.themes.forEach(t => {
    const r = row('th-' + t.id, t.name, true, on => { const s = new Set(state.get().themesOn); on ? s.add(t.id) : s.delete(t.id); state.set({ themesOn: s }); }, t.glyph, D.eventsByTheme.get(t.id) || 0, t.color);
    r.dataset.theme = t.id; themesBox.append(r);
  });
  const other = el('div', { class: 'lyr-group' }, el('div', { class: 'lyr-h' }, 'Map'));
  const L = state.get().layers;
  [['peoples', 'Peoples'], ['routes', 'Routes'], ['languages', 'Languages (cultural borders)'], ['dots', 'Language dots (zoom in)'], ['rivers', 'Rivers'], ['borders', 'Modern borders'], ['labels', 'Labels']]
    .forEach(([k, n]) => other.append(row('ly-' + k, n, L[k], () => toggleLayer(k))));
  const legend = el('div', { class: 'legend', hidden: true }, el('div', { class: 'lyr-h' }, 'Language families'),
    map.legend.map(g => el('div', { class: 'leg' }, el('i', { style: `background:${g.tint}` }), g.name)),
    el('div', { class: 'leg-note' }, 'Glottolog 5.4 · nearest language point within 2.5°'));
  body.append(themesBox, other, legend);
  state.on((s, p) => {
    if (s.layers !== p.layers) { legend.hidden = !s.layers.languages; for (const k of Object.keys(s.layers)) { const i = document.getElementById('ly-' + k); if (i) i.checked = s.layers[k]; } }
    if (s.themesOn !== p.themesOn) D.themes.forEach(t => { const i = document.getElementById('th-' + t.id); if (i) i.checked = s.themesOn.has(t.id); });
  });
  return { root, toggleMobile: () => root.classList.toggle('sheet-open') };
}

// ---------------------------------------------------------------- Search
export function createSearch({ D, actions }) {
  const input = document.getElementById('search'), box = document.getElementById('searchResults');
  const idx = [
    ...D.events.map(e => ({ kind: 'Event', id: e.id, label: e.title, sub: `${formatYear(e.start)} · ${e.place || ''}`, hay: `${e.title} ${e.place} ${e.summary} ${e.id}`.toLowerCase(), go: () => actions.select('event', e.id) })),
    ...D.peoples.map(p => ({ kind: 'People', id: p.id, label: p.name, sub: p.family || '', hay: `${p.name} ${p.autonym} ${p.region} ${p.family}`.toLowerCase(), go: () => actions.select('people', p.id) })),
    ...D.sources.map(s => ({ kind: 'Source', id: s.id, label: s.title, sub: `${s.authors} (${s.year})`, hay: `${s.title} ${s.authors} ${s.year} ${s.id}`.toLowerCase(), go: () => actions.openSources(s.title) }))
  ];
  let items = [], sel = -1;
  const close = () => { box.hidden = true; sel = -1; };
  const paint = () => {
    [...box.children].forEach((c, i) => c.classList.toggle('on', i === sel));
  };
  function run() {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) return close();
    const terms = q.split(/\s+/);
    items = idx.filter(x => terms.every(t => x.hay.includes(t))).sort((a, b) => (b.label.toLowerCase().startsWith(q) - a.label.toLowerCase().startsWith(q))).slice(0, 14);
    box.replaceChildren(...(items.length ? items.map((x, i) => el('button', { class: 'sr', role: 'option', onclick: () => pick(i) }, el('span', { class: 'sr-kind' }, x.kind), el('span', { class: 'sr-main' }, el('b', {}, x.label), el('small', {}, x.sub)))) : [el('div', { class: 'sr-none' }, 'No matches')]));
    box.hidden = false; sel = -1;
  }
  function pick(i) { const x = items[i]; if (!x) return; close(); input.blur(); x.go(); }
  input.addEventListener('input', run);
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
  const c = el('div', { class: 'panel-body prose' },
    el('p', { class: 'lede' }, 'An interactive hex map that follows indigenous peoples of the Southeast Asian world and the long web of migration, trade, religion, slavery, empire, plantation and independence that connected them — from the first crossings to Sahul, c. 65,000 years ago, to today.'),
    el('h3', { class: 'sec-h' }, 'Purpose'),
    el('p', {}, 'Built as a research companion: every event is a card with a summary, the scholarly debate around it, the peoples involved and the sources it rests on. Sources carry a Verify button that checks the DOI against Crossref and OpenAlex (and ISBNs against Open Library) in your browser.'),
    el('h3', { class: 'sec-h' }, 'Method'),
    el('p', {}, 'Procedural hex map generated in the browser from Natural Earth 50 m coastlines; language territories from Glottolog 5.4 (Hammarström, Forkel, Haspelmath & Bank 2026), cross-checked against Wikipedia’s “Languages of Indonesia” map; every card cites its sources; certainty flags mark each card as Established, Debated or Estimate. The Languages layer colours each hex by the family of the nearest Glottolog language point (within 2.5°) and is indicative, not a claim about historical territories.'),
    el('h3', { class: 'sec-h' }, 'Data credits'),
    el('ul', {}, el('li', {}, 'Natural Earth — coastlines, countries, rivers (public domain).'), el('li', {}, 'Glottolog 5.4 — language locations and families (CC-BY-4.0).'), el('li', {}, 'Crossref, OpenAlex and Open Library — live verification of citations.')),
    el('h3', { class: 'sec-h' }, 'Adding to the map'),
    el('p', {}, 'Ask Claude in the chat: ', el('code', {}, '“add to the map: …”'), ' — Claude edits data/*.json and pushes to GitHub. Notes you write on a card stay in this browser (localStorage) until you export them from the Notes panel.'),
    el('p', { class: 'muted' }, `Currently ${D.events.length} events, ${D.routes.length} routes, ${D.peoples.length} peoples, ${D.sources.length} sources.` + (D.warnings.length ? ` ${D.warnings.length} data warning(s) — see the browser console.` : '')),
    el('h3', { class: 'sec-h' }, 'Keyboard'),
    el('p', {}, el('kbd', {}, 'Space'), ' play / pause · ', el('kbd', {}, '←'), ' ', el('kbd', {}, '→'), ' previous / next event · ', el('kbd', {}, 'Esc'), ' close · ', el('kbd', {}, '/'), ' search'));
  openModal('About this map', c);
}
