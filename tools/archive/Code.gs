/**
 * VIH Archive — Google Apps Script for the "Visualisation of Indonesian History" Drive archive.
 *
 * What it does
 *  1. setup()            builds the archive folder tree inside ROOT_ID (safe to run again; never deletes).
 *  2. doGet()            a read-only web app the map reads from: ?action=ping | manifest | list | file | search
 *                        (folder "99 PRIVATE" is never served).
 *  3. harvestBig()       downloads the BIG (Badan Informasi Geospasial) administrative boundaries — desa/kelurahan,
 *                        kabupaten/kota, provinsi — page by page into "02 SPATIAL/01 RAW/BIG …". Resumable: it re-arms
 *                        itself with a time trigger until done (Apps Script stops a run after 6 minutes).
 *  4. backupRepo()       saves a zip of the GitHub repo into "06 RELEASES" (run by hand or weekly trigger).
 *  5. linkToGitHub()     OPTIONAL: writes this web app's URL into the repo's config/archive.json, using a GitHub
 *                        fine-grained token you store in Script Properties as GITHUB_TOKEN. Otherwise just paste
 *                        the URL to Claude in chat and it will make that edit.
 *
 * Install (5 minutes): see tools/archive/README.md in the repo.
 */

// ------------------------------------------------------------------------------------------------ CONFIG
const ROOT_ID = '1eA_Zv8Y_nDcd-ECL-WLxsjzJcGHT2BxY';
const REPO = 'sambeltempoyak/visualisation-of-indonesian-history';
const BRANCH = 'main';
const PRIVATE_FOLDER = '99 PRIVATE';
const MAX_SERVE_BYTES = 45 * 1024 * 1024; // ContentService limit is ~50 MB

/** The archive tree. Leaves are folders; strings in `readme` become README.md files. */
const TREE = {
  '00 ABOUT': { readme: 'What this archive is, how it is organised, and who writes where. See STRUCTURE.md in the root.' },
  '01 STORIES': {
    readme: 'One folder per story id (same id as stories/<id>/ in the GitHub repo). The story text itself (story.md) lives in GitHub — the source of truth the app builds from. Here: research notes, long-form drafts, media (photos, scans, drawings) and exported PDFs of each story.',
    'sumba': { 'media': {}, 'notes': {} },
    'sea-slave-network': { 'media': {}, 'notes': {} },
    '_template': { 'media': {}, 'notes': {} }
  },
  '02 SPATIAL': {
    readme: 'All spatial data. 01 RAW = originals exactly as downloaded, never edited. 02 PROCESSED = simplified/dissolved/converted copies (what the app uses comes from here or from the repo). 03 USER LAYERS = layers Ejak draws, uploads or collects in the field. 04 BASEMAPS = georeferenced historical maps and rasters.',
    '01 RAW': {
      'BIG Batas Wilayah': { readme: 'Badan Informasi Geospasial, geoservices.big.go.id (rbi/rest/services/BATASWILAYAH). Harvested by harvestBig(). Licence/terms: BIG open geoservice; cite "Badan Informasi Geospasial, Batas Wilayah Administrasi".', 'desa-kelurahan': {}, 'kabupaten-kota': {}, 'provinsi': {}, 'sumba-full-resolution': {} },
      'Glottolog': {}, 'Natural Earth': {}, 'Kartapranata (Wikimedia)': {}, 'Ananta 2014 ethnic groups': {}, 'Other': {}
    },
    '02 PROCESSED': { 'admin-boundaries': {}, 'ethnic-areas': {}, 'story-geometry (lite)': {}, 'flows': {} },
    '03 USER LAYERS': { 'field GPS': {}, 'drawn': {}, 'uploads': {} },
    '04 BASEMAPS': { 'historical maps (georeferenced)': {}, 'rasters': {} }
  },
  '03 SOURCES': {
    readme: 'Bibliography mirror and per-source notes. The bibliography the app uses is data/sources.json in GitHub. Here: source-notes/<source-id>.md (paraphrase, page references, verification log) and open-access PDFs the archive may keep. Never put copyrighted PDFs in a shared folder.',
    'source-notes': {}, 'open-access pdf': {}, 'verification logs': {}
  },
  '04 EVENTS': { readme: 'Event cards and timeline canvases (History Timeline Canvas exports, event drafts before they go into data/events.json).' },
  '05 MEDIA': { readme: 'Images and drawings the app may show, with credit lines (one .md per image: credit, licence, consent).', 'images': {}, 'drawings': {}, 'audio-video': {} },
  '06 RELEASES': { readme: 'Repo snapshots made by backupRepo() and release zips.' },
  '98 LOGS': { readme: 'Harvest and sync logs written by this script.' },
  '99 PRIVATE': { readme: 'Never served by the web app. Private quote packs (verbatim quotes), personal notes, anything not for public display.' }
};

