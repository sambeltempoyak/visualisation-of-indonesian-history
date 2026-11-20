# -*- coding: utf-8 -*-
# Chapter definitions for the Sumba story. Text is original prose; no long verbatim quotes.
INTRO = ("This story follows one island across roughly 650 years, from the first Javanese and Bimanese claims over Sumba to the sugarcane permits of the 2010s. "
"It is built from 120 events on Ejak's History of Sumba and Indonesia canvas, each drawn from sources in his Mendeley library, mostly Soelarto, Pietrow, Hoskins, Vel, Keane and the Dutch-era writers Leupe, Nooteboom and Onvlee. "
"Chapters name who says what, and where the sources disagree on a date or a fact the text says so.\n\n"
"Two cautions. Much of the early history comes from a handful of authors, and Sumbanese voices appear mostly through the people who wrote about them. "
"Dates before the 1750s are often approximate or taken from a single source. The wording here is my own; the verbatim passages stay in a private quote pack that is not published with the site.")

C = []
def ch(id, title, start, end, label, text, camera, places, events, citations_extra=None, map_events=None, indo_cites=None, notes=None):
    C.append(dict(id=id, title=title, start=start, end=end, label=label, text=text, camera=camera,
                  places=places, events=events, map_events=map_events or [], indo_cites=indo_cites or {}))

ch("c01","Landfalls in the undated past",-2000,1000,"Undated; before c. 1350",
"Soelarto's Budaya Sumba, the main source for the island's early chronology on the canvas, opens with arrivals rather than dates. He reports a hypothesis by the archaeologist A. N. J. Th. van der Hoop that the ancient society of Umalulu, in the east, was still a Neolithic one. The canvas summary links this to a tradition of settlers from the Malay Peninsula who landed at Kambaniru and Umalulu, with urn burials offered as the material evidence.\n\n"
"Later waves, in what Soelarto calls the centuries of history that followed, came partly from Sulawesi, above all Makassar and Bugis people, and partly from the islands now grouped as Nusa Tenggara. Most of them, he says, chose Tanjung Sasar as a landing place and temporary home before moving inland.\n\n"
"Treat the numbers attached to this chapter with care. Soelarto gives no calendar dates here; the -2000 and 1000 on the timeline are placeholders for 'prehistoric' and 'early historic', and the Neolithic label is van der Hoop's hypothesis as relayed by Soelarto, not a settled finding.",
{"center":[-9.85,120.5],"zoom":9},
[("kambaniru","Landing place named in the origin tradition"),("umalulu","Site of the urn burials and the Neolithic hypothesis")],
["S171","S172"])

ch("c02","Majapahit's long shadow",1350,1500,"c. 1350 to the 15th century",
"Soelarto says Javanese groups came to Bima, Sumbawa and Sumba between the mid-fourteenth and late fifteenth centuries, while Majapahit was extending its power across the archipelago. The canvas places the settlement of Sumba's south coast at about 1350. The same author reads canto 14, verse 5 of the Negarakertagama as naming Sumba among the Nusa Tenggara islands under Majapahit. Sources differ on the date: the record behind the canvas gives 1300, whereas canto 14 is conventionally dated about 1365, which is the date used here.\n\n"
"In the fifteenth century, Soelarto writes, Majapahit's influence passed to the kings of Bima, who were said to descend from Majapahit as well. Pietrow reads the fifteenth-century Bimanese chronicles in a similar spirit: Bima claimed Sumba together with Savu, Manggarai, Solor, Rote and Raijua. A chronicle claim is not evidence of control, and a later chapter shows the VOC doubting that Bima ever ruled Sumba.",
{"center":[-9.2,119.5],"zoom":8},
[("bima","Seat of the kings who claimed Sumba"),("sumba","Sumba, claimed in Bimanese chronicles")],
["S001","S002","S003"], indo_cites={"I011":["Soelarto, 1980, p. 26"]})
C[-1]["extra_events"]=["I011"]

