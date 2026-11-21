// story/main.js — boot and routing for story.html#<storyId>/<slide>.
import { loadIndex, loadStory } from './data.js';
import { buildPicker } from './ui.js';
import { Stage } from './stage.js';
import { Player } from './player.js';

const app = document.getElementById('app'), mapEl = document.getElementById('map'), ui = document.getElementById('ui');
let index, stage, player, bootId = 0;

const parse = () => { const [id, n] = decodeURIComponent(location.hash.slice(1)).split('/'); return { id: id || '', n: Math.max(0, parseInt(n, 10) || 0) }; };

async function route() {
  const { id, n } = parse(), my = ++bootId;
  if (player && player.story.id === id) { player.go(n, false); return; }          // same story: hash edited by hand
  player?.destroy(); player = null; stage?.clear();
  document.title = 'Stories · Visualisation of Indonesian History';
  const entry = id && index.lookup.get(id);
  if (!entry) { showPicker(id); return; }
  app.classList.add('is-loading'); app.classList.remove('is-picker');
  let story;
  try { story = await loadStory(entry); } catch (e) { console.error('[story] load failed', e); if (my === bootId) showPicker(id); return; }
  if (my !== bootId) return;
  if (!story.slides.length) { console.warn('[story] no slides in', id); showPicker(id); return; }
  story.id = entry.id; document.title = `${story.title} · Visualisation of Indonesian History`;
  app.classList.remove('is-picker'); ui.innerHTML = '';
  if (!stage) stage = new Stage(mapEl);
  stage.map.invalidateSize(); stage.setBasemap(story.basemap);
  await stage.ensurePacks(story.geo);
  if (my !== bootId) return;
  player = new Player({ root: ui, stage, story, entry });
  if (new URLSearchParams(location.search).has('dev')) window.__vs = { stage, player };
  app.classList.remove('is-loading');
  player.go(Math.min(n, story.slides.length), false, { instant: true });
}

function showPicker(missing) {
  app.classList.remove('is-loading'); app.classList.add('is-picker');
  ui.innerHTML = ''; ui.append(buildPicker(index.list, missing));
  if (missing) history.replaceState(null, '', location.pathname + location.search);
}

(async function boot() {
  try { index = await loadIndex(); } catch (e) { console.error(e); index = { list: [], lookup: new Map() }; }
  addEventListener('hashchange', route);
  route();
})();
