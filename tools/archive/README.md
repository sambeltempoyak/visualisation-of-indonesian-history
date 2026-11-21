# VIH Archive (Google Drive + Apps Script)

The app's long-term archive is a Google Drive folder (`1eA_Zv8Y_nDcd-ECL-WLxsjzJcGHT2BxY`). `Code.gs` turns it into a
small read-only web service the map can read from, builds the folder tree, harvests the BIG boundary data into it, and
backs up the repo.

## Who keeps what
| GitHub repo (source of truth for the app) | Drive archive |
|---|---|
| code, `stories/<id>/story.md`, `data/sources.json`, the **light** geometry the app loads (`data/geo/lite`, `data/admin`) | **originals** (`02 SPATIAL/01 RAW`, never edited), heavy data, media, research notes, repo snapshots, private material (`99 PRIVATE`, never served) |

## Install (once, ~5 minutes)
1. Open the Drive folder in the Google account that owns it → **New → More → Google Apps Script**. Name the project `VIH Archive`.
2. Replace the default `Code.gs` with this file's contents. Save.
3. Choose `setup` in the function menu → **Run** → approve the permissions (Drive, external requests, triggers). The folder tree appears.
4. **Deploy → New deployment → type: Web app** → *Execute as:* **Me** · *Who has access:* **Anyone** → Deploy. Copy the URL ending in `/exec`.
5. Open that URL once with `?action=ping` on the end. It answers `{"ok":true…}` and writes `ARCHIVE-ENDPOINT.json` in the folder.
6. Paste the URL to Claude in chat (it edits `config/archive.json` and pushes). Or, to have the script do it: add a Script Property
   `GITHUB_TOKEN` (fine-grained token, this repo only, *Contents: read and write*) and run `linkToGitHub`.
7. Optional: run `harvestBig` once. It keeps re-scheduling itself every minute until the BIG boundaries are all in
   `02 SPATIAL/01 RAW/BIG Batas Wilayah` (Sumba at full resolution; the rest at ~20 m). Expect 1–2 hours and a few hundred MB.
   Run `backupRepo` whenever you want a dated zip of the repo in `06 RELEASES` (or add a weekly time trigger for it).

## Endpoints (`<URL>?action=…`)
- `ping` — health check, records the endpoint.
- `manifest` (`&refresh=1` to rebuild) — every file: path, id, size, mime, modified.
- `list&path=02 SPATIAL/01 RAW` — one folder.
- `file&path=…` or `file&id=…` — text files as text, others as base64 JSON (≤45 MB).
- `search&q=sumba` — path search.
Anything under `99 PRIVATE` is refused.

## Security notes
- "Anyone" access means anyone with the URL can read the archive (except `99 PRIVATE`). Don't put unpublished or
  copyrighted material outside `99 PRIVATE`.
- The web app runs as you but only reads inside this folder; it has no write action.
- A `GITHUB_TOKEN`, if you add one, sits in Script Properties (only you can see it). Scope it to this repo only; revoke it in
  GitHub → Settings → Developer settings when not needed.
