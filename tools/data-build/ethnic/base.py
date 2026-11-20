import json,re,unicodedata,collections
from parse import *
from p2 import app2
from p3b import app3b
import io,contextlib

A1ISL={}
for isl,names in {
'Sumatra':'1 2 3 6 21 18 23 35 40 44 50 52 54 58 59 66 72 74 78 80 83 84 86 90 92 93 94 102 103 110',
'Nusa Tenggara':'4 11 26 37 41 47 60 70 71 81 95 99 105 106 114 55 57',
'Jawa-Bali':'15 16 20 22 24 32 48 63 85 107',
'Kalimantan':'19 36 56 88',
'Sulawesi':'10 14 17 27 28 30 38 43 46 49 62 64 67 68 69 73 76 77 79 87 89 96 97 100 108 109 116 117 118',
'Maluku':'5 29 42 45 51 61 65 91 98 101 104 111 112 113 115',
'Papua':'8 9 12 13 25 33 34 39 53 75 82 119',
'Foreign/Other':'7 31'}.items():
    for k in names.split(): A1ISL[int(k)]=isl
assert len(A1ISL)==119,len(A1ISL)

def clean(s):
    s=s.replace('Tarfi a','Tarfia').replace('Tarfi a','Tarfia').strip().strip('“”" ').strip()
    s=re.sub(r'\s*/\s*','/',s)
    s=re.sub(r'\s+',' ',s).strip()
    return s
def slug(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')

def aliases_from(name,labels,cap=40):
    out=[];seen={name.lower()}
    for l in labels:
        for p in re.split(r'/',l):
            p=p.strip().strip('“”"').strip()
            if not p or p.lower() in seen or len(p)>45: continue
            seen.add(p.lower()); out.append(p)
    return out[:cap]

def build():
    with contextlib.redirect_stdout(io.StringIO()):
        a2=app2()
    A1=dict(namex0=130,namex1=200,codex=245,numx0=70,namex_start=125)
    g1=appendix12(range(22,37),A1)
    m=collections.OrderedDict()
    for x in g1:
        k=int(x['no'])
        if k in m: m[k]['ents']+=x['ents']
        else: m[k]=x
    groups=[]
    def mk(app,no,name,island,ents,section=None):
        name=clean(name)
        codes=[]
        for e in ents:
            lab=clean(e['label']).replace('Tarfi a','Tarfia')
            codes.append({'code':'/'.join(e['codes']) if isinstance(e['codes'],list) and len(e['codes'])>1 else e['codes'][0],'label':lab})
        return {'id':'eg-'+slug(name),'no':no,'appendix':app,'name':name,'island':island,'section':section,
                'codes':codes,'aliases':aliases_from(name,[c['label'] for c in codes])}
    for k,x in m.items(): groups.append(mk(1,k,x['name'],A1ISL[k],x['ents']))
    isl2={}
    for x in a2:
        if x['isl']: cur=x['isl']
        isl2[int(x['no'])]=cur
    for x in a2:
        k=int(x['no']); groups.append(mk(2,k,x['name'],isl2[k],x['ents']))
    secs,_=app3b()
    islmap={'Others from Sumatra':'Sumatra','Others from Jawa/Bali':'Jawa-Bali','Others from Nusa Tenggara':'Nusa Tenggara','Others from Kalimantan':'Kalimantan','Others from Sulawesi':'Sulawesi','Others from Maluku':'Maluku','Others from Papua':'Papua','Foreign Indonesians':'Foreign/Other'}
    for s in secs:
        for r in s['rows']:
            groups.append(mk(3,r['k'],r['label'],islmap[s['name']],[{'codes':r['codes'],'label':r['label']}],s['name']))
    # unique ids
    c=collections.Counter(g['id'] for g in groups)
    seen=collections.Counter()
    for g in groups:
        if c[g['id']]>1:
            seen[g['id']]+=1
            g['id']=g['id']+('-a%d'%g['appendix'] if True else '')
    c=collections.Counter(g['id'] for g in groups)
    for i,v in c.items():
        if v>1: print('DUPID',i)
    return groups
if __name__=='__main__':
    G=build()
    print(len(G),collections.Counter(g['appendix'] for g in G))
    json.dump(G,open('base.json','w'),ensure_ascii=False,indent=0)
    print(collections.Counter(g['island'] for g in G))