ch("c03","A port of call and the Sandalwood Island",1400,1610,"15th to early 17th century",
"Soelarto describes the fifteenth and sixteenth centuries as a time when traders from Makassar, Bugis lands, Banjar, Bajau and Buton called at Sumba in numbers, carrying away sandalwood, woven cloth and livestock. Hoskins notes the island was given the name Sandalwood Island in the sixteenth and seventeenth centuries and that its aromatic forests were quickly depleted. The two authors do not date this identically: Soelarto places the sandalwood barter around 1400, Hoskins the naming around 1500 or later.\n\n"
"Soelarto adds that Sumbanese first met Europeans in the 1510s, when Portuguese traders, called Tau Marenggi, arrived. English ships followed, sailing from a base at Mauritius, and the English were known as Tau Murihu. His account is the only one on the canvas for this early European contact.\n\n"
"Around 1600, he says, Makassarese and Bugis traders also spread Islam, and some settled in Kodi in the west. This is described as seventeenth-century context rather than a firm date.",
{"center":[-9.7,119.9],"zoom":8},
[("kodi","Makassarese and Bugis traders settled here")],
["S004","S005","S006","S008"])

ch("c04","The Company's first glimpses",1600,1660,"c. 1600 to 1660",
"According to Soelarto the Dutch became known to Sumbanese only in the seventeenth century, when VOC ships began to call for sandalwood. Pietrow supplies the first dated mention: a VOC letter of 1636 records a ship that, held back by calm and contrary currents, only reached Sumba around the 29th of the month.\n\n"
"Pietrow also finds a VOC letter of 2 October 1645 that documents a raid on Sumba by people from Ende. He reads it as proof that such raids happened at least once and probably more often. Ende raiders return as the island's main slavers in later chapters.\n\n"
"In 1660, Awa and Suana report, the Dutch made a treaty with a ruler called Raja Sumbayang, intended to make Sumba submit to the Dutch rather than to the king of Makassar. The text does not say how far the treaty reached across the island.",
{"center":[-9.3,120.4],"zoom":8},
[("ende","Home port of the raiders named in the 1645 letter")],
["S007","S010","S011","S012"])

ch("c05","Bima, the Company and a contested overlordship",1674,1726,"1674 to 1726",
"Pietrow's study asks whether Sumba was ever a subject of Bima. He finds that Sumbanese rebelled against Bimanese tribute, and that the VOC knew of the rebellion by 1674, though when it began is unclear. The canvas records that the VOC backed Bima's claim. In April 1677 a second expedition of VOC and Bimanese forces sailed for Sumba. Pietrow's own sources disagree about what followed: some report villages submitting to Bima, another reports an ambush and the Bimanese retreating in disgrace.\n\n"
"A VOC letter of 1686 doubts that Bima ever succeeded: the late king wanted to bring Manggarai and Sumba under his protection but, the Company had been told, did not manage it before he died. By then the VOC was acting for itself. A letter of 1680 shows the ship Negombo sailing to Sumba to buy enslaved people, and in the 1690s the Company began exploring the island on its own terms, with the Portuguese as competitors. Raben adds the larger setting, that the Company's conquest of Makassar in 1667 to 1669 was a pivotal moment for slave networks in the region.\n\n"
"Two dating problems. Pietrow has the official Beynon reporting constant warfare on Sumba, but his sentence places this in the late eighteenth century, whereas the canvas dates it to about 1700; I keep the canvas date with that doubt. In 1726 the VOC is recorded as recognising the Portuguese as sovereigns in eastern Sumba, although the canvas summary also leaves open that the Company took the overlord role itself.",
{"center":[-9.45,119.7],"zoom":8},
[("bima","Sultanate whose claim over Sumba the VOC first backed, then doubted")],
["S014","S016","S018","S020","S021","S022","S024"], indo_cites={"I039":["Raben, 2008, p. 133"]})
C[-1]["extra_events"]=["I039"]