// ------------------------------------------------------------------------------------------------ SETUP
function setup() {
  const root = DriveApp.getFolderById(ROOT_ID);
  buildTree_(root, TREE);
  writeText_(root, 'STRUCTURE.md', structureMd_());
  writeText_(root, 'README.md', '# VIH Archive\n\nDrive archive of the "Visualisation of Indonesian History" map app.\nApp: https://sambeltempoyak.github.io/visualisation-of-indonesian-history/\nCode and story text: https://github.com/' + REPO + '\n\nRead STRUCTURE.md for where things go.\n');
  log_('setup', 'tree ensured');
  return 'Archive tree ready in ' + root.getName();
}

function buildTree_(parent, spec) {
  Object.keys(spec).forEach(function (name) {
    if (name === 'readme') { writeText_(parent, 'README.md', '# ' + parent.getName() + '\n\n' + spec.readme + '\n'); return; }
    const f = child_(parent, name, true);
    buildTree_(f, spec[name]);
  });
}

function structureMd_() {
  const lines = ['# Archive structure', '', 'Generated by setup() on ' + new Date().toISOString().slice(0, 10) + '.', '',
    '| Folder | Holds |', '|---|---|'];
  Object.keys(TREE).forEach(function (k) { lines.push('| ' + k + ' | ' + ((TREE[k].readme || '').split('. ')[0]) + ' |'); });
  lines.push('', '## Rules', '- GitHub is the source of truth for the app code, story text (stories/<id>/story.md), bibliography and the light geometry the app loads. Drive is the archive: originals, heavy data, media, notes, snapshots.',
    '- 01 RAW is never edited. Derivatives go to 02 PROCESSED with a note of how they were made.',
    '- Every file that came from somewhere else gets a credit line (README.md in its folder, or a sidecar .md).',
    '- 99 PRIVATE is never served by the web app and is not public.');
  return lines.join('\n') + '\n';
}

// ------------------------------------------------------------------------------------------------ WEB APP (read-only)
function doGet(e) {
  const p = (e && e.parameter) || {};
  const action = p.action || 'ping';
  try {
    if (action === 'ping') { recordEndpoint_(); return json_({ ok: true, archive: 'VIH Archive', time: new Date().toISOString(), endpoint: ScriptApp.getService().getUrl() }); }
    if (action === 'manifest') return json_(manifest_(p.refresh === '1'));
    if (action === 'list') return json_(list_(p.path || ''));
    if (action === 'file') return file_(p);
    if (action === 'search') return json_(search_(p.q || ''));
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) { return json_({ ok: false, error: String(err) }); }
}

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function manifest_(refresh) {
  const cache = CacheService.getScriptCache();
  if (!refresh) { const c = cache.get('manifest'); if (c) return JSON.parse(c); }
  const root = DriveApp.getFolderById(ROOT_ID), out = [];
  (function walk(folder, path, depth) {
    if (depth > 6) return;
    const files = folder.getFiles();
    while (files.hasNext()) { const f = files.next(); out.push({ path: path + f.getName(), id: f.getId(), size: f.getSize(), mime: f.getMimeType(), modified: f.getLastUpdated().toISOString() }); }
    const subs = folder.getFolders();
    while (subs.hasNext()) { const s = subs.next(); if (s.getName() === PRIVATE_FOLDER) continue; out.push({ path: path + s.getName() + '/', folder: true }); walk(s, path + s.getName() + '/', depth + 1); }
  })(root, '', 0);
  const m = { ok: true, generated: new Date().toISOString(), count: out.length, items: out };
  const s = JSON.stringify(m); if (s.length < 95000) cache.put('manifest', s, 600);
  return m;
}

