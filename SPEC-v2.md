# v2 additions to the data contract (read with SPEC.md)

v2 replaces the procedural hex map with a normal web map (Leaflet), adds a GIS layer system with spatial analysis, the 633 ethnic groups of Indonesia, the Wikimedia ethnolinguistic map as an overlay, and storytelling.

## `data/ethnic-groups.json` — the 633 groups (Ananta et al. 2014/2015, 2010 census)
```
{ "meta": { "source_id":"ananta2014", "note":"…", "counts":{"appendix1":119,"appendix2":n,"appendix3":n,"total":633} },
  "groups": [ {
    "id":"eg-acehnese", "no":1, "appendix":1,              // appendix 1 = large groups, 2 = new small groups, 3 = other small groups
    "name":"Acehnese",                                        // name as in Ananta
    "island":"Sumatra",                                       // Sumatra | Jawa-Bali | Nusa Tenggara | Kalimantan | Sulawesi | Maluku | Papua | Foreign/Other
    "codes":[{"code":"0001","label":"Aceh/Achin/Akhir/Asji/A-Tse/Ureung Aceh"}],
    "aliases":["Aceh","Achin","Ureung Aceh"],
    "lat":5.2,"lon":96.2,
    "precision":"point|district|province|island|none",       // honest spatial precision
    "method":"wikimedia-map|glottolog|manual|province-centroid|island-centroid|none",
    "place":"Kab. Pidie, Aceh",                                // human-readable homeland (kabupaten/province) when known
    "glottocode":"achi1257",                                   // when matched
    "wm_label":"ACEH",                                         // Kartapranata map label used, if any
    "note":"" } ] }
```
Groups such as "Arab", "Chinese", foreign nationals or catch-all "Other tribes of X" get precision "none" or "island" and are listed but drawn differently (or not drawn).

## `data/wikimedia-suku-labels.json` (done)
213 labels from Gunawan Kartapranata's SVG map with georeferenced lon/lat and the fit bounds (`meta.georef.bounds`) used to overlay the SVG image itself.

## `data/layers.json` — the layer catalogue (Claude adds entries on request)
```
[{ "id":"wm-suku-map", "name":"Ethnolinguistic map (Kartapranata, Wikimedia)", "group":"Reference maps",
   "type":"image|geojson|wms|xyz|arcgis-dynamic|arcgis-feature|builtin",
   "url":"…", "bounds":[[south,west],[north,east]],                     // image only
   "options":{ "layers":"…","format":"image/png","transparent":true },    // wms
   "style":{ "color":"#49546D","weight":1,"fillOpacity":0.2 },            // geojson
   "popup":["name","type"],                                               // geojson properties to show
   "attribution":"…", "source_id":"kartapranata-map", "opacity":0.7, "default":false, "note":"" }]
```
Built-in layers (events, routes, peoples, ethnic groups, Glottolog languages, Natural Earth borders, rivers) are also listed here with `type:"builtin"` so the layer manager shows one list.

## `data/stories/index.json` and `data/stories/<id>.json` — storytelling
```
index: [{ "id":"sumba", "title":"Sumba: …", "subtitle":"…", "author":"Ejak (Reza Arlianda), with Claude", "date":"2026-11-20",
          "file":"sumba.json", "region":[[-10.4,118.8],[-9.0,120.9]], "chapters":N }]
story: { "id":"sumba", "title":"…", "intro":"…",
  "chapters":[{ "id":"c01", "title":"…", "period":{"start":-3000,"end":0,"label":"c. 3000 BCE"},
      "text":"2–5 short paragraphs (\n\n) in Claude's words, no long verbatim quotes",
      "camera":{"center":[lat,lon],"zoom":9},
      "places":[{"name":"Kodi","lat":-9.56,"lon":119.03,"note":"…"}],   // markers shown during the chapter
      "events":["S012","S013"],                                         // canvas event ids (line sumba / indonesia) this chapter draws on
      "map_events":["sumba-slaves"],                                    // ids from data/events.json to highlight, optional
      "layers":{"on":["ethnic-groups"],"off":[]},                        // layer ids toggled for the chapter, optional
      "citations":[{"cite":"Hoskins, 1993, p. 45","source_id":"hoskins1993"}] }] }
```
Private quote pack (NOT in the repo): `sumba-quotes.private.json` = `{ "<canvas event id>": [ {cite, quote, translation} ] }`. The app has a "Load private quotes" button (file input) that stores it in IndexedDB/localStorage on that browser only and shows quotes under each chapter.

## Sources
`data/sources.json` stays the single bibliography. New entries for works cited in the story (from Ejak's Mendeley library) carry `"library":"mendeley"`.
