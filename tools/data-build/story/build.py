# -*- coding: utf-8 -*-
import json, re, sys
sys.path.insert(0,'/home/claude/story-work')
from chapters import C, INTRO
from sources_new import SOURCES
CAN="/mnt/user-data/uploads/Claude's File/Claude outputs/01 PHD/History Timeline Canvas/data/events.json"
V="/home/claude/vih/data"
ev={e['id']:e for e in json.load(open(CAN,encoding='utf-8'))['events']}
gaz=json.load(open('/home/claude/story-work/gazetteer.json',encoding='utf-8'))['places']
SRC={"Soelarto":"soelarto1980","Pietrow":"pietrow2024","Hoskins, 1996":"hoskins1996","Hoskins, 2002":"hoskins2002","Awa & Suana":"awa2021",
"Raben, 2008":"raben2008","Leupe":"leupe1879","Kuipers":"kuipers1998","Vel, 2008":"vel2008","Bosma, 2020":"bosma2020","Nooteboom":"nooteboom1940",
"Keane, 1995":"keane1995","Soeriadiredja":"soeriadiredja2013","Forth":"forth1981","Mross":"mross2000","Onvlee":"onvlee1973","Geria":"geria2014",
"Vel & Makambombu":"vel2019","Kamuri":"kamuri2020","Geirnaert":"geirnaert1996","Waskitojati":"waskitojati2020","Fowler":"fowler2022",
"McCarthy":"mccarthy2012","Morizcha":"morizcha2021","Li, 2000":"li2000"}
def clean(c): return re.sub(r"\s*\[.*?\]","",c).strip()
def sid(c):
    for k,v in SRC.items():
        if c.startswith(k): return v
    raise KeyError(c)
story_chapters=[]; private={}
for i,c in enumerate(C,1):
    cites=[]; 
    for eid in c['events']:
        for q in ev[eid]['quotes']:
            cc=clean(q['cite'])
            if cc not in cites: cites.append(cc)
    for eid,cl in c['indo_cites'].items():
        for cc in cl:
            if cc not in cites: cites.append(cc)
    places=[]
    for key,note in c['places']:
        g=gaz[key]; n=note
        if g['accuracy']!='good': n+=" (approximate)"
        places.append({"name":g['name'],"lat":g['lat'],"lon":g['lon'],"note":n})
    allev=c['events']+c.get('extra_events',[])
    for eid in allev:
        if eid in private: continue
        private[eid]=[{"cite":clean(q['cite']),"quote":q['quote'],"translation":q['translation']} for q in ev[eid]['quotes']]
    story_chapters.append({"id":c['id'],"title":c['title'],"period":{"start":c['start'],"end":c['end'],"label":c['label']},
        "text":c['text'],"camera":{"center":c['camera']['center'],"zoom":c['camera']['zoom']},"places":places,
        "events":allev,"map_events":c['map_events'],
        "citations":[{"cite":x,"source_id":sid(x)} for x in cites]})
story={"id":"sumba","title":"Sandalwood Island: Sumba through time, c. 1350 to 2018","intro":INTRO,"chapters":story_chapters}
index=[{"id":"sumba","title":"Sandalwood Island: Sumba through time","subtitle":"From Majapahit's claims to the sugarcane permits, in 22 chapters drawn from 120 canvas events",
  "author":"Ejak (Reza Arlianda), with Claude","date":"2026-11-20","file":"sumba.json","region":[[-10.4,118.8],[-9.0,120.9]],"chapters":len(story_chapters)}]
dump=lambda p,o:open(p,'w',encoding='utf-8').write(json.dumps(o,ensure_ascii=False,indent=1)+"\n")
dump(V+"/stories/sumba.json",story); dump(V+"/stories/index.json",index)
existing={s['id'] for s in json.load(open(V+"/sources.json"))}
new=[s for s in SOURCES if s['id'] not in existing]
dump(V+"/sources-mendeley.json",new)
dump('/home/claude/story-work/sumba-quotes.private.json',private)
print(len(story_chapters),len(new),len(private))
