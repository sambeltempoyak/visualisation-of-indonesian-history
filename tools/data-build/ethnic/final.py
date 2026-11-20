import json,collections,re
B=json.load(open('/home/claude/eg-work/built.json'))
out=B['out'];log=B['log']
KEYS=['id','no','appendix','section','name','island','codes','aliases','lat','lon','precision','method','place','glottocode','wm_label','note']
groups=[]
for r in out:
    groups.append({k:r[k] for k in KEYS})
cnt={'appendix1':sum(g['appendix']==1 for g in groups),'appendix2':sum(g['appendix']==2 for g in groups),'appendix3':sum(g['appendix']==3 for g in groups)}
cnt['total']=len(groups); cnt['ananta_stated_total']=633
ncodes=sum(len(g['codes']) for g in groups)
meta={'source_id':'ananta2014',
 'note':'Ananta, Arifin, Hasbullah, Handayani & Pramono (2014), A New Classification of Indonesia\'s Ethnic Groups (Based on the 2010 Population Census), ISEAS Working Paper. Parsed from Appendices 1-3. The paper states 633 groups (Appendix 3 total printed as 456), but the printed Appendix 3 table contains 453 rows (numbering skips #59 in the Sulawesi, Maluku and Papua blocks), so 630 groups are listed; nothing was padded. Locations: Kartapranata map labels (wm-map), Glottolog 5.4 (glottolog), own knowledge at regency level (manual), or province/island centroids with +/-0.15 deg deterministic jitter. precision tells how far to trust the point; "none" = not territorial. island is the island on which the point falls where located; "section" is the Appendix 3 heading as printed (several groups printed under "Others from Sulawesi" are Maluku/Aru groups).',
 'counts':cnt,'code_entries':ncodes,
 'by_method':dict(collections.Counter(g['method'] for g in groups)),'by_precision':dict(collections.Counter(g['precision'] for g in groups))}
with open('/home/claude/vih/data/ethnic-groups.json','w',encoding='utf-8') as f:
    f.write('{"meta":'+json.dumps(meta,ensure_ascii=False)+',\n"groups":[\n')
    f.write(',\n'.join(json.dumps(g,ensure_ascii=False,separators=(',',':')) for g in groups))
    f.write('\n]}\n')
# validate
d=json.load(open('/home/claude/vih/data/ethnic-groups.json',encoding='utf-8'))
assert len(d['groups'])==630
print(len(d['groups']),ncodes)
# report pieces
from collections import Counter,defaultdict
codeown=defaultdict(list)
for g in groups:
    for c in g['codes']:
        for cc in c['code'].split('/'): codeown[cc].append(g['id'])
dups={c:v for c,v in codeown.items() if len(v)>1}
allc=[f'{i:04d}' for i in range(1,1332)]
missing=[c for c in allc if c not in codeown]
def rng(l):
    r=[];s=p=None
    for x in map(int,l):
        if s is None: s=p=x
        elif x==p+1: p=x
        else: r.append((s,p)); s=p=x
    if s is not None: r.append((s,p))
    return ', '.join(f'{a:04d}' if a==b else f'{a:04d}-{b:04d}' for a,b in r)