function resolve_(path) {
  let f = DriveApp.getFolderById(ROOT_ID);
  const parts = String(path).split('/').filter(String);
  if (parts[0] === PRIVATE_FOLDER) throw new Error('private');
  for (let i = 0; i < parts.length - 1; i++) { f = child_(f, parts[i], false); if (!f) throw new Error('not found: ' + parts.slice(0, i + 1).join('/')); }
  return { folder: f, name: parts[parts.length - 1] };
}

function list_(path) {
  let folder = DriveApp.getFolderById(ROOT_ID);
  String(path).split('/').filter(String).forEach(function (n) { if (n === PRIVATE_FOLDER) throw new Error('private'); folder = child_(folder, n, false); if (!folder) throw new Error('not found'); });
  const items = [], fs = folder.getFiles(), ds = folder.getFolders();
  while (ds.hasNext()) { const d = ds.next(); if (d.getName() !== PRIVATE_FOLDER) items.push({ name: d.getName() + '/', folder: true }); }
  while (fs.hasNext()) { const f = fs.next(); items.push({ name: f.getName(), id: f.getId(), size: f.getSize(), mime: f.getMimeType() }); }
  return { ok: true, path: path, items: items };
}

function file_(p) {
  let file;
  if (p.id) { file = DriveApp.getFileById(p.id); if (!isInsideArchive_(file)) throw new Error('outside archive'); }
  else { const r = resolve_(p.path || ''); const it = r.folder.getFilesByName(r.name); if (!it.hasNext()) throw new Error('not found'); file = it.next(); }
  if (file.getSize() > MAX_SERVE_BYTES) return json_({ ok: false, error: 'too large to serve; split it', size: file.getSize() });
  const blob = file.getBlob(), mime = blob.getContentType() || '';
  if (p.b64 === '1' || !/^(text\/|application\/(json|geo\+json|xml|javascript))/.test(mime) && !/\.(md|json|geojson|topojson|csv|txt|kml|gpx)$/i.test(file.getName())) {
    return json_({ ok: true, name: file.getName(), mime: mime, base64: Utilities.base64Encode(blob.getBytes()) });
  }
  const out = ContentService.createTextOutput(blob.getDataAsString('UTF-8'));
  out.setMimeType(/json$/i.test(file.getName()) ? ContentService.MimeType.JSON : ContentService.MimeType.TEXT);
  return out;
}

function isInsideArchive_(file) {
  const seen = {}; let parents = file.getParents();
  while (parents.hasNext()) {
    let f = parents.next();
    for (let i = 0; i < 12 && f; i++) {
      if (f.getName() === PRIVATE_FOLDER) return false;
      if (f.getId() === ROOT_ID) return true;
      if (seen[f.getId()]) break; seen[f.getId()] = 1;
      const up = f.getParents(); f = up.hasNext() ? up.next() : null;
    }
  }
  return false;
}

function search_(q) {
  if (!q) return { ok: true, items: [] };
  const items = manifest_(false).items.filter(function (x) { return x.path.toLowerCase().indexOf(String(q).toLowerCase()) > -1; });
  return { ok: true, q: q, items: items.slice(0, 200) };
}

