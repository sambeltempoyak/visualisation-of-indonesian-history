// cards.js — Civilopedia-style card drawer (event, people, route), source lists with live "Verify",
// the Sources panel (bibliography, filters, BibTeX/JSON export) and the shared modal helper.
import { el, esc, clamp, formatRange, formatYear, hashStr, rng, mix, rgb2css, PAL, textGlyph, downloadFile } from './util.js';
import { verifySource, verifyAll, onVerify, cached } from './verify.js';
import { notesSection, targetLabel } from './notes.js';
import { eraOf } from './data.js';

// ---------- modal ----------
export function openModal(title, content, { wide = false, onClose } = {}) {
  const m = document.getElementById('modal'), sheet = document.getElementById('modalSheet');
  const close = el('button', { class: 'btn btn-icon x-btn', 'aria-label': 'Close', onclick: () => closeModal() }, '✕');
  sheet.className = 'modal-sheet' + (wide ? ' wide' : '');
  sheet.replaceChildren(el('header', { class: 'modal-head' }, el('h2', {}, title), close), el('div', { class: 'modal-body' }, content));
  m.hidden = false; m._onClose = onClose; document.body.classList.add('modal-open');
  requestAnimationFrame(() => { m.classList.add('open'); close.focus(); });
}
export function closeModal() {
  const m = document.getElementById('modal'); if (m.hidden) return;
  m.classList.remove('open'); m.hidden = true; document.body.classList.remove('modal-open'); m._onClose?.(); m._onClose = null;
}
export const modalOpen = () => !document.getElementById('modal').hidden;

// ---------- source formatting ----------
const doiUrl = s => s.doi ? `https://doi.org/${s.doi}` : null;
const TYPE_LABEL = { book: 'Book', journal: 'Journal article', chapter: 'Chapter', thesis: 'Thesis', primary: 'Primary source', dataset: 'Dataset', web: 'Web', legal: 'Legal' };

/** Citation as DOM (italic book titles / journal names). */
export function citeDom(s, pages) {
  const q = t => `“${t}”`, i = t => el('em', {}, t);
  const parts = [el('span', { class: 'c-auth' }, s.authors || 'Anon.'), ` (${s.year ?? 'n.d.'}). `];
  const vol = s.volume ? ` ${s.volume}${s.issue ? `(${s.issue})` : ''}` : '';
  const pg = s.pages ? (/^\d/.test(s.pages) ? `: ${s.pages}` : `, ${s.pages}`) : '';
  if (s.type === 'book' || s.type === 'thesis') parts.push(i(s.title), '. ', [s.container, (s.publisher && s.container && (s.publisher.includes(s.container) || s.container.includes(s.publisher))) ? (s.publisher.length > s.container.length ? s.publisher : null) : s.publisher].filter(Boolean).filter((v, k, a) => !(k === 1 && a[0] && v.includes(a[0])) || true).slice(-2).filter((v, k, a) => !(k === 0 && a.length === 2 && a[1].includes(v))).join(', '));
  else if (s.type === 'chapter') parts.push(q(s.title), '. In ', i(s.container || ''), s.publisher ? `. ${s.publisher}` : '', s.pages ? `, ${s.pages}` : '');
  else if (s.type === 'journal') parts.push(q(s.title), '. ', i(s.container || ''), vol + pg);
  else parts.push(i(s.title), s.container ? `. ${s.container}` : '', s.publisher && s.publisher !== s.container ? `. ${s.publisher}` : '');
  const last = parts[parts.length - 1]; if (typeof last === 'string' && !/[.)]$/.test(last)) parts.push('.');
  return el('span', { class: 'cite' }, parts);
}

