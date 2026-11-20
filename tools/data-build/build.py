import sys,json,hashlib,collections,re
sys.path.insert(0,'/home/claude/eg-work')
from geo_lib import *
from shapely.geometry import shape,Point
from shapely.ops import nearest_points,unary_union
from spec1 import S1
from spec23 import S2,S3,SEC
G=json.load(open('/home/claude/eg-work/base.json'))
# provinces
PD=json.load(open('/home/claude/eg-work/prov.json'))
def pname(s):
    s={'DI. ACEH':'ACEH','NUSATENGGARA BARAT':'NUSA TENGGARA BARAT'}.get(s,s)
    return s.title().replace('Dki','DKI').replace('Di ','DI ')
PROV={}
for f in PD['features']:
    PROV[f['properties']['Propinsi']]=shape(f['geometry']).buffer(0)
PROVNAME={k:pname(k) for k in PROV}
LANDU=unary_union(list(PROV.values())+list(LAND))
import geo_lib as _gl
TL=[g for g,f in zip(_gl.LAND,[f for f in _gl._ne["features"] if f["properties"].get("NAME") in("Indonesia","Timor-Leste")]) if f["properties"]["NAME"]=="Timor-Leste"]
def in_tl(lat,lon):
    p=Point(lon,lat); return any(g.contains(p) for g in TL)
def island_of(lat,lon):
    if in_tl(lat,lon): return 'Nusa Tenggara'
    if lon>=135.5 and lat>=-9.4: return 'Papua'
    if lon>=129.9 and lat>-2.4 and lat<=1.2: return 'Papua'
    if lon>=132.0 and -4.8<=lat<=-2.4: return 'Papua'
    if lat<-8.0 and 115.75<=lon<=125.2: return 'Nusa Tenggara'
    if lat<-8.5 and 115.75<=lon<=127.6: return 'Nusa Tenggara'
    if -9.0<=lat<=3.0 and lon<135.5 and ((lat<=-2.5 and lon>=124.8) or (-2.5<lat<=-1.5 and lon>=124.2) or (lat>-1.5 and lon>=126.0)): return 'Maluku'
    if 2.5<=lat<=4.6 and 105.0<=lon<=109.5: return 'Sumatra'
    if -4.3<=lat<=4.5 and 108.5<=lon<=118.6: return 'Kalimantan'
    if -7.7<=lat<=5.0 and 118.7<=lon<=127.0: return 'Sulawesi'
    if -7.7<=lat<=-5.8 and 120.0<=lon<=124.8: return 'Sulawesi'
    if -9.0<=lat<=-5.95 and 105.0<=lon<=115.75: return 'Jawa-Bali'
    if -9.0<=lat<=-5.6 and 106.6<=lon<=115.75: return 'Jawa-Bali'
    if -3.6<=lat<=-1.0 and 105.0<=lon<=108.6: return 'Sumatra'
    if -6.0<=lat<=6.2 and 94.5<=lon<=106.6: return 'Sumatra'
    if -1.3<=lat<=1.6 and 103.0<=lon<=105.5: return 'Sumatra'
    return None
def land_info(lat,lon):
    p=Point(lon,lat); d=LANDU.distance(p); return d
def snap(lat,lon):
    p=Point(lon,lat)
    if LANDU.distance(p)==0: return lat,lon,False
    q=nearest_points(LANDU,p)[0]
    return q.y,q.x,True
def province_at(lat,lon):
    p=Point(lon,lat)
    for k,g in PROV.items():
        if g.contains(p): return PROVNAME[k]
    best=min(PROV.items(),key=lambda kv:kv[1].distance(p))
    return PROVNAME[best[0]] if best[1].distance(p)<2.0 else None
PCENT={k:g.representative_point() for k,g in PROV.items()}
# use largest polygon's rep point for multipolygons
for k,g in PROV.items():
    if g.geom_type=='MultiPolygon':
        big=max(g.geoms,key=lambda x:x.area); PCENT[k]=big.representative_point()