function recordEndpoint_() {
  const url = ScriptApp.getService().getUrl();
  const props = PropertiesService.getScriptProperties();
  if (!url || props.getProperty('ENDPOINT') === url) return;
  props.setProperty('ENDPOINT', url);
  writeText_(DriveApp.getFolderById(ROOT_ID), 'ARCHIVE-ENDPOINT.json', JSON.stringify({ endpoint: url, recorded: new Date().toISOString() }, null, 1));
}

// ------------------------------------------------------------------------------------------------ BIG HARVEST
/** What to harvest. maxAllowableOffset is in degrees (0 = full resolution). 0.0002° ≈ 20 m — a good archive grade
 *  that keeps the national desa set around a few hundred MB instead of ~4 GB at full resolution. */
const BIG = 'https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/';
const HARVEST = [
  { key: 'sumba-full-resolution', url: BIG + 'BATAS_DESAKEL_AR/MapServer/0', offset: 0, envelope: '118.8,-10.5,120.95,-9.0', page: 250 },
  { key: 'provinsi', url: BIG + 'BATAS_WILAYAH/MapServer/12', offset: 0.0002, page: 20 },
  { key: 'kabupaten-kota', url: BIG + 'BATAS_WILAYAH/MapServer/13', offset: 0.0002, page: 50 },
  { key: 'desa-kelurahan', url: BIG + 'BATAS_DESAKEL_AR/MapServer/0', offset: 0.0002, page: 500 }
];