/** One numbered source entry with badges + Verify button. */
export function sourceItem(D, ref, n) {
  const id = ref.id ?? ref, s = D.sourceById.get(id);
  if (!s) return el('li', { class: 'src missing' }, el('span', { class: 'chip chip-missing' }, `missing source: ${id}`));
  const result = el('div', { class: 'verify-result', 'aria-live': 'polite' });
  const paint = r => { result.className = 'verify-result ' + (r ? 'st-' + r.status : ''); result.textContent = r ? r.detail : ''; };
  paint(cached(id));
  const btn = el('button', { class: 'btn btn-sm btn-quiet', onclick: async () => { btn.disabled = true; btn.textContent = 'Checking…'; result.className = 'verify-result st-busy'; result.textContent = 'Contacting Crossref / OpenAlex…'; await verifySource(s, { force: true }); btn.disabled = false; btn.textContent = 'Verify'; } }, 'Verify');
  onVerify(r => { if (r.id === id && result.isConnected) paint(r); });
  const links = [doiUrl(s) && el('a', { href: doiUrl(s), target: '_blank', rel: 'noopener' }, 'doi:' + s.doi), s.url && el('a', { href: s.url, target: '_blank', rel: 'noopener' }, 'Link ↗'), s.isbn && el('span', { class: 'isbn' }, 'ISBN ' + s.isbn)].filter(Boolean);
  return el('li', { class: 'src', 'data-src': id },
    el('div', { class: 'src-main' },
      el('div', { class: 'src-cite' }, citeDom(s), ref.pages ? el('span', { class: 'src-pages' }, ` pp. ${ref.pages}`) : null),
      el('div', { class: 'src-badges' }, el('span', { class: 'tag' }, TYPE_LABEL[s.type] || s.type),
        s.peer_reviewed ? el('span', { class: 'tag b-peer' }, 'Peer-reviewed') : null, s.open_access ? el('span', { class: 'tag b-oa' }, 'Open access') : null,
        s.library === 'mendeley' ? el('span', { class: 'tag b-lib' }, 'Ejak\'s library') : null),
      ref.note || s.note ? el('div', { class: 'src-note' }, ref.note || s.note) : null,
      el('div', { class: 'src-links' }, links, btn), result));
}
function sourcesList(D, refs, { title = 'Sources' } = {}) {
  const sec = el('section', { class: 'card-sec' });
  const ol = el('ol', { class: 'sources' }, refs.map((r, i) => sourceItem(D, r, i + 1)));
  const all = el('button', { class: 'btn btn-sm', onclick: async () => {
    all.disabled = true; all.textContent = 'Verifying…';
    const list = refs.map(r => D.sourceById.get(r.id ?? r)).filter(Boolean);
    await verifyAll(list, { force: true, onProgress: (d, t) => { all.textContent = `Verifying ${d}/${t}…`; } });
    all.disabled = false; all.textContent = 'Verify all';
  } }, 'Verify all');
  sec.append(el('div', { class: 'sec-row' }, el('h3', { class: 'sec-h' }, `${title} (${refs.length})`), refs.length ? all : null), refs.length ? ol : el('p', { class: 'muted' }, 'No sources listed.'));
  return sec;
}

// ---------- header band with procedural hex/batik pattern ----------
export function patternSvg(seedStr, color, w = 440, h = 170) {
  const R = rng(hashStr(seedStr)), r = 13, dx = Math.sqrt(3) * r, dy = 1.5 * r;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('preserveAspectRatio', 'xMidYMid slice'); svg.setAttribute('aria-hidden', 'true'); svg.classList.add('pattern');
  const pts = rad => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 180 * (30 + 60 * i); return `${(Math.cos(a) * rad).toFixed(1)},${(Math.sin(a) * rad).toFixed(1)}`; }).join(' ');
  let g = '';
  for (let row = -1; row * dy < h + r; row++) for (let c = -1; c * dx < w + r; c++) {
    const x = c * dx + (row & 1 ? dx / 2 : 0), y = row * dy, p = R();
    // fade pattern toward the left (where the text sits)
    const fade = clamp((x / w) * 1.25 - 0.1, 0.05, 1);
    if (p < 0.16) g += `<polygon points="${pts(r - 1.5)}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" fill="${color}" fill-opacity="${(0.34 * fade).toFixed(2)}"/>`;
    else if (p < 0.30) g += `<polygon points="${pts(r - 2)}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" fill="none" stroke="${color}" stroke-opacity="${(0.55 * fade).toFixed(2)}" stroke-width="1.1"/>`;
    else if (p < 0.34) g += `<polygon points="${pts(r - 2)}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" fill="none" stroke="${color}" stroke-opacity="${(0.5 * fade).toFixed(2)}" stroke-width="1"/><polygon points="${pts(r - 7)}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" fill="${color}" fill-opacity="${(0.4 * fade).toFixed(2)}"/>`;
    else if (p < 0.4) g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6" fill="${color}" fill-opacity="${(0.6 * fade).toFixed(2)}"/>`;
  }
  svg.innerHTML = g; return svg;
}

const CERT = { established: ['● Established', 'Established: broad scholarly agreement'], debated: ['◐ Debated', 'Debated: competing scholarly interpretations'], estimate: ['○ Estimate', 'Estimate: approximate date or figure'] };

