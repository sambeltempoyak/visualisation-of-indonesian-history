// main.js — boots the app: loads data, builds the map, overlays, timeline, panels and wires interactions.
import { $, $$, el, clamp, createState, isMobile, reducedMotion, formatRange } from './util.js';
import { loadAll } from './data.js';
import { createMap } from './map.js';
import { createOverlays } from './overlays.js';
import { createTimeline, makeScale } from './timeline.js';
import { createCards, openModal, closeModal, modalOpen, sourcesPanel } from './cards.js';
import { createLayers, createSearch, createTour, openAbout } from './panels.js';
import { notesPanel } from './notes.js';
import { verifyAll } from './verify.js';

// ---------------------------------------------------------------- tooltip
const tipEl = $('#tooltip');
const tip = {
  sticky: false,
  show(html, ev) { if (tip.sticky) return; tipEl.innerHTML = html; tipEl.hidden = false; tipEl.classList.remove('sticky'); tip.move(ev); },
  move(ev) {
    if (tip.sticky || tipEl.hidden) return;
    const w = tipEl.offsetWidth, h = tipEl.offsetHeight;
    tipEl.style.left = clamp(ev.clientX + 14, 8, innerWidth - w - 8) + 'px';
    tipEl.style.top = clamp(ev.clientY - h - 14 < 8 ? ev.clientY + 18 : ev.clientY - h - 14, 8, innerHeight - h - 8) + 'px';
  },
  hide() { if (!tip.sticky) tipEl.hidden = true; },
  pin(html, ev) { tipEl.innerHTML = html; tipEl.hidden = false; tipEl.classList.add('sticky'); tip.sticky = true; tipEl.style.left = clamp(ev.clientX + 12, 8, innerWidth - 280) + 'px'; tipEl.style.top = clamp(ev.clientY + 12, 8, innerHeight - 120) + 'px'; },
  unpin() { tip.sticky = false; tipEl.hidden = true; tipEl.classList.remove('sticky'); }
};

