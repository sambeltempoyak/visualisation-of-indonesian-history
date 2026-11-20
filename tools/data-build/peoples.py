# Peoples. P(id, name, glottocode, family, country, region, summary, impacts, sources, autonym=None, lat=None, lon=None)
# impacts: list of (period, text, [source ids]); lat/lon default to Glottolog coordinates.
PE=[]
def P(id,name,glottocode,family,country,region,summary,impacts,sources,autonym=None,lat=None,lon=None):
    PE.append(dict(id=id,name=name,autonym=autonym,glottocode=glottocode,lat=lat,lon=lon,family=family,
        country=country,region=region,summary=summary,
        impacts=[dict(period=a,text=b,sources=[{"id":s} for s in c]) for a,b,c in impacts],
        sources=[{"id":s} for s in sources]))

AN="Austronesian › Malayo-Polynesian"
# ---- first 12 = shown at low zoom ----
P("acehnese","Acehnese","achi1257",AN+" › Chamic","Indonesia","Aceh, northern tip of Sumatra",
 "Speakers of a Chamic language related to Cham of Vietnam; heirs of Pasai and the Aceh sultanate, the 'Veranda of Mecca'.",
 [("c. 600–1200?","Ancestors of Acehnese speakers probably arrived from the Champa coast; date uncertain.",["thurgood1999"]),
  ("1290s–1520","Samudra-Pasai is the first Muslim sultanate in the archipelago.",["ricklefs2008"]),
  ("1520–1700","Aceh Darussalam grows on pepper and Islamic scholarship, rivals Portuguese Melaka.",["reid2005","reid1993"]),
  ("1873–1912","The Aceh War: decades of Dutch conquest and guerrilla resistance.",["reid2005"]),
  ("1976–2005","GAM rebellion; tsunami (2004); Helsinki peace and special autonomy (2005).",["aspinall2009"])],
 ["reid2005","aspinall2009"], autonym="Ureuëng Acèh", lat=5.2, lon=96.2)
P("minangkabau","Minangkabau","mina1268",AN+" › Malayic","Indonesia","West Sumatra highlands (darek) and coast (rantau)",
 "A matrilineal Muslim society of the West Sumatran highlands, famous for merantau (migration) and for combining adat with Islam.",
 [("1784–1838","Coffee and trade boom; the Padri reform movement and the Dutch Padri War.",["dobbin1983"]),
  ("1830s–1910s","Forced coffee cultivation and colonial 'adat' administration; Ombilin coal mines worked by convicts.",["kahn1993","unesco2019"]),
  ("20th c.","Minangkabau migrants and intellectuals (Hatta, Sjahrir, Tan Malaka) prominent in nationalism.",["kahn1993","elson2008"])],
 ["dobbin1983","kahn1993"], lat=-0.6, lon=100.5)
P("javanese","Javanese","java1254",AN+" › Javanese","Indonesia (and Suriname, Malaysia, New Caledonia)","Central and East Java",
 "The largest ethnic group in Southeast Asia, heirs of Mataram, Majapahit and Islamic Mataram, and of a long agrarian court culture.",
 [("8th–15th c.","Hindu-Buddhist kingdoms: Mataram (Borobudur, Prambanan), Kediri, Singhasari, Majapahit.",["miksic2017","robson1995"]),
  ("15th–17th c.","North-coast Muslim ports; inland Islamic Mataram.",["ricklefs2008"]),
  ("1825–1870","Java War; the Cultivation System's forced export crops.",["carey2007","elson1994"]),
  ("1870–1939","Indentured to Deli and Suriname as coolies.",["breman1989","hoefte1998"]),
  ("1942–45","Mobilised as romusha by the Japanese.",["sato1994"]),
  ("1905–2000","Moved as transmigrants to the outer islands — often onto indigenous land.",["fearnside1997"])],
 ["ricklefs2008"], autonym="Wong Jawa", lat=-7.3, lon=110.6)
P("sundanese","Sundanese","sund1252",AN+" › Sundanese","Indonesia","West Java (Pasundan)",
 "The people of West Java, heirs of Tarumanagara, Sunda-Pajajaran and Banten.",
 [("5th c.","Tarumanagara inscriptions of King Purnavarman.",["coedes1968"]),
  ("1527–1682","Banten sultanate's pepper trade.",["ricklefs2008"]),
  ("1830–1870","Priangan coffee under forced cultivation.",["elson1994"])],
 ["ricklefs2008"], autonym="Urang Sunda", lat=-6.9, lon=107.4)