ch("c06","Surveying an island of slaves and sandalwood",1740,1759,"c. 1740 to 1759",
"By the mid-eighteenth century slaves were being bought on Sumba, Ende and Solor for the Timor-linked trade, according to Raben. In 1750 the VOC sent an expedition to make trading agreements with local rajas and to forbid them to trade with the Makassarese (Hoskins). Soelarto says the envoy was D. J. van der Burg and that the agreement was oral, made with eight Sumbanese kings. Hoskins gives the year without naming the envoy, and the date is best read as about 1750.\n\n"
"In 1757 the Council of the Indies ordered the Opperhoofd at Timor to have Sumba examined: what happened there, what it produced, and whether holding it would be useful to the Company. The report of the survey, translated from Leupe's 1879 edition, shows the Opperhoofd viewing the island mainly as a source of slaves and suggesting a large expedition to seize prisoners of war who could not be had by fair means. Hoskins confirms the scale: by 1757 Sumba supplied slaves sold directly to the Company and exported as far as Bali, Sulawesi, Java and even South Africa, Mauritius and Madagascar.\n\n"
"Leupe's report also records piracy. In 1758 Makassarese, turned away from Rote, raided Sumba and the ruler of Lewa handed them fifty-five slaves. The surveyor Erasmusz, writing on 25 January 1759, concluded that the Sumbanese made war on each other without pause and that no profit could be expected until the island was quieted, though he projected exports of a shipload of sandalwood, many slaves and raw cotton if it came under the Company.",
{"center":[-9.75,120.0],"zoom":8},
[("lewa","Ruler of Lewa handed over slaves to Makassarese raiders in 1758")],
["S025","S026","S027","S028","S029","S030","S031"], map_events=["sumba-slaves"])

ch("c07","Slavers, a vanished Company and the first warships",1775,1838,"c. 1775 to 1838",
"Pietrow reports that by 1775 Makassarese slavers were arriving every year with more than thirty ships and carrying off many people. When the VOC was dissolved in 1799, Soelarto notes, the Dutch had never occupied Sumba. Bosma places the wider picture in the archipelago: from the 1780s to the 1860s slave raiding surged in the seas and along the coasts of the Indonesian islands.\n\n"
"In the early nineteenth century Endenese raiders took over the trade. Pietrow says they intensified it and held a monopoly on Sumba, and Kuipers, citing Needham, places their raids especially on the north coast. Kuipers adds that as the Dutch gradually controlled the coastal waters, the raiders went deeper inland in search of captives.\n\n"
"The Dutch moved slowly. Soelarto says that only in the nineteenth century, once their power in the archipelago was consolidated, did they begin to take over all of Sumba, cheaply, through declarations and later a controleur. Two early episodes appear on the canvas: four Dutch warships with commissioners entering a bay in south-west Sumba on 8 March 1817 (Awa and Suana), and, in 1838, the wreck and plundering of a British ship, after which Batavia ordered the Resident at Kupang to investigate how the island could be made safe and governable (Vel).",
{"center":[-9.4,119.9],"zoom":8},
[("ende","Home of the Endenese raiders")],
["S032","S033","S034","S035","S037","S039"], map_events=["sumba-slaves"], indo_cites={"I057":["Bosma, 2020, p. 111"]})
C[-1]["extra_events"]=["I057"]

ch("c08","Waingapu, horses and contracts",1843,1851,"1843 to 1851",
"Waingapu's origin is dated differently by different authors. Soelarto, Vel and Hoskins (2002) give 1843, when Sayid Syarif Abdulrahman Algadri, an Arab trader from Makassar, founded the port with help from several Sumbanese rajas. Hoskins (1996) describes an Arab horse trader building a small dock to load livestock at Waingapu, without a year, and Nooteboom's account of the Arab horse trader is undated or places it around 1800. I follow 1843, which three sources share.\n\n"
"Vel says the founder started a profitable horse trade and became very influential, acting as broker between the colonial government and local leaders for the next thirty-four years. Inter-island trade grew, Soelarto adds, once the port existed.\n\n"
"In 1845, from the colonial government's view, a contract signed by some Sumbanese rajas limited their sovereignty over trade and alliances with foreigners other than the Dutch (Vel). Awa and Suana say the Dutch began to control parts of the Sumba mainland from 1851, though the canvas has no event showing what that meant on the ground before the first controleur arrived in 1866.",
{"center":[-9.66,120.26],"zoom":10},
[("waingapu","Port founded 1843; centre of the horse trade")],
["S041","S042","S046"])

