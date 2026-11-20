import json,csv,sys
sys.path.insert(0,'.')
import sources, events, routes, peoples
D='/home/claude/vih/data/'
SRC=sources.SRC; EV=events.EV; RT=routes.RT; PE=peoples.PE
langs={r['ID']:r for r in csv.DictReader(open('/home/claude/raw/languages.csv'))}
for p in PE:
    g=langs.get(p['glottocode'])
    if not g: print('!! glottocode',p['id'],p['glottocode'])
    elif p['lat'] is None:
        p['lat']=round(float(g['Latitude']),3); p['lon']=round(float(g['Longitude']),3)
    if g: p['glottolog_name']=g['Name']
sid={s['id'] for s in SRC}; eid={e['id'] for e in EV}; rid={r['id'] for r in RT}; pid={p['id'] for p in PE}
eras={e['id'] for e in json.load(open(D+'eras.json'))}; th={t['id'] for t in json.load(open(D+'themes.json'))}
err=[]
def cs(lst,where):
    for s in lst:
        if s['id'] not in sid: err.append(f'source {s["id"]} in {where}')
for e in EV:
    cs(e['sources'],e['id'])
    if e['era'] not in eras: err.append('era '+e['id'])
    if e['theme'] not in th: err.append('theme '+e['id'])
    for x in e['peoples']:
        if x not in pid: err.append(f'people {x} in {e["id"]}')
    for x in e['routes']:
        if x not in rid: err.append(f'route {x} in {e["id"]}')
    if e['end'] is not None and e['end']<e['start']: err.append('dates '+e['id'])
for r in RT:
    cs(r['sources'],r['id'])
    if r['event'] not in eid: err.append('route event '+r['id'])
for p in PE:
    cs(p['sources'],p['id'])
    for i in p['impacts']: cs(i['sources'],p['id'])
used=set()
for e in EV: used|={s['id'] for s in e['sources']}
for r in RT: used|={s['id'] for s in r['sources']}
for p in PE:
    used|={s['id'] for s in p['sources']}
    for i in p['impacts']: used|={s['id'] for s in i['sources']}
for e in json.load(open(D+'eras.json')):
    for s in e['sources']:
        used.add(s)
        if s not in sid: err.append('era src '+s)
unused=sid-used
print('ERR',err); print('unused',sorted(unused))
qs={}
for e in EV:
    for q in e['q']: qs[q]=qs.get(q,0)+1
print('per question',dict(sorted(qs.items())))
# ISBNs from memory removed unless verified live (Open Library title match) on 2026-11-20
ISBN_OK={"bellwood2007","bellwood2017","endicott2016","kirch2017","higham2014","wolters1999","pollock2006","hall2011","sen2003","miksic2017","miksic2013","kulke2009","reid1988","reid1993","reid2015","lieberman2003","lieberman2009","ricklefs2008","andaya2015","andaya1993","andaya2008","laffan2011","cummings2002","pelras1996","bosma2008","subrahmanyam2012","tarling1992","andrade2008","winichakul1994","hagerdal2012","carey2007","heidhues2003","leith2003","elson2008","robinson2018","aspinall2009","reid2005","li2007","li2014","leary1995","keane1997","dobbin1983","vickers2013","vickers1989","picard1996","thurgood1999","robson1995","degroot2009","baker2009","drooglever2009","schulte2010"}
for x in SRC:
    if x.get('isbn') and x['id'] not in ISBN_OK: x.pop('isbn')
json.dump(SRC,open(D+'sources.json','w'),ensure_ascii=False,indent=1)
json.dump(EV,open(D+'events.json','w'),ensure_ascii=False,indent=1)
json.dump(RT,open(D+'routes.json','w'),ensure_ascii=False,indent=1)
json.dump(PE,open(D+'peoples.json','w'),ensure_ascii=False,indent=1)
import os
if not os.path.exists(D+'notes.json'):
    json.dump([{"id":"n0","target":"general","date":"2026-11-20","author":"Claude","text":"First release. Ejak's notes and additions will appear here as they are added through the chat.","sources":[]}],open(D+'notes.json','w'),ensure_ascii=False,indent=1)
print(len(SRC),'src',len(EV),'events',len(RT),'routes',len(PE),'peoples')
