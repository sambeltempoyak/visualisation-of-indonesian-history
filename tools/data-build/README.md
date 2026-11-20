# Data build scripts
- `core/` — events, routes, peoples, sources (`python3 build.py` validates ids and writes data/*.json). Needs Glottolog `languages.csv` at the path in build.py.
- `story/` — builds data/stories/sumba.json from the History Timeline Canvas events (`chapters.py` holds the prose; `validate.py` checks it).
- `ethnic/` — parses Ananta et al. 2014 appendices and geolocates the groups → data/ethnic-groups.json.
Paths inside the scripts point at Claude's workspace; adjust before re-running.