ch("c09","Abolition on paper, Savunese on the coasts",1850,1860,"c. 1850 to 1860",
"Bosma lists Sumba, with Lampung, Bali, Timor and Nias, among places still offering thousands of slaves for sale each year from the mid-nineteenth century on; the canvas notes a figure of five hundred to a thousand a year from Sumba, a number I could not see in the quoted passage. Slavery was formally abolished in the Netherlands Indies in 1860, but Bosma stresses that this was the first comprehensive ban, and Hoskins observes that Makassarese and Endenese were starting to settle on Sumba's north coast, at Waingapu, Memboro and Waikalo, at about the same time.\n\n"
"Sumbanese rajas looked for allies. Vel reports that at the request of two rajas the colonial government moved four hundred Savunese from Savu to Sumba in 1860, as part of their defence against Ende raiders. Nooteboom speaks more broadly of Savunese settlement along the coasts, increasing greatly in the second half of the nineteenth century at the Government's urging, on top of older spontaneous migration. The sources differ on dates: Nooteboom points to about 1850, Vel to 1860.",
{"center":[-9.85,120.5],"zoom":8},
[("savu","Source of the Savunese settlers"),("waingapu","North-coast settlement of Endenese"),("memboro","North-coast settlement of Endenese")],
["S043","S045","S047"], map_events=["sumba-slaves"], indo_cites={"I081":["Bosma, 2020, p. 117"]})
C[-1]["extra_events"]=["I081"]

ch("c10","The first official, the first schools, the first missionaries",1866,1881,"1866 to 1881",
"Vel names Controleur S. Roos as the first government official on Sumba, appointed in 1866. His tasks included collecting payment in horses for goods plundered from wrecks and studying Sumbanese habits to find out which form of indirect rule would fit local adat. Nooteboom quotes a writer who lived as that first official from 1866 to 1869 at Kambaniru, five kilometres from Waingapu, and says contact then looked more like diplomacy than administration. Kuipers sees 1866 as the start of a Dutch effort at 'orderly administration' that began to change the meaning of ancestral villages as sources of security and ritual authority.\n\n"
"Missions were just as uneven. Nooteboom says attempts by the Indies Church in the second half of the nineteenth century failed; the canvas dates this at about 1850, which is looser than his wording. Soelarto reports a Jesuit mission building a large church and school at Loura in 1866, and a Protestant mission organisation expanding from 1877. Soeriadiredja puts the first mission primary school at Kambaniru in 1875, although his sentence also dates evangelisation there from 1877, so one date may be loose. Vel gives September 1881 for the arrival of the first Dutch missionary, Van Alphen, who worked mostly with Savunese in the east.\n\n"
"Politics on the ground continued in parallel. In 1874 the Dutch took the side of the raja of Seba in a war against the raja of Batakapidu, preferring the more accommodating ruler (Soelarto). The same author describes the Dutch trying and failing to capture Tarandalu of Lewa-Kambera by playing his rivals off against him, until his death in 1892.",
{"center":[-9.7,120.1],"zoom":9},
[("kambaniru","Seat of the first controleur and the first mission school"),("loura","Jesuit church and school, 1866 (Soelarto's 'Laura')"),("lewa","Domain of Tarandalu, who resisted until 1892")],
["S044","S048","S049","S050","S051","S052","S053","S060"])

ch("c11","Rajas made, slaving ending, a tree of skulls",1877,1892,"1877 to 1892",
"The last decades of the slave trade overlap with the first of colonial taxation and the making of rajas. Bosma says about five hundred people were still deported from Sumba in 1877 and that Endenese trafficking was still observed in 1886, while the Dutch navy stepped up patrols against slave transports from Sumba to Bali and east Lombok in the late nineteenth century. In 1877 the broker Sjarif Abdoelrachman was called to Kupang to answer for warfare and slave trade on Sumba and died there a few months later (Vel).\n\n"
"In 1880 Vel, citing Kapita, reports the Dutch installing Umbu Dongu Ubini Mesa as first raja of Anakalang and presenting him with a golden staff as the sign of colonial recognition. Sources differ: Keane dates the first recorded Dutch visit to Anakalang to 1910 and the raja's position to about 1912. In the east Hoskins records the raja of Lewa claiming a hereditary right over Kambera; the canvas summary says he conquered it and moved to Kawangu, which the quoted passage does not state. The state started taxing Sumbanese at the end of the century, Vel adds, which pushed people into the money economy.\n\n"
"Catholic and Protestant work also began. A Jesuit mission in the north-west opened a school, which Vel says closed after ten years without converts, dating it to 1891, while Keane gives a brief Catholic mission in West Sumba from 1885 to 1893. In 1892 a missionary visiting Rindi in the east drew a skull tree, reproduced by Hoskins; the canvas gives its count as sixteen heads. A mission primary school opened at Melolo the same year (Soeriadiredja).",
{"center":[-9.8,120.2],"zoom":9},
[("anakalang","First raja installed here, 1880"),("lewa","Raja claimed Kambera"),("rindi","Skull tree drawn by a missionary, 1892"),("melolo","Mission primary school, 1892")],
["S054","S056","S057","S058","S059","S061","S063","S064","S065"], map_events=["sumba-slaves"])