P("balinese","Balinese","bali1278",AN+" › Bali-Sasak-Sumbawa","Indonesia","Bali",
 "A Hindu society whose court culture inherited Majapahit's; later made into the archetype of 'cultural tourism'.",
 [("16th c.","After Majapahit's fall, Hindu-Javanese court culture continues in Gelgel and Klungkung.",["vickers1989"]),
  ("1620–1830","Balinese courts export war captives as slaves to Batavia and beyond.",["vanderkraan1983"]),
  ("1906–1908","Puputan: the royal houses of Badung and Klungkung die facing Dutch troops.",["vickers1989"]),
  ("1920s–today","Tourism produces a 'touristic culture'.",["picard1996"])],
 ["vickers1989","picard1996"])
P("makassarese","Makassarese","maka1311",AN+" › South Sulawesi","Indonesia","South-west Sulawesi (Gowa–Tallo)",
 "Seafaring people of Gowa–Tallo, whose port of Makassar was the free-trading rival of the VOC.",
 [("1605","Rulers of Gowa–Tallo accept Islam.",["cummings2002"]),
  ("1600–1669","Makassar flourishes as an open spice port.",["reid1993"]),
  ("1666–69","Defeat by the VOC and Bone; diaspora.",["andaya2015"]),
  ("1720–1907","Trepang voyages to Aboriginal Australia (Marege').",["macknight1976"])],
 ["cummings2002"], lat=-5.4, lon=119.6)
P("bugis","Bugis","bugi1244",AN+" › South Sulawesi","Indonesia, Malaysia","South Sulawesi; diaspora across the archipelago",
 "Rice farmers, traders and sailors of South Sulawesi with a written literature (La Galigo) and a far-flung 18th-century diaspora.",
 [("1608–11","Islamised by Gowa in war.",["pelras1996"]),
  ("1666–69","Arung Palakka of Bone allies with the VOC against Gowa.",["andaya2015"]),
  ("18th c.","Bugis dynasties rise in Riau, Selangor and Johor.",["andaya2015","pelras1996"])],
 ["pelras1996"], autonym="To Ugi'", lat=-4.3, lon=120.0)
P("kambera","Sumbanese (Kambera, East Sumba)","kamb1299",AN+" › Central Malayo-Polynesian › Sumba-Hawu","Indonesia","East Sumba",
 "East Sumbanese, speakers of Kambera, in a ranked society of nobles, commoners and hereditary servants, with the Marapu ancestral religion and horse and textile trade.",
 [("1700–1900","Sumba raided and traded for slaves and horses via Ende, Bima and Makassar.",["needham1983"]),
  ("1906–13","Dutch military 'pacification'; colonial rajas and districts.",["needham1983","hoskins1993"]),
  ("20th c.–","Protestant missions, state land categories and, recently, plantation and tourism frontiers.",["vel2008"])],
 ["needham1983","keane1997"], lat=-9.8, lon=120.3)
P("dani","Dani (Baliem Valley)","lowe1415","Nuclear Trans New Guinea › Dani","Indonesia","Baliem Valley, highland Papua",
 "Highland Papuan farmers of the Baliem Valley, heirs of one of the world's independent agricultural traditions, first contacted by outsiders in 1938.",
 [("c. 7000 BP","New Guinea highlanders domesticate taro and bananas (Kuk).",["denham2003"]),
  ("1962–69","Integration into Indonesia via the New York Agreement and Act of Free Choice.",["drooglever2009"]),
  ("1970s–","Missions, migration from other islands and militarisation; Papuan nationalism.",["chauvel2005","kirksey2012"])],
 ["chauvel2005"], lat=-4.1, lon=138.95)
P("semai","Semai (Senoi Orang Asli)","sema1266","Austroasiatic › Aslian","Malaysia","Central Malay Peninsula (Perak, Pahang)",
 "The largest Orang Asli group, Senoi swidden farmers speaking an Aslian (Austroasiatic) language.",
 [("c. 4,000 BP","Mix of Hòabìnhian foragers and incoming Austroasiatic farmers.",["mccoll2018","bulbeck2011"]),
  ("18th–19th c.","Orang Asli communities raided for slaves by Malay and other slavers.",["endicott1983"]),
  ("1948–60","Forced resettlement during the Malayan Emergency.",["leary1995"]),
  ("1954–today","Governed under the Aboriginal Peoples Act; land lost to plantations and dams.",["nicholas2000"])],
 ["endicott2016","nicholas2000"])
