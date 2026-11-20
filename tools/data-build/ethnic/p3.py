from parse import *
def app3():
    rows=[];heads=[]
    for n in range(41,52):
        pg=pdf.pages[n-1]
        words=pg.extract_words()
        hdr=[w for w in words if w['text'] in ('No.','Code/category')]
        ytop=max(w['bottom'] for w in hdr)+2
        body=[w for w in words if ytop<w['top']<765]
        # find end (Total/Note) - cut at 'Total' or 'NIU'
        for l in lines_of(body):
            x0=l[0]['x0']
            left=[w for w in l if w['x0']<200]
            rest=[w for w in l if w['x0']>=200]
            if left: heads.append((n,round(l[0]['top']),' '.join(w['text'] for w in left)))
            if rest:
                rows.append((n,round(l[0]['top']),rest))
    return rows,heads
if __name__=='__main__':
    rows,heads=app3()
    print(len(rows))
    for h in heads: print(h)