ch("c12","A rumour at Waingapu and the pacification campaign",1900,1906,"1900 to 1906",
"Vel traces the end of Dutch non-interference to 1901, when a rumour spread that the raja of Lewa-Kambera would capture Waingapu. The colonial government decided to defend its inhabitants and established its authority through a violent campaign. Soelarto adds that reinforcements were hurried from Kupang by ship in August 1901, and the canvas records Umbu Biditau fighting a guerrilla war until his surrender in 1907, after which he was exiled to Padang.\n\n"
"Vel lists four measures of the pacification of 1901 to 1912: freeing slaves and banning the trade, banning internal warfare and taking all firearms into a state monopoly of violence, forced labour such as road building, and taxes. Even the start date is disputed. Vel counts from 1901, while Keane, Kuipers and the later Vel and Makambombu paper date it from 1906; Kuipers ties 1906 to the appointment of Van Heutz as Governor General, which I believe other literature places in 1904.\n\n"
"Nooteboom describes the political disorganisation caused by Dutch intervention in the first decade of the century: at one point all adult members of Lewa's ruling lineage were banished from the island. Afterwards, Awa and Suana say, the realms became self-governing swapraja, and Vel and Makambombu explain that the government chose traditional domain leaders as rajas of bounded territories for indirect rule; the canvas counts fifteen. Protestant mission work took off in 1904, Keane notes, when a missionary settled in the east-coast government town.",
{"center":[-9.65,120.15],"zoom":9},
[("waingapu","Rumoured target of attack, 1901"),("lewa","Ruling lineage banished")],
["S067","S069","S072","S073","S074","S075","S076"], map_events=["sumba-pacification"])

ch("c13","West Sumba fights back",1905,1913,"1905 to 1913",
"The west resisted. Awa and Suana describe the people of Bongu village in Kodi opposing the Dutch presence of 1908 under H. Christoffel; Soelarto dates the rising of Rato Loghe Kandua, raja of Kodi Besar, to 1911; and Hoskins writes of Wona Kaka, a warrior from the headhunting clan of Bongu, who raided Dutch forces and killed several soldiers around 1911. Dates and names vary: 1905, 1908, 1910 and 1911 all appear as the start; one account names Rato Dendo and another Rato Loghe Kandua; and Awa and Suana claim the Kodi won in 1913 where the others record a Dutch victory.\n\n"
"Elsewhere in the west in 1909, Soelarto says, the people of Wewewa destroyed a Dutch military post and tax office, and Lamboya under Umbu Tadu Meli killed Lieutenant de Neeve, though it was later crushed. Soelarto puts Wona Kaka's arrest in 1912, which allowed the Dutch to regain control of all West Sumba, while Hoskins says the rebel forces surrendered in 1913.",
{"center":[-9.6,119.2],"zoom":9},
[("bongu","Headhunting clan of Wona Kaka"),("wewewa","Post and tax office destroyed, 1909"),("lamboya","Lt de Neeve killed, 1909")],
["S078","S082","S083","S089"], map_events=["sumba-pacification"])