P("orang-rimba","Orang Rimba (Kubu)","kubu1239",AN+" › Malayic","Indonesia","Bukit Duabelas and Bukit Tigapuluh forests, Jambi",
 "Forest-dwelling hunter-gardeners of Jambi who speak a Malayic language and keep a strict boundary between forest life and settled outsiders; 'Kubu' is a pejorative exonym.",
 [("7th–13th c.","Forest-product collectors in the hinterland of Melayu/Muara Jambi.",["miksic2017"]),
  ("1980s–","Logging, transmigration settlements and oil palm encircle their forests.",["sager2008","fearnside1997"]),
  ("2000","Bukit Duabelas declared a national park.",["sager2008"])],
 ["sager2008"], autonym="Orang Rimba (people of the forest)", lat=-1.95, lon=102.6)
P("malay","Malay","stan1306",AN+" › Malayic","Malaysia, Indonesia, Brunei, Singapore, Thailand","Straits of Malacca, coasts of Sumatra and Borneo",
 "A language and court culture spread through trade and Islam — 'Malayu' identity absorbed many origins.",
 [("682","Old Malay inscriptions of Srivijaya.",["manguin2004"]),
  ("1400–1511","Melaka sets the model of Malay Muslim kingship.",["andaya2017"]),
  ("1824","The Anglo-Dutch treaty splits the Malay world.",["tarling1962"]),
  ("1957–","Defined in Malaysia's constitution as Muslim, Malay-speaking, following Malay custom.",["andaya2017"])],
 ["andaya2008","andaya2017"], lat=2.5, lon=102.0)
# ---- others ----
P("jehai","Jahai (Semang Orang Asli)","jeha1242","Austroasiatic › Aslian","Malaysia, Thailand","Northern Malay Peninsula forests",
 "Semang foragers who carry the deepest local (Hòabìnhian) ancestry in mainland Southeast Asia.",
 [("Late Pleistocene","Descend largely from early forager populations.",["mccoll2018"]),
  ("1948–60","Pulled into the Emergency by both sides.",["leary1995"])],["endicott2016","benjamin2002"])
P("batek","Batek (Semang Orang Asli)","bate1262","Austroasiatic › Aslian","Malaysia","Pahang and Kelantan, around Taman Negara",
 "Semang foragers and traders of forest products.",[("20th c.","Logging and the national park reshape their territory.",["endicott2016"])],["endicott2016"])
P("temiar","Temiar (Senoi Orang Asli)","temi1246","Austroasiatic › Aslian","Malaysia","Upland Perak and Kelantan",
 "Senoi swiddeners famous in anthropology for dream and trance practices.",
 [("1948–60","Courted by communists and the British during the Emergency.",["leary1995"])],["endicott2016"])
P("temuan","Temuan (Proto-Malay Orang Asli)","temu1239",AN+" › Malayic","Malaysia","Selangor and Negeri Sembilan",
 "Malayic-speaking Orang Asli, classified as 'Proto-Malay'.",
 [("1990s–2000s","Land taken for highways and the airport; landmark customary land case won in 2002.",["endicott2016"])],["endicott2016","benjamin2002"])
P("jakun","Jakun (Proto-Malay Orang Asli)","jaku1244",AN+" › Malayic","Malaysia","Johor and Pahang",
 "Malayic-speaking Orang Asli of the southern Peninsula.",[],["endicott2016"])
P("ayta","Ayta Magbukon","maga1263",AN+" › Northern Luzon","Philippines","Bataan and Zambales, Luzon",
 "A Philippine Negrito people descended from the earliest settlers of the islands.",
 [("c. 50,000 BP","Ancestors among the first arrivals in the Philippines; highest known Denisovan ancestry.",["larena2021","larena2021b"])],["larena2021"], lat=14.7, lon=120.4)
P("amis","Amis (Pangcah)","amis1246","Austronesian › East Formosan","Taiwan","East coast of Taiwan",
 "Taiwan's largest indigenous people, speakers of a Formosan language from the Austronesian homeland.",
 [("c. 5,000 BP","Taiwan is the source of the Austronesian expansion.",["blust1995","gray2009"]),
  ("1624–1662","Dutch rule and Han Chinese settlement begin to marginalise Taiwan's indigenous peoples.",["andrade2008"])],["blust1995"])
