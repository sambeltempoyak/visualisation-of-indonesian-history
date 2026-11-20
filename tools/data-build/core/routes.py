# Arrows. R(id, kind, start, end, event, title, path, sources, width=2, note="")
RT=[]
def R(id, kind, start, end, event, title, path, sources, width=2, note=""):
    RT.append(dict(id=id,kind=kind,start=start,end=end,event=event,title=title,path=path,
                   width=width,note=note,sources=[{"id":s} for s in sources]))

R("r-sunda-entry","migration",-70000,-50000,"sundaland","First peoples move down Sundaland",
  [[97,20],[100,12],[101.5,6],[103,2],[106,-2.5],[110,-7]],["bellwood2007"],3)
R("r-sahul-south","migration",-65000,-47000,"first-sahul","Southern route to Sahul via Nusa Tenggara and Timor",
  [[110,-7.5],[115.5,-8.6],[120,-9.2],[124.5,-9.6],[129,-11],[132.9,-12.5]],["bellwood2017","clarkson2017"],3)
R("r-sahul-north","migration",-65000,-47000,"first-sahul","Northern route via Sulawesi and Maluku to New Guinea",
  [[112,-3],[119.5,-4],[124,-1.5],[128,-1.5],[134,-3.5],[141,-5.5]],["bellwood2017"],3)
R("r-austroasiatic","migration",-2500,-1000,"austroasiatic","Austroasiatic farmers spread south",
  [[107,24],[105.5,19],[104,14],[102.5,9],[101.4,5.5]],["lipson2018","mccoll2018"],2)
R("r-taiwan-luzon","migration",-3000,-2200,"out-of-taiwan","Out of Taiwan to Batanes and Luzon",
  [[120.8,23.8],[121.4,21.5],[121.9,20.4],[121.6,18.3],[121.2,16.5]],["blust1995","gray2009","bellwood2017"],3)
R("r-mp-south","migration",-2200,-1500,"malayo-polynesian","Philippines → Sulawesi and Maluku",
  [[121.2,16],[122.5,11.5],[125,7],[125,3],[123.5,0.5],[120.5,-2.5]],["bellwood2007"],2)
R("r-mp-borneo","migration",-2000,-1300,"malayo-polynesian","Philippines → Borneo",
  [[120.5,11],[118,8],[116,5],[114,2],[112,-1]],["bellwood2007"],2)
R("r-mp-west","migration",-1500,-500,"malayo-polynesian","Borneo → Java, Sumatra and the Peninsula",
  [[112,-2.5],[110,-6.8],[106,-6.3],[104,-3.5],[101.5,0],[101.8,3.5]],["bellwood2007","lipson2014"],2)
R("r-mp-east","migration",-1600,-1300,"malayo-polynesian","Maluku → New Guinea coasts → Bismarcks",
  [[124.5,1.2],[128.5,-1.5],[132,-1],[136,-1.2],[141,-2.8],[146,-4.5],[150.5,-4.8]],["bellwood2017","skoglund2016"],2)
R("r-malay-spread","migration",-300,700,"malay-homeland","Malayic from West Borneo to Sumatra and the Peninsula",
  [[111.5,0.4],[108,0.2],[105,-0.8],[103.5,-1.5],[101.5,1.5],[102.2,3.8]],["adelaar2005","andaya2008"],2)
R("r-lapita","migration",-1300,-800,"lapita","Lapita voyagers into Remote Oceania",
  [[150.5,-4.8],[156,-8],[161,-10],[167,-15.5],[178,-18],[184.8,-21.2]],["skoglund2016","kirch2017"],2)
R("r-poly-hawaii","migration",1000,1200,"lapita","East Polynesia → Hawai‘i",
  [[188,-14],[200,-15],[210,-17.5],[208,-8],[205,8],[203,20.5]],["wilmshurst2011","kirch2017"],2)
R("r-poly-rapa","migration",1100,1200,"lapita","East Polynesia → Rapa Nui",
  [[210,-17.5],[225,-21],[240,-25],[250.6,-27.1]],["wilmshurst2011"],2)
R("r-poly-nz","migration",1250,1300,"lapita","East Polynesia → Aotearoa New Zealand",
  [[210,-17.5],[200,-25],[186,-34],[175,-39.5]],["wilmshurst2011"],2)
R("r-madagascar","migration",500,900,"madagascar","Barito sailors to Madagascar",
  [[115,-2.5],[106,-6.5],[96,-8],[80,-11],[62,-14],[49,-18]],["adelaar2005","cox2012"],2)
R("r-dongson","trade",-500,200,"dongson","Bronze drums carried to the islands",
  [[105.8,20.2],[107.5,13],[105,6],[104,-1],[110,-6],[115.5,-8.3],[124.6,-8.2],[132.7,-5.6]],["calo2009"],1)