ch("c14","A pacified island, a divided administration",1906,1918,"c. 1906 to 1918",
"Authors date the end of resistance differently. Hoskins (2002) says effective Dutch political control came in 1911 with a large armed force; Soelarto stresses that from 1912 to 1942 no physical resistance is reported; Kuipers quotes Couvreur's claim that by 1914 east and central Sumba were fully pacified and the west mostly. Hoskins (1996) uses 1915, and Forth, writing about the east, says only 'the early part of this century'. Colonial administration, Vel says, began in 1912 and made the island one afdeeling of the Residency of Timor; Mross dates Dutch administration from 1906.\n\n"
"The aftermath was large. Forth describes the hilltop villages of many eastern domains, including Rindi, being gradually abandoned for lower villages closer to fields and water once warfare stopped. Hoskins notes that the language and ritual of headhunting were turned to new uses: nationalism, welcoming officials, alliance negotiation. Overseas slave export, he says, effectively ended in 1913, but left a large population of slave descendants.\n\n"
"In 1913 the Flores-Sumba Contract tried to end competition between Catholic and Protestant missions by giving Sumba to the Protestants and Flores to the Catholics (Vel). In 1914 Onvlee cites a regulation requiring self-rulers to obey the Netherlands Indies Government, and Geria writes that Rindi's kingdom was confirmed by a short declaration in 1918.",
{"center":[-9.85,120.3],"zoom":9},
[("rindi","Hilltop village abandoned; kingdom confirmed 1918"),("waingapu","Government centre")],
["S070","S079","S087","S090","S091","S093"], map_events=["sumba-pacification"])

ch("c15","Nineteen domains and arguments about adat",1920,1963,"c. 1920 to 1963",
"Vel and Makambombu report that Protestant missionaries in the 1920s and 1930s debated whether to abolish all of adat or only parts of it. The colonial state meanwhile divided the island. Onvlee had a map of 1929, revised in 1928, showing nineteen self-governing domains in two subdivisions, East Sumba and West Sumba.\n\n"
"In 1929 an exception was made to the Calvinist mission monopoly for the Catholic Societas Verbi Divini, because some Sumbanese had been baptised by the brief earlier Catholic mission (Keane). The church also had to decide what to do with polygamy. Onvlee says a gravamen from the Rev. W. van Dijk reached the General Synod of Arnhem in 1930, arguing that the rule of the husband of one wife could not apply to Sumbanese relationships; the synod did not take it up. The canvas dates the polygamy and sacrificial-meat debates from 1930 to 1963 and Onvlee himself gives separate dates, 1930 for the synod, 1934 for an advice and 1963 for an adat consultation.",
{"center":[-9.7,119.85],"zoom":8},
[("waingapu","East Sumba subdivision (later district centre)"),("waikabubak","West Sumba subdivision (later district centre)")],
["S099","S101","S102","S105"])

ch("c16","Japanese, NICA and a Sumbanese state",1942,1950,"1942 to 1950",
"Hoskins says the Japanese displaced the Dutch in 1942 and were remembered as especially brutal, called dawa nippon. He speaks of four years, where the canvas and most histories give 1942 to 1945. Soelarto says the NICA, the returning Dutch civil administration, held Sumba for a year, from November 1945 to November 1946.\n\n"
"In the first half of 1946 Onvlee attended a meeting in Waikabubak where a representative of the Netherlands Indies authority told the heads of the population that a new time had come and that a new political structure would be built on democratic grounds. Soelarto says that when the State of East Indonesia was set up, Sumba became one of its states, under Raja Mamboro. Vel describes Sumba as one of sixteen member states of the federation, created by the colonial government to counterbalance the nationalist movement, and divided into sixteen kerajaan. Vel dates Sumba's joining to 1945, which conflicts with the 1946 of the other sources.\n\n"
"The federation ended in 1950 when its territory became part of the Republic, with Sumba in the province of Sunda Kecil, renamed Nusa Tenggara in 1954 (Vel).",
{"center":[-9.55,119.6],"zoom":9},
[("waikabubak","Site of the 1946 meeting"),("mamboro","Raja Mamboro headed Sumba's state in the federation")],
["S109","S112","S113","S114"], indo_cites={"I156":["Vel, 2008, p. 179","Onvlee, 1973, p. 119"],"I162":["Vel, 2008, p. 179"]})
C[-1]["extra_events"]=["I156","I162"]

