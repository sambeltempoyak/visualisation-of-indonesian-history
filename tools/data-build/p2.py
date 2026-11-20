from parse import *
def app2():
    cfg=dict(namex0=210,namex1=250,codex=304,numx0=160,namex_start=200)
    out=[]
    cur_island=None
    for n in range(37,41):
        pg=pdf.pages[n-1]
        words=pg.extract_words()
        hdr=[w for w in words if w['text'] in ('No.','Code/Category','Island')]
        ytop=max(w['bottom'] for w in hdr)+2
        # island spans
        ib=sorted(set([ytop]+hlines(pg,72,160,ytop-1)+[800]))
        ispans=[]
        for a,b in zip(ib,ib[1:]):
            t=' '.join(w['text'] for w in sorted([w for w in words if w['x0']<160 and a<=(w['top']+w['bottom'])/2<b and w['top']>ytop and w['top']<770],key=lambda w:(round(w['top']),w['x0'])))
            ispans.append((a,b,t))
        gs=appendix12([n],dict(namex0=210,namex1=250,codex=304,numx0=160,namex_start=200))
        for g in gs:
            # find span midpoint: use first entry top
            y=g['ents'][0]['top'] if g['ents'] else 0
            isl=None
            for a,b,t in ispans:
                if a<=y<b and t: isl=t
            g['isl']=isl
            out.append(g)
        print(n,[(round(a),round(b),t) for a,b,t in ispans])
    return out
if __name__=='__main__':
    g=app2()
    for x in g: print(x['page'],x['no'],x['name'],x['isl'],[e['codes'][0] for e in x['ents']])