export function createCards({ D, state, actions }) {
  const root = document.getElementById('card');

  const chip = (text, attrs = {}) => el('button', { class: 'chip', ...attrs }, text);
  const head = ({ seed, color, glyph, title, sub, chips, nav }) => el('header', { class: 'card-head' },
    patternSvg(seed, color), el('div', { class: 'card-head-shade' }),
    el('div', { class: 'card-tools' }, ...nav),
    el('div', { class: 'card-chips' }, chips),
    el('div', { class: 'card-title-row' },
      glyph ? el('div', { class: 'card-glyph', style: `--c:${color}` }, textGlyph(glyph)) : null,
      el('div', {}, el('h2', { class: 'card-title' }, title), sub)));

  function show(content, key) {
    root.replaceChildren(content);
    root.classList.add('open'); root.setAttribute('aria-hidden', 'false'); root.dataset.key = key;
    content.scrollTop = 0; document.body.classList.add('card-open');
  }
  const tools = (extra = []) => [
    ...extra,
    el('button', { class: 'btn btn-icon btn-glass', 'aria-label': 'Close card (Esc)', title: 'Close (Esc)', onclick: () => actions.close() }, '✕')];
  const navBtns = () => [
    el('button', { class: 'btn btn-icon btn-glass', 'aria-label': 'Previous event', title: 'Previous event', onclick: () => actions.step(-1) }, '‹'),
    el('button', { class: 'btn btn-icon btn-glass', 'aria-label': 'Next event', title: 'Next event', onclick: () => actions.step(1) }, '›')];
  const back = () => actions.canBack() ? [el('button', { class: 'btn btn-glass btn-sm', onclick: () => actions.back() }, '‹ Back')] : [];

  // ---------------- EVENT ----------------
  function eventCard(e) {
    const th = D.themeById.get(e.theme), era = D.eraById.get(e.era);
    const col = th?.color || PAL.water;
    const [cl, ct] = CERT[e.certainty] || CERT.estimate;
    const body = el('div', { class: 'card-body' });
    body.append(el('p', { class: 'lede' }, e.summary || ''));
    (e.detail || '').split(/\n\n+/).filter(Boolean).forEach(p => body.append(el('p', { class: 'para' }, p)));
    if (e.debate) body.append(el('aside', { class: 'debate' }, el('div', { class: 'debate-h' }, 'Debate'), el('p', {}, e.debate)));
    const peoples = (e.peoples || []).map(id => D.peopleById.get(id) ? chip(D.peopleById.get(id).name, { onclick: () => actions.select('people', id) }) : el('span', { class: 'chip chip-missing' }, `missing people: ${id}`));
    if (peoples.length) body.append(el('section', { class: 'card-sec' }, el('h3', { class: 'sec-h' }, 'Peoples involved'), el('div', { class: 'chips' }, peoples)));
    const routes = (D.routesOfEvent.get(e.id) || []).map(r => chip('↝ ' + r.title, { onclick: () => actions.flyRoute(r.id) }));
    if (routes.length) body.append(el('section', { class: 'card-sec' }, el('h3', { class: 'sec-h' }, 'Connected routes'), el('div', { class: 'chips' }, routes)));
    const rel = (e.related || []).map(id => D.eventById.get(id) ? chip(D.eventById.get(id).title, { onclick: () => actions.select('event', id) }) : null).filter(Boolean);
    if (rel.length) body.append(el('section', { class: 'card-sec' }, el('h3', { class: 'sec-h' }, 'Related'), el('div', { class: 'chips' }, rel)));
    body.append(sourcesList(D, e.sources || []));
    body.append(notesSection(D, 'event:' + e.id, e.title));
    const sub = el('div', { class: 'card-sub' }, el('span', {}, formatRange(e.start, e.end)), e.place ? el('span', { class: 'dot' }, '·') : null, e.place ? el('span', {}, e.place) : null);
    const wrap = el('div', { class: 'card-scroll' },
      head({ seed: e.id, color: col, glyph: th?.glyph, title: e.title, sub,
        chips: [era ? el('span', { class: 'chip chip-glass', title: `${era.name}` }, era.name) : null, th ? el('span', { class: 'chip chip-glass' }, th.name) : null, el('span', { class: 'chip chip-glass cert-' + e.certainty, title: ct }, cl)],
        nav: tools([...back(), ...navBtns()]) }), body);
    return wrap;
  }

  // ---------------- PEOPLE ----------------
  function peopleCard(p) {
    const body = el('div', { class: 'card-body' });
    const meta = el('dl', { class: 'meta' },
      p.autonym ? [el('dt', {}, 'Autonym'), el('dd', {}, p.autonym)] : null,
      p.family ? [el('dt', {}, 'Family'), el('dd', {}, p.family)] : null,
      [el('dt', {}, 'Region'), el('dd', {}, [p.region, p.country].filter(Boolean).join(', '))],
      p.glottocode ? [el('dt', {}, 'Glottolog'), el('dd', {}, el('a', { href: `https://glottolog.org/resource/languoid/id/${p.glottocode}`, target: '_blank', rel: 'noopener' }, p.glottocode + ' ↗'))] : null);
    body.append(el('p', { class: 'lede' }, p.summary || ''), meta);
    const imp = p.impacts || [];
    const allRefs = []; const seen = new Set();
    const add = r => { const id = r.id ?? r; if (!seen.has(id)) { seen.add(id); allRefs.push({ id }); } };
    (p.sources || []).forEach(add); imp.forEach(i => (i.sources || []).forEach(add));
    if (imp.length) {
      const tl = el('ol', { class: 'through-time' }, imp.map(i => el('li', {},
        el('div', { class: 'tt-period' }, i.period), el('p', {}, i.text),
        (i.sources || []).length ? el('div', { class: 'tt-src' }, (i.sources || []).map(s => { const x = D.sourceById.get(s.id); return el('span', { class: 'chip chip-sm' + (x ? '' : ' chip-missing') }, x ? `${(x.authors || '').split(',')[0]} ${x.year}` : `missing: ${s.id}`); })) : null)));
      body.append(el('section', { class: 'card-sec' }, el('h3', { class: 'sec-h' }, 'Through time'), tl));
    }
    const evs = D.eventsOfPeople.get(p.id) || [];
    if (evs.length) body.append(el('section', { class: 'card-sec' }, el('h3', { class: 'sec-h' }, `Events mentioning ${p.name}`), el('div', { class: 'chips' }, evs.map(e => chip(`${formatYear(e.start)} · ${e.title}`, { onclick: () => actions.select('event', e.id) })))));
    body.append(sourcesList(D, allRefs));
    body.append(notesSection(D, 'people:' + p.id, p.name));
    const sub = el('div', { class: 'card-sub' }, [p.region, p.country].filter(Boolean).join(', '));
    return el('div', { class: 'card-scroll' }, head({ seed: p.id, color: PAL.water, glyph: '❖', title: p.name, sub,
      chips: [el('span', { class: 'chip chip-glass' }, 'People'), p.family ? el('span', { class: 'chip chip-glass' }, p.family.split('›').pop().trim()) : null], nav: tools(back()) }), body);
  }

  // ---------------- ROUTE (no linked event) ----------------
  function routeCard(r) {
    const body = el('div', { class: 'card-body' });
    body.append(el('p', { class: 'lede' }, r.note || r.title));
    const ev = r.event && D.eventById.get(r.event);
    if (ev) body.append(el('section', { class: 'card-sec' }, el('h3', { class: 'sec-h' }, 'Event'), el('div', { class: 'chips' }, chip(ev.title, { onclick: () => actions.select('event', ev.id) }))));
    body.append(sourcesList(D, r.sources || []));
    return el('div', { class: 'card-scroll' }, head({ seed: r.id, color: PAL.water, glyph: '↝', title: r.title, sub: el('div', { class: 'card-sub' }, formatRange(r.start, r.end)),
      chips: [el('span', { class: 'chip chip-glass' }, 'Route'), el('span', { class: 'chip chip-glass' }, r.kind)], nav: tools(back()) }), body);
  }

  return {
    openEvent(id) { const e = D.eventById.get(id); if (e) show(eventCard(e), 'event:' + id); },
    openPeople(id) { const p = D.peopleById.get(id); if (p) show(peopleCard(p), 'people:' + id); },
    openRoute(id) { const r = D.routeById.get(id); if (r) show(routeCard(r), 'route:' + id); },
    close() { root.classList.remove('open'); root.setAttribute('aria-hidden', 'true'); delete root.dataset.key; document.body.classList.remove('card-open'); },
    isOpen: () => root.classList.contains('open')
  };
}

