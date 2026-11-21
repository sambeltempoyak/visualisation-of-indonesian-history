// archivepanel.js — "Archive" panel for Analyse: lists the Drive archive manifest (core/archive.js) with a filter box.
// Until config/archive.json has an endpoint it says so plainly. Nothing is fetched until the panel is opened.
import { el } from './util.js';
import { openModal } from './cards.js';
import { archive } from './core/archive.js';

const fmt = n => n == null ? '' : n > 1e6 ? (n / 1e6).toFixed(1) + ' MB' : n > 1e3 ? Math.round(n / 1e3) + ' KB' : n + ' B';

export async function openArchive() {
  const body = el('div', { class: 'panel-body archive-panel' }, el('p', { class: 'muted' }, 'Checking the archive…'));
  openModal('Archive', body, { wide: true });
  let ready = false;
  try { ready = await archive.ready(); } catch (e) { ready = false; }
  if (!ready) {
    body.replaceChildren(
      el('p', { class: 'lede-sm' }, 'Drive archive not connected yet (see tools/archive/README.md).'),
      el('p', { class: 'muted' }, 'The archive holds the original boundary files, heavy data and research notes. Once the Apps Script web app is deployed and its URL is in config/archive.json, the files will be listed here.'));
    return;
  }
  let m;
  try { m = await archive.manifest(); } catch (e) { body.replaceChildren(el('p', { class: 'muted' }, 'The archive could not be reached: ' + e.message)); return; }
  const items = (m?.items || (Array.isArray(m) ? m : [])).slice().sort((a, b) => String(a.path).localeCompare(String(b.path)));
  const list = el('div', { class: 'arch-list', role: 'list' }), count = el('p', { class: 'muted' });
  const filter = el('input', { type: 'search', class: 'arch-filter', placeholder: 'Filter by path…', 'aria-label': 'Filter archive files' });
  const paint = () => {
    const q = filter.value.trim().toLowerCase(), shown = items.filter(x => !q || String(x.path).toLowerCase().includes(q));
    count.textContent = `${shown.length} of ${items.length} files`;
    list.replaceChildren(...shown.slice(0, 300).map(x => el('div', { class: 'arch-row', role: 'listitem' }, el('span', { class: 'arch-path' }, x.path), el('span', { class: 'arch-size' }, fmt(x.size)))));
    if (shown.length > 300) list.append(el('p', { class: 'muted' }, 'Showing the first 300 — narrow the filter.'));
  };
  filter.addEventListener('input', paint);
  body.replaceChildren(filter, count, list); paint();
}
