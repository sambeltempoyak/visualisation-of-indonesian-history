# Event cards. E(id, start, end, era, theme, place, lat, lon, title, summary, detail, sources, q, **kw)
# sources: list of "id" or "id:pages"
EV = []
def src(lst):
    out=[]
    for s in lst:
        if ":" in s: i,p=s.split(":",1); out.append({"id":i,"pages":p})
        else: out.append({"id":s})
    return out
def E(id, start, end, era, theme, place, lat, lon, title, summary, detail, sources, q, certainty="established", **kw):
    d=dict(id=id,title=title,start=start,end=end,era=era,theme=theme,place=place,lat=lat,lon=lon,
           summary=summary,detail=detail,certainty=certainty,sources=src(sources),q=q)
    for k in ("peoples","routes","related"): d[k]=kw.pop(k,[])
    d.update(kw); EV.append(d)

# ===================== 1. GEOGRAPHY / DEEP TIME =====================
E("sundaland",-70000,-8000,"deep","migration","Sunda Shelf",2.0,108.0,
 "Sundaland, Sahul and the Wallace Line",
 "In glacial periods sea level fell by up to about 120 m, joining Sumatra, Java, Bali and Borneo to the Asian mainland (Sundaland) and New Guinea to Australia (Sahul). Between them, the islands of Wallacea always needed sea crossings.",
 "This geography is the stage for everything that follows. Sundaland could be walked; Wallacea — Sulawesi, Lombok to Timor, Maluku — could not, which is why the earliest crossings to Sahul imply boats and planned voyages. The Wallace Line, first drawn from the distribution of animals, also marks a deep human threshold.\n\nRising seas after the Last Glacial Maximum (c. 20,000 years ago) drowned the Sunda plains, creating the shallow Java Sea, Strait of Malacca and South China Sea that later carried monsoon trade. The modern nations of the region — Indonesia, Malaysia, Brunei, Singapore, the Philippines, Timor-Leste, Papua New Guinea, and mainland Thailand, Myanmar, Cambodia, Laos and Vietnam — sit across this drowned continent and its island arcs.",
 ["bellwood2007:1–39","bellwood2017"], [1,2], peoples=[], routes=["r-sunda-entry"])
E("monsoon",1,1600,"commerce","trade","Strait of Malacca",2.6,101.2,
 "Lands below the winds: monsoons and straits",
 "Alternating monsoon winds set the rhythm of sailing: ships waited in ports for the wind to turn, making straits such as Malacca and Sunda natural sites for entrepôts.",
 "Anthony Reid's 'lands below the winds' takes its name from a Malay, Persian and Arab phrase for the lands their ships reached on the monsoon winds, east of India. Because ships from India, China and the Arabian Sea had to wait months for the winds to reverse, ports where routes met — the Isthmus of Kra, the Strait of Malacca, the north Java coast — became cosmopolitan meeting places. This structural fact explains why power in the archipelago was so often maritime and port-based rather than territorial.",
 ["reid1988:1–10","wolters1967","hall2011"], [1,5])

E("first-sahul",-65000,-47000,"deep","migration","Madjedbebe, Arnhem Land",-12.5,132.9,
 "First crossings to Sahul",
 "Modern humans crossed the Wallacean straits and reached northern Australia by about 65,000–50,000 years ago — among the earliest deliberate sea voyages known.",
 "Excavations at Madjedbebe rock shelter in Arnhem Land produced artefacts dated to about 65,000 years ago, the earliest secure evidence of people in Sahul; others prefer a later arrival near 50,000 years ago, so the date range is still debated. Either way, Papuans and Aboriginal Australians descend from these first voyagers, and their ancestry is the deepest layer in the populations of eastern Indonesia, from Timor and Alor to Papua.",
 ["clarkson2017","bellwood2017","skoglund2016"], [2], certainty="debated",
 debate="Arrival 65 ka (Clarkson et al. 2017) vs c. 50–47 ka (critics of the Madjedbebe dating). Both imply open-sea crossings through Wallacea.",
 peoples=["yolngu","dani"], routes=["r-sahul-south","r-sahul-north"])
E("sulawesi-art",-51200,-40000,"deep","indigenous","Leang Karampuang, Maros-Pangkep",-4.95,119.67,
 "The world's oldest narrative art, Sulawesi",
 "Cave paintings in the limestone karst of Maros-Pangkep show humans and animals in a scene dated to at least 51,200 years ago; a warty-pig painting at Leang Tedongnge is at least 45,500 years old.",
 "These dates, obtained by uranium-series analysis of mineral crusts over the paint, place Sulawesi — not Europe — at the origin of figurative and narrative image-making. They show that the first people moving through Wallacea brought complex symbolic culture with them.",
 ["oktaviana2024","brumm2021"], [2])
E("liang-bua",-100000,-50000,"deep","migration","Liang Bua, Flores",-8.53,120.45,
 "Homo floresiensis and other archaic humans",
 "Flores was home to a small archaic hominin, Homo floresiensis, whose remains date to about 100,000–60,000 years ago; its traces vanish around 50,000 years ago, near the arrival of modern humans.",
 "The islands were not empty when modern humans arrived: archaic hominins lived on Flores (and on Luzon, Homo luzonensis). Whether modern humans played a part in their disappearance is unknown.",
 ["sutikna2016","bellwood2017"], [2], certainty="debated")
E("hoabinhian",-30000,-2000,"deep","indigenous","Malay Peninsula interior",5.3,101.6,
 "Hòabìnhian foragers and the ancestors of the Semang",
 "Ancient genomes show that the Semang Orang Asli (Jahai, Batek and others) carry the deepest local hunter-gatherer ancestry in mainland Southeast Asia, from the Hòabìnhian forager tradition.",
 "McColl et al. (2018) sequenced ancient individuals from Laos, Malaysia, Vietnam and elsewhere and found a 'two-layer' history: first Hòabìnhian hunter-gatherers, then farming populations from the north. The Semang retain most of the first layer; the Senoi (Semai, Temiar) are a mix of these foragers with Neolithic Austroasiatic farmers; the 'Proto-Malay' groups (Temuan, Jakun) speak Malayic Austronesian languages. Geoffrey Benjamin warns that these three categories describe social modes (foraging, swiddening, trade-oriented) as much as descent.",
 ["mccoll2018","bulbeck2011","benjamin2002","endicott2016"], [2,12],
 peoples=["jehai","batek","semai","temiar","temuan","jakun"])
E("ayta-first",-50000,-20000,"deep","migration","Zambales, Luzon",15.2,120.4,
 "The Philippines' earliest settlers",
 "Genome-wide data show that Philippine Negrito groups such as the Ayta descend from the earliest settlers of the islands, and that the Philippines received at least five migration waves over 50,000 years.",
 "Larena et al. (2021) found that Ayta Magbukon carry the highest Denisovan ancestry known, and that later waves — including Austronesian-speakers from Taiwan — mixed with the earliest population rather than replacing it.",
 ["larena2021","larena2021b"], [2], peoples=["ayta"])
E("kuk",-5000,-4400,"deep","migration","Kuk Swamp, Wahgi Valley",-5.78,144.33,
 "Independent agriculture in highland New Guinea",
 "By about 7,000–6,400 years ago Papuan communities were draining wetlands and cultivating bananas and taro at Kuk — one of the world's independent centres of plant domestication.",
 "Kuk shows that Papuan societies developed farming on their own, long before Austronesian-speakers arrived on the New Guinea coasts. This matters for how 'progress' narratives treat Papua as backward: its highlands were early agricultural innovators.",
 ["denham2003","bellwood2017"], [2,12], peoples=["dani"])

# ===================== 2. MIGRATIONS =====================
E("austroasiatic",-2500,-1000,"austronesian","migration","Mainland Southeast Asia",15.5,104.5,
 "Austroasiatic farmers spread south",
 "Rice- and millet-farming communities related to today's Austroasiatic speakers (Khmer, Mon, Vietnamese, Aslian Orang Asli) spread through the mainland and into the Malay Peninsula from about 4,500 years ago.",
 "Ancient genomes from Man Bac in Vietnam and later sites show farmers with East Asian ancestry mixing with local Hòabìnhian foragers. Lipson et al. (2014) also detected Austroasiatic-related ancestry in western Indonesians (Java, Bali, Borneo), suggesting an early mainland farmer layer there before Austronesian dominance — a hint that Sundaland's history was more layered than a single 'wave'.",
 ["lipson2018","mccoll2018","lipson2014"], [2], peoples=["semai","temiar"], routes=["r-austroasiatic"])
