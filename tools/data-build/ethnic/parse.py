import pdfplumber,re,json,collections
P="/mnt/user-data/uploads/Mendeley Desktop/Unknown/Ananta et al. - 2014 - A New Classification of Indonesia's Ethnic Groups (Based on the 2010 Population Census) - Unknown.pdf"
pdf=pdfplumber.open(P)
CODE=re.compile(r'^\d{4}$')

def lines_of(words,tol=3):
    """group words into text lines by 'top'"""
    ws=sorted(words,key=lambda w:(round(w['top']),w['x0']))
    out=[];cur=[]
    for w in ws:
        if cur and abs(w['top']-cur[0]['top'])>tol:
            out.append(cur);cur=[]
        cur.append(w)
    if cur: out.append(cur)
    return [sorted(l,key=lambda w:w['x0']) for l in out]

def join_lines(strs):
    s=''
    for t in strs:
        if not s: s=t
        elif s.endswith('-') and t[:1].islower(): s=s[:-1]+t
        elif s.endswith('-'): s=s+t
        else: s=s+' '+t
    return s

def code_entries(words,codex):
    """words in code column (x>=codex-2). returns list of (top, [codes], label)"""
    ents=[]
    for l in lines_of(words):
        first=l[0]
        txt=' '.join(w['text'] for w in l)
        if abs(first['x0']-codex)<4 and CODE.match(first['text']):
            m=re.match(r'^(\d{4})(?:\s*/\s*(\d{4}))?\s*(.*)$',txt)
            ents.append({'top':first['top'],'codes':[m.group(1)]+([m.group(2)] if m.group(2) else []),'parts':[m.group(3)]})
        else:
            if not ents: ents.append({'top':first['top'],'codes':[],'parts':[]})
            ents[-1]['parts'].append(txt)
    for e in ents:
        s=join_lines(e['parts']).strip()
        e['label']=s.strip('“”" ').strip()
    return ents

def hlines(pg,x0max,x1min,ymin):
    ys=set()
    for l in pg.lines:
        if abs(l['top']-l['bottom'])<0.5 and l['x0']<=x0max and l['x1']>=x1min and l['top']>ymin:
            ys.add(round(l['top'],1))
    return sorted(ys)

def appendix12(pages,cfg):
    groups=[]
    for n in pages:
        pg=pdf.pages[n-1]
        words=pg.extract_words()
        hdr=[w for w in words if w['text'] in ('No.','Code/Category') ]
        ytop=max(w['bottom'] for w in hdr)+2
        body=[w for w in words if w['top']>ytop and w['top']<780]
        # remove page number line at the bottom
        body=[w for w in body if not (w['top']>770)]
        bounds=hlines(pg,cfg['namex0'],cfg['namex1'],ytop-1)
        bounds=sorted(set([ytop]+bounds+[800]))
        for a,b in zip(bounds,bounds[1:]):
            span=[w for w in body if a-0.5<=w['top']+ (w['bottom']-w['top'])/2-0 and (w['top']+w['bottom'])/2<b]
            codew=[w for w in span if w['x0']>=cfg['codex']-2]
            leftw=[w for w in span if w['x0']<cfg['codex']-2]
            if not span: continue
            ents=code_entries(codew,cfg['codex'])
            numw=[w for w in leftw if cfg['numx0']<=w['x0']<cfg['namex_start']-1]
            namew=[w for w in leftw if w['x0']>=cfg['namex_start']-1]
            islw=[w for w in leftw if w['x0']<cfg['numx0']] if cfg.get('islandx') else []
            num=''.join(w['text'] for w in numw)
            name=' '.join(w['text'] for w in sorted(namew,key=lambda w:(round(w['top']),w['x0'])))
            isl=' '.join(w['text'] for w in sorted(islw,key=lambda w:(round(w['top']),w['x0'])))
            groups.append({'page':n,'no':num,'name':name,'island_txt':isl,'ents':ents})
    return groups
if __name__=='__main__':
    A1=dict(namex0=130,namex1=200,codex=245,numx0=70,namex_start=125)
    g=appendix12(range(22,37),A1)
    print(len(g))
    for x in g[:12]: print(x['page'],x['no'],x['name'],len(x['ents']))
