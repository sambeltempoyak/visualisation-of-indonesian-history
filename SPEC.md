# Visualisation of Indonesian History — build spec

Static site, **no build step**: `index.html`, `css/app.css`, `js/*.js` (ES modules), `vendor/` (d3 v7, topojson-client, loaded as classic scripts → globals `d3`, `topojson`), `data/*.json`. Served by GitHub Pages from the repo root. Must work from `python3 -m http.server`.

## Purpose
An interactive, Civilization-VI-style hex map of Island and Mainland Southeast Asia (plus Taiwan, New Guinea, northern Australia, Madagascar and the Pacific for migrations) that visualises historical trajectories of indigenous peoples and how they interacted with one another, with traders and with colonial powers — from first settlement (~65,000 BP) to today. Every card carries its scholarly sources, which can be verified live (DOI → Crossref/OpenAlex).

## Data contract (all in `data/`)
### `eras.json`
`[{ "id":"deep", "name":"First Peoples", "start":-70000, "end":-3000, "blurb":"…", "sources":["bellwood2007"] }]` — 8 eras, contiguous, ascending. The app's timeline is split into these eras.

### `themes.json`
`[{ "id":"migration", "name":"Migration & settlement", "glyph":"⟿", "color":"#CCD6E6" }]` — ~14 themes. `glyph` is a single unicode character used inside the hex badge (use it, do not hard-code icons). `color` is the badge accent.

### `events.json` — the cards
```
{ "id":"out-of-taiwan", "title":"…", "start":-3000, "end":-1500,        // years; negative = BCE/BP-ish (−3000 = 3000 BCE). end optional
  "era":"austronesian", "theme":"migration", "place":"Taiwan → Luzon", "lat":22.5, "lon":121.0,
  "summary":"1–2 sentences", "detail":"1–3 paragraphs separated by \n\n",
  "certainty":"established|debated|estimate", "debate":"optional text describing competing views",
  "peoples":["amis","tagalog"], "routes":["route-id"], "related":["event-id"],
  "sources":[{"id":"bellwood2007","pages":"201–223","note":"optional what this source supports"}],
  "q":[2]   // which of the user's 16 questions this card answers (for the "Questions" guided tour)
}
```
### `routes.json` — arrows
```
{ "id":"r-out-of-taiwan", "title":"…", "kind":"migration|trade|pilgrimage|religion|colonial|slave|labour|resource|state",
  "start":-3000, "end":-1500, "path":[[lon,lat],[lon,lat],…],   // ≥2 points, drawn as a smooth curve (d3.curveCatmullRom) with arrowhead at the end
  "width":1-3, "note":"short", "event":"event-id", "sources":[{"id":"…"}] }
```
Longitudes may exceed 180 for Pacific routes (e.g. 200 = 160°W); normalise with the projection (it is rotated so this is continuous).

### `peoples.json` — indigenous / ethnolinguistic groups ("city banners")
```
{ "id":"acehnese", "name":"Acehnese", "autonym":"Ureuëng Acèh", "glottocode":"achi1257", "lat":5.2, "lon":96.4,
  "family":"Austronesian › Malayo-Polynesian › Chamic", "country":"Indonesia", "region":"Aceh, northern Sumatra",
  "summary":"…", "impacts":[{"period":"1873–1904","text":"…","sources":[{"id":"…"}]}], "sources":[{"id":"…"}] }
```
### `sources.json` — the bibliography (single source of truth)
```
{ "id":"bellwood2007", "type":"book|journal|chapter|thesis|primary|dataset|web|legal",
  "authors":"Bellwood, Peter", "year":2007, "title":"…", "container":"journal or book or publisher", "volume":"", "issue":"", "pages":"",
  "publisher":"", "doi":"10.xxxx/…" (optional), "url":"" (optional), "isbn":"" (optional),
  "peer_reviewed":true, "open_access":true|false, "note":"why it is authoritative / how used" }
```
### `notes.json` — Ejak's additions (pushed by Claude on request)
`[{ "id":"n1", "target":"event:out-of-taiwan" | "people:acehnese" | "general", "date":"2026-11-20", "author":"Ejak", "text":"…", "sources":[{"id":"…"}] }]`

### `languages.json` (already built from Glottolog 5.4)
`{source, families:{familyId:name}, cols:[name,glottocode,lat,lon,family,iso], rows:[[…]]}` — 3,205 language points.

### `geo/countries.topo.json` (object `countries`, props NAME, ADM0_A3, CONTINENT) and `geo/rivers.topo.json` (object `rivers`). From Natural Earth 50m, clipped. Pacific part is in negative longitudes.

`cities` are events with theme `urban` — no separate file.

Every reference to an id (sources, peoples, routes, related, era, theme) must resolve; the app should `console.warn` unresolved ids and show "missing source" chips rather than crash.