E("out-of-taiwan",-3000,-2200,"austronesian","migration","Taiwan → Batanes → Luzon",22.0,121.3,
 "Out of Taiwan: the Austronesian departure",
 "Linguistic, archaeological and genetic evidence points to Taiwan as the homeland of the Austronesian language family; speakers moved south to the northern Philippines by about 4,200 years ago.",
 "Nine of Austronesian's ten first-order branches are found only on Taiwan, which Blust read as the signature of a homeland. Gray et al.'s phylogeny of 400 languages dates the expansion's start to about 5,200 years ago, with a 'pause' before the move to the Philippines. Red-slipped pottery, rice and pig husbandry, and Taiwan nephrite traded as far as Borneo and Vietnam trace the movement archaeologically.\n\nThe 'Out-of-Taiwan' model remains debated. Some geneticists (Soares, Hill and colleagues) argued for older dispersals out of Sundaland after the Ice Age; Solheim proposed a 'Nusantao' trading network instead of a migration. Genome-wide and ancient-DNA studies since 2014 broadly support a Taiwan source for Austronesian ancestry, but layered over earlier Papuan-related and Austroasiatic-related populations.",
 ["blust1995","gray2009","bellwood2017","ko2014","lipson2014","soares2008","hill2007","solheim2006"], [2], certainty="debated",
 debate="Out-of-Taiwan (Bellwood, Blust, Gray) vs Out-of-Sundaland mtDNA models (Soares 2008, Hill 2007) vs the Nusantao trade-network model (Solheim 2006).",
 peoples=["amis","tagalog"], routes=["r-taiwan-luzon"])
E("malayo-polynesian",-2200,-500,"austronesian","migration","Philippines → Borneo, Sulawesi, Java, Sumatra",1.0,118.0,
 "Malayo-Polynesian dispersal through the islands",
 "From the Philippines, Malayo-Polynesian speakers moved into Borneo, Sulawesi and Maluku, then west to Java, Sumatra and the Malay Peninsula, and east along New Guinea's coasts.",
 "In the west they met long-established foragers and probably Austroasiatic-speaking farmers; in the east, Papuan-speaking peoples who had lived there for tens of thousands of years. The result is the patchwork visible on the language map: Austronesian languages dominate the west, while Halmahera, Timor-Alor-Pantar and New Guinea keep Papuan families, and eastern Indonesian populations show heavy Papuan-related ancestry.",
 ["bellwood2007:201–254","lipson2014","adelaar2005"], [2],
 peoples=["javanese","bugis","ngaju","dani"], routes=["r-mp-south","r-mp-borneo","r-mp-west","r-mp-east"])
E("malay-homeland",-300,700,"austronesian","migration","West Borneo",0.4,111.6,
 "Where do the Malays come from?",
 "Linguists locate the homeland of the Malayic languages in western Borneo; Malay later spread into southeast Sumatra and the Peninsula and became the region's trade language.",
 "Malay is one Austronesian language among many — not a 'race'. Adelaar and others place Proto-Malayic in West Borneo, where Malayic Dayak languages (Iban, Kendayan) still cluster. By the late 7th century Old Malay was written in Srivijaya's inscriptions near Palembang and Jambi. 'Malayu' identity then grew through commerce, Islam and court culture, absorbing Orang Laut, Orang Asli and migrants. Leonard Andaya shows that ethnic labels in the Straits were shaped by trade roles as much as ancestry.",
 ["adelaar2005","andaya2008","benjamin2002"], [2,12], certainty="debated",
 debate="Borneo homeland is the majority view; some earlier scholars favoured Sumatra (Jambi/Palembang).",
 peoples=["malay","iban","temuan"], routes=["r-malay-spread"])
E("lapita",-1300,-800,"austronesian","migration","Bismarck Archipelago → Tonga",-4.5,151.5,
 "Lapita and Remote Oceania",
 "From about 3,300 years ago, Austronesian-speaking Lapita potters sailed beyond the Solomons into uninhabited Remote Oceania, reaching Vanuatu, Fiji, Tonga and Samoa within a few centuries.",
 "Ancient genomes from Lapita-associated burials in Vanuatu and Tonga show almost entirely Asian (Taiwan-linked) ancestry, with Papuan ancestry arriving later — overturning older 'Melanesian mixing on the way' models. After a long pause, East Polynesia was settled rapidly c. 1025–1120 CE and New Zealand c. 1250–1300 CE.",
 ["skoglund2016","kirch2017","gray2009","wilmshurst2011"], [2], routes=["r-lapita","r-poly-hawaii","r-poly-rapa","r-poly-nz"])
E("madagascar",500,900,"austronesian","migration","Madagascar",-19.0,47.0,
 "Across the Indian Ocean to Madagascar",
 "Malagasy is a Barito language from south Borneo, and Malagasy maternal lineages trace to Indonesia; settlement began roughly 1,200–1,500 years ago.",
 "Adelaar showed Malagasy's closest relative is Ma'anyan of south-east Kalimantan, with loanwords from Malay and Javanese — suggesting Barito people travelled as crew in Malay-led ventures. Cox et al. estimate a founding group of perhaps 30 Island Southeast Asian women. The voyage makes Austronesians the most widely dispersed language family before 1500.",
 ["adelaar2005","cox2012"], [2], certainty="estimate", peoples=["maanyan","malagasy"], routes=["r-madagascar"])
E("dongson",-500,200,"austronesian","trade","Dong Son, Red River",20.0,105.8,
 "Bronze drums across the archipelago",
 "Dong Son-type bronze drums made in northern Vietnam were traded as prestige goods to Sumatra, Java, Bali, Sumbawa, Alor and the Kei Islands between about 500 BCE and 300 CE.",
 "The drums show that long-distance exchange linked mainland and island societies before any Indian influence. Local communities later cast their own drums (the 'Moon of Pejeng' in Bali; moko in Alor).",
 ["calo2009","higham2014","bellwood2007"], [2,3], routes=["r-dongson"])

# ===================== 3. INDIC =====================
E("bay-of-bengal",-400,200,"austronesian","trade","Khao Sam Kaeo, Isthmus of Kra",10.4,99.1,
 "Early contact with India across the Bay of Bengal",
 "By the 4th century BCE, glass and stone beads made with Indian techniques — and probably by Indian craftsmen — appear at Ban Don Ta Phet and Khao Sam Kaeo on the Thai-Malay peninsula.",
 "Bellina and Glover show a two-way exchange: Southeast Asian sailors were active in the Bay of Bengal, and South Asian artisans settled in peninsula ports. Indian influence therefore began as trade and craft, centuries before kings adopted Sanskrit titles.",
 ["bellina2004","hall2011"], [3,6], routes=["r-bengal"])
E("indianisation-debate",100,1300,"indic","indic","Bay of Bengal",12.0,89.5,
 "Indianisation, localisation or convergence?",
 "How Indian religion and kingship reached Southeast Asia is itself debated: colonisation by Indians (old view), selection by local elites (Wolters' 'localisation'), or parallel development (Kulke's 'convergence').",
 "George Coedès' 'Indianized States' (1944) imagined Indian traders and Brahmins founding kingdoms. Later scholars rejected any conquest: there is no evidence of Indian armies or colonies. O. W. Wolters argued that local chiefs — 'men of prowess' at the centre of fluid mandala polities — selectively took Indic ideas that enhanced their status. Hermann Kulke saw Southeast Asian and Indian states maturing in parallel. Sheldon Pollock's 'Sanskrit cosmopolis' frames Sanskrit as a prestige language of political expression, adopted from Afghanistan to Java between about 300 and 1300 CE without imperial force. For a postcolonial reading, the shift matters: it moves agency from 'foreign civilisers' back to Southeast Asians.",
 ["coedes1968","wolters1999:41–55","kulke1990","pollock2006","manguin2004"], [3], certainty="debated",
 debate="Coedès (Indian colonisation) vs Wolters (local selection) vs Kulke (convergence) vs Pollock (cosmopolitan prestige language).")
E("funan",100,630,"indic","indic","Oc Eo, Mekong Delta",10.25,105.15,
 "Funan and the port of Oc Eo",
 "Chinese envoys of the 3rd century described Funan, a polity in the Mekong delta with a legend of an Indian Brahmin, Kaundinya, marrying a local queen; its port at Oc Eo traded Roman, Indian and Chinese goods.",
 "Oc Eo's canals and workshops have yielded Indian seals, Sanskrit inscriptions and a Roman medallion of Antoninus Pius (152 CE). Funan is the earliest 'Indic' polity in the region, but its population and builders were local.",
 ["manguin2004","miksic2017","coedes1968"], [3,5,6])
E("kutai",380,420,"indic","indic","Muara Kaman, Kutai (East Kalimantan)",-0.33,116.72,
 "Kutai: the earliest inscriptions in Indonesia",
 "Seven stone posts (yūpa) in Sanskrit and Pallava script record gifts to Brahmins by King Mūlavarman around 400 CE — the earliest writing found in Indonesia.",
 "The inscriptions name Mūlavarman's grandfather Kuṇḍuṅga, a non-Sanskrit name, then a father with an Indic name — a classic picture of a local ruling line adopting Indic kingship within a few generations.",
 ["coedes1968:52","hall2011"], [3])
E("tarumanagara",400,600,"indic","indic","Ciaruteun, Bogor (West Java)",-6.55,106.69,
 "Tarumanagara and Purnavarman",
 "Fifth-century Sanskrit inscriptions near Bogor and Jakarta celebrate King Pūrṇavarman of Tārumā, carving his footprints like those of Vishnu.",
 "Tārumā shows Vaishnava kingship and irrigation works in West Java, in Sundanese lands, centuries before the better-known Central Javanese temples.",
 ["coedes1968","hall2011"], [3], peoples=["sundanese"])