isl=Counter(g['island'] for g in groups)
meth=Counter(g['method'] for g in groups);prec=Counter(g['precision'] for g in groups)
per_app_meth={a:Counter(g['method'] for g in groups if g['appendix']==a) for a in(1,2,3)}
per_app_prec={a:Counter(g['precision'] for g in groups if g['appendix']==a) for a in(1,2,3)}
man=[r for r in out if r['method']=='manual']
man.sort(key=lambda r:(r['_conf'],r['appendix'],r['no']))
prov=[r for r in out if r['method']=='province-centroid']
least=(man[:18]+prov)[:30]
none=[g for g in groups if g['method']=='none']
open('/home/claude/eg-work/stats.json','w').write(json.dumps(dict(dups=dups,missing=missing,missing_rng=rng(missing),isl=isl,meth=meth,prec=prec,pam=per_app_meth,pap=per_app_prec),default=dict,ensure_ascii=False))
rep=[]
A=rep.append
A('# ethnic-groups.json build report\n')
A('## Totals\n')
A(f"- Groups parsed: **{len(groups)}** (Ananta states 633). Appendix 1: {cnt['appendix1']} (expected 119, OK). Appendix 2: {cnt['appendix2']}. Appendix 3: {cnt['appendix3']}.")
A(f"- Code entries kept: {ncodes} lines in {len(groups)} groups (dual BPS/IPUMS codes like `1317/9110` kept as one entry).")
A('- Appendix 3 per heading (printed counts): Sumatra 23, Jawa/Bali 5, Nusa Tenggara 35, Kalimantan 3, Sulawesi 83, Maluku 82, Papua 210, Foreign Indonesians 12 = 453.\n')
A('## Discrepancy with 633\n')
A('- 119 + 58 + 453 = **630**, i.e. 3 short of 633. The paper prints "Total 456" for Appendix 3 (456 + 119 + 58 = 633).')
A('- Cause: the printed Appendix 3 numbering skips **#59** in each of the Sulawesi block (58 -> 60 on p.43, Laha 0752 -> Limakatina 0756), the Maluku block (58 -> 60 on p.45, Tarangan 0892 -> Watubela 0894) and the Papua block (58 -> 60 on p.47, Demba 1043 -> Demisa 1044). The authors\' 456 equals the sum of the *last printed numbers* in each block (23+5+35+3+84+83+211+12 = 456), not the number of rows. There is no text for the missing #59 rows in the PDF (the row pitch on the page is regular, no room for a hidden row), and the BPS codes on either side are consecutive or are accounted for elsewhere (0753 Lamahot, 0754 Laki-laki/Tolaki, 0755 Loloda in Appendix 1; 0893 Wai Loa in Appendix 2), so these look like numbering slips, not lost groups. Nothing was added.')
A('- The 9999 "NIU (not in universe)" row is not counted as a group.')
A('- Whether the paper\'s 1,331 codes is reproduced: distinct 4-digit codes found 0001-1331 = %d of 1331. **Missing codes: %s** (%d codes).'%(1331-len([c for c in allc if c not in codeown]) if False else len([c for c in allc if c in codeown]),rng(missing),len(missing)))
A('  - 0236-0284 (49 codes) are absent from the Dayak list in Appendix 1: the PDF jumps from 0235 "Dayak Benawas" to 0285 "Dayak Jawan" (p.24). This is a gap in the source (text layer and page image show no rows), so those Dayak sub-labels are missing from the `codes` of Dayak (#36) but the group count is unaffected.')
A('  - 0793 is not listed anywhere (between 0792 To Ala Sekko and 0794 Tofuti).')
A('- Duplicate codes (same code listed under more than one group, or twice): '+'; '.join(f'{c} -> {", ".join(v)}' for c,v in sorted(dups.items()))+'. 0717 appears twice inside To Ala (labels "To Ala Walenrang" and "To Ala Tanomanae"), a source typo.')
A('- Non-4-digit-range codes kept as printed: catch-alls 2000-8000, 9000, 9100-9210 (IPUMS twins of 13xx foreign codes).\n')
A('## Counts by method\n')
A('| method | all | App.1 | App.2 | App.3 |\n|---|---|---|---|---|')
for m in('wm-map','glottolog','manual','province-centroid','island-centroid','none'):
    A(f'| {m} | {meth[m]} | {per_app_meth[1][m]} | {per_app_meth[2][m]} | {per_app_meth[3][m]} |')
A('\n## Counts by precision\n')
A('| precision | all | App.1 | App.2 | App.3 |\n|---|---|---|---|---|')
for m in('point','district','province','island','none'):
    A(f'| {m} | {prec[m]} | {per_app_prec[1][m]} | {per_app_prec[2][m]} | {per_app_prec[3][m]} |')
A('\n## By island (as stored in `island`)\n')
A(', '.join(f'{k}: {v}' for k,v in isl.most_common()))
A('\n## The 30 least certain manual / inferred placements\n')
A('(manual placements ranked by my own confidence; padded with province-centroid inferences from BPS code blocks)\n')
for r in least:
    A(f"- **{r['name']}** (App.{r['appendix']} #{r['no']}, {r['method']}, {r['precision']}; {r['lat']},{r['lon']}; {r['place']}) {r['note']}")
