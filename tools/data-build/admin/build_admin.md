# Admin boundaries (BIG) — how data/admin and data/geo/lite were made (21 Nov 2026)

Source: Badan Informasi Geospasial, `https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_DESAKEL_AR/MapServer/0`
(84,503 desa/kelurahan polygons; fields NAMOBJ, WADMKC, WADMKK, WADMPR, KDEPUM, TIPADM). Found behind the BIG web app
`portal/apps/webappviewer/index.html?id=49bda2cefd3f4b92aa726300bcdb40f7` (web map eeb011638b754398a0a159d1ebade476).

1. Query in 85 pages of 1,000 (`orderByFields=OBJECTID&resultOffset=…`), `outSR=4326`, `maxAllowableOffset=0.002`
   (~200 m), `geometryPrecision=4`, `f=geojson`. (Run from a browser on Ejak's machine: the cloud shells cannot reach
   geoservices.big.go.id. The Apps Script `harvestBig()` does the same server-side at higher resolution into Drive.)
2. `mapshaper desa.geojson snap -clean -dissolve2 prov,kab,kec` → 7,423 kecamatan; `-dissolve2 prov,kab` → 524 kab/kota;
   `-dissolve2 prov` → 38 provinces.
3. App files: `data/admin/kecamatan.topo.json` (simplify 15 %), `data/admin/kabkota.topo.json` (30 %),
   `data/admin/desa/<prov>.topo.json` (simplify 30 %, fields desa,kec,kab,kode, quantization 4e4),
   lite packs `data/geo/lite/indonesia-prov` (4 %), `indonesia-kab` (6 %), `sumba-desa|kec|kab|island`.
4. Peoples: `data/peoples/ethnic-areas.*` — nearest-seed assignment of desa representative points (scipy cKDTree, same
   island group) to Ananta et al. 2014 groups with point/district/province precision; Sumba desa to nearest Glottolog
   language; `mapshaper -dissolve2 g -simplify 1.2% weighted`.