P("tagalog","Tagalog","taga1270",AN+" › Greater Central Philippine","Philippines","Manila and southern Luzon",
 "The people of Manila's hinterland, converted to Catholicism under Spain and central to the 1896 revolution.",
 [("1571–1898","Spanish rule centred on Manila.",["phelan1959"]),("1896","Philippine Revolution.",["ileto1979"])],["phelan1959","ileto1979"])
P("tausug","Tausug","taus1251",AN+" › Greater Central Philippine","Philippines, Malaysia","Sulu Archipelago",
 "Muslim people of the Sulu sultanate, which resisted Spain for three centuries.",
 [("1768–1898","Sulu sultanate trades sea and forest products for China, relying on slave raids.",["warren1981"])],["warren1981"], lat=6.0, lon=121.1)
P("iban","Iban","iban1264",AN+" › Malayic (Ibanic)","Malaysia, Indonesia","Sarawak and West Kalimantan",
 "Malayic-speaking Dayak swidden farmers whose migrations and headhunting raids shaped Borneo; levies for the Brooke Raj.",
 [("1841–1946","Recruited and also fought by the Brooke Rajahs.",["king1993"]),
  ("1970s–","Logging and plantations transform longhouse lands.",["gaveau2016"])],["king1993"])
P("ngaju","Ngaju Dayak","ngaj1237",AN+" › Barito","Indonesia","Central Kalimantan rivers",
 "Barito-speaking Dayak of Central Kalimantan, with the Kaharingan religion.",
 [("1967–","State forest, logging, then oil palm and the failed Mega Rice Project.",["li2000","gaveau2016"])],["king1993"])
P("kenyah","Kenyah","main1275",AN+" › North Borneo","Malaysia, Indonesia","Upper Baram and Apo Kayan, central Borneo",
 "Longhouse-dwelling stratified societies of central Borneo.",
 [("1970s–","Resettlement and logging in the interior.",["king1993"])],["king1993"])
P("maanyan","Ma'anyan","maan1238",AN+" › Barito","Indonesia","South-east Kalimantan",
 "Barito Dayak whose language is the closest relative of Malagasy.",
 [("c. 500–900","Barito speakers sail to Madagascar.",["adelaar2005"])],["adelaar2005"])
P("malagasy","Malagasy","plat1254",AN+" › Barito","Madagascar","Madagascar",
 "The westernmost Austronesians, descended from Island Southeast Asian and African ancestors.",
 [("c. 1,200–1,500 BP","Founded partly by a small group of Indonesian women.",["cox2012"])],["adelaar2005","cox2012"])
P("cham","Cham","west2650",AN+" › Chamic","Vietnam, Cambodia","Central Vietnam and Cambodia",
 "Austronesian people of the former kingdom of Champa, now Muslim and Hindu (Balamon) communities.",
 [("192–1471","Kingdom of Champa on the coast of today's Vietnam.",["coedes1968"]),("1471","Vijaya falls to Đại Việt.",["hall2011"])],["thurgood1999"], lat=11.6, lon=108.9)
P("kodi","Kodi (West Sumba)","kodi1247",AN+" › Sumba-Hawu","Indonesia","Western tip of Sumba",
 "West Sumbanese domain studied by Janet Hoskins, with calendrical rites (the Nale festival) and exchange.",
 [("19th c.","Exposure to slave raiding.",["needham1983"]),("1906–13","Colonial pacification and a new calendar of history.",["hoskins1993"])],["hoskins1993"])
P("lamboya","Laboya / Lamboya (West Sumba)","lamb1273",AN+" › Sumba-Hawu","Indonesia","South-west Sumba",
 "A West Sumbanese domain and language (Laboya), with Marapu ancestral houses and the Nale festival.",
 [("20th c.","Colonial and Indonesian state administration redraws domains into districts.",["vel2008"])],["vel2008"])
P("biak","Biak","biak1248",AN+" › South Halmahera–West New Guinea","Indonesia","Biak and the Cenderawasih Bay",
 "Austronesian seafarers of northern Papua, long linked to Tidore and its raiding networks.",
 [("1600–1870","Agents and victims in the Tidore tribute and slave system.",["andaya1993"]),
  ("1998","Biak massacre after a Morning Star flag-raising.",["chauvel2005"])],["andaya1993","chauvel2005"])
