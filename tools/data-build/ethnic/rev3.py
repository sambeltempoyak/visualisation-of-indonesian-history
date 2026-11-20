import sys,json;sys.path.insert(0,'/home/claude/eg-work')
from geo_lib import *
from auto import G,keys
out=[]
for g in G:
    if g['appendix']==1: continue
    ks=keys(g)
    hits=[]
    for i,k in enumerate(ks):
        for h in gl_idx.get(k,[]):
            hits.append((i,h))
    if not hits: continue
    langs=[(i,h) for i,h in hits if h['level']=='language']
    dia=[(i,h) for i,h in hits if h['level']=='dialect']
    s=[]
    for i,h in (langs+dia)[:3]:
        ok=in_box(g['island'],h['lat'],h['lon'])
        s.append(f"{h['level'][0]}:{h['name']}({h['id']},{h['lat']:.1f},{h['lon']:.1f}){'' if ok else ' !BOX'}{' alias' if i>0 else ''}")
    print(g['appendix'],g['no'],g['island'][:3],g['name'],'=>',' ; '.join(s))