E("prambanan",732,929,"indic","indic","Prambanan, Central Java",-7.75,110.49,
 "Mataram (Medang): Shaivite temples of Central Java",
 "Central Java's Mataram kingdom built Hindu temple complexes culminating in the Śiva temple of Prambanan (856 CE), alongside Buddhist monuments of the Śailendra.",
 "The Kedu and Prambanan plains hold hundreds of candi whose orientation and placement read the landscape — rivers, volcanoes — in Indic cosmological terms. Around 929 the court moved to East Java, possibly after Merapi eruptions and political conflict.",
 ["degroot2009","miksic2017","ricklefs2008"], [3], peoples=["javanese"])
E("champa",192,1471,"indic","indic","Mỹ Sơn, Champa",15.76,108.12,
 "Champa: an Austronesian Hindu kingdom on the mainland",
 "The Cham, speakers of an Austronesian (Chamic) language on the coast of today's Vietnam, built Śaiva temple-cities from the 4th century until Vijaya fell to Đại Việt in 1471.",
 "Champa is a reminder that Austronesians were not only islanders. Chamic is closely related to Malay and Acehnese; linguists think Acehnese speakers came from the Champa coast, a rare west-bound Austronesian movement.",
 ["thurgood1999","coedes1968","hall2011"], [3,12], peoples=["cham","acehnese"], routes=["r-champa-aceh"])
E("angkor",802,1431,"indic","urban","Angkor",13.41,103.87,
 "Angkor: the largest pre-industrial city",
 "From 802 Khmer kings built Angkor, whose temples, reservoirs and canals spread over roughly 1,000 km² — the most extensive pre-industrial urban complex known.",
 "Radar and aerial mapping by Evans et al. revealed a low-density urban landscape tied together by water management. Angkor moved from Śaiva and Vaishnava kingship (Angkor Wat, 12th c.) to Mahāyāna (Bayon) and then Theravāda Buddhism.",
 ["evans2007","miksic2017","coedes1968"], [3,5])
E("chola",1025,1025,"indic","colonial","Kadaram (Bujang Valley, Kedah)",5.73,100.43,
 "The Chola raid on Srivijaya",
 "In 1025 the South Indian Chola king Rājendra I sent a naval expedition that sacked Srivijaya's ports, including Kadaram (Kedah).",
 "The only recorded Indian military expedition to Southeast Asia, it was a commercial-political strike rather than a colonisation, and it weakened Srivijaya's monopoly of the Straits.",
 ["kulke2009","hall2011"], [3,4], routes=["r-chola"])
E("majapahit",1293,1527,"indic","urban","Trowulan, East Java",-7.56,112.38,
 "Majapahit",
 "Founded in 1293 after a Mongol invasion of Java, Majapahit claimed overlordship across much of the archipelago; the court poem Deśawarṇana (1365) lists its tributaries.",
 "Majapahit's brick capital at Trowulan was a dense urban landscape with canals and Muslim graves from 1368 — evidence that Islam was present at court while it remained Hindu-Buddhist (Śiva-Buddha). Its claimed 'empire' was more a network of tributary and trading relations than direct rule; it later became a nationalist symbol of a united 'Nusantara'. After its decline, Hindu court culture survived mainly in Bali.",
 ["robson1995","ricklefs2008:3–20","miksic2017"], [3,5,10], peoples=["javanese","balinese"])

# ===================== 4. BUDDHIST =====================
E("buddhism-routes",300,1300,"indic","buddhist","Andaman Sea",9.0,94.0,
 "Buddhism: from India and Sri Lanka by sea — not mainly from China",
 "Buddhism reached most of Southeast Asia from India and Sri Lanka along the sea routes, from about the 4th–5th centuries CE. China was a partner rather than the source — except in northern Vietnam, where Mahāyāna and Chan came via China.",
 "Early Buddha images and inscriptions (Pyu, Dvāravatī Mon, peninsula ports) follow South Asian models. Chinese monks such as Faxian (5th c.) and Yijing (671–695) passed through the archipelago, and Yijing recommended Srivijaya as a place to study Sanskrit and Buddhist texts before going on to India — showing the islands as a hub of the Buddhist world. Theravāda Buddhism, now dominant on the mainland, was consolidated from Sri Lanka between the 11th and 13th centuries (Bagan, then Sukhothai). In the islands, Mahāyāna and Vajrayāna flourished in Srivijaya and Java, then gave way to Śiva-Buddha syncretism and Islam.",
 ["sen2003","takakusu1896","coedes1968","lieberman2003"], [4], routes=["r-yijing"])
E("srivijaya",671,1025,"indic","buddhist","Palembang (and Jambi)",-2.99,104.76,
 "Srivijaya",
 "A Malay maritime polity centred at Palembang, Srivijaya controlled the Straits of Malacca and Sunda from the late 7th century; its Old Malay inscription at Kedukan Bukit (682) is among the earliest writing in Malay.",
 "Yijing stayed there in 671 and again in 687–695, describing over a thousand monks. Wolters argued Srivijaya's power rested on making its ports the obligatory stopping place for China trade. Its capital later shifted to Jambi (Melayu), near the Buddhist complex of Muara Jambi. Archaeologically, Srivijaya looks like a dispersed riverine network, not a monumental capital.",
 ["wolters1967","takakusu1896","manguin2004","miksic2017"], [4,5], peoples=["malay"], routes=["r-yijing","r-maritime-silk"])
E("muara-jambi",650,1300,"indic","buddhist","Muara Jambi, Batang Hari river",-1.48,103.67,
 "Muara Jambi: a Buddhist landscape on the Batang Hari",
 "The brick temple complex at Muara Jambi, spread along the Batang Hari river, is one of Southeast Asia's largest Buddhist sites, active roughly from the 7th to 13th centuries.",
 "Upriver, in the forests of the Batang Hari basin, lived the forest peoples whose descendants include today's Orang Rimba — the river linked court, port and forest products such as resins and rattan.",
 ["miksic2017","manguin2004"], [4,12], peoples=["orang-rimba","malay"])
E("borobudur",780,830,"indic","buddhist","Borobudur, Kedu Plain",-7.61,110.20,
 "Borobudur and the Śailendra",
 "The Mahāyāna monument of Borobudur was built around 780–830 under the Śailendra dynasty, a three-dimensional maṇḍala with over 2,600 relief panels.",
 "A Nalanda copper plate of about 860 records the Śailendra prince Bālaputra (then ruling in Sumatra) endowing a monastery in Bengal — evidence of the direct island–India Buddhist link.",
 ["miksic2017","degroot2009","sen2003"], [4], peoples=["javanese"])
E("bagan",1044,1287,"indic","buddhist","Bagan",21.17,94.86,
 "Bagan and the rise of Theravāda",
 "Under Anawrahta (r. 1044–77) Bagan adopted Theravāda Buddhism with texts and monks linked to Sri Lanka; over 2,000 brick temples survive.",
 "Lieberman treats Bagan as the first 'charter state' of the western mainland — the model for later Burmese integration.",
 ["lieberman2003","miksic2017"], [4,5])

# ===================== 5. SLAVERY & URBAN =====================
E("bondage",1300,1900,"commerce","slavery","Across the archipelago",-2.0,118.0,
 "Bondage in a world short of people",
 "In a land-rich, labour-poor region, power was measured in followers: debt bondage, war captives and purchased slaves were widespread, and most slaves lived inside households.",
 "Reid distinguishes 'open' systems, where slaves were absorbed into the owner's kin group over time (common in Southeast Asia), from the 'closed' systems of the Americas. Raiding for people was a core activity of states and sea-peoples, and slaves were traded between ports. Colonial companies did not invent this system but scaled and commercialised it, buying slaves for cities and plantations; the Dutch prohibited the slave trade in 1818 and abolished slavery in the Indies in 1860, though bondage persisted in outlying islands.",
 ["reid1983:1–43","reid1988","vink2003"], [5], certainty="established")
E("batavia-slaves",1619,1800,"company","slavery","Batavia",-6.13,106.81,
 "Batavia: a city of slaves",
 "VOC Batavia depended on imported slaves; in the late 17th century slaves made up roughly half of the town's inhabitants, brought from Bengal, Arakan, the Coromandel Coast, Bali, Sulawesi and the eastern islands.",
 "Markus Vink calls the Dutch Indian Ocean slave trade 'the world's oldest trade' and estimates it was larger in the 17th century than often assumed. Remco Raben shows how Batavia's ethnic quarters (kampung) grouped Balinese, Bugis, Makassarese, Ambonese and others — the origin of the Betawi people. Slaves came first from South Asia, then increasingly from within the archipelago once the VOC banned exports from Java.",
 ["vink2003","raben1996","bosma2008"], [5,7], certainty="estimate",
 routes=["r-slave-arakan","r-slave-coromandel","r-slave-bali","r-slave-sulawesi"])
E("bali-slaves",1620,1830,"company","slavery","South Bali",-8.55,115.2,
 "Bali as a slave exporter",
 "Balinese rulers sold war captives and debtors to Dutch, Chinese and Bugis traders for Batavia, the Cape and Mauritius from the 17th to the early 19th century.",
 "Van der Kraan describes how the trade financed Balinese courts' purchase of opium and arms — showing indigenous elites as active participants in the regional slave economy.",
 ["vanderkraan1983","vink2003"], [5,12], peoples=["balinese"], routes=["r-slave-bali"])
