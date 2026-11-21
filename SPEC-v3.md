# v3 — three modes, light by default (read with SPEC.md and SPEC-v2.md)

Ejak's v3 feedback (21 Nov 2026): the app was heavy on RAM because one page loaded every layer and library. v3 splits
it into **separate pages** so a mode only loads what it needs, and leaving a mode frees its memory.

| Page | Mode | Loads | Purpose |
|---|---|---|---|
| `index.html` | Landing | topojson-client + `data/geo/lite/indonesia-prov` + `data/stories/index.json` | choose a mode / a story |
| `story.html#<id>/<n>` | **History storytelling** | Leaflet + story JSON + its lite geo packs | one story, slide by slide, chronological |
| `peoples.html` | **Indonesian indigenous peoples** | Leaflet + `data/peoples/*` (+ desa borders of one province on demand) | approximate homeland areas of the 394 mapped groups |
| `analyse.html` | **Analysis** (the v2 app) | everything: Geoman, Turf, shp, Esri, clusters, all layers, admin boundaries, archive | every layer and tool, editing, export |

## Shared code (`js/core/`, `css/v3.css`)
- `core/util.js` re-exports `js/util.js` (el, esc, clamp, mixHex, reducedMotion, isMobile…).
- `core/basemaps.js` — `setBasemap(map, id, prev)`; ids `relief | imagery | dusk | paper`; palette filters.
- `core/geo.js` — `loadTopo(url)`, `loadPack(name)` (story geometry packs: sumba-island, sumba-kab, sumba-kec,
  sumba-desa, indonesia-prov, indonesia-kab), `smoothPath([[lon,lat]…])` → dense curved [[lat,lng]…].
- `core/symbols.js` — `GLYPHS` (place kinds), `FLOWS` (flow kinds: colour light/dark, dash, speed), `AREAS` (area
  roles), `installPatterns()`, `glyphSvg()`, `placeIcon()`, `TIER` badges.
- `core/archive.js` — Drive archive client; no-op until `config/archive.json` has an endpoint.

## Geometry: lite for animation, originals for analysis (Ejak's point 7)
- **Lite** (repo, animated in Stories/Peoples): `data/geo/lite/*.topo.json` — BIG boundaries generalised hard (Sumba desa
  ~200 m; national provinces/kab at 4–6 % of vertices). Small enough to fade, pulse and redraw smoothly.
- **Analysis grade** (repo, Analyse only): `data/admin/kabkota.topo.json` (524), `data/admin/kecamatan.topo.json`
  (7,423), `data/admin/desa/<province>.topo.json` (84,503 desa in 38 files, index in `data/admin/desa/index.json` with
  bbox per province — load only the provinces in view at zoom ≥ 9).
- **Originals** (Drive archive `02 SPATIAL/01 RAW/BIG Batas Wilayah`, harvested by `tools/archive/Code.gs`): Sumba at
  full resolution, the rest at ~20 m. Never edited.
- Build: `tools/data-build/admin/build_admin.md` documents the commands (BIG REST query → mapshaper dissolve/simplify).

## Stories
Authoring contract: `stories/README.md`. Compiler/validator: `tools/stories/build.py` → `data/stories/<id>.json`:
```
{ id, title, subtitle, author, date, region, basemap, geo:[packs], cover, intro,
  slides:[{ id, label, title, text, more, year:[a,b], camera:[lat,lon,z]?,
            places:[{name,lat,lon,kind,note}], flows:[{kind, path:[[lon,lat]…], label, weight}],
            areas:[{pack,key,role,label}], layers?, sources:[{id,pages,tier,cite}], evidence }] }
```
`data/stories/index.json`: `[{id,title,subtitle,author,date,cover,region,basemap,file,slides,span:[a,b]}]`.

## Peoples
`data/peoples/ethnic-areas.topo.json` (one feature per group, property `g` = group id) +
`data/peoples/ethnic-areas.meta.json` `{method, sources, areas:{<g>:{name,island,precision,method,place,aliases,glottocode,lat,lon,source,note?}}, unmapped:{<island>:[{id,name,precision,place}]}}`.
Method (show it on the page): each desa is assigned to the nearest documented group location on the same island group,
then merged; Sumba uses Glottolog language points. Approximate homeland zones, not a census map.