P("ternatean","Ternateans","tern1247","North Halmahera (Papuan)","Indonesia","Ternate, North Maluku",
 "Speakers of a non-Austronesian (West Papuan) language; rulers of the clove sultanate of Ternate.",
 [("1450–1606","Muslim clove sultanate; Portuguese fort (1522) and expulsion (1575).",["andaya1993"])],["andaya1993"])
P("bandanese","Bandanese (Banda Eli, Kei)","band1355",AN+" › Central Malayo-Polynesian","Indonesia","Banda Eli & Banda Elat, Kei Islands",
 "Descendants of Bandanese who fled the VOC conquest of 1621, still speaking a Banda language in Kei.",
 [("1621","VOC conquest of Banda; mass killing, enslavement and flight.",["loth1995"]),
  ("17th c.–","Exile community keeps memory of the lost islands.",["kaartinen2010"])],["kaartinen2010"])
P("tetum","Tetum","tetu1246",AN+" › Central Malayo-Polynesian","Timor-Leste","Timor",
 "Timor's lingua franca, official language of Timor-Leste.",
 [("1600–1800","Timorese lords, Topasses and Portuguese contest sandalwood.",["hagerdal2012"]),
  ("1975–1999","Indonesian occupation.",["cavr2005"])],["hagerdal2012"])
P("atoni","Atoni (Uab Meto)","uabm1237",AN+" › Central Malayo-Polynesian","Indonesia, Timor-Leste","West Timor",
 "Dawan/Atoni Pah Meto of West Timor.",[("1600–1800","Divided between VOC Kupang and Portuguese-Topass spheres.",["hagerdal2012"])],["hagerdal2012"])
P("batak-toba","Toba Batak","bata1289",AN+" › Northwest Sumatra–Barrier Islands","Indonesia","Lake Toba, North Sumatra",
 "Highland people of North Sumatra, largely Protestant since 19th-century German missions.",
 [("1870–1940","Plantation belt expands onto lands of Batak and Malay cultivators.",["stoler1985"])],["stoler1985"])
P("amungme","Amungme","dama1272","Nuclear Trans New Guinea","Indonesia","Highlands around Grasberg, Papua",
 "Highland people whose sacred mountain became the Freeport mine.",
 [("1967–","Freeport mine; displacement, pollution and militarisation.",["leith2003"])],["leith2003"])
P("kamoro","Kamoro","kamo1255","Asmat-Kamoro (Papuan)","Indonesia","South coast lowlands, Mimika, Papua",
 "Sago-forest and river people of the Mimika coast, downstream of Freeport's tailings.",
 [("1970s–","Tailings and the mining town of Timika transform their rivers and estuaries.",["leith2003"])],["leith2003"])
P("marind","Marind","nucl1622","Anim (Papuan)","Indonesia","Merauke, south Papua",
 "Lowland people of south Papua, at the centre of transmigration and the MIFEE agribusiness project.",
 [("1902–","Dutch post at Merauke; epidemics in the early 20th century.",["chauvel2005"]),
  ("2010–","MIFEE and food-estate concessions on Marind land.",["ginting2013"])],["ginting2013"])
P("madurese","Madurese","nucl1460",AN+" › Madurese","Indonesia","Madura and East Java; migrants in Kalimantan",
 "People of Madura, many of whom migrated to East Java and Kalimantan, including as transmigrants.",
 [("1990s–2001","Violent conflicts with Dayak (and Malay) communities in West Kalimantan (1996–97, 1999) and Central Kalimantan (2001).",["henley2007"])],["fearnside1997"])
P("yolngu","Yolŋu","djam1256","Pama-Nyungan","Australia","North-east Arnhem Land",
 "Aboriginal clans of Arnhem Land with centuries of contact with Makassan trepangers.",
 [("65,000–50,000 BP","Descendants of the first peoples of Sahul.",["clarkson2017"]),
  ("1720–1907","Trade and exchange with Makassan trepangers.",["macknight1976"]),
  ("1906–07","Northern Territory authorities (then under South Australia) end Makassan voyages.",["macknight1976"])],["macknight1976","broome2010"])
P("toraja","Toraja (Sa'dan)","tora1261",AN+" › South Sulawesi","Indonesia","Highland South Sulawesi",
 "Highland rice farmers famous for tongkonan houses and funeral feasts, largely Protestant since Dutch missions.",
 [("19th c.","Highlanders raided for slaves by lowland Bugis.",["sutherland1983"])],["pelras1996"])