E("sulawesi-slaves",1660,1830,"company","slavery","Makassar",-5.13,119.41,
 "South Sulawesi's slave trade",
 "After the Dutch conquest of Makassar (1669), the city became a major slave market, supplying Batavia with captives from the wars of South Sulawesi and from the eastern islands.",
 "Heather Sutherland traces how Bugis and Makassarese warfare, debt and raiding supplied slaves, and how the VOC both depended on and policed the trade.",
 ["sutherland1983","cummings2002"], [5], peoples=["bugis","makassarese"], routes=["r-slave-sulawesi"])
E("sumba-slaves",1700,1910,"company","slavery","Sumba",-9.65,119.9,
 "Sumba and the slave trade",
 "Sumba was raided and traded for slaves into the late 19th century: Endenese from Flores and traders linked to Bima and Makassar took captives, often in exchange for arms and cloth; Sumbanese nobles also sold people.",
 "Rodney Needham's study shows the trade continued long after formal Dutch abolition (1860), helped by the colonial state's weak presence on Sumba until the military campaigns of 1906–13. Within Sumbanese society, hereditary slaves (ata) formed a lower rank — a hierarchy that still shapes marriage, land and politics today, as Hoskins and Keane discuss for Kodi and Anakalang.",
 ["needham1983","hoskins1993","keane1997"], [5,12], peoples=["kambera","kodi","lamboya"], routes=["r-slave-sumba"])
E("sulu-zone",1768,1898,"company","slavery","Jolo, Sulu",6.05,121.0,
 "The Sulu Zone",
 "Iranun and Balangingi raiders based in the Sulu sultanate seized tens of thousands of captives across the Philippines, Borneo, Sulawesi and Maluku to work in Sulu's trade in sea and forest products for the China market.",
 "James Warren's classic study shows that the British country trade's demand for trepang, pearl and birds' nests drove slave raiding — global commerce and 'piracy' were linked, not opposed.",
 ["warren1981"], [5,9], peoples=["tausug"], routes=["r-sulu-west","r-sulu-north","r-sulu-south"])
E("papua-slaves",1600,1870,"company","slavery","Raja Ampat & Papuan coast",-0.9,130.9,
 "Papuans in the Maluku slave trade",
 "The Sultan of Tidore claimed Papuan coasts and islands as dependencies; tribute and raids supplied Papuan slaves to Maluku and beyond.",
 "Andaya shows Raja Ampat and Biak seafarers as both victims and agents: some Papuan groups served as Tidore's raiders.",
 ["andaya1993"], [5,12], peoples=["biak"], routes=["r-papua-tidore"])

E("melaka",1400,1511,"commerce","urban","Melaka",2.19,102.25,
 "Melaka, the great entrepôt",
 "Founded around 1400 by Parameswara, a prince from the Palembang line, Melaka became the hub of the Indian Ocean–China trade; its rulers converted to Islam in the 15th century.",
 "Tomé Pires, writing just after the Portuguese conquest, describes merchants from Gujarat, Tamil Nadu, Bengal, Java, Luzon and China, and dozens of languages in the streets. Reid estimates its population around 1500 at the order of 100,000. Melaka's court laws and literature (Sejarah Melayu) set the model of Malay kingship.",
 ["cortesao1944","reid1993:62–90","andaya2017","wade2005","miksic2013"], [5,6], certainty="estimate", peoples=["malay"])
E("ayutthaya",1351,1767,"commerce","urban","Ayutthaya",14.36,100.57,
 "Ayutthaya",
 "Siam's island capital on the Chao Phraya, a cosmopolitan port with Persian, Japanese, Portuguese, Dutch and Chinese quarters, until it was sacked by Burmese armies in 1767.",
 "Reid ranks Ayutthaya among the largest cities of the age of commerce.",
 ["reid1993","baker2009","lieberman2003"], [5], certainty="estimate")
E("aceh",1500,1700,"commerce","urban","Banda Aceh",5.55,95.32,
 "Aceh Darussalam",
 "After 1511 Muslim traders diverted from Portuguese Melaka to Aceh, which grew into a pepper-exporting sultanate; under Iskandar Muda (1607–36) it dominated northern Sumatra and attacked Melaka.",
 "Aceh's capital was one of the large cities of the 17th-century archipelago and a centre of Islamic scholarship (Hamzah Fansuri, al-Raniri). Its 'Veranda of Mecca' identity later fuelled resistance to the Dutch.",
 ["reid2005","reid1993","ricklefs2008"], [5,12], peoples=["acehnese"])
E("banten",1527,1682,"commerce","urban","Banten",-6.03,106.16,
 "Banten, pepper port",
 "The Muslim sultanate of Banten in West Java grew rich on pepper; English and Dutch first set up trading posts there (1596, 1602) before the VOC subdued it in 1682.",
 "", ["ricklefs2008","reid1993"], [5,7], peoples=["sundanese"])
E("makassar",1600,1669,"commerce","urban","Somba Opu, Makassar",-5.19,119.40,
 "Makassar (Gowa–Tallo)",
 "After Gowa–Tallo's rulers embraced Islam in 1605, Makassar became an open port where Portuguese, English, Danish and Malay merchants traded spices outside Dutch control.",
 "William Cummings shows how writing and Islam transformed Makassarese ideas of rank and history. Makassar's openness made it the VOC's main rival in the east until the war of 1666–69.",
 ["cummings2002","andaya2015","reid1993"], [5,7], peoples=["makassarese"])
E("ternate",1450,1606,"commerce","urban","Ternate",0.79,127.38,
 "Ternate and Tidore: the clove sultanates",
 "Cloves grew only on a few islands of north Maluku; their sultans (Muslim from the late 15th century) were courted by Javanese, Malay, Chinese, Portuguese, Spanish and Dutch traders.",
 "Leonard Andaya reads Maluku through local ideas of a 'single tree' of four kingdoms rather than European rivalry.",
 ["andaya1993"], [5,6,7], peoples=["ternatean"])
E("brunei-port",1400,1600,"commerce","urban","Brunei Town (Kampong Ayer)",4.89,114.94,
 "Brunei",
 "The Muslim sultanate of Brunei, with its town on stilts over the river, dominated the north Borneo coast and traded with Manila and China; Magellan's crew visited in 1521.",
 "", ["saunders2002","reid1993"], [5,8])
E("mataram-islam",1587,1755,"company","urban","Kotagede / Plered",-7.83,110.40,
 "Islamic Mataram",
 "An inland agrarian kingdom in Central Java, Mataram under Sultan Agung (r. 1613–46) conquered most of Java's ports and twice besieged Batavia (1628–29).",
 "Its rice-based, inland power contrasts with the maritime ports — a contrast Reid and Ricklefs use to explain the 17th-century 'crisis' of the coast.",
 ["ricklefs2008","reid1993","lieberman2009"], [5,7], peoples=["javanese"])

# ===================== Islam & China =====================
E("pasai",1290,1520,"commerce","islam","Samudra-Pasai",5.16,97.15,
 "Islam takes root: Pasai",
 "The gravestone of Sultan Malik al-Salih (d. 1297) at Samudra-Pasai is the earliest firm evidence of a Muslim ruler in the archipelago; Marco Polo noted Muslims at nearby Perlak in 1292.",
 "Islam spread mainly along trade routes, through merchants from Gujarat, the Coromandel coast, Arabia and China, and through Sufi teachers and marriage — not conquest. Ricklefs stresses gradual 'conversion' over centuries; Laffan shows how later Dutch scholars constructed the story of a 'Sufi' and Indian-derived Islam.",
 ["ricklefs2008:3–17","laffan2011"], [5,6], peoples=["acehnese"], routes=["r-islam"])
E("demak",1475,1550,"commerce","islam","Demak",-6.89,110.64,
 "Demak and the north coast of Java",
 "Muslim port principalities on Java's north coast, led by Demak, eclipsed Majapahit in the early 16th century; Javanese tradition credits the nine saints (wali songo).",
 "", ["ricklefs2008","reid1993"], [5], peoples=["javanese"])
E("gowa-islam",1605,1611,"commerce","islam","Gowa–Tallo",-5.2,119.45,
 "Makassar accepts Islam (1605)",
 "The rulers of Gowa and Tallo converted in 1605 and then spread Islam to Bugis states by war (1608–11).",
 "", ["cummings2002","pelras1996"], [5], peoples=["makassarese","bugis"])
E("zhenghe",1405,1433,"commerce","trade","Fleet route to the Indian Ocean",4.0,100.0,
 "Zheng He's voyages",
 "Seven Ming fleets under the eunuch admiral Zheng He sailed through Champa, Java, Palembang, Melaka and Sumatra to India, Arabia and East Africa between 1405 and 1433.",
 "Geoff Wade argues the voyages were armed state ventures to impose Ming hegemony over ports — they intervened militarily in Palembang, Sumatra and Ceylon — rather than peaceful goodwill tours. Melaka gained Ming backing against Siam.",
 ["wade2005","reid2015"], [5,6], certainty="debated", debate="Peaceful exploration (popular narratives) vs 'proto-colonial' armed diplomacy (Wade 2005).", routes=["r-zhenghe"])

