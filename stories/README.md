# Stories — how they are written, checked and published

A story is **one Markdown file** in `stories/<id>/story.md`. Nothing else has to be touched to add, fix or extend a story:
`tools/stories/build.py` turns every `story.md` into `data/stories/<id>.json` and `data/stories/index.json`, and refuses to
build a slide whose claims are not backed by an acceptable source. The GitHub Action runs the same build on every push, so
a story edit is: **edit `story.md` → (optional local `python3 tools/stories/build.py`) → push.**

```
stories/
  README.md                ← this file (the contract)
  <id>/story.md            ← the story (front matter + slides)
  <id>/comments.md         ← Ejak's comments on the story and what was done about each (newest first)
  <id>/research.md         ← optional: working notes, open questions, sources still to check (not published)
```

## Front matter
```yaml
---
id: sumba                         # = folder name, a-z0-9-
title: "Sandalwood Island"
subtitle: "Sumba through time, c. 1350–2018"
author: "Ejak (Reza Arlianda), with Claude"
date: 2026-11-21
region: [[-10.4, 118.8], [-9.0, 120.9]]   # [[south, west], [north, east]] — the overview camera
basemap: relief                   # relief | imagery | dusk | paper   (see js/core/basemaps.js)
geo: [sumba-kab, sumba-desa]      # lite geometry packs this story uses (data/geo/lite/<pack>.topo.json)
cover: "One island, six centuries of being claimed."     # one line for the story card
---
Intro paragraph(s) — shown on the title slide.
```

## Slides
Every `## ` heading starts a slide. The heading is `## <year label> · <title>`. Directly under it comes **one fenced
`yaml` block** (the map instructions), then the slide text.

````markdown
## 1750s · Slaves and sandalwood
```yaml
year: 1750                 # the big counter shows this; or  year: [1750, 1780]  for a span
camera: [-9.75, 120.0, 8]  # lat, lon, zoom   (omit = fit places + flows)
areas:                     # polygons from the story's geo packs, by pack:key  — fade in, styled by role
  - { ref: sumba-kab:Sumba Timur, role: focus }        # focus | claim | contested | lost | adat | concession
places:                    # markers; kind picks the symbol
  - { name: Waingapu, at: [-9.65, 120.26], kind: port, note: "Main harbour of the east coast" }
flows:                     # animated movement lines
  - { kind: slave, from: [120.26, -9.65], to: [121.66, -8.84], via: [[121.0, -9.2]], label: "Captives to Ende", weight: 3 }
layers: { on: [], off: [] } # optional: analysis-layer ids to show in this slide
sources:                   # REQUIRED: source id from data/sources.json → page(s)
  - needham1983: "pp. 21–24"
  - bosma2020: "p. 610"
evidence: peer-reviewed    # optional override: primary (archival/census) | contested (sources disagree; say so in text)
```
Short slide text: **40–90 words**, Claude's own words (no verbatim quotes in public text). Name who says what
("Needham reports…"). Where sources disagree, say so.

> More: an optional second block after a line `> More` is shown when the reader taps "Read more" (≤150 words).
````

### Kinds
- **place kind** (symbol): `port · fort · village · kingdom · mission · school · raid · battle · market · plantation · resort · mine · adat · grave · city`
- **flow kind** (colour + motion): `trade` (sandalwood, horses, goods) · `slave` (captives, forced movement) · `migration` (people settling) · `military` (expeditions, raids) · `mission` (religion, schooling) · `colonial` (administration, claims) · `labour` (indenture, contract labour) · `capital` (investment, plantations, tourism)
- **area role**: `focus` (the subject) · `claim` (claimed overlordship) · `contested` · `lost` (land taken) · `adat` (customary territory) · `concession` (plantation/tourism permit)
- `weight` 1–4 = relative scale of the flow, stated or implied by the source; never invent numbers.

## Source rule (the point of the whole app)
Every slide cites at least one source from `data/sources.json`. The build accepts a slide when:
1. at least one cited source has `"peer_reviewed": true` (journal article, university/academic press monograph,
   refereed edited volume) — **default requirement**; or
2. the slide says `evidence: primary` and cites a source of type `primary` (archival report, colonial gazette, census) — the
   text must say it is a contemporary/colonial record; or
3. the slide says `evidence: contested` and cites ≥2 sources, at least one peer-reviewed.

Sources that are not peer reviewed (regional surveys such as Soelarto 1980, theses, websites) may be cited **alongside** a
peer-reviewed one, never alone. The app shows each citation's tier as a badge (peer-reviewed · primary · other).

New sources: add the entry to `data/sources.json` (`tools/data-build/core/sources.py` if rebuilding) with `peer_reviewed`
set honestly, a DOI/ISBN only when verified, and `"library":"mendeley"` when it is in Ejak's Mendeley library. Prefer, in order:
Ejak's Mendeley library → peer-reviewed literature found and checked online → nothing (leave the claim out).

## Comments workflow
When Ejak comments on a story: add the comment verbatim at the top of `<id>/comments.md` with the date, edit
`story.md`, and note under the comment what changed (slide numbers). That is the whole loop.