ch("c17","Church, schools and a Sumbanese regent",1946,1962,"1946 to 1962",
"After independence, Vel says, indirect rule continued in the same form, with local rulers now subordinate to the national government, and the missions kept a leading role in education, social services and health. Vel and Makambombu agree that local nobility held local state leadership.\n\n"
"Keane says that by 1946, when the Sumbanese Christian Church (GKS) was founded as successor to the Calvinist Church, Anakalang had only 180 baptised members in a population of over 22,000. Soeriadiredja gives 1947 for the founding of GKS, a one-year difference between the two authors, and adds that a Sumbanese-led foundation, Yapmas, was formed in 1950 to run the church's schools. Mross notes that since the 1950s many Christians in Wanokaka have moved away from hilltop settlements while still regarding the clan-houses as ancestral homes.\n\n"
"The Anakalang raja's family illustrates the continuity of noble power: Keane says the son of the raja who died in 1953, Umbu Remu Samapati, became West Sumba's first bupati, while Vel dates his election to 1962. In 1958 Nusa Tenggara was divided into three provinces and Sumba into East and West districts (Soelarto; Vel).",
{"center":[-9.7,119.75],"zoom":9},
[("anakalang","Raja's family became West Sumba's first regents"),("wanokaka","Christians moved from hilltop villages")],
["S111","S115","S118","S119","S120","S122"])

ch("c18","1965 and the registered religion",1965,1986,"1965 to 1986",
"After 1965, Vel writes, Sumba experienced for the first time rule by a bureaucracy organised and instructed from Jakarta. The New Order invested in public primary schools, roads, healthcare and electricity. It also required anyone sitting an exam or seeking government work to belong to one of five recognised religions; the traditional Sumbanese religion, Marapu, was not among them.\n\n"
"Keane and Kamuri tie religious change to the killings of 1965 to 1966. Keane says rapid church growth in Anakalang began only after the coup attempt, when having no recognised religion was taken as a sign of communism; Kamuri adds that Marapu followers' careers and even lives were threatened by that suspicion. Vel reports that GKS membership grew from 52,000 in 1976 to 100,000 in 1986, citing van Halsema, and describes mass baptisms of over 2,300 people in one service at Maradesa. The numbers measure registered membership, not belief.",
{"center":[-9.7,119.9],"zoom":8},
[("anakalang","Church growth after 1965 studied by Keane"),("waikabubak","West Sumba's regency town")],
["S123","S124","S125","S127"])

ch("c19","Tombstones, tourists and tarmac",1977,1997,"1977 to 1997",
"Hoskins recalls that in the 1970s a guidebook called Sumba notable only for giant tombstones and giant mosquitoes, and most travellers stayed away; by 1988 the same guide called it fascinating. Hoskins writes of a modest tourist boom in the 1990s, with backpacker accommodation in Waikabubak, Loura and Lamboya, and a newly paved road from Waingapu to the west that cut travel from thirteen hours to three and a half. Vel counts six hotels in Waikabubak by 2002.\n\n"
"Religion shifted at uneven rates. Keane says that in 1986 West Sumba was one of the last regencies in Indonesia with a pagan majority, 63.6 per cent of 262,813 inhabitants officially without a religion, and Hoskins says the pagan majority lasted until the final census of the century. Yet Geirnaert finds the Laboya increasingly abandoning their ancestral religion for Protestantism or Catholicism, and Mross reports Wanokaka Christians rising from half to sixty-eight per cent between 1993 and 1997. These figures describe different places and are not strictly comparable.\n\n"
"The land changed too. Waskitojati, Kameo and Wiloso say that from the 1980s in the south-west, in Wewewa, Loura and Kodi, tenure shifted from communal clan land to family holdings, and that cashew planting, promoted from 1991, became dominant in Kodi and parts of Loura.",
{"center":[-9.6,119.45],"zoom":9},
[("waikabubak","Tourist and hotel centre"),("lamboya","Backpacker lodgings; religious change recorded by Geirnaert"),("wanokaka","Christian share rose to 68% by 1997"),("kodi","Cashew planting from 1991")],
["S128","S130","S132","S135","S136","S137","S138","S139","S141"], map_events=["bali-tourism"])