async function boot() {
  const D = await loadAll();
  const allThemes = new Set(D.themes.map(t => t.id));
  const startEra = D.eraById.get('commerce') || D.eras[Math.min(3, D.eras.length - 1)];
  const state = createState({
    window: [startEra.start, startEra.end], cumulative: false, themesOn: allThemes, selection: null,
    layers: { peoples: true, routes: true, languages: false, dots: false, rivers: true, borders: false, labels: true }
  });

  const map = createMap({ D, state });
  let tl, tour, cards;
  const scale = makeScale(D.eras);

  // ---- insets: where the "free" map area is (for fit/fly) ----
  const tlH = () => $('#timeline').offsetHeight + 12;
  function updateInsets() {
    const mob = isMobile(), open = $('#card').classList.contains('open');
    map.setInsets({ top: mob ? 56 : 72, left: 0, right: !mob && open ? 452 : 0, bottom: mob ? (open ? innerHeight * 0.56 : tlH() + 60) : tlH() });
  }

  // ---- selection / navigation ----
  let stack = [], current = null;
  const sameSel = (a, b) => a && b && a.type === b.type && a.id === b.id;
  const evMid = e => e.start;

  const overlays = createOverlays({
    D, map, state, tip,
    onSelect: (type, id) => {
      if (type === 'route') { const r = D.routeById.get(id); if (r?.event && D.eventById.has(r.event)) return actions.select('event', r.event, { route: id }); }
      actions.select(type, id);
    }
  });

  const actions = {
    select(type, id, opt = {}) {
      if (!opt.keepStack && current && !sameSel(current, { type, id }) && !opt.tour && !opt.reset) { if (['people'].includes(type) || ['people'].includes(current.type)) stack.push(current); else stack = []; }
      if (opt.tour || opt.reset) stack = [];
      current = { type, id };
      state.set({ selection: { type, id, route: opt.route || null } });
      updateInsetsBeforeOpen();
      if (type === 'event') {
        const e = D.eventById.get(id); if (!e) return;
        tl.ensureVisible(e.start, e.end ?? e.start);
        cards.openEvent(id); updateInsets();
        const pts = overlays.eventPoints(e);
        if (pts.length === 1) { const k = clamp(Math.max(map.transform().k, 3.2), 3.2, 6); map.flyToPoints([pts[0], pts[0]], { maxK: k, minK: k }); }
        else map.flyToPoints(pts, { pad: 80, maxK: 7, minK: 0.6 });
      } else if (type === 'people') {
        const p = D.peopleById.get(id); if (!p) return;
        cards.openPeople(id); updateInsets();
        const pt = map.project(p.lon, p.lat), k = clamp(Math.max(map.transform().k, 3), 3, 6);
        map.flyToPoints([pt, pt], { maxK: k, minK: k });
      } else if (type === 'route') {
        cards.openRoute(id); updateInsets(); map.flyToPoints(overlays.routePoints(id), { pad: 80, maxK: 7, minK: 0.6 });
      }
    },
    flyRoute(id) {
      const r = D.routeById.get(id); if (!r) return;
      tl.ensureVisible(r.start, r.end ?? r.start);
      state.set({ selection: { ...state.get().selection, route: id } });
      map.flyToPoints(overlays.routePoints(id), { pad: 80, maxK: 7, minK: 0.6 });
    },
    close() {
      tour?.stop(); cards.close(); stack = []; current = null; state.set({ selection: null }); updateInsets();
    },
    canBack: () => stack.length > 0,
    back() { const prev = stack.pop(); if (prev) actions.select(prev.type, prev.id, { keepStack: true, reset: false }); },
    step(dir) {
      const st = state.get(), evs = D.events;
      let i;
      if (st.selection?.type === 'event') i = D.eventById.get(st.selection.id)._i + dir;
      else {
        const anchor = st.window[1] > 1e9 ? 0 : (st.cumulative ? st.window[1] : (st.window[0] + st.window[1]) / 2);
        i = dir > 0 ? evs.findIndex(e => e.start > anchor) : (() => { let j = -1; evs.forEach((e, n) => { if (e.start < anchor) j = n; }); return j; })();
      }
      if (i < 0 || i >= evs.length) return;
      actions.select('event', evs[i].id, { reset: true });
    },
    openSources(query = '') { openModal('Sources', sourcesPanel(D, { actions, query }), { wide: true }); },
    openNotes() { openModal('Notes', notesPanel(D)); }
  };
  function updateInsetsBeforeOpen() { $('#card').classList.add('open'); }

  cards = createCards({ D, state, actions });
  $('#card').classList.remove('open');

  // ---- timeline ----
  tl = createTimeline({ D, state, scale, tip, onSelectEvent: id => actions.select('event', id, { reset: true }), onStep: d => actions.step(d) });
  tour = createTour({ D, actions });
  createLayers({ D, state, map });
  const search = createSearch({ D, actions });

  // ---- map init ----
  updateInsets();
  map.init();
  state.on((s, p) => {
    if (s.layers !== p.layers) { map.syncLanguages(); map.updateLayers(); map.redraw(); overlays.settle(); }
    if (s.window !== p.window) map.updateLayers();
  });
  map.onZoomEnd(() => overlays.settle());
  overlays.applyState(); overlays.layoutZoom();
  window.addEventListener('resize', () => { updateInsets(); tl.redraw(); overlays.settle(); });

  // ---- language dot hover / click ----
  const svg = $('#svg');
  svg.addEventListener('pointermove', ev => {
    if (ev.target.closest('.badge, .banner, .r-hit')) return;
    const r = svg.getBoundingClientRect(), p = map.nearestLang?.(ev.clientX - r.left, ev.clientY - r.top);
    if (p && !tip.sticky) { tip.show(`<b>${p.name}</b><br><span>${p.code} · ${p.family}</span>`, ev); }
    else if (!p && !tip.sticky) { if (!ev.target.closest('.tick')) tip.hide(); }
  });
  svg.addEventListener('click', ev => {
    if (tip.sticky) tip.unpin();
    if (ev.target.closest('.badge, .banner, .r-hit')) return;
    const r = svg.getBoundingClientRect(), p = map.nearestLang?.(ev.clientX - r.left, ev.clientY - r.top, 12);
    if (p) { tip.sticky = false; tip.pin(`<b>${p.name}</b><br><span>${p.code} · ${p.family}</span><br><a href="https://glottolog.org/resource/languoid/id/${p.code}" target="_blank" rel="noopener">Glottolog ↗</a>`, ev); }
  });
  document.addEventListener('pointerdown', ev => { if (tip.sticky && !ev.target.closest('#tooltip') && !ev.target.closest('#svg')) tip.unpin(); });

  // ---- top bar / tabs ----
  $$('[data-open]').forEach(b => b.addEventListener('click', () => {
    const what = b.dataset.open;
    if (what === 'questions') tour.togglePopover(isMobile() ? $('#tabbar') : b);
    else if (what === 'sources') actions.openSources();
    else if (what === 'notes') actions.openNotes();
    else if (what === 'about') openAbout(D);
  }));
  $('#btnHome').addEventListener('click', () => { map.home(); });
  $('[data-tab="layers"]').addEventListener('click', () => $('#layers').classList.toggle('sheet-open'));
  $('.modal-backdrop').addEventListener('click', () => closeModal());

  // ---- keyboard ----
  document.addEventListener('keydown', e => {
    const t = e.target, typing = t.matches?.('input, textarea, select, [contenteditable]');
    if (e.key === 'Escape') {
      if (modalOpen()) return closeModal();
      if (!$('#popover').hidden) { $('#popover').hidden = true; return; }
      if (tip.sticky) return tip.unpin();
      if ($('#layers').classList.contains('sheet-open')) return $('#layers').classList.remove('sheet-open');
      if (tour.active()) return tour.stop();
      if ($('#card').classList.contains('open')) return actions.close();
      return;
    }
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/') { e.preventDefault(); search.focus(); }
    else if (e.key === ' ' && !t.closest?.('button, a, [role="button"]')) { e.preventDefault(); tl.toggle(); }
    else if (e.key === 'ArrowRight' && !t.closest?.('.tl-svg, .band')) { e.preventDefault(); actions.step(1); }
    else if (e.key === 'ArrowLeft' && !t.closest?.('.tl-svg, .band')) { e.preventDefault(); actions.step(-1); }
  });

  // ---- hooks for automated audit / debugging ----
  window.vihVerifyAll = () => verifyAll(D.sources, { force: true });
  window.vih = { D, state, map, actions, overlays, tl, tip };

  document.body.classList.add('ready');
  $('#loading').classList.add('done');
  setTimeout(() => $('#loading').remove(), 700);
}

boot().catch(err => {
  console.error('[boot]', err);
  const l = $('#loading'); if (l) { l.classList.add('error'); l.querySelector('span').textContent = 'Could not start: ' + err.message; }
});