# ===================== 6. FIRST WESTERN CONTACT =====================
E("roman-indirect",100,250,"indic","contact","Oc Eo and Ptolemy's 'Iabadiou'",9.8,105.4,
 "Indirect contact with the Roman world",
 "Roman coins and a medallion of Antoninus Pius reached Oc Eo, and Ptolemy's 2nd-century Geography names 'Iabadiou' (perhaps Java) — the West knew of the region through Indian middlemen.",
 "There was no direct European presence: goods and knowledge passed hand to hand along Indian Ocean routes.",
 ["bellina2004","manguin2004"], [6])
E("marco-polo",1292,1292,"commerce","contact","Perlak / Samudra, Sumatra",5.1,97.6,
 "Marco Polo in Sumatra (1292)",
 "Returning from China, Marco Polo spent five months on Sumatra waiting for the monsoon and described several small kingdoms, one of them Muslim — the first European eyewitness account.",
 "Later medieval travellers such as Odoric of Pordenone (1320s) also passed through Java and Sumatra, but no European power was present until 1509.",
 ["ricklefs2008:3–4","reid2015"], [6])
E("portuguese-melaka",1509,1641,"commerce","contact","Melaka",2.19,102.25,
 "The Portuguese seize Melaka (1511)",
 "After a first visit by Diogo Lopes de Sequeira in 1509, Afonso de Albuquerque conquered Melaka in 1511; in 1512 Portuguese ships reached Banda and Ternate, the sources of nutmeg and cloves.",
 "This was the first sustained direct contact between Europe and the archipelago. The Portuguese 'Estado da Índia' was a network of fortresses and licences rather than a territorial empire; Muslim traders simply moved to Aceh, Johor, Banten and Makassar. Melaka fell to the Dutch and Johor in 1641.",
 ["subrahmanyam2012","cortesao1944","reid1993","andaya2017"], [6,7], peoples=["malay"], routes=["r-portuguese"])
E("magellan",1521,1522,"commerce","contact","Mactan & Cebu",10.3,123.95,
 "Magellan's expedition and Lapulapu (1521)",
 "Magellan's Spanish fleet reached the Philippines from the Pacific in March 1521; Magellan was killed at Mactan by Lapulapu's forces. The survivors bought cloves at Tidore and returned home round the Cape — the first circumnavigation.",
 "", ["phelan1959","andaya1993"], [6,7], routes=["r-magellan"])

# ===================== 7. EUROPEAN COMPANIES =====================
E("portuguese-maluku",1522,1702,"commerce","colonial","Ternate, Ambon, Solor, Timor",-3.7,128.2,
 "Portuguese forts, Catholics and Topasses",
 "The Portuguese built a fort on Ternate (1522) but were expelled in 1575 after murdering Sultan Hairun; they shifted to Tidore, Ambon, Solor and Timor, where mixed 'Black Portuguese' (Topasses) controlled the sandalwood trade.",
 "Hans Hägerdal shows how Timorese lords and Topasses, not Lisbon, shaped Timor's colonial geography; the Portuguese capital moved from Lifau to Dili in 1769 — the root of Timor-Leste.",
 ["andaya1993","hagerdal2012","subrahmanyam2012"], [7], peoples=["ternatean","tetum","atoni"])
E("spain-manila",1565,1898,"commerce","colonial","Manila",14.59,120.97,
 "Spain in the Philippines",
 "Miguel López de Legazpi founded a Spanish base at Cebu in 1565 and took Manila in 1571. Manila galleons carried American silver to Asia and Chinese silk to Acapulco until 1815.",
 "Spain did settle — as friars, soldiers and officials — and converted most lowland Filipinos to Catholicism, but Muslim sultanates of Mindanao and Sulu and upland peoples of the Cordillera stayed outside effective rule for centuries. Flynn and Giráldez date the birth of global trade to 1571, when Manila linked the Americas to China. Spain also held a fort on Tidore (1606–63) and northern Taiwan (1626–42).",
 ["phelan1959","flynn1995","andrade2008"], [7,8], peoples=["tagalog","tausug"], routes=["r-galleon"])
E("voc",1596,1619,"company","colonial","Banten",-6.03,106.16,
 "The Dutch arrive; the VOC is founded (1602)",
 "Cornelis de Houtman's fleet reached Banten in 1596; rival Dutch companies merged in 1602 into the VOC, a chartered company empowered to wage war, make treaties and build forts in Asia.",
 "The English East India Company (1600) also opened a factory at Banten in 1602. The VOC's aim was monopoly of fine spices, enforced by violence.",
 ["gaastra2003","boxer1965","ricklefs2008"], [7], routes=["r-voc"])
E("batavia",1619,1799,"company","colonial","Batavia (Jakarta)",-6.13,106.81,
 "Batavia (1619)",
 "Jan Pieterszoon Coen destroyed Jayakarta in 1619 and built Batavia, the VOC's Asian headquarters, a walled city of canals and ethnic quarters.",
 "Batavia was besieged twice by Mataram (1628–29). In 1740 a massacre of the Chinese population followed fears of revolt. The Javanese hinterland was taken step by step through intervention in Mataram's succession wars.",
 ["ricklefs2008","raben1996","bosma2008"], [7,5], routes=["r-voc-spice"])
E("banda",1621,1621,"company","colonial","Banda Islands",-4.53,129.9,
 "The conquest of Banda (1621)",
 "To secure the nutmeg monopoly, Coen's forces conquered the Banda Islands in 1621. Most of the roughly 15,000 Bandanese were killed, died of hunger, enslaved or deported; survivors fled to Kei and elsewhere.",
 "The VOC divided the islands into perken (nutmeg gardens) run by Dutch perkeniers with imported slaves — an early plantation colony. Descendants of refugees still speak a Banda language at Banda Eli and Banda Elat in the Kei Islands, keeping memories of the lost homeland.",
 ["loth1995","andaya1993","kaartinen2010","vink2003"], [7,5,12], certainty="estimate", peoples=["bandanese"], routes=["r-banda-kei"])
E("amboyna",1623,1667,"company","colonial","Ambon",-3.69,128.18,
 "Amboyna (1623) and the British turn to India",
 "In 1623 the VOC tortured and executed English East India Company men at Ambon; the English largely withdrew from the spice islands. Under the Treaty of Breda (1667) England gave up its claim to Run in exchange for New Amsterdam (Manhattan).",
 "The English kept a pepper post at Bencoolen (Bengkulu, 1685) and concentrated on India and the China trade.",
 ["boxer1965","tarling1962","andaya1993"], [7])
E("dutch-formosa",1624,1662,"company","colonial","Fort Zeelandia, Taiwan",23.0,120.16,
 "The Dutch in Taiwan",
 "The VOC held southwest Taiwan from 1624, ruling indigenous Austronesian villages and encouraging Chinese settlers, until Zheng Chenggong (Koxinga) expelled it in 1662.",
 "Tonio Andrade calls this 'co-colonisation': Dutch rule enabled Han Chinese settlement that marginalised Taiwan's indigenous peoples — the descendants of the first Austronesians.",
 ["andrade2008"], [7,12], peoples=["amis"])
E("makassar-war",1666,1669,"company","colonial","Makassar & Bone",-5.13,119.41,
 "The Makassar War and the Bugis diaspora",
 "The VOC under Speelman, allied with the Bugis prince Arung Palakka of Bone, defeated Gowa; the Treaty of Bongaya (1667) and fall of Somba Opu (1669) ended Makassar's free port.",
 "Defeat scattered Makassarese and Bugis warriors and traders across the archipelago: Bugis dynasties founded or captured power in Riau, Selangor and Johor in the 18th century. This is a clear case of indigenous rivalries interlocking with company power.",
 ["andaya2015","cummings2002","pelras1996"], [7,9,12], peoples=["bugis","makassarese"], routes=["r-bugis"])
E("trepang",1720,1907,"company","trade","Marege' (Arnhem Land)",-12.0,136.5,
 "Makassan trepangers and Aboriginal Australians",
 "From about the 1720s, fleets of praus from Makassar sailed each monsoon to Arnhem Land and the Kimberley to collect and process trepang (sea cucumber) for the China market, trading with Yolŋu and other Aboriginal peoples.",
 "Macknight documents a long, mostly peaceful relationship that left Makassarese words in Yolŋu languages and Aboriginal people who travelled to Makassar. The South Australian government, which then administered the Northern Territory, ended the voyages by refusing licences in 1906–07.",
 ["macknight1976","broome2010"], [9,12], certainty="estimate", peoples=["yolngu","makassarese"], routes=["r-trepang"])
E("giyanti",1755,1755,"company","colonial","Surakarta & Yogyakarta",-7.57,110.82,
 "The partition of Mataram (1755)",
 "The Treaty of Giyanti, brokered by the VOC, split Mataram into the courts of Surakarta and Yogyakarta, completing Dutch paramountcy over Central Java.",
 "", ["ricklefs2008"], [7,8], peoples=["javanese"])
