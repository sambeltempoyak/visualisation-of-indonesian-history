// notes.js — repo notes (read-only, data/notes.json) + local notes (localStorage `vih.notes.v1`),
// the per-card note box, the Notes panel, "Copy request for Claude", and GitHub-issue links.
import { el, esc, store, downloadFile } from './util.js';

const KEY = 'vih.notes.v1';
const REPO = 'https://github.com/sambeltempoyak/visualisation-of-indonesian-history';
const listeners = new Set();
export const onNotesChange = f => listeners.add(f);
const emit = () => listeners.forEach(f => f());

export const localNotes = () => store.get(KEY, []);
export function addLocal(target, text) {
  const list = localNotes();
  list.push({ id: 'L' + Date.now().toString(36), target, text: text.trim(), date: new Date().toISOString().slice(0, 10), author: 'Ejak', local: true });
  store.set(KEY, list); emit();
}
export function delLocal(id) { store.set(KEY, localNotes().filter(n => n.id !== id)); emit(); }

export function issueUrl(title, target, text) {
  const body = `target: ${target}\nnote: ${text || ''}\n`;
  return `${REPO}/issues/new?title=${encodeURIComponent('Note on: ' + title)}&body=${encodeURIComponent(body)}`;
}
export function requestText(notes = localNotes()) {
  return 'Please add to the map:\n' + notes.map(n => `- target: ${n.target}\n- note: ${n.text}`).join('\n');
}
async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) {
    const ta = el('textarea', { style: 'position:fixed;opacity:0' }); ta.value = text; document.body.append(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e2) { /* ignore */ } ta.remove(); return ok;
  }
}

const noteItem = (n, { local, onDelete, withTarget, D } = {}) => {
  const tgt = withTarget ? targetLabel(D, n.target) : null;
  return el('li', { class: 'note' + (local ? ' note-local' : '') },
    el('div', { class: 'note-meta' }, el('span', { class: 'tag ' + (local ? 'b-local' : 'b-repo') }, local ? 'local' : 'repo'), el('span', {}, `${n.author || 'Ejak'} · ${n.date || ''}`),
      tgt ? el('span', { class: 'note-target' }, tgt) : null,
      local ? el('button', { class: 'link-btn', 'aria-label': 'Delete note', onclick: () => onDelete(n.id) }, 'delete') : null),
    el('p', {}, n.text),
    (n.sources || []).length ? el('p', { class: 'note-src' }, 'Sources: ' + n.sources.map(s => s.id ?? s).join(', ')) : null);
};

export function targetLabel(D, target) {
  const [k, id] = (target || '').split(':');
  if (k === 'event') return 'Event · ' + (D.eventById.get(id)?.title || id);
  if (k === 'people') return 'People · ' + (D.peopleById.get(id)?.name || id);
  return 'General';
}

/** The "Notes" block at the bottom of a card. */
export function notesSection(D, target, title) {
  const wrap = el('section', { class: 'card-sec notes-sec' }, el('h3', { class: 'sec-h' }, 'Notes'));
  const list = el('ul', { class: 'notes-list' });
  const ta = el('textarea', { rows: 3, placeholder: 'Add a note…  (saved in this browser)', 'aria-label': 'Add a note' });
  const issue = el('a', { class: 'btn btn-quiet', target: '_blank', rel: 'noopener', href: issueUrl(title, target, '') }, 'Open GitHub issue');
  ta.addEventListener('input', () => { issue.href = issueUrl(title, target, ta.value); });
  const save = el('button', { class: 'btn btn-primary', onclick: () => { if (!ta.value.trim()) return; addLocal(target, ta.value); ta.value = ''; issue.href = issueUrl(title, target, ''); } }, 'Save note');
  const render = () => {
    list.replaceChildren(
      ...(D.notes || []).filter(n => n.target === target).map(n => noteItem(n, {})),
      ...localNotes().filter(n => n.target === target).map(n => noteItem(n, { local: true, onDelete: delLocal })));
    if (!list.children.length) list.append(el('li', { class: 'muted' }, 'No notes yet.'));
  };
  render();
  const off = f => listeners.add(f); off(() => { if (wrap.isConnected) render(); });
  wrap.append(list, ta, el('div', { class: 'row' }, save, issue));
  return wrap;
}

/** Content for the Notes modal. */
export function notesPanel(D) {
  const root = el('div', { class: 'panel-body' });
  const render = () => {
    const loc = localNotes();
    const repo = D.notes || [];
    const copyBtn = el('button', { class: 'btn btn-primary', onclick: async e => { const ok = await copy(requestText(loc)); e.target.textContent = ok ? 'Copied ✓' : 'Copy failed'; setTimeout(() => { e.target.textContent = 'Copy request for Claude'; }, 1600); } }, 'Copy request for Claude');
    copyBtn.disabled = !loc.length;
    const dl = el('button', { class: 'btn', onclick: () => downloadFile('vih-local-notes.json', JSON.stringify(loc.map(({ local, ...n }) => n), null, 2)) }, 'Download notes JSON');
    dl.disabled = !loc.length;
    root.replaceChildren(
      el('p', { class: 'lede-sm' }, 'Notes you add on a card stay in this browser. Copy them as a request and paste it to Claude in the chat — Claude adds them to data/notes.json.'),
      el('div', { class: 'row' }, copyBtn, dl),
      el('h3', { class: 'sec-h' }, `Local notes (${loc.length})`),
      el('ul', { class: 'notes-list' }, loc.length ? loc.map(n => noteItem(n, { local: true, onDelete: delLocal, withTarget: true, D })) : el('li', { class: 'muted' }, 'None yet. Open any card and use “Add a note”.')),
      el('h3', { class: 'sec-h' }, `Notes in the repository (${repo.length})`),
      el('ul', { class: 'notes-list' }, repo.length ? repo.map(n => noteItem(n, { withTarget: true, D })) : el('li', { class: 'muted' }, 'None yet.')));
  };
  render(); listeners.add(() => { if (root.isConnected) render(); });
  return root;
}