ICENT={'Sumatra':(-1.0,102.2),'Jawa-Bali':(-7.45,110.2),'Nusa Tenggara':(-8.65,121.2),'Kalimantan':(0.0,114.0),'Sulawesi':(-1.9,120.3),'Maluku':(-3.1,129.5),'Papua':(-4.0,138.0)}
def jitter(id,lat,lon):
    h=int(hashlib.md5(id.encode()).hexdigest(),16)
    jx=((h%2001)/1000-1)*0.15; jy=(((h//2001)%2001)/1000-1)*0.15
    for s in (1,0.5,0.25,0):
        la,lo=lat+jy*s,lon+jx*s
        if LANDU.distance(Point(lo,la))==0: return la,lo
    return lat,lon
def centroid(pts): return sum(p[0] for p in pts)/len(pts),sum(p[1] for p in pts)/len(pts)
def key3(g): return SEC[g['section']]+str(g['no'])
def wm_point(names,man):
    pts=[];labs=[]
    for n in names:
        ents=wm_idx.get(nk(n),[])
        if not ents: continue
        if man: e=min(ents,key=lambda e:dist((e['lat'],e['lon']),man))
        elif len(ents)>1:
            c=centroid([(x['lat'],x['lon']) for x in ents])
            sp=max(dist(c,(x['lat'],x['lon'])) for x in ents)
            e={'lat':c[0],'lon':c[1],'label':ents[0]['label']} if sp<1.5 else ents[0]
        else: e=ents[0]
        pts.append((e['lat'],e['lon'])); labs.append(e['label'])
    if not pts: return None
    return centroid(pts),'; '.join(dict.fromkeys(labs))
def gl_point(names,man,gld):
    pts=[];ids=[];lv=[]
    for n in names:
        ents=gl_idx.get(nk(n),[])
        cand=[e for e in ents if e['level']=='language'] or ([e for e in ents if gld] if gld else [])
        if not cand: continue
        e=min(cand,key=lambda e:dist((e['lat'],e['lon']),man)) if man else cand[0]
        pts.append((e['lat'],e['lon']));ids.append(e['id']);lv.append(e['level'])
    if not pts: return None
    return centroid(pts),','.join(ids),('dialect' if 'dialect' in lv else 'language')
out=[];log=collections.defaultdict(list)
for g in G:
    app=g['appendix']
    spec=S1[g['no']] if app==1 else S2[g['no']] if app==2 else S3.get(key3(g),{})
    rec={'id':g['id'],'no':g['no'],'appendix':app,'name':g['name'],'island':g['island'],'codes':g['codes'],'aliases':g['aliases'],
         'lat':None,'lon':None,'precision':'none','method':'none','place':spec.get('place',''),'glottocode':'','wm_label':'','note':'','section':g.get('section') or ''}
    notes=[]
    if spec.get('note'): notes.append(spec['note'])
    declared=g['island']
    man=spec.get('man'); conf=spec.get('conf',3)
    if spec.get('none') or declared=='Foreign/Other':
        rec['note']=' '.join(notes) or 'Not territorial.'
        if declared!='Foreign/Other': rec['island']=declared
        out.append(rec); log['none'].append(g['id']); continue
    # candidates
    wmn=spec.get('wm'); gln=spec.get('gl'); gld=spec.get('gld',False)
    if isinstance(gln,str): gln=[gln]
    if app==3:
        parts=[p for p in g['name'].split('/')]
        if not wmn:
            auto=[p for p in parts if nk(p) in wm_idx and len(nk(p))>=3]
            if auto:
                r=wm_point(auto,man)
                if r and island_of(*r[0])==declared: wmn=auto
                else: log['auto_wm_rejected'].append((g['id'],auto))
        if not gln and not spec.get('prov') and not spec.get('island_fallback') and not spec.get('man') :
            auto=[p for p in parts if any(h['level']=='language' for h in gl_idx.get(nk(p),[])) and len(nk(p))>=3]
            if auto:
                r=gl_point(auto[:1],None,False)
                if r and island_of(*r[0][:2])==declared: gln=auto[:1]
                else: log['auto_gl_rejected'].append((g['id'],auto,r and (island_of(*r[0]),r[0])))
    wm=wm_point(wmn,man) if wmn else None
    gl=gl_point(gln,man,gld) if gln else None
    if wmn and not wm: notes.append('WM label(s) %s not found.'%wmn)
    primary=None
    pref=spec.get('pref')
    lat=lon=None;method=None;prec=None
    def use_man(why=None):
        global lat,lon,method,prec
        lat,lon=man;method='manual';prec=spec.get('prec','district')
        if why: notes.append(why)
    cands=[]
    if gl: cands.append(('gl',gl[0]))
    if wm: cands.append(('wm',wm[0]))
    if man: cands.append(('man',man))
    if pref=='wm' and wm: sel='wm'
    elif pref=='gl' and gl: sel='gl'
    elif pref=='man' and man: sel='man'
    elif gl: sel='gl'
    elif wm: sel='wm'
    elif man: sel='man'
    else: sel=None
    # >1.5 deg GL vs WM
    if gl and wm and pref is None and dist(gl[0],wm[0])>1.5:
        notes.append('Glottolog and WM label are %.1f deg apart (GL %.2f,%.2f; WM %.2f,%.2f).'%(dist(gl[0],wm[0]),gl[0][0],gl[0][1],wm[0][0],wm[0][1]))
        log['gl_wm_conflict'].append(g['id'])
        # choose one consistent with island / manual
        opts=[c for c in cands if c[0] in('gl','wm')]
        if man: sel=min(opts,key=lambda c:dist(c[1],man))[0]
        else:
            ok=[c for c in opts if island_of(*c[1])==declared]
            sel=ok[0][0] if ok else 'wm'
    if sel and sel!='man' and man and pref is None:
        pt=gl[0] if sel=='gl' else wm[0]
        if dist(pt,man)>2.0:
            log['far_from_manual'].append((g['id'],sel,round(dist(pt,man),1)))
            notes.append('Chosen %s point is %.1f deg from own-knowledge position; own-knowledge position used.'%(sel,dist(pt,man)))
            sel='man'
    if sel in('gl','wm') and man and pref is None:
        pt=gl[0] if sel=='gl' else wm[0]
        if dist(pt,man)>1.0:
            log['gt1_from_manual'].append((g['id'],sel,round(dist(pt,man),1)))
            notes.append('Note: %s point is %.1f deg from the compiler\'s own-knowledge position (%.2f,%.2f).'%(sel,dist(pt,man),man[0],man[1]))
    if sel=='gl':
        lat,lon=gl[0]; method='glottolog'
        prec='district' if gl[2]=='dialect' else 'point'
        if spec.get('prec'): prec=spec['prec']
        rec['glottocode']=gl[1]
        if wm: rec['wm_label']=wm[1]
        if gl[2]=='dialect': notes.append('Glottolog dialect-level entry (coordinates may be those of the parent language), so precision set to district.')
    elif sel=='wm':
        lat,lon=wm[0]; method='wm-map'; prec=spec.get('prec','district'); rec['wm_label']=wm[1]
        if gl and pref=='wm': pass
    elif sel=='man': use_man()
    else:
        # fallback
        if spec.get('prov'):
            pk=spec['prov']; p=PCENT[pk]; lat,lon=p.y,p.x; method='province-centroid'; prec='province'
            rec['place']=rec['place'] or PROVNAME[pk]
            notes.append('Province centroid (with no jitter needed? see below).') if False else None
            lat,lon=jitter(rec['id'],lat,lon)
            notes.append('Province centroid with deterministic jitter (+/-0.15 deg).')
        else:
            la,lo=ICENT[declared]; lat,lon=jitter(rec['id'],la,lo); method='island-centroid'; prec='island'
            notes.append('Island centroid with deterministic jitter (+/-0.15 deg); no usable location.')
            if app==3 and g['section']=='Others from Sulawesi' and not any('Sulawesi' in n for n in notes):
                notes.append('Island unverified: several groups in Ananta\'s Sulawesi block are Maluku/Aru languages.')
    # place if empty
    # sanity: island and land
    isl=island_of(lat,lon)
    if method not in('island-centroid','province-centroid'):
        d=land_info(lat,lon)
        if d>0:
            if d<=0.4:
                lat2,lon2,sn=snap(lat,lon); notes.append('Point snapped %.2f deg to nearest Indonesian land (coast/border).'%dist((lat,lon),(lat2,lon2))); lat,lon=lat2,lon2
                log['snapped'].append(g['id'])
            else:
                log['offland'].append((g['id'],lat,lon,d)); notes.append('Point is %.1f deg from the nearest land polygon (small isolated island missing from the polygon data); kept.'%d)
    if method not in('island-centroid','province-centroid'):
        isl=island_of(lat,lon)
        if isl and isl!=declared:
            if spec.get('ok_isl') or app in(1,2) or True:
                if isl!=declared: notes.append('Located on %s; Ananta heading/block says %s.'%(isl,declared)); log['island_changed'].append((g['id'],declared,isl))
                rec['island']=isl
        elif isl is None: log['island_none'].append((g['id'],lat,lon))
    else:
        isl=island_of(lat,lon)
        if isl!=declared: log['centroid_island_mismatch'].append((g['id'],declared,isl,lat,lon))
    if not rec['place'] and method!='island-centroid':
        pr=province_at(lat,lon)
        rec['place']=pr or ''
    rec['lat']=round(lat,3); rec['lon']=round(lon,3); rec['precision']=prec; rec['method']=method
    rec['note']=' '.join(n for n in notes if n)
    rec['_conf']=conf
    out.append(rec)
json.dump({'out':out,'log':{k:v for k,v in log.items()}},open('/home/claude/eg-work/built.json','w'),ensure_ascii=False)
print(len(out),collections.Counter(r['method'] for r in out),collections.Counter(r['precision'] for r in out))
for k,v in log.items():
    if k!='none': print('##',k,len(v)); print(v[:60])