E("british-straits",1786,1826,"company","colonial","Penang & Singapore",3.0,101.0,
 "Penang, Singapore and the Straits Settlements",
 "The EIC acquired Penang in 1786 and Raffles founded a British post at Singapore in 1819; with Melaka they became the Straits Settlements in 1826.",
 "Britain also governed Java from 1811 to 1816 during the Napoleonic wars (Raffles' land-rent system). These free ports drew Chinese, Indian and archipelago traders and later became the hubs of indentured labour recruitment.",
 ["tarling1962","andaya2017","carey2007"], [7,8], routes=["r-eic"])
E("voc-end",1799,1816,"company","colonial","Batavia",-6.2,106.85,
 "From company to colonial state",
 "Bankrupt and corrupt, the VOC was dissolved on 31 December 1799; its possessions passed to the Dutch state, and the Netherlands Indies was re-established after British rule in 1816.",
 "This marks the shift from a company of trading posts to a territorial colonial state — Ricklefs dates the real colonial state in Java to the aftermath of the Java War (1830).",
 ["gaastra2003","ricklefs2008"], [8])

# ===================== 8. COLONIAL STATES =====================
E("treaty-1824",1824,1824,"colonial","colonial","Strait of Malacca",1.8,103.0,
 "The Anglo-Dutch Treaty of 1824",
 "Britain and the Netherlands divided the Malay world along the Strait of Malacca: Britain kept the Peninsula and Singapore, the Dutch Sumatra and the islands to the south.",
 "This European line split societies that had long been one Malay world (Johor-Riau was cut in two). It is the origin of the Indonesia–Malaysia border and of separate 'Indonesian' and 'Malaysian' national histories.",
 ["tarling1962","andaya2017"], [8], peoples=["malay"])
E("padri",1803,1838,"colonial","colonial","Minangkabau highlands",-0.3,100.4,
 "The Padri War, Minangkabau",
 "Islamic reformers (Padri) clashed with adat leaders in the Minangkabau highlands; the Dutch intervened from 1821 and defeated the Padri in 1837–38.",
 "Christine Dobbin links the reform movement to the coffee and trade boom in the highlands. The war folded Minangkabau into the colonial state while the famous 'adat basandi syarak, syarak basandi Kitabullah' (adat founded on Islamic law) settlement emerged later.",
 ["dobbin1983","kahn1993"], [8,12], peoples=["minangkabau"])
E("java-war",1825,1830,"colonial","colonial","Central Java",-7.8,110.36,
 "The Java War (1825–30)",
 "Prince Dipanagara of Yogyakarta led a war against Dutch rule in which perhaps 200,000 Javanese died; his capture in 1830 ended the old Javanese order.",
 "Peter Carey shows the war combined Javanese prophecy (Ratu Adil), Islam and anger at land and toll abuses.",
 ["carey2007"], [8,10], certainty="estimate", peoples=["javanese"])
E("cultivation",1830,1870,"colonial","labour","Java",-7.3,110.0,
 "The Cultivation System",
 "Governor-General Van den Bosch required Javanese villages to grow export crops (coffee, sugar, indigo) for the government; profits balanced the Dutch budget.",
 "Elson and Fasseur show regional variation, but the system tied village heads and priyayi elites to colonial extraction and contributed to famines in Cirebon and Central Java in the 1840s. After 1870 the Agrarian Law opened land to private plantations on long leases.",
 ["elson1994","fasseur1992","ricklefs2008"], [8,9,12], peoples=["javanese","sundanese"])
E("aceh-war",1873,1912,"colonial","colonial","Aceh",5.3,96.0,
 "The Aceh War",
 "The Dutch invaded Aceh in 1873; tens of thousands died in a war that lasted, as guerrilla resistance, into the 1910s.",
 "Christiaan Snouck Hurgronje's advice to separate ulama from uleebalang chiefs shaped the colonial strategy. The war's memory fed later Acehnese rebellions (Darul Islam 1953, GAM 1976–2005).",
 ["reid2005","ricklefs2008"], [8,12], peoples=["acehnese"])
E("pax-neerlandica",1890,1914,"colonial","colonial","Netherlands Indies",-2.5,118.0,
 "Pax Neerlandica: completing the colonial state",
 "Between the 1890s and 1914, military campaigns under Van Heutsz and others brought the whole archipelago under direct Dutch control; rulers signed the 'Short Declaration' of submission.",
 "Borders were fixed by treaty with Britain (Borneo, New Guinea at 141°E) and Portugal (Timor, 1859/1904/1916). This is when 'Indonesia' as a bounded territory came into being — the territory the nationalists would later claim.",
 ["ricklefs2008","elson2008","vickers2013"], [8])
E("bali-puputan",1906,1908,"colonial","colonial","Denpasar & Klungkung",-8.65,115.22,
 "The puputan of Badung and Klungkung",
 "When Dutch troops invaded south Bali in 1906 and Klungkung in 1908, the royal courts walked out in ritual 'endings' (puputan) into rifle fire; hundreds died.",
 "Adrian Vickers shows how the colonial state then reinvented Bali as a living museum of Hindu-Javanese culture — the basis of later tourism.",
 ["vickers1989"], [8,12], peoples=["balinese"])
E("sumba-pacification",1906,1913,"colonial","colonial","Sumba",-9.6,119.6,
 "Sumba brought under direct rule",
 "Dutch military patrols subdued Sumba's domains between 1906 and 1913, after centuries of indirect contact through the slave and horse trades; colonial rule then created 'rajas' and districts that cut across older clan territories.",
 "Hoskins describes how Kodi experienced pacification and the colonial calendar; Vel shows how colonial and later state categories reshaped West Sumbanese politics around the uma (house). Protestant missions spread rapidly in the 20th century alongside the Marapu religion.",
 ["hoskins1993","vel2008","needham1983"], [8,12], peoples=["kodi","lamboya","kambera"])
E("british-malaya",1874,1909,"colonial","colonial","Perak & the Malay states",4.6,101.1,
 "British Malaya",
 "The Pangkor Engagement (1874) placed a British Resident in Perak after wars over tin; the Federated Malay States followed in 1895, and the 1909 treaty with Siam transferred Kedah, Perlis, Kelantan and Terengganu to Britain.",
 "Indirect rule preserved the Malay sultans and the idea of the Malays as the 'native' people, while Chinese and Indian immigrants dominated tin and rubber — the root of Malaysia's later communal politics. The Orang Asli were classed as 'aborigines' apart from the Malays.",
 ["andaya2017","harper1999","winichakul1994"], [8], peoples=["malay","semai"])
E("borneo-north",1841,1906,"colonial","colonial","Sarawak, Sabah & Brunei",3.5,113.5,
 "Brooke Sarawak, North Borneo and the shrinking of Brunei",
 "The adventurer James Brooke became Rajah of Sarawak in 1841; the British North Borneo Company took Sabah in 1881. Brunei, cut to two small enclaves, became a British protectorate (1888) with a Resident from 1906.",
 "Oil found at Seria in 1929 made Brunei rich. It stayed out of Malaysia in 1963 and became independent only in 1984. The Brookes' rule relied on Iban levies, setting Dayak groups against each other.",
 ["saunders2002","king1993"], [8,9], peoples=["iban"])
E("siam",1855,1909,"colonial","colonial","Siam (Thailand)",14.0,100.5,
 "Siam: never colonised, but re-mapped",
 "The Bowring Treaty (1855) opened Siam to British trade; under Mongkut and Chulalongkorn it modernised and survived as a buffer between British Burma/Malaya and French Indochina, losing Laos and Cambodian provinces (1893–1907) and the northern Malay states (1909).",
 "Thongchai Winichakul shows how modern mapping created Siam's 'geo-body' — overlapping tributary sovereignties were replaced by a single bounded territory, a process paralleling colonial states.",
 ["winichakul1994","baker2009"], [8])
E("french-indochina",1858,1887,"colonial","colonial","Indochina",16.0,106.5,
 "French Indochina and British Burma",
 "France took Cochinchina from 1858 and formed the Indochinese Union in 1887; Britain annexed Burma in three wars (1824–85).",
 "", ["tarling1992"], [8])
E("philippines-us",1896,1946,"colonial","colonial","Luzon",15.5,121.0,
 "Revolution and American rule in the Philippines",
 "The Philippine Revolution against Spain began in 1896; Spain ceded the islands to the United States in 1898, which defeated the Philippine Republic in a brutal war (1899–1902) and ruled until 1946.",
 "Reynaldo Ileto reads the revolution from below, through the Pasyon (passion narrative) of peasant movements.",
 ["ileto1979","tarling1992"], [8,10], peoples=["tagalog"])
E("australia-1788",1788,1901,"colonial","colonial","Sydney",-33.86,151.21,
 "British settlement of Australia",
 "The First Fleet founded a penal colony at Sydney in 1788; frontier violence, disease and land seizure devastated Aboriginal societies as settlement spread. The colonies federated in 1901.",
 "Australia is the region's settler colony: unlike the Indies or Malaya, the colonisers came to stay and replace. Northern Aboriginal peoples kept older ties with Makassar until colonial licensing ended the voyages in 1906–07.",
 ["broome2010"], [8,12], peoples=["yolngu"])