A('\n## Other low-confidence automatic matches (Glottolog/WM)\n')
lowc=[r for r in out if r['method'] in('glottolog','wm-map') and r['_conf']<3]
for r in lowc: A(f"- **{r['name']}** (App.{r['appendix']} #{r['no']}, {r['method']}) {r['note']}")
A('\n## Groups with precision "none" (%d)\n'%len(none))
A(', '.join(g['name'] for g in none))
A('\n## Decisions and checks\n')
A('- Island is the island where the point falls when located (Ananta\'s Appendix 3 "Others from Sulawesi" block contains 18 Maluku/Aru groups, e.g. Gamkonora, Kamarian, Karey, Kayeli, Koba, Kola, Kompane, Lola, Lorang, Luang, Luhu, Manombai, Manusela, Masela, Masiwang, Laha, Laba; Gebe is under Papua but is a Maluku Utara island). Printed heading kept in `section`.')
A('- Appendix 1 island was assigned by me per group (Sumatra/Jawa-Bali/Nusa Tenggara/Kalimantan/Sulawesi/Maluku/Papua; Arab and Chinese = Foreign/Other). Appendix 2 islands come from the printed island column (Wai Loa p.38 carries Maluku over from p.37).')
A('- Glottolog entries at *dialect* level often inherit the parent language\'s coordinates (e.g. Aneuk Jamee, Muko-Muko, Penghulu, Kuala all sit on Minangkabau/Borneo points); they were rejected unless explicitly vetted, in which case precision is "district". Only language-level exact name matches were auto-accepted, and only when the point fell on the declared island.')
A('- Glottolog vs WM > 1.5 deg: Anak Dalam (Glottolog Kubu in Jambi vs WM label also Kubu), see note on the record. Glottolog Banjar (0.7N,115.8E), Luwu (4.5S, = Wajo), Moi, Bawean, Madura-area points were judged wrong against the island/own knowledge and replaced (`pref`), with the reason in `note`.')
A('- WM points more than 1 deg from my own-knowledge location (kept as WM/Glottolog, flagged in note): '+', '.join(f"{a} ({b}, {c} deg)" for a,b,c in log.get('gt1_from_manual',[]))+'.')
A('- Land check: points are tested against the 34-province polygons (BAKOSURTANAL 1:250k, from ans-4175/peta-indonesia-geojson, fetched by me for checking only) plus Natural Earth Indonesia/Timor-Leste; points up to 0.4 deg off land were snapped to the nearest land (%d records, noted in each record). Four small isolated islands absent from the polygons were kept as-is: %s. Border points on the PNG line (Amanab, Ninggerum, Ngalum, Pyu, Manem, Waris) were snapped to the Indonesian side.'%(len(log.get('snapped',[])),', '.join(x[0] for x in log.get('offland',[]))))
A('- Timor-Leste-origin groups (Fataluku, Kemak, Adabe, Galoli, Kairui, Lakalei, Makua) are located in Timor-Leste (islands field = Nusa Tenggara) since that is the language area; the census recorded them among respondents in Indonesia.')
A('- Rejected automatic matches: '+'; '.join(str(x) for x in log.get('auto_wm_rejected',[]))+'; Glottolog auto-matches rejected for island mismatch: '+(str(len(log.get('auto_gl_rejected',[])))))
A('- Jitter: island-centroid and province-centroid points get a deterministic +/-0.15 deg offset seeded by an md5 of the id; re-run on land only.')
A('\n## Parse notes\n')
A('- Parsed with pdfplumber word coordinates. Group boundaries come from the horizontal ruling lines of the table (name column), which also fixes names vertically centred between code rows. Groups spanning pages (Dayak p.24-31) are merged by their number.')
A('- Hyphenated line breaks inside BPS labels were repaired only when the next fragment starts lower-case ("Ka-/nayatn" -> "Kanayatn"). Labels truncated in the source (e.g. `... Dayak "`) are kept truncated. Ligature artefact "Tarfi a" fixed to "Tarfia". Stray quotes removed from "Bapu" and "Korapu/Korupun".')
A('- Aliases are the slash-separated variants of each group\'s BPS labels (max 40 per group; for Dayak the 40 first only).')
open('/home/claude/eg-work/report.md','w').write('\n'.join(rep)+'\n')
print('\n'.join(rep)[:6000])