function harvestBig() {
  const start = Date.now(), props = PropertiesService.getScriptProperties();
  const state = JSON.parse(props.getProperty('HARVEST') || '{"i":0,"offset":0}');
  const bigFolder = child_(child_(child_(DriveApp.getFolderById(ROOT_ID), '02 SPATIAL', true), '01 RAW', true), 'BIG Batas Wilayah', true);
  while (state.i < HARVEST.length) {
    const h = HARVEST[state.i], dest = child_(bigFolder, h.key, true);
    const geo = h.envelope ? '&geometry=' + h.envelope + '&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects' : '';
    const q = h.url + '/query?where=1%3D1' + geo + '&outFields=*&outSR=4326&orderByFields=OBJECTID&f=geojson' +
      (h.offset ? '&maxAllowableOffset=' + h.offset : '') + '&resultOffset=' + state.offset + '&resultRecordCount=' + h.page;
    const res = UrlFetchApp.fetch(q, { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) { log_('harvest', h.key + ' HTTP ' + res.getResponseCode() + ' at ' + state.offset); break; }
    const text = res.getContentText(), n = (JSON.parse(text).features || []).length;
    if (n === 0) { log_('harvest', h.key + ' done at ' + state.offset); state.i++; state.offset = 0; props.setProperty('HARVEST', JSON.stringify(state)); continue; }
    const name = h.key + '_' + ('000000' + state.offset).slice(-6) + '-' + ('000000' + (state.offset + n - 1)).slice(-6) + '.geojson';
    writeBlob_(dest, name, Utilities.newBlob(text, 'application/geo+json', name));
    state.offset += n; props.setProperty('HARVEST', JSON.stringify(state));
    if (Date.now() - start > 4.5 * 60 * 1000) { rearm_('harvestBig'); log_('harvest', 'paused at ' + h.key + ' ' + state.offset); return 'paused — will resume by trigger'; }
  }
  if (state.i >= HARVEST.length) { clearTriggers_('harvestBig'); writeText_(bigFolder, 'HARVEST-DONE.md', '# Harvest complete\n\n' + new Date().toISOString() + '\n\nSource: ' + BIG + '\nGrades: ' + HARVEST.map(function (h) { return h.key + ' (offset ' + h.offset + '°)'; }).join(', ') + '\n'); return 'harvest complete'; }
  rearm_('harvestBig'); return 'retrying later';
}

function resetHarvest() { PropertiesService.getScriptProperties().deleteProperty('HARVEST'); clearTriggers_('harvestBig'); return 'harvest state cleared'; }

// ------------------------------------------------------------------------------------------------ GITHUB
function backupRepo() {
  const url = 'https://codeload.github.com/' + REPO + '/zip/refs/heads/' + BRANCH;
  const blob = UrlFetchApp.fetch(url).getBlob().setName(new Date().toISOString().slice(0, 10) + ' visualisation-of-indonesian-history (' + BRANCH + ').zip');
  writeBlob_(child_(DriveApp.getFolderById(ROOT_ID), '06 RELEASES', true), blob.getName(), blob);
  log_('backup', blob.getName());
  return blob.getName();
}

/** Optional: write config/archive.json in the repo so the app points at this archive.
 *  Needs Script Property GITHUB_TOKEN = fine-grained token for this repo only, permission Contents: read & write. */
function linkToGitHub() {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  const endpoint = PropertiesService.getScriptProperties().getProperty('ENDPOINT') || ScriptApp.getService().getUrl();
  if (!token) throw new Error('Set Script Property GITHUB_TOKEN first, or paste the web app URL to Claude instead.');
  if (!endpoint || !/\/exec$/.test(endpoint)) throw new Error('Deploy the web app first and open its URL once (?action=ping).');
  const api = 'https://api.github.com/repos/' + REPO + '/contents/config/archive.json';
  const h = { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' };
  const cur = UrlFetchApp.fetch(api + '?ref=' + BRANCH, { headers: h, muteHttpExceptions: true });
  const sha = cur.getResponseCode() === 200 ? JSON.parse(cur.getContentText()).sha : undefined;
  const body = { message: 'Archive: point app at the Drive archive web app', branch: BRANCH,
    content: Utilities.base64Encode(JSON.stringify({ endpoint: endpoint, driveFolder: ROOT_ID, linked: new Date().toISOString() }, null, 1) + '\n', Utilities.Charset.UTF_8) };
  if (sha) body.sha = sha;
  const r = UrlFetchApp.fetch(api, { method: 'put', headers: h, contentType: 'application/json', payload: JSON.stringify(body), muteHttpExceptions: true });
  log_('github', 'config/archive.json ' + r.getResponseCode());
  return r.getResponseCode() + ' ' + (r.getResponseCode() < 300 ? 'linked' : r.getContentText().slice(0, 300));
}

// ------------------------------------------------------------------------------------------------ helpers
function child_(parent, name, create) {
  if (!parent) return null;
  const it = parent.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return create ? parent.createFolder(name) : null;
}
function writeText_(folder, name, text) { writeBlob_(folder, name, Utilities.newBlob(text, 'text/markdown', name)); }
function writeBlob_(folder, name, blob) {
  const it = folder.getFilesByName(name);
  if (it.hasNext()) { const f = it.next(); f.setTrashed(true); } // replaced copy goes to Drive's bin (recoverable 30 days)
  return folder.createFile(blob.setName(name));
}
function rearm_(fn) { clearTriggers_(fn); ScriptApp.newTrigger(fn).timeBased().after(60 * 1000).create(); }
function clearTriggers_(fn) { ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === fn) ScriptApp.deleteTrigger(t); }); }
function log_(kind, msg) {
  try {
    const logs = child_(DriveApp.getFolderById(ROOT_ID), '98 LOGS', true), name = new Date().toISOString().slice(0, 7) + ' log.md';
    const it = logs.getFilesByName(name), line = '- ' + new Date().toISOString() + ' · ' + kind + ' · ' + msg + '\n';
    if (it.hasNext()) { const f = it.next(); f.setContent(f.getBlob().getDataAsString() + line); } else logs.createFile(name, '# Log\n\n' + line, 'text/markdown');
  } catch (e) { console.log(kind, msg, e); }
}
