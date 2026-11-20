# Visualisation of Indonesian History

An interactive Leaflet web map (v2, with GIS-style layers, analysis and stories) of the Southeast Asian world that follows the historical trajectories of indigenous peoples — first settlement, Austronesian and Austroasiatic migrations, Hindu and Buddhist polities, Islam and the age of commerce, slave networks, European companies, colonial states, plantations and mines, independence, and 20th-century development — and how these peoples interacted with each other and with outsiders.

**Live:** https://sambeltempoyak.github.io/visualisation-of-indonesian-history/

## What is in it
| | |
|---|---|
| Event cards | `data/events.json` — each with dates, place, certainty flag (established / debated / estimate), peoples, routes and page-level citations |
| Routes (arrows) | `data/routes.json` — migrations, trade, pilgrimage, slave and labour routes, colonial voyages, transmigration |
| Peoples | `data/peoples.json` — ethnolinguistic groups located by Glottolog, with an impacts timeline |
| Sources | `data/sources.json` — the single bibliography; mostly peer-reviewed journals and university-press monographs, with DOI/ISBN/URL |
| Languages | `data/languages.json` — 3,205 language points from Glottolog 5.4, used to generate the language-territory layer |
| Map | `data/geo/` — Natural Earth 1:50m countries and rivers (public domain), used as the offline vector fallback and reference layers; basemaps via CARTO/OSM/Esri tiles |
| Notes | `data/notes.json` — additions and comments |

Every source can be checked from the app: **Verify** queries Crossref and OpenAlex for the DOI (title match, citation count) or Open Library for the ISBN.

## Adding or correcting things
Ask Claude in the chat, e.g. *"add to the map: the 1740 Chinese massacre in Batavia, with Raben 1996"* or *"comment on the Banda card: …"*. Claude edits the JSON files, checks every id resolves, and pushes. Notes written inside the app are kept in your browser; use **Notes → Copy request for Claude** or **Open GitHub issue** to send them.

Data contract: see `SPEC.md`. Rebuild check: every id referenced by a card must exist in its file (the app warns in the console otherwise).

## Credits
Coastlines and borders: Natural Earth. Language locations: Hammarström, Forkel, Haspelmath & Bank, *Glottolog 5.4* (CC-BY-4.0). Historical content: see `data/sources.json`. Built by Claude for Ejak (UCL Bartlett), November 2026.

## v2 notes
- Static, no build: `python3 -m http.server`, open `index.html`. `?mocktiles` draws offline stand-in tiles for development.
- Vendored in `vendor/`: Leaflet 1.9.4, Leaflet-Geoman 2.20.8, Turf 7.4.0, shpjs 6.2.0, togeojson 7.1.4, esri-leaflet 3.0.19, leaflet.heat 1.0.1, leaflet.markercluster 1.5.3, topojson-client.
- Layers are catalogued in `data/layers.json`; add stories as files in `data/stories/` and list them in `data/stories/index.json`.
- Contrast: `python3 tools/contrast.py`.
