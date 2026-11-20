import csv,json,re,unicodedata,math
from shapely.geometry import shape,Point
def norm(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().upper()
    s=re.sub(r"[’'`\".,()*]",'',s)
    s=re.sub(r'[-_/]',' ',s)
    s=re.sub(r'\s+',' ',s).strip()
    return s
def strip_prefix(s):
    for p in ('TO ','SUKU ','ORANG ','DAYAK ','TAU '):
        if s.startswith(p) and len(s)>len(p)+2: s=s[len(p):]
    return s
def nk(s): return strip_prefix(norm(s)).replace(' ','')
WM=json.load(open('/home/claude/vih/data/wikimedia-suku-labels.json'))['labels']
wm_idx={}
for l in WM: wm_idx.setdefault(nk(l['label']),[]).append(l)
GL=[]
for r in csv.DictReader(open('/home/claude/raw/languages.csv')):
    if r['Level'] not in('language','dialect') or not r['Latitude']: continue
    la,lo=float(r['Latitude']),float(r['Longitude'])
    c=(r['Countries'] or '').split(';')
    if 'ID' in c or 'TL' in c or (r['Level']=='dialect' and not r['Countries'] and -11<=la<=6 and 95<=lo<=141) or (r['Level']=='language' and not r['Countries'] and -11<=la<=6 and 95<=lo<=141):
        GL.append(dict(id=r['ID'],name=r['Name'],lat=la,lon=lo,level=r['Level'],fam=r['Family_ID'],c=r['Countries']))
gl_idx={}
for g in GL: gl_idx.setdefault(nk(g['name']),[]).append(g)
# land
_ne=json.load(open('/home/claude/raw/ne_50m_admin_0_countries.geojson'))
LAND=[shape(f['geometry']) for f in _ne['features'] if f['properties'].get('NAME') in('Indonesia','Timor-Leste')]
def land_dist(lat,lon):
    p=Point(lon,lat)
    return min(g.distance(p) for g in LAND)  # degrees (0 if inside)
BOX={'Sumatra':(-6.3,6.2,94.5,106.3),'Jawa-Bali':(-9.0,-5.7,105.0,116.0),'Nusa Tenggara':(-11.2,-7.9,115.4,127.5),
'Kalimantan':(-4.3,4.5,108.5,119.5),'Sulawesi':(-6.2,5.0,118.5,127.0),'Maluku':(-8.5,3.0,124.0,135.5),'Papua':(-9.3,1.0,129.0,141.1),'Foreign/Other':(-90,90,-180,180)}
def in_box(isl,lat,lon):
    a,b,c,d=BOX[isl]; return a<=lat<=b and c<=lon<=d
def which_island(lat,lon):
    # best-fit island for a point (non-overlapping preference order)
    for isl in('Papua','Maluku','Sulawesi','Kalimantan','Nusa Tenggara','Jawa-Bali','Sumatra'):
        if in_box(isl,lat,lon): return isl
def dist(a,b): return math.hypot(a[0]-b[0],(a[1]-b[1])*math.cos(math.radians((a[0]+b[0])/2)))
