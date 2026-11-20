// story.js — storytelling mode. Stories are plain JSON (data/stories/index.json + <id>.json, schema in SPEC-v2.md):
// a left narrative column you scroll (or step with ◀ ▶) while the map flies to each chapter's camera, shows its places,
// highlights its events, toggles layers and sets the timeline window. Deep link: #story=<id>&c=<chapter number>.
import { el, esc, kv, isMobile, reducedMotion, formatRange, unwrapLon } from './util.js';
import { loadStory } from './data.js';
import { openModal, closeModal } from './cards.js';

const QUOTES_KEY = 'quotes:private';

export function createStories({ D, map, reg, state, historical, ctx }) {
  const lmap = map.map, root = document.getElementById('story');
  map.pane('p-story', 394);
  const placesGroup = L.layerGroup().addTo(lmap);
  let story = null, chapters = [], cur = -1, lock = false, quotes = null, scrollEl, progressEl, counterEl, selectEl, sections = [], listener = null;
  const cache = new Map();

  kv.get(QUOTES_KEY).then(q => { quotes = q; if (story) paintQuotes(); });

  // ----------------------------------------------------------------- picker
  function openPicker() {
    const list = D.stories || [];
    const body = el('div', { class: 'panel-body story-picker' },
      el('p', { class: 'lede-sm' }, 'Stories walk the map through a place and its history, chapter by chapter, with the timeline, layers and sources following along.'),
      list.length ? el('div', { class: 'story-cards' }, list.map(s => el('button', { class: 'story-card', onclick: () => { closeModal(); start(s.id); } },
        el('span', { class: 'sc-t' }, s.title), s.subtitle ? el('span', { class: 'sc-s' }, s.subtitle) : null,
        el('span', { class: 'sc-m' }, `${s.chapters || '?'} chapters · ${s.author || ''} · ${s.date || ''}`)))) : el('p', { class: 'muted' }, 'No stories are published yet.'),
      el('p', { class: 'muted' }, 'To add a story: put its JSON in ', el('code', {}, 'data/stories/'), ' and one line in ', el('code', {}, 'index.json'), '.'));
    openModal('Stories', body);
  }

  // ----------------------------------------------------------------- start / exit
  async function start(id, chapter = 0) {
    const meta = (D.stories || []).find(s => s.id === id); if (!meta) { ctx.toast(`Story “${id}” was not found.`); return; }
    try { story = cache.get(id) || await loadStory(meta.file); cache.set(id, story); } catch (e) { ctx.toast('Could not load the story: ' + e.message); return; }
    chapters = story.chapters || [];
    ctx.beforeStory?.();
    document.body.classList.add('story-mode'); root.hidden = false; cur = -1;
    build();
    ctx.updateInsets();
    const i = Math.max(0, Math.min(chapters.length - 1, chapter));
    go(i, { scroll: i > 0, instant: true });
  }
  function exit() {
    document.body.classList.remove('story-mode'); root.hidden = true; story = null; cur = -1;
    placesGroup.clearLayers(); historical.setForced([]); history.replaceState(null, '', location.pathname + location.search);
    ctx.updateInsets(); ctx.afterStory?.(); document.dispatchEvent(new Event('vih:declutter'));
  }

  // ----------------------------------------------------------------- DOM
  function build() {
    const sel = el('select', { 'aria-label': 'Chapters', onchange: () => go(+sel.value, { scroll: true }) }, chapters.map((c, i) => el('option', { value: i }, `${i + 1}. ${c.title}`)));
    selectEl = sel; counterEl = el('span', { class: 'sn-count' }); progressEl = el('i');
    const head = el('header', { class: 'story-head' },
      el('div', { class: 'story-top' }, el('span', { class: 'story-kicker' }, 'Story'), el('button', { class: 'btn btn-sm btn-glass', onclick: () => { navigator.clipboard?.writeText(location.href); ctx.toast('Link to this chapter copied.'); }, title: 'Copy link to this chapter' }, 'Share'), el('button', { class: 'btn btn-sm btn-glass', onclick: exit, 'aria-label': 'Exit story' }, 'Exit ✕')),
      el('h2', {}, story.title),
      el('div', { class: 'story-progress', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': chapters.length }, progressEl),
      el('div', { class: 'story-nav' }, el('button', { class: 'btn btn-sm btn-glass', 'aria-label': 'Previous chapter', onclick: () => go(cur - 1, { scroll: true }) }, '◀'), sel, counterEl, el('button', { class: 'btn btn-sm btn-glass', 'aria-label': 'Next chapter', onclick: () => go(cur + 1, { scroll: true }) }, '▶')));
    sections = chapters.map((c, i) => {
      const paras = String(c.text || '').split(/\n\n+/).map(t => el('p', {}, t));
      const cites = (c.citations || []).map(ci => { const s = ci.source_id && D.sourceById.get(ci.source_id); return el('button', { class: 'chip chip-sm' + (ci.source_id && !s ? ' chip-missing' : ''), onclick: () => ctx.openSource(ci.source_id, ci.cite), title: s ? 'Open source card (with Verify)' : 'Source not yet in the bibliography' }, ci.cite); });
      return el('section', { class: 'chap', 'data-i': i, id: `chap-${c.id || i}` },
        el('div', { class: 'chap-n' }, `Chapter ${i + 1} of ${chapters.length}`), el('h3', {}, c.title), c.period?.label ? el('div', { class: 'chap-period' }, c.period.label) : null,
        el('div', { class: 'chap-text' }, paras), el('div', { class: 'chap-quotes', 'data-i': i }),
        cites.length ? el('div', { class: 'chap-cites' }, el('span', { class: 'sec-h' }, 'Sources'), el('div', { class: 'chips' }, cites)) : null);
    });
    const quoteTools = el('div', { class: 'quote-tools' }, el('h4', {}, 'Private quotes'),
      el('p', { class: 'muted' }, 'Load your private quote pack (JSON). It is stored only in this browser (IndexedDB) and is never uploaded or published.'),
      el('div', { class: 'row' }, (() => { const f = el('input', { type: 'file', accept: '.json,application/json', id: 'quoteFile', 'aria-label': 'Choose private quote pack' }); f.addEventListener('change', async () => { if (!f.files[0]) return; try { const j = JSON.parse(await f.files[0].text()); if (typeof j !== 'object' || Array.isArray(j)) throw new Error('expected an object keyed by event id'); quotes = j; await kv.set(QUOTES_KEY, j); paintQuotes(); ctx.toast(`Loaded quotes for ${Object.keys(j).length} events — kept on this device only.`); } catch (e) { ctx.toast('Could not read that file: ' + e.message); } f.value = ''; }); return f; })(),
        el('button', { class: 'btn btn-sm', onclick: async () => { await kv.del(QUOTES_KEY); quotes = null; paintQuotes(); ctx.toast('Private quotes removed from this browser.'); } }, 'Forget quotes')));
    scrollEl = el('div', { class: 'story-scroll', tabindex: 0 }, el('div', { class: 'story-intro' }, story.intro ? String(story.intro).split(/\n\n+/).map(t => el('p', {}, t)) : null, el('p', { class: 'muted' }, `${story.author || ''}`)), ...sections, quoteTools, el('div', { class: 'story-end' }, el('button', { class: 'btn', onclick: exit }, 'Exit story')));
    root.replaceChildren(head, scrollEl);
    let tick = false;
    scrollEl.addEventListener('scroll', () => { if (lock || tick) return; tick = true; requestAnimationFrame(() => { tick = false; const top = scrollEl.getBoundingClientRect().top + scrollEl.clientHeight * 0.38; let a = -1; sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= top) a = i; }); if (a >= 0 && a !== cur) go(a, { scroll: false }); }); });
    paintQuotes();
  }
  function paintQuotes() {
    if (!story) return;
    root.querySelectorAll('.chap-quotes').forEach(box => {
      const ch = chapters[+box.dataset.i], items = quotes ? (ch.events || []).flatMap(id => quotes[id] || []) : [];
      box.replaceChildren(...items.map(q => el('blockquote', { class: 'soft-quote' }, el('p', { class: 'q-orig' }, q.quote), q.translation ? el('p', { class: 'q-tr' }, q.translation) : null, el('cite', {}, q.cite || ''))));
      box.classList.toggle('has', items.length > 0);
    });
  }

  // ----------------------------------------------------------------- chapter change
  function go(i, { scroll = false, instant = false } = {}) {
    if (!story || i < 0 || i >= chapters.length) return;
    const changed = i !== cur; cur = i; const ch = chapters[i];
    selectEl.value = String(i); counterEl.textContent = `${i + 1} / ${chapters.length}`;
    progressEl.style.width = ((i + 1) / chapters.length * 100) + '%'; progressEl.parentNode.setAttribute('aria-valuenow', i + 1);
    sections.forEach((s, j) => s.classList.toggle('active', j === i));
    if (scroll) { lock = true; sections[i].scrollIntoView({ behavior: reducedMotion() || instant ? 'auto' : 'smooth', block: 'start' }); setTimeout(() => { lock = false; }, reducedMotion() ? 50 : 900); }
    history.replaceState(null, '', `#story=${encodeURIComponent(story.id)}&c=${i + 1}`);
    if (!changed && !scroll) return;
    // --- camera
    const dur = instant ? 0 : 1.8;
    const pts = (ch.places || []).map(p => [p.lat, unwrapLon(p.lon)]);
    if (ch.camera?.center) {
      // keep the authored centre/zoom, but zoom out (and re-centre) if the chapter's places would not fit the free map area
      let c = ch.camera.center, z = ch.camera.zoom ?? 8;
      if (pts.length > 1) { const v = map.viewFor(pts, { pad: 80, maxZoom: z }); if (v.zoom < z) { c = [v.center.lat, v.center.lng]; z = v.zoom; } }
      map.flyToView(c, z, { duration: dur, animate: dur > 0 });
    } else if (ch.places?.length) map.flyToBounds(ch.places.map(p => [p.lat, unwrapLon(p.lon)]), { pad: 80, maxZoom: 10, duration: dur });
    // --- places
    placesGroup.clearLayers();
    (ch.places || []).forEach((p, k) => {
      const m = L.marker([p.lat, unwrapLon(p.lon)], { pane: 'p-story', keyboard: true, title: p.name, icon: L.divIcon({ className: 'sp-wrap', iconSize: [0, 0], html: `<div class="sp"><i class="sp-dot"></i><span class="sp-t">${esc(p.name)}</span></div>` }) });
      if (p.note) m.bindPopup(() => el('div', { class: 'vp-pop' }, el('h4', {}, p.name), el('p', {}, p.note)), { className: 'vih-popup' });
      placesGroup.addLayer(m);
    });
    document.dispatchEvent(new Event('vih:declutter'));
    // --- events + layers + time
    historical.setForced((ch.map_events || []).filter(id => D.eventById.has(id)));
    (ch.layers?.on || []).forEach(id => reg.has(id) ? reg.setVisible(id, true) : console.warn('[story] unknown layer', id));
    (ch.layers?.off || []).forEach(id => reg.has(id) && reg.setVisible(id, false));
    if (ch.period && Number.isFinite(ch.period.start)) state.set({ window: [ch.period.start, Math.max(ch.period.end ?? ch.period.start, ch.period.start + 1)], cumulative: false });
  }
  window.addEventListener('keydown', e => { if (!story || e.target.matches?.('input, textarea, select')) return; if (e.key === 'ArrowDown' && e.altKey) go(cur + 1, { scroll: true }); if (e.key === 'ArrowUp' && e.altKey) go(cur - 1, { scroll: true }); });

  // ----------------------------------------------------------------- deep links
  function fromHash() {
    const h = new URLSearchParams(location.hash.replace(/^#/, '')), id = h.get('story'); if (!id) return false;
    const c = Math.max(1, parseInt(h.get('c') || '1', 10)) - 1;
    if (story?.id === id) { go(c, { scroll: true }); return true; }
    start(id, c); return true;
  }
  window.addEventListener('hashchange', fromHash);
  return { openPicker, start, exit, fromHash, active: () => !!story, go, loadQuotes: q => { quotes = q; paintQuotes(); } };
}