R("r-bengal","trade",-400,200,"bay-of-bengal","Bay of Bengal crossings",
  [[79.8,11.9],[86,15],[92,13],[96,11],[99.1,10.4]],["bellina2004"],2)
R("r-maritime-silk","trade",200,1300,"srivijaya","The maritime Silk Road through the Straits",
  [[80,9.5],[90,7],[97,5.5],[101,2.8],[104,1.3],[106,6],[105.2,9.8],[108.5,14],[110.5,19],[113.3,22.9]],["hall2011","wolters1967"],3)
R("r-yijing","pilgrimage",671,695,"srivijaya","Yijing: Guangzhou → Srivijaya → Nalanda",
  [[113.3,23.1],[110,16],[106.5,7],[104.8,-3],[103.6,-1.6],[100.4,5.7],[95,10],[89,18],[88,22.4],[85.4,25.1]],["takakusu1896","sen2003"],2)
R("r-chola","state",1025,1025,"chola","Chola naval raid on Srivijaya's ports",
  [[79.8,10.8],[88,8],[95,6.5],[100.3,5.7],[102.5,1.8],[104.8,-3]],["kulke2009"],2)
R("r-champa-aceh","migration",600,1200,"champa","Chamic speakers to Aceh (date uncertain)",
  [[109,13.8],[106.5,9],[103,6.5],[99,5.8],[95.6,5.4]],["thurgood1999"],1,"Direction supported by linguistics; date unknown.")
R("r-zhenghe","trade",1405,1433,"zhenghe","Zheng He's fleets",
  [[119.3,26],[114,21],[109.2,13.8],[108,4],[106.8,-6],[104.8,-3],[102.2,2.2],[97.3,5.2],[88,6.5],[80,6.9],[75.8,11.2]],["wade2005"],3)
R("r-islam","religion",1290,1620,"pasai","Islam along the trade routes",
  [[72.6,21.7],[76,12],[80.2,9.5],[90,6.5],[97.1,5.2],[102.2,2.2],[106.2,-6],[110.6,-6.9],[112.7,-7.2],[119.4,-5.2],[127.4,0.8]],["ricklefs2008","laffan2011"],2)
R("r-portuguese","colonial",1510,1512,"portuguese-melaka","Portuguese: Goa → Melaka → Banda & Ternate",
  [[73.8,15.5],[78,7.5],[90,5.5],[98,4.5],[102.2,2.2],[106.5,-4],[112,-6.5],[119,-6.8],[126,-5.5],[129.9,-4.5],[128,-1.5],[127.4,0.8]],["subrahmanyam2012"],2)
R("r-magellan","colonial",1521,1522,"magellan","Magellan–Elcano: Guam → Cebu → Tidore → Timor",
  [[144.7,13.4],[132,11.5],[125.6,10.2],[123.95,10.3],[121,8.3],[116.5,5.8],[114.9,4.9],[118,5.5],[124,3],[127.4,0.7],[124.5,-8.8],[115,-14],[95,-22],[65,-33]],["phelan1959"],2)
R("r-galleon","trade",1565,1815,"spain-manila","Manila galleons to Acapulco",
  [[120.97,14.59],[126,15],[135,26],[150,33],[175,37],[205,36],[235,30],[255,20],[260.1,16.9]],["flynn1995","phelan1959"],3)
R("r-voc","colonial",1611,1799,"voc","VOC 'Brouwer route' across the southern Indian Ocean",
  [[40,-37],[60,-39],[85,-37],[100,-28],[104,-14],[105.8,-7],[106.8,-6.1]],["gaastra2003"],2)
R("r-voc-spice","colonial",1619,1799,"batavia","VOC Batavia → Makassar → Ambon & Banda",
  [[106.8,-6.1],[110,-5.9],[114,-6],[119.2,-5.4],[124,-5.8],[128.2,-3.75],[129.9,-4.5]],["gaastra2003","andaya1993"],2)
R("r-eic","colonial",1685,1840,"british-straits","EIC: India → Bencoolen, Penang, Singapore → Canton",
  [[88.3,21.8],[93,15],[98,8.5],[100.3,5.4],[102.3,2.2],[103.85,1.29],[106,6],[109,12],[111.5,18],[113.3,22.9]],["tarling1962"],2)
R("r-slave-arakan","slave",1620,1665,"batavia-slaves","Slaves from Arakan and Bengal to Batavia",
  [[92.9,20.1],[93.5,15],[96,8.5],[100,3.5],[104,-1.5],[106.8,-6.1]],["vink2003"],2)
R("r-slave-coromandel","slave",1620,1690,"batavia-slaves","Slaves from the Coromandel Coast",
  [[80.2,13.1],[85,9],[93,5],[99,2],[104,-2.5],[106.8,-6.1]],["vink2003"],2)
R("r-slave-bali","slave",1620,1830,"bali-slaves","Balinese slaves to Batavia",
  [[115.2,-8.65],[113.5,-7.4],[110.5,-6.4],[106.8,-6.1]],["vanderkraan1983"],2)