E("new-guinea",1828,1906,"colonial","colonial","New Guinea",-5.0,141.0,
 "Partitioning New Guinea",
 "The Dutch claimed western New Guinea to 141°E in 1828 (finalised 1848); Germany and Britain divided the east in 1884, the British part passing to Australia in 1906.",
 "The 141st meridian — a line drawn in Europe — still divides Papuan peoples between Indonesia and Papua New Guinea.",
 ["chauvel2005","drooglever2009"], [8,12], peoples=["dani","marind"])

# ===================== 9. LABOUR, PLANTATIONS, MINES =====================
E("deli",1863,1940,"colonial","labour","Deli, East Sumatra",3.6,98.67,
 "Deli's plantation belt and the coolie ordinance",
 "From 1863 tobacco, then rubber, oil palm and tea estates spread across East Sumatra on land leased from Malay sultans; workers were indentured Chinese, then Javanese, bound by penal sanctions under the Coolie Ordinance (1880).",
 "Jan Breman documents flogging, debt and violence; Ann Stoler traces the long history of labour control and resistance from 1870 to 1979. Batak and Malay cultivators lost access to land rotated under swidden. Indenture with penal sanction was abolished only in the 1930s.",
 ["breman1989","stoler1985","kaur2004"], [9,12], peoples=["javanese","batak-toba","malay"], routes=["r-coolie-china","r-java-deli"])
E("suriname",1890,1939,"colonial","labour","Java → Suriname",-7.0,110.4,
 "Javanese indenture to Suriname",
 "Around 33,000 Javanese were shipped to Suriname between 1890 and 1939 to replace emancipated slaves on plantations; many stayed, forming today's Javanese Surinamese community.",
 "Rosemarijn Hoefte compares their contracts with those of British Indian labourers.",
 ["hoefte1998"], [9], peoples=["javanese"], routes=["r-suriname"])
E("tamil-malaya",1880,1938,"colonial","labour","Klang & Perak rubber estates",3.05,101.45,
 "Tamil labour for Malaya's rubber",
 "Hundreds of thousands of South Indian (mainly Tamil) labourers came to Malaya through indenture and the kangani recruiting system to work on rubber estates.",
 "Malaya's rubber boom after 1905 made the colony the world's leading producer; estate labour regimes shaped Malaysia's Indian community.",
 ["sandhu1969","kaur2004","harper1999"], [9], routes=["r-tamil"])
E("bangka",1710,1940,"company","mining","Bangka",-2.1,106.1,
 "Bangka tin and Chinese miners",
 "Tin was found on Bangka around 1710; the Palembang sultan, then the Dutch state, brought in Chinese miners who formed lasting communities.",
 "Mary Somers Heidhues shows how Chinese miners and Malay pepper farmers built a distinctive island society.",
 ["heidhues1992"], [9])
E("kongsi",1760,1885,"company","mining","Montrado, West Borneo",0.95,109.1,
 "The gold kongsi of West Borneo",
 "Chinese gold miners organised self-governing federations (kongsi) in West Borneo from the 1760s, trading and intermarrying with Dayak communities, until the Dutch destroyed them by 1884.",
 "", ["heidhues2003","king1993"], [9,12], peoples=["iban"])
E("malayan-tin",1840,1940,"colonial","mining","Larut & Kinta Valley",4.6,101.1,
 "Malayan tin",
 "Tin rushes in Larut and Kinta drew Chinese miners and secret societies; wars between them provided the pretext for British intervention in 1874.",
 "", ["wong1965","andaya2017"], [9], routes=[])
E("ombilin",1892,1940,"colonial","mining","Sawahlunto",-0.68,100.78,
 "Ombilin coal: convict labour in Minangkabau",
 "The Dutch opened the Ombilin coal mines at Sawahlunto in the 1890s, worked by chained convict labourers ('orang rantai'), contract coolies and Minangkabau workers; a railway linked the mines to Emmahaven (Padang).",
 "UNESCO inscribed the mining town as World Heritage in 2019.",
 ["unesco2019"], [9,12], peoples=["minangkabau"])
E("oil-borneo",1890,1940,"colonial","mining","Seria, Balikpapan, Pangkalan Brandan",4.6,114.3,
 "Oil in Sumatra and Borneo",
 "Royal Dutch was founded in 1890 to exploit oil in North Sumatra; Balikpapan (East Borneo) and later Seria in Brunei (1929) became major oilfields.",
 "Oil made the Indies strategically vital — a key reason for the Japanese invasion of 1942.",
 ["ricklefs2008","saunders2002"], [9,10])
E("romusha",1942,1945,"revolution","labour","Java → Thailand–Burma railway",-7.0,110.4,
 "Japanese occupation and romusha",
 "Japan occupied the Indies, Malaya and the Philippines in 1942. Hundreds of thousands of Javanese were mobilised as romusha (labourers); many were sent abroad, including to the Thailand–Burma railway, and large numbers died.",
 "Shigeru Sato shows how requisitions and forced labour devastated Javanese villages, while the occupation also armed and mobilised Indonesian youth (PETA), preparing the ground for revolution.",
 ["sato1994","ricklefs2008"], [9,10], certainty="estimate", peoples=["javanese"], routes=["r-romusha"])
E("freeport",1967,2026,"nation","mining","Ertsberg & Grasberg",-4.05,137.11,
 "Freeport in Papua",
 "Freeport-McMoRan signed the New Order's first foreign investment contract in 1967, before Papua's 1969 'Act of Free Choice'; the Grasberg copper-gold mine, found in 1988, became one of the world's largest.",
 "Mining displaced Amungme and Kamoro communities and dumped tailings into their rivers; security operations around the mine are tied to human-rights abuses. Denise Leith analyses Freeport's alliance with the Suharto regime; Eben Kirksey follows Papuan movements entangled with it.",
 ["leith2003","kirksey2012"], [9,11,12], peoples=["amungme","kamoro"])

# ===================== 10. INDEPENDENCE =====================
E("national-awakening",1901,1928,"colonial","independence","Batavia & Bandung",-6.2,106.8,
 "From the Ethical Policy to the Youth Pledge",
 "The Ethical Policy (1901) expanded schooling; a new educated elite founded Budi Utomo (1908), Sarekat Islam (1912) and the PKI (1920), and in 1928 the Youth Pledge proclaimed one homeland, one nation and one language: Indonesia.",
 "Benedict Anderson argues that the colonial school system and print in Malay created the 'imagined community' of Indonesia within the borders of the colonial state. Robert Elson traces how the idea of 'Indonesia' was invented and contested. After the 1926–27 communist uprisings, the colonial state exiled radicals to Boven Digoel in Papua.",
 ["anderson1983","elson2008","ricklefs2008"], [10])
E("proclamation",1945,1949,"revolution","independence","Jakarta",-6.2,106.85,
 "Proclamation and revolution (1945–49)",
 "Sukarno and Hatta proclaimed independence on 17 August 1945. Four years of war and diplomacy followed — Surabaya (1945), Dutch 'police actions' (1947, 1948) — until the Netherlands transferred sovereignty on 27 December 1949.",
 "George Kahin and Anthony Reid wrote the classic accounts. The revolution was also a series of local 'social revolutions' — in Aceh, East Sumatra and elsewhere aristocrats were killed or displaced. The Dutch kept western New Guinea, setting up the next conflict.",
 ["kahin1952","reid1974","ricklefs2008"], [10])
E("mainland-independence",1945,1957,"revolution","independence","Mainland Southeast Asia",17.0,100.0,
 "Decolonisation across the region",
 "The Philippines became independent in 1946, Burma in 1948; Vietnam's revolution (1945) led to war with France until 1954; Cambodia and Laos gained independence in 1953; Malaya in 1957.",
 "", ["tarling1992","harper1999"], [10])
E("malayan-emergency",1948,1960,"revolution","independence","Malayan interior",4.5,101.8,
 "The Malayan Emergency and the Orang Asli",
 "During the communist insurgency, the British resettled about half a million rural Chinese into 'New Villages' and forcibly moved Orang Asli out of the forests; many died in the camps. Merdeka came on 31 August 1957.",
 "John Leary shows how both sides courted the Orang Asli; the colonial state created a Department of Aborigines and the Aboriginal Peoples Act (1954), a protective but controlling framework still in force in Malaysia.",
 ["leary1995","harper1999","nicholas2000"], [10,12], peoples=["semai","temiar","jehai"])
E("malaysia-1963",1963,1966,"revolution","independence","Malaysia & Borneo",2.5,111.0,
 "Malaysia, Konfrontasi and Singapore",
 "Malaysia was formed on 16 September 1963 from Malaya, Singapore, Sabah and Sarawak; Brunei stayed out after a 1962 revolt. Indonesia opposed it in a 'Confrontation' (1963–66); Singapore left Malaysia in 1965.",
 "", ["mackie1974","saunders2002","andaya2017"], [10])
