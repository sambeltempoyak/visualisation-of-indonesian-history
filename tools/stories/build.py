#!/usr/bin/env python3
"""Build stories/<id>/story.md → data/stories/<id>.json + data/stories/index.json, enforcing the source rule.

Usage:  python3 tools/stories/build.py            # build all, fail (exit 1) on any rule error
        python3 tools/stories/build.py --check    # validate only, write nothing
The contract is stories/README.md. Needs PyYAML (pip install pyyaml).
"""
import json, re, sys, pathlib, datetime
import yaml

ROOT = pathlib.Path(__file__).resolve().parents[2]
STORIES, OUT = ROOT / 'stories', ROOT / 'data' / 'stories'
PLACE_KINDS = set('port fort village kingdom mission school raid battle market plantation resort mine adat grave city'.split())
FLOW_KINDS = set('trade slave migration military mission colonial labour capital'.split())
AREA_ROLES = set('focus claim contested lost adat concession'.split())


def load_sources():
    src = {}
    for name in ('sources.json', 'sources-mendeley.json'):
        p = ROOT / 'data' / name
        if p.exists():
            for s in json.loads(p.read_text('utf-8')):
                src.setdefault(s['id'], s)
    return src


def tier(s):
    if not s: return 'missing'
    if s.get('type') == 'primary': return 'primary'
    if s.get('peer_reviewed'): return 'peer-reviewed'
    # defensible academic work that is not formally peer reviewed: theses, university / research-institute publications
    if s.get('academic') or s.get('type') == 'thesis': return 'academic'
    return 'other'