// ---------------- BibTeX ----------------
const bibEsc = s => String(s ?? '').replace(/([&%$#_])/g, '\\$1');
export function toBibtex(sources) {
  const typeOf = { book: 'book', journal: 'article', chapter: 'incollection', thesis: 'phdthesis' };
  return sources.map(s => {
    const t = typeOf[s.type] || 'misc', f = [];
    const add = (k, v) => { if (v !== undefined && v !== null && v !== '') f.push(`  ${k} = {${bibEsc(v)}}`); };
    add('author', (s.authors || '').split(/;\s*/).join(' and '));
    f.push(`  title = {{${bibEsc(s.title)}}}`);
    add('year', s.year);
    if (t === 'article') { add('journal', s.container); add('volume', s.volume); add('number', s.issue); add('pages', (s.pages || '').replace(/[–—-]+/g, '--')); }
    else if (t === 'incollection') { add('booktitle', s.container); add('publisher', s.publisher); add('pages', (s.pages || '').replace(/[–—-]+/g, '--')); }
    else if (t === 'phdthesis') { add('school', s.container || s.publisher); }
    else { add('publisher', s.publisher || (t === 'book' ? s.container : '')); if (t === 'misc') add('howpublished', s.container); }
    if (s.doi) f.push(`  doi = {${s.doi}}`);
    if (s.url) f.push(`  url = {${s.url}}`);
    add('isbn', s.isbn); add('note', s.note);
    return `@${t}{${s.id},\n${f.join(',\n')}\n}`;
  }).join('\n\n') + '\n';
}

// ---------------- Sources panel ----------------
export function sourcesPanel(D, { actions, query = '' } = {}) {
  const root = el('div', { class: 'panel-body sources-panel' });
  const q = el('input', { type: 'search', placeholder: 'Search sources…', 'aria-label': 'Search sources', value: query });
  const type = el('select', { 'aria-label': 'Filter by type' }, el('option', { value: '' }, 'All types'), ...Object.entries(TYPE_LABEL).map(([k, v]) => el('option', { value: k }, v)));
  const peer = el('input', { type: 'checkbox', id: 'f-peer' }), oa = el('input', { type: 'checkbox', id: 'f-oa' });
  const sort = el('select', { 'aria-label': 'Sort' }, el('option', { value: 'author' }, 'Sort: author'), el('option', { value: 'year' }, 'Sort: year (old → new)'), el('option', { value: 'yeard' }, 'Sort: year (new → old)'), el('option', { value: 'cites' }, 'Sort: most cited here'));
  const count = el('span', { class: 'muted' });
  const list = el('ul', { class: 'src-cards' });
  const vAll = el('button', { class: 'btn', onclick: async () => { vAll.disabled = true; const t = vAll.textContent; await verifyAll(D.sources, { force: true, onProgress: (d, n) => { vAll.textContent = `Verifying ${d}/${n}…`; } }); vAll.textContent = t; vAll.disabled = false; render(); } }, 'Verify all');
  const bib = el('button', { class: 'btn', onclick: () => downloadFile('vih-sources.bib', toBibtex(D.sources), 'text/plain') }, 'Download BibTeX');
  const js = el('button', { class: 'btn', onclick: () => downloadFile('vih-sources.json', JSON.stringify(D.sources, null, 2)) }, 'Download JSON');
  root.append(
    el('div', { class: 'filters' }, q, type, sort,
      el('label', { class: 'check', for: 'f-peer' }, peer, 'Peer-reviewed only'), el('label', { class: 'check', for: 'f-oa' }, oa, 'Open access')),
    el('div', { class: 'row sp' }, count, el('div', { class: 'row' }, vAll, bib, js)), list);
  function citing(s) {
    const items = D.citedBy.get(s.id) || [];
    const box = el('div', { class: 'cited-list', hidden: true }, items.map(c => el('button', { class: 'chip chip-sm', onclick: () => { if (c.kind === 'era') return; closeModal(); actions.select(c.kind, c.id); } }, `${c.kind === 'event' ? '' : c.kind + ': '}${c.title}`)));
    const b = el('button', { class: 'link-btn', 'aria-expanded': 'false', onclick: () => { box.hidden = !box.hidden; b.setAttribute('aria-expanded', !box.hidden); } }, `Cited in ${items.length} card${items.length === 1 ? '' : 's'}`);
    return [b, box];
  }
  function render() {
    const needle = q.value.trim().toLowerCase();
    let rows = D.sources.filter(s => (!type.value || s.type === type.value) && (!peer.checked || s.peer_reviewed) && (!oa.checked || s.open_access) &&
      (!needle || `${s.authors} ${s.year} ${s.title} ${s.container || ''} ${s.id}`.toLowerCase().includes(needle)));
    const by = { author: (a, b) => (a.authors || '').localeCompare(b.authors || '') || a.year - b.year, year: (a, b) => a.year - b.year, yeard: (a, b) => b.year - a.year,
      cites: (a, b) => (D.citedBy.get(b.id) || []).length - (D.citedBy.get(a.id) || []).length };
    rows = rows.sort(by[sort.value]);
    count.textContent = `${rows.length} of ${D.sources.length} sources`;
    list.replaceChildren(...rows.map(s => el('li', { class: 'src-card' }, el('ol', { class: 'sources one' }, sourceItem(D, { id: s.id }, 0)), el('div', { class: 'src-cited' }, citing(s)))));
  }
  [q, type, sort, peer, oa].forEach(c => c.addEventListener('input', render)); render();
  return root;
}