E("west-papua",1962,1969,"revolution","independence","West Papua",-3.5,138.5,
 "West Papua and the 'Act of Free Choice' (1969)",
 "Under the 1962 New York Agreement the Netherlands handed West New Guinea to UN and then Indonesian administration; in 1969 1,025 selected representatives voted for integration with Indonesia.",
 "Pieter Drooglever's study for the Dutch government concluded that the 1969 process did not meet the standard of genuine self-determination. Papuan nationalism — symbolised by the Morning Star flag first raised in 1961 — has continued since.",
 ["drooglever2009","chauvel2005"], [10,12], peoples=["dani","biak","amungme"])
E("timor",1975,2002,"nation","independence","Timor-Leste",-8.75,125.9,
 "East Timor: invasion and independence",
 "Indonesia invaded Portuguese Timor in December 1975. The truth commission (CAVR) estimated at least 102,800 conflict-related deaths during the occupation. After a UN-run referendum in 1999 and militia violence, Timor-Leste became independent in 2002.",
 "", ["cavr2005","hagerdal2012"], [10,12], peoples=["tetum"])
E("brunei-1984",1984,1984,"nation","independence","Bandar Seri Begawan",4.9,114.94,
 "Brunei's independence (1984)",
 "Brunei became fully independent on 1 January 1984 as an absolute monarchy funded by oil and gas.",
 "", ["saunders2002"], [10])

# ===================== 11. 20TH-CENTURY DEVELOPMENT =====================
E("killings-1965",1965,1966,"nation","development","Java, Bali, Sumatra",-7.5,112.0,
 "The 1965–66 killings and the New Order",
 "After the 30 September 1965 movement, the army and allied militias killed about 500,000 people accused of communist links and imprisoned hundreds of thousands; Suharto's New Order (1966–98) was built on this violence.",
 "Geoffrey Robinson shows the army's central role. The New Order's ideology of 'development' (pembangunan) and order framed indigenous peoples as 'isolated, alien communities' (masyarakat terasing) to be resettled and civilised.",
 ["robinson2018","li2007"], [11,12])
E("new-order-forest",1967,1998,"nation","development","Kalimantan",0.0,114.0,
 "State forest, logging and the 'tribal slot'",
 "The Basic Forestry Law of 1967 claimed most of the outer islands as state forest; logging concessions were handed to military-linked conglomerates, overriding adat claims.",
 "Tania Li shows how indigeneity in Indonesia became a 'tribal slot' — a position defined by the state and activists through resource politics. Satellite studies document how logging gave way to plantations in Borneo and Sumatra.",
 ["li2000","li2007","gaveau2016"], [11,12], peoples=["ngaju","iban","kenyah"])
E("transmigrasi",1905,2000,"nation","development","Java → outer islands",-5.0,112.0,
 "Transmigration (transmigrasi)",
 "Begun by the Dutch as kolonisatie in 1905 and expanded by the New Order, transmigration moved millions of people from Java, Bali and Madura to Sumatra, Kalimantan, Sulawesi and Papua.",
 "Officially a population and development programme, it also served security and 'national integration' goals, placing settlers on land claimed by indigenous communities, especially in Papua. Fearnside reviews its environmental and social costs.",
 ["fearnside1997","hardjono1977","li2007"], [11,12], peoples=["javanese","madurese","orang-rimba","marind"],
 routes=["r-transmig-lampung","r-transmig-kalimantan","r-transmig-sulawesi","r-transmig-papua"])
E("asean",1967,1967,"nation","development","Bangkok",13.75,100.5,
 "ASEAN (1967)",
 "Indonesia, Malaysia, the Philippines, Singapore and Thailand founded ASEAN in Bangkok on 8 August 1967, ending Konfrontasi's era; Brunei joined in 1984, later the mainland states.",
 "", ["tarling1992","reid2015"], [11])
E("palm-oil",1980,2026,"nation","development","Borneo & Sumatra",0.5,110.0,
 "The oil palm frontier",
 "Indonesia and Malaysia became the world's largest palm oil producers; industrial plantations spread over millions of hectares of Borneo and Sumatra, much of it former forest and customary land.",
 "Margono et al. measured Indonesia's primary forest loss at over six million hectares in 2000–12; Gaveau et al. tracked four decades of plantation expansion in Borneo. Li and Semedi call the result 'corporate occupation': plantations that govern land, labour and villages like a colonial order.",
 ["li2021","gaveau2016","margono2014","li2014"], [11,12], peoples=["ngaju","iban","orang-rimba"])
E("reformasi",1998,2005,"nation","development","Jakarta",-6.2,106.85,
 "Reformasi and decentralisation",
 "Suharto fell in May 1998. Decentralisation laws (1999, implemented 2001) moved power to districts, and new provinces and districts multiplied (pemekaran) — often along ethnic and adat lines.",
 "Schulte Nordholt and van Klinken show how local elites used decentralisation and adat to renegotiate boundaries; it also sharpened land conflicts.",
 ["schulte2010","henley2007"], [11,12])
E("aceh-peace",2004,2005,"nation","independence","Aceh",5.55,95.32,
 "Tsunami and peace in Aceh",
 "The Indian Ocean tsunami of 26 December 2004 killed over 160,000 people in Aceh; the Helsinki agreement of August 2005 ended the war between Indonesia and GAM and granted special autonomy.",
 "Edward Aspinall traces how Acehnese nationalism grew from grievances over resources and military violence.",
 ["aspinall2009"], [11,12], peoples=["acehnese"])
E("adat-revival",1999,2026,"nation","indigenous","Indonesia",-4.0,116.0,
 "Adat revival, AMAN and the Constitutional Court",
 "In 1999 the first congress of indigenous peoples founded AMAN (Aliansi Masyarakat Adat Nusantara). In 2013 the Constitutional Court (decision 35/PUU-X/2012) ruled that customary forests are not state forests.",
 "Davidson and Henley trace adat from the colonial Leiden school of Van Vollenhoven — which codified 'adat law circles' — to today's indigenism, showing its double edge: protection, but also exclusion and elite capture. Implementing MK35 has been slow and depends on regional regulations recognising each community.",
 ["henley2007","burns2004","mk2012","butt2014","aman1999"], [11,12])
E("bali-tourism",1924,2026,"nation","development","Bali",-8.5,115.26,
 "Tourism and 'touristic culture'",
 "From KPM steamship tours in the 1920s to mass tourism after 1970, Bali became a model of cultural tourism that Indonesia replicated elsewhere — including eastern islands such as Sumba.",
 "Michel Picard argues that tourism did not simply corrupt Balinese culture but produced a 'touristic culture' in which Balinese learned to see their own religion and arts through tourism's eyes.",
 ["picard1996","vickers1989"], [11,12], peoples=["balinese"])
E("mifee",2010,2026,"nation","development","Merauke",-8.5,140.4,
 "MIFEE and food estates in Papua",
 "The Merauke Integrated Food and Energy Estate (from 2010) allocated over a million hectares of Marind lands for agribusiness; later 'food estate' projects have renewed the pressure.",
 "Ginting and Pye document Marind resistance and the role of transmigration and corporate concessions.",
 ["ginting2013","li2021"], [11,12], peoples=["marind"])
E("orang-asli-land",1954,2026,"nation","indigenous","Peninsular Malaysia",3.8,101.9,
 "Orang Asli land rights in Malaysia",
 "Under the Aboriginal Peoples Act (1954) Orang Asli occupy land at the state's pleasure; logging, dams, plantations and Islamisation programmes have pressed on their territories, while court cases since the late 1990s have begun to recognise customary title.",
 "Colin Nicholas argues that the contest for resources, not culture, defines Orang Asli politics; Endicott's volume reviews history and present.",
 ["nicholas2000","endicott2016"], [12], peoples=["semai","temiar","jehai","batek","temuan","jakun"])
E("orang-rimba-now",1980,2026,"nation","indigenous","Bukit Duabelas, Jambi",-1.95,102.6,
 "The Orang Rimba of Bukit Duabelas",
 "The Orang Rimba, forest-dwelling hunter-gardeners of Jambi, saw their forests cut by logging, transmigration settlements and oil palm from the 1980s; Bukit Duabelas was made a national park in 2000, partly to protect them.",
 "Steven Sager's ethnography describes Orang Rimba custom (adat), religion and the boundary they draw between forest life and the settled 'Orang Terang' world — a boundary under pressure from sedentarisation, conversion programmes and plantation work.",
 ["sager2008","li2021"], [12], peoples=["orang-rimba"])


E("language-map",-5000,2026,"nation","indigenous","Island Southeast Asia",-1.0,124.0,
 "Reading the language map",
 "Over 700 languages are spoken in Indonesia alone. Austronesian languages dominate from Sumatra to Maluku; Papuan families survive in Halmahera, Timor-Alor-Pantar and New Guinea; Austroasiatic Aslian languages mark the Orang Asli of the Peninsula.",
 "Switch on the 'Languages' layer to see territories generated from Glottolog's coordinates for 3,205 languages in the region, coloured by family. Glottolog points are approximate centres, not borders: real language areas overlap, and migrants (Javanese, Bugis, Madurese, Minangkabau) live far from their homelands. The map is cross-checked against Wikipedia's ethnolinguistic map of Indonesia.",
 ["glottolog2026","wiki-langmap","blust1995","bellwood2007"], [1,2,12])