ch("c20","Bloody Thursday and an ended boom",1994,2000,"1994 to 2000",
"In 1994, Fowler reports, the company Sutera Marosi Kharisma obtained thirty-year building rights over fifty hectares around Marosi Beach in North Kodi. In 1998 and 1999 the forestry service demarcated and categorised North Kodi's lands as part of a regreening plan.\n\n"
"In October and November 1998 Waikabubak saw riots. Vel begins on 26 October with about thirty university graduates demonstrating outside parliament against corruption in the civil service examinations. Hoskins describes thousands of villagers from Lauli confronting Weyewa villagers on 5 November outside a backpacker hotel. The death toll is disputed: Vel counts 26 dead and 891 houses destroyed, Hoskins gives a range of 26 to 114. The framing differs too. Vel presents a Loli-Wewewa clash, Hoskins a Lauli-Weyewa one, and Mross reads it as the latest episode of centuries-old internecine warfare.\n\n"
"Other legacies of the period were quieter. Soeriadiredja says education policy tied to official religions kept Marapu children labelled as heathen or religionless even in the Reformasi era, and Hoskins notes that the tourist boom stalled by summer 2000 because of political upheaval after Suharto's fall.",
{"center":[-9.55,119.25],"zoom":9},
[("waikabubak","Riots of October and November 1998"),("marosi","Beach concession, 1994"),("kodi","Lands demarcated, 1998 to 1999")],
["S142","S143","S144","S145","S146"], map_events=["bali-tourism"])

ch("c21","Autonomy, new districts and plantation hopes",2001,2007,"2001 to 2007",
"Regional autonomy changed the map. Fowler says that after autonomy was implemented in 2001, the island was divided into four districts: Southwest Sumba, West Sumba, Central Sumba and East Sumba. Vel dates the political campaign for new districts from 2002 and notes that private ethnic arguments were used for Central and Southwest Sumba. The one-year gap is a dating difference between the two authors. Vel also writes that Law 22 of 1999 devolved political authority to districts, bypassing provinces.\n\n"
"Plantation schemes of the decade focused, McCarthy, Vel and Afiff say, on Jatropha, maize, cotton, sugarcane, cashew and sorghum, and most did not materialise. Their account of 2005 to 2008 describes West Sumba's agricultural service distributing Jatropha seed and inputs under a biofuel push.\n\n"
"Vel reports NGO staff in 2002 telling of rising illegal logging of protected species such as sandalwood, which sold in Bali for about thirty times what local loggers received. She also notes the Nihi Watu resort, which offered wealthy tourists Sumba's isolation as an asset and, according to the canvas summary, visits to a 'traditional village'.",
{"center":[-9.7,119.85],"zoom":8},
[("nihiwatu","Luxury resort, 2006"),("waikabubak","District centre, West Sumba"),("tambolaka","District centre, Southwest Sumba"),("waingapu","District centre, East Sumba")],
["S150","S151","S152","S155","S156"], indo_cites={"I233":["Vel, 2008, p. 117"]})
C[-1]["extra_events"]=["I233"]

ch("c22","Sugarcane, adat and AMAN",2012,2018,"2012 to 2018",
"Vel and Makambombu say that in 2012 the Djarum Group was exploring Sumba for sugar production; the canvas notes an earlier failed attempt by Wilmar. In 2014, Fowler records, the 20,646-hectare South West Sumba Protection Forest Management Unit was established by ministry decrees. In April 2015 East Sumba's district government gave PT MSM a location permit for sugarcane and a sugar mill. Morizcha puts it at 52,817 hectares and Vel and Makambombu at nearly 53,000, which is a rounding difference. The area included land in Umalulu near Wanga village.\n\n"
"In June 2015, Vel and Makambombu report, the company told Wanga's residents it would not occupy land in use by farmers, nor pastures or forest; the canvas notes that an attendance list was later used as evidence of consent. On 20 June 2016 PT MSM sought principle approval for an investment of Rp 9.5 trillion, and the same year Morizcha says the Marapu adat community of Umalulu entered a dispute with the company that was still running when Morizcha wrote. In 2017 a newly elected Wanga village head protested, and the Sumba branch of AMAN, the indigenous peoples' alliance founded nationally in 1999, was established in February. Morizcha says the plantation then displaced residents from six sub-districts and thirty villages; that is a legal scholar's claim and I have not seen a second source for the figure.\n\n"
"In January 2018 an article cited by Vel and Makambombu complained that the larger part of Sumba's adat land, 70 per cent of the island's surface according to the article, was treated as government property. The claim is the article's, not a survey result.",
{"center":[-9.95,120.55],"zoom":9},
[("umalulu","Centre of the PT MSM dispute; Wanga village is nearby"),("melolo","Sugarcane permit area"),("waingapu","East Sumba's district capital")],
["S159","S160","S161","S162","S163","S164","S166","S167","S168","S169"], map_events=["adat-revival"], indo_cites={"I240":["Li, 2000, p. 150"]})
C[-1]["extra_events"]=["I240"]
