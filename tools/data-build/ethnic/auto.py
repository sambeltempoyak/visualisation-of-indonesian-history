import sys,json;sys.path.insert(0,'/home/claude/eg-work')
from geo_lib import *
G=json.load(open('/home/claude/eg-work/base.json'))
def keys(g,use_alias=True):
    ks=[]
    for p in g['name'].split('/'): ks.append(nk(p))
    if use_alias and g['name']!='Dayak':
        for a in g['aliases']: ks.append(nk(a))
    return [k for k in dict.fromkeys(ks) if len(k)>=3]
if __name__=='__main__':
    res={}
    for g in G:
        k=keys(g)
        wmh=[(x,wm_idx[x]) for x in k if x in wm_idx]
        glh=[(x,gl_idx[x]) for x in k if x in gl_idx]
        res[g['id']]=(wmh,glh)
    used=set()
    nwm=sum(1 for v in res.values() if v[0]);ngl=sum(1 for v in res.values() if v[1])
    print(nwm,ngl)
    for g in G:
        wmh,glh=res[g['id']]
        if g['appendix']<3 :
            print(g['appendix'],g['no'],g['name'],'| WM:',[(x,[ (l['label']) for l in ls]) for x,ls in wmh][:3],'| GL:',[(x,[(l['name'],l['id'],round(l['lat'],1),round(l['lon'],1)) for l in ls][:3]) for x,ls in glh][:3])
