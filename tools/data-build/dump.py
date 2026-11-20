import pdfplumber,sys
p=pdfplumber.open(sys.argv[1])
print(len(p.pages))
for i in range(int(sys.argv[2])-1,int(sys.argv[3])):
    pg=p.pages[i]; print('=====PAGE',i+1,pg.width,pg.height); print(pg.extract_text())