def parse(md_path, src, errors):
    text = md_path.read_text('utf-8')
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.S)
    if not m: errors.append(f'{md_path}: missing front matter'); return None
    meta = yaml.safe_load(m.group(1)) or {}
    body = m.group(2)
    parts = re.split(r'^## +(.+)$', body, flags=re.M)
    intro, slides = parts[0].strip(), []
    for i in range(1, len(parts), 2):
        head, chunk = parts[i].strip(), parts[i + 1]
        where = f'{md_path.parent.name} slide {len(slides) + 1} "{head}"'
        label, title = (head.split('·', 1) + [''])[:2] if '·' in head else ('', head)
        y = re.search(r'```ya?ml\n(.*?)```', chunk, re.S)
        spec = (yaml.safe_load(y.group(1)) if y else {}) or {}
        rest = chunk[y.end():] if y else chunk
        more = ''
        mm = re.search(r'^> *More:?\s*$', rest, re.M)
        if mm: rest, more = rest[:mm.start()], rest[mm.end():]
        clean = lambda t: re.sub(r'\n{3,}', '\n\n', '\n'.join(l[1:].lstrip() if l.startswith('>') else l for l in t.strip().splitlines())).strip()
        slide = {'id': f's{len(slides) + 1:02d}', 'label': label.strip(), 'title': title.strip(), 'text': clean(rest), 'more': clean(more)}
        # ---- year
        yr = spec.get('year')
        if isinstance(yr, list): slide['year'] = [int(yr[0]), int(yr[-1])]
        elif yr is not None: slide['year'] = [int(yr), int(yr)]
        else: errors.append(f'{where}: no year')
        if 'camera' in spec:
            c = spec['camera']
            if not (isinstance(c, list) and len(c) == 3): errors.append(f'{where}: camera must be [lat, lon, zoom]')
            slide['camera'] = c
        # ---- places / flows / areas
        slide['places'] = []
        for p in spec.get('places') or []:
            if p.get('kind') and p['kind'] not in PLACE_KINDS: errors.append(f'{where}: place kind "{p["kind"]}"')
            at = p.get('at') or []
            if len(at) != 2 or not (-60 < at[0] < 40): errors.append(f'{where}: place {p.get("name")} needs at: [lat, lon]')
            slide['places'].append({'name': p.get('name', ''), 'lat': at[0] if at else None, 'lon': at[1] if len(at) > 1 else None, 'kind': p.get('kind', 'village'), 'note': p.get('note', '')})
        slide['flows'] = []
        for k, f in enumerate(spec.get('flows') or []):
            if f.get('kind') not in FLOW_KINDS: errors.append(f'{where}: flow kind "{f.get("kind")}"')
            pts = [f.get('from')] + list(f.get('via') or []) + [f.get('to')]
            if any(not (isinstance(q, list) and len(q) == 2) for q in pts): errors.append(f'{where}: flow {k + 1} needs from/to [lon, lat]'); continue
            if any(not (-60 < q[1] < 62 and -30 < q[0] < 180) for q in pts): errors.append(f'{where}: flow {k + 1} coordinates look like [lat, lon]; use [lon, lat]')
            slide['flows'].append({'kind': f['kind'], 'path': pts, 'label': f.get('label', ''), 'weight': max(1, min(4, int(f.get('weight', 2))))})
        slide['areas'] = []
        for a in spec.get('areas') or []:
            ref = a.get('ref', '')
            if ':' not in ref: errors.append(f'{where}: area ref "{ref}" must be pack:key'); continue
            pack, key = ref.split(':', 1)
            if pack not in (meta.get('geo') or []): errors.append(f'{where}: area pack "{pack}" not in front-matter geo')
            if a.get('role', 'focus') not in AREA_ROLES: errors.append(f'{where}: area role "{a.get("role")}"')
            slide['areas'].append({'pack': pack, 'key': key.strip(), 'role': a.get('role', 'focus'), 'label': a.get('label', '')})
        if spec.get('layers'): slide['layers'] = spec['layers']
        # ---- sources + rule
        cites = []
        for s in spec.get('sources') or []:
            (sid, pages), = s.items() if isinstance(s, dict) else ((s, ''),)
            ent = src.get(sid)
            if not ent: errors.append(f'{where}: unknown source "{sid}"')
            cites.append({'id': sid, 'pages': str(pages or ''), 'tier': tier(ent),
                          'cite': f'{(ent or {}).get("authors", sid).split(",")[0]} {(ent or {}).get("year", "")}'.strip() + (f', {pages}' if pages else '')})
        slide['sources'] = cites
        ev = spec.get('evidence', 'peer-reviewed')
        slide['evidence'] = ev
        tiers = [c['tier'] for c in cites]
        if not cites: errors.append(f'{where}: no sources')
        elif ev == 'primary':
            if 'primary' not in tiers: errors.append(f'{where}: evidence primary needs a primary source')
        elif ev == 'contested':
            if len(cites) < 2 or not {'peer-reviewed', 'academic'} & set(tiers): errors.append(f'{where}: contested needs ≥2 sources incl. one peer-reviewed or academic')
        elif not {'peer-reviewed', 'academic'} & set(tiers):
            errors.append(f'{where}: needs a peer-reviewed or academic source (has: {", ".join(c["id"] + "=" + c["tier"] for c in cites)})')
        words = len(slide['text'].split())
        if words > 120: errors.append(f'{where}: text {words} words (max ~90)')
        slides.append(slide)
    return {'id': meta.get('id') or md_path.parent.name, 'title': meta.get('title', ''), 'subtitle': meta.get('subtitle', ''),
            'author': meta.get('author', ''), 'date': str(meta.get('date', '')), 'region': meta.get('region'),
            'basemap': meta.get('basemap', 'relief'), 'geo': meta.get('geo') or [], 'cover': meta.get('cover', ''),
            'intro': intro, 'slides': slides}


def main():
    check = '--check' in sys.argv
    src, errors, index = load_sources(), [], []
    for md in sorted(STORIES.glob('*/story.md')):
        st = parse(md, src, errors)
        if not st: continue
        years = [y for s in st['slides'] for y in s.get('year', [])]
        index.append({'id': st['id'], 'title': st['title'], 'subtitle': st['subtitle'], 'author': st['author'], 'date': st['date'],
                      'cover': st['cover'], 'region': st['region'], 'basemap': st['basemap'], 'file': f'{st["id"]}.json',
                      'slides': len(st['slides']), 'span': [min(years), max(years)] if years else None})
        if not check:
            OUT.mkdir(parents=True, exist_ok=True)
            (OUT / f'{st["id"]}.json').write_text(json.dumps(st, ensure_ascii=False, indent=1) + '\n', 'utf-8')
    if errors:
        print('\n'.join('✗ ' + e for e in errors)); print(f'{len(errors)} problem(s).'); sys.exit(1)
    if not check:
        (OUT / 'index.json').write_text(json.dumps(index, ensure_ascii=False, indent=1) + '\n', 'utf-8')
    print(f'✓ {len(index)} stories, {sum(i["slides"] for i in index)} slides' + (' (check only)' if check else ' built'))


if __name__ == '__main__':
    main()