R("r-slave-sulawesi","slave",1667,1830,"sulawesi-slaves","Makassar → Batavia slave route",
  [[119.4,-5.13],[116,-5.3],[111.5,-5.6],[106.8,-6.1]],["sutherland1983"],2)
R("r-slave-sumba","slave",1700,1910,"sumba-slaves","Sumba → Ende → Bima & Makassar",
  [[119.6,-9.6],[120.8,-9.2],[121.65,-8.85],[120.5,-7.8],[119.8,-6.5],[119.4,-5.15]],["needham1983"],2)
R("r-sulu-north","slave",1768,1898,"sulu-zone","Sulu raids into the Visayas and Luzon",
  [[121,6.05],[122.5,8.5],[123.5,10.5],[124,12.5]],["warren1981"],2)
R("r-sulu-south","slave",1768,1898,"sulu-zone","Sulu raids to Sulawesi and Maluku",
  [[121,6.05],[122.5,3.5],[124.8,1.5],[127.3,0.5]],["warren1981"],2)
R("r-sulu-west","slave",1768,1898,"sulu-zone","Sulu raids along Borneo to the Straits",
  [[121,6.05],[118,5.5],[115,4],[111,1.8],[107,1.3],[104,1.2]],["warren1981"],2)
R("r-papua-tidore","slave",1600,1870,"papua-slaves","Papuan captives to Tidore",
  [[131,-0.9],[129.5,-0.4],[127.4,0.68]],["andaya1993"],2)
R("r-banda-kei","migration",1621,1630,"banda","Bandanese refugees to the Kei Islands",
  [[129.9,-4.53],[131.3,-5],[132.7,-5.55]],["kaartinen2010"],2)
R("r-bugis","migration",1669,1780,"makassar-war","Bugis and Makassarese diaspora to Riau, Selangor, Johor",
  [[119.4,-5.13],[115,-4.6],[110,-3],[106,-0.6],[104.4,0.9],[102.6,2.4],[101.4,3.05]],["andaya2015","pelras1996"],2)
R("r-trepang","trade",1720,1907,"trepang","Makassan trepang voyages to Marege'",
  [[119.4,-5.13],[121.5,-7.5],[125,-9.6],[130,-11.4],[133.5,-11.6],[136.5,-12.1]],["macknight1976"],2)
R("r-coolie-china","labour",1870,1930,"deli","Chinese coolies via Singapore & Penang to Deli",
  [[116.7,23.35],[113,19],[109,12],[105.5,4],[103.85,1.29],[100.3,5.4],[98.67,3.6]],["breman1989","kaur2004"],2)
R("r-java-deli","labour",1890,1940,"deli","Javanese contract labour to Deli",
  [[110.4,-7],[107,-6],[105,-3.5],[103,-0.5],[100.5,2.2],[98.67,3.6]],["breman1989","stoler1985"],2)
R("r-suriname","labour",1890,1939,"suriname","Javanese to Suriname (via the Cape)",
  [[110.4,-7],[105,-9.5],[95,-15],[75,-25],[55,-32],[41,-35]],["hoefte1998"],2,"Continues off-map to Suriname.")
R("r-tamil","labour",1880,1938,"tamil-malaya","Tamil labour to Malaya's rubber estates",
  [[80.3,13.05],[79.85,10.77],[86,8.5],[94,6.5],[100.3,5.4],[101.45,3.05]],["sandhu1969","kaur2004"],2)
R("r-romusha","labour",1942,1945,"romusha","Romusha to the Thailand–Burma railway",
  [[110.4,-7],[106.8,-6.1],[104,-1],[103.85,1.29],[101.5,6.5],[100.5,12.5],[99.53,14.02]],["sato1994"],2)
R("r-transmig-lampung","state",1905,2000,"transmigrasi","Transmigration: Java → Lampung & South Sumatra",
  [[110.4,-7.3],[107.5,-6.8],[106,-5.9],[105.2,-5]],["hardjono1977","fearnside1997"],2)
R("r-transmig-kalimantan","state",1950,2000,"transmigrasi","Transmigration: Java & Madura → Kalimantan",
  [[112.7,-7.2],[113,-5],[114,-3],[114.5,-1.8]],["fearnside1997"],2)
R("r-transmig-sulawesi","state",1950,2000,"transmigrasi","Transmigration: Java & Bali → Sulawesi",
  [[114.5,-7.8],[117.5,-6.5],[119.5,-4.8],[121.5,-2.5]],["fearnside1997"],2)
R("r-transmig-papua","state",1964,2000,"transmigrasi","Transmigration: Java → Papua",
  [[112.7,-7.2],[118,-7.8],[125,-8.6],[131,-8],[136,-7.6],[140.4,-8.45]],["fearnside1997"],2)
