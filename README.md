# Visualisation of Indonesian History

An interactive, Civilization-VI-style hex map of the Southeast Asian world that follows the historical trajectories of indigenous peoples — first settlement, Austronesian and Austroasiatic migrations, Hindu and Buddhist polities, Islam and the age of commerce, slave networks, European companies, colonial states, plantations and mines, independence, and 20th-century development — and how these peoples interacted with each other and with outsiders.

**Live:** https://sambeltempoyak.github.io/visualisation-of-indonesian-history/

## What is in it
| | |
|---|---|
| Event cards | `data/events.json` — each with dates, place, certainty flag (established / debated / estimate), peoples, routes and page-level citations |
| Routes (arrows) | `data/routes.json` — migrations, trade, pilgrimage, slave and labour routes, colonial voyages, transmigration |
| Peoples | `data/peoples.json` — ethnolinguistic groups located by Glottolog, with an impacts timeline |
| Sources | `data/sources.json` — the single bibliography; mostly peer-reviewed journals and university-press monographs, with DOI/ISBN/URL |
| Languages | `data/languages.json` — 3,205 language points from Glottolog 5.4, used to generate the language-territory layer |
| Map | `data/geo/` — Natural Earth 1:50m countries and rivers (public domain), turned into a procedural hex map in the browser |
| Notes | `data/notes.json` — additions and comments |

Every source can be checked from the app: **Verify** queries Crossref and OpenAlex for the DOI (title match, citation count) or Open Library for the ISBN.

## Adding or correcting things
Ask Claude in the chat, e.g. *"add to the map: the 1740 Chinese massacre in Batavia, with Raben 1996"* or *"comment on the Banda card: …"*. Claude edits the JSON files, checks every id resolves, and pushes. Notes written inside the app are kept in your browser; use **Notes → Copy request for Claude** or **Open GitHub issue** to send them.

Data contract: see `SPEC.md`. Rebuild check: every id referenced by a card must exist in its file (the app warns in the console otherwise).

## Credits
Coastlines and borders: Natural Earth. Language locations: Hammarström, Forkel, Haspelmath & Bank, *Glottolog 5.4* (CC-BY-4.0). Historical content: see `data/sources.json`. Built by Claude for Ejak (UCL Bartlett), November 2026.
