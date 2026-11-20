import json,re,sys
CAN="/mnt/user-data/uploads/Claude's File/Claude outputs/01 PHD/History Timeline Canvas/data/events.json"
V="/home/claude/vih/data"
ev={e['id']:e for e in json.load(open(CAN,encoding='utf-8'))['events']}
st=json.load(open(V+"/stories/sumba.json")); idx=json.load(open(V+"/stories/index.json"))
src={s['id'] for s in json.load(open(V+"/sources.json"))}|{s['id'] for s in json.load(open(V+"/sources-mendeley.json"))}
me={e['id'] for e in json.load(open(V+"/events.json"))}
priv=json.load(open('/home/claude/story-work/sumba-quotes.private.json'))
err=[]
sumba={i for i,e in ev.items() if e['line']=='sumba'}
cnt={}
prev=None
for c in st['chapters']:
    for e in c['events']:
        if e not in ev: err.append(('missing event',c['id'],e))
        cnt[e]=cnt.get(e,0)+1
        if e not in priv: err.append(('no private quote',e))
    for m in c['map_events']:
        if m not in me: err.append(('map_event',m))
    for ci in c['citations']:
        if ci['source_id'] not in src: err.append(('source',ci))
        if not re.match(r".+, \d{4}, p\. \d+",ci['cite']): err.append(('cite fmt',ci['cite']))
    if not c['citations']: err.append(('nocite',c['id']))
    z=c['camera']['zoom']; la,lo=c['camera']['center']
    if not(8<=z<=12 and -10.8<=la<=-8.0 and 118.5<=lo<=121.2): err.append(('camera',c['id'],c['camera']))
    for p in c['places']:
        ext=p['name'].split()[0] in('Ende','Bima','Savu','Kupang')
        if not ext and not(-10.45<=p['lat']<=-9.05 and 118.85<=p['lon']<=120.95): err.append(('place',c['id'],p))
    n=len(c['text'].split('\n\n'))
    if not 2<=n<=5: err.append(('paras',c['id'],n))
    if prev is not None and c['period']['start']<prev: err.append(('order',c['id']))
    prev=c['period']['start']
for s in sumba:
    if cnt.get(s,0)!=1: err.append(('sumba count',s,cnt.get(s,0)))
for e,n in cnt.items():
    if n!=1: err.append(('dup',e,n))
# verbatim check: any 13-word run of a quote appearing in the text
def words(t): return re.findall(r"\w+",t.lower())
for c in st['chapters']:
    tw=' '.join(words(c['text']))
    for e in c['events']:
        for q in priv[e]:
            for t in (q['quote'],q['translation'] or ''):
                w=words(t)
                for i in range(0,max(0,len(w)-12)):
                    if ' '.join(w[i:i+13]) in tw: err.append(('verbatim>12',c['id'],e)); break
if idx[0]['chapters']!=len(st['chapters']): err.append('index count')
print('chapters',len(st['chapters']),'sumba events',len(sumba&set(cnt)),'/',len(sumba),'errors',len(err))
for e in err: print(e)
