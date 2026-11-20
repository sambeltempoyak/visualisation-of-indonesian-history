from p3 import *
def app3b():
    rows,heads=app3()
    secs=[];log=[]
    names=['Others from Sumatra','Others from Jawa/Bali','Others from Nusa Tenggara','Others from Kalimantan','Others from Sulawesi','Others from Maluku','Others from Papua','Foreign Indonesians']
    for n,t,ws in rows:
        txt=' '.join(w['text'] for w in ws)
        m=re.match(r'^(\d{1,4}) (\d{4})(?: / (\d{4}))? “(.*?)[” ]*$',txt)
        if not m:
            log.append((n,t,txt)); continue
        k=int(m.group(1))
        if k==9999 : log.append((n,t,'NIU:'+txt)); continue
        if k==1: secs.append({'name':names[len(secs)],'rows':[]})
        codes=[m.group(2)]+([m.group(3)] if m.group(3) else [])
        secs[-1]['rows'].append(dict(k=k,codes=codes,label=m.group(4).strip(),page=n))
    return secs,log
if __name__=='__main__':
    secs,log=app3b()
    for s in secs: print(s['name'],len(s['rows']))
    print(sum(len(s['rows']) for s in secs)); print(log)
