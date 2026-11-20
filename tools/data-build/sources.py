# Bibliography for Visualisation of Indonesian History.
# S(id, type, authors, year, title, container, **kw)  -> kw: volume, issue, pages, publisher, doi, url, isbn, pr (peer reviewed), oa, note
import json
SRC = []
def S(id, type, authors, year, title, container="", pr=True, oa=False, **kw):
    d = dict(id=id, type=type, authors=authors, year=year, title=title, container=container,
             peer_reviewed=pr, open_access=oa)
    d.update(kw); SRC.append(d)

# ---------- Prehistory, genetics, migrations ----------
S("bellwood2007","book","Bellwood, Peter",2007,"Prehistory of the Indo-Malaysian Archipelago (3rd ed.)","ANU E Press",oa=True,
  publisher="ANU E Press, Canberra", doi="10.22459/PIMA.03.2007", note="Standard synthesis of Island Southeast Asian prehistory; open access.")
S("bellwood2017","book","Bellwood, Peter",2017,"First Islanders: Prehistory and Human Migration in Island Southeast Asia","Wiley-Blackwell",
  publisher="Wiley-Blackwell, Hoboken NJ", doi="10.1002/9781119251583", note="Updated statement of the Out-of-Taiwan model with genetics.")
S("blust1995","journal","Blust, Robert",1995,"The prehistory of the Austronesian-speaking peoples: a view from language","Journal of World Prehistory",
  volume="9", issue="4", pages="453–510", doi="10.1007/BF02221119", note="Linguistic reconstruction placing the Austronesian homeland in Taiwan.")
S("gray2009","journal","Gray, Russell D.; Drummond, Alexei J.; Greenhill, Simon J.",2009,"Language phylogenies reveal expansion pulses and pauses in Pacific settlement","Science",
  volume="323", issue="5913", pages="479–483", doi="10.1126/science.1166858", note="Bayesian phylogeny of 400 Austronesian languages; Taiwan origin c. 5,200 years ago.")
S("lipson2014","journal","Lipson, Mark; Loh, Po-Ru; Patterson, Nick; et al.",2014,"Reconstructing Austronesian population history in Island Southeast Asia","Nature Communications",
  volume="5", pages="4689", doi="10.1038/ncomms5689", oa=True, note="Genome-wide data: Austronesian ancestry from Taiwan, plus Austroasiatic input in western Indonesia.")
S("soares2008","journal","Soares, Pedro; Trejaut, Jean A.; Loo, Jun-Hun; et al.",2008,"Climate change and postglacial human dispersals in Southeast Asia","Molecular Biology and Evolution",
  volume="25", issue="6", pages="1209–1218", doi="10.1093/molbev/msn068", oa=True, note="Main mtDNA challenge to Out-of-Taiwan: post-glacial dispersals out of Sundaland.")
S("hill2007","journal","Hill, Catherine; Soares, Pedro; Mormina, Maru; et al.",2007,"A mitochondrial stratigraphy for Island Southeast Asia","American Journal of Human Genetics",
  volume="80", issue="1", pages="29–43", doi="10.1086/510412", oa=True)
S("ko2014","journal","Ko, Albert Min-Shan; Chen, Chung-Yu; Fu, Qiaomei; et al.",2014,"Early Austronesians: into and out of Taiwan","American Journal of Human Genetics",
  volume="94", issue="3", pages="426–436", doi="10.1016/j.ajhg.2014.02.003", oa=True, note="Ancient mtDNA from Liangdao (Matsu) linking mainland coast, Taiwan and the islands.")
S("mccoll2018","journal","McColl, Hugh; Racimo, Fernando; Vinner, Lasse; et al.",2018,"The prehistoric peopling of Southeast Asia","Science",
  volume="361", issue="6397", pages="88–92", doi="10.1126/science.aat3628", note="Ancient genomes: Hòabìnhian hunter-gatherers ancestral to the Semang (Orang Asli); farmer waves from the north.")
S("lipson2018","journal","Lipson, Mark; Cheronet, Olivia; Mallick, Swapan; et al.",2018,"Ancient genomes document multiple waves of migration in Southeast Asian prehistory","Science",
  volume="361", issue="6397", pages="92–95", doi="10.1126/science.aat3188", note="Neolithic farmers related to Austroasiatic speakers; later Bronze Age waves.")
S("larena2021","journal","Larena, Maximilian; Sanchez-Quinto, Federico; Sjödin, Per; et al.",2021,"Multiple migrations to the Philippines during the last 50,000 years","Proceedings of the National Academy of Sciences",
  volume="118", issue="13", pages="e2026132118", doi="10.1073/pnas.2026132118", oa=True, note="Philippine Negrito groups (e.g. Ayta) descend from the earliest settlers; at least five waves.")
S("clarkson2017","journal","Clarkson, Chris; Jacobs, Zenobia; Marwick, Ben; et al.",2017,"Human occupation of northern Australia by 65,000 years ago","Nature",
  volume="547", pages="306–310", doi="10.1038/nature22968", note="Madjedbebe rock shelter; earliest secure evidence for people in Sahul (debated range 65–50 ka).")
S("brumm2021","journal","Brumm, Adam; Oktaviana, Adhi Agus; Burhan, Basran; et al.",2021,"Oldest cave art found in Sulawesi","Science Advances",
  volume="7", issue="3", pages="eabd4648", doi="10.1126/sciadv.abd4648", oa=True, note="Leang Tedongnge warty pig painting ≥45,500 years.")
S("oktaviana2024","journal","Oktaviana, Adhi Agus; Joannes-Boyau, Renaud; Hakim, Budianto; et al.",2024,"Narrative cave art in Indonesia by 51,200 years ago","Nature",
  volume="631", pages="814–818", doi="10.1038/s41586-024-07541-7", note="Leang Karampuang, Maros-Pangkep: oldest known figurative scene.")
S("sutikna2016","journal","Sutikna, Thomas; Tocheri, Matthew W.; Morwood, Michael J.; et al.",2016,"Revised stratigraphy and chronology for Homo floresiensis at Liang Bua in Indonesia","Nature",
  volume="532", pages="366–369", doi="10.1038/nature17179", note="H. floresiensis remains 100–60 ka; last trace c. 50 ka, near modern human arrival.")
S("skoglund2016","journal","Skoglund, Pontus; Posth, Cosimo; Sirak, Kendra; et al.",2016,"Genomic insights into the peopling of the Southwest Pacific","Nature",
  volume="538", pages="510–513", doi="10.1038/nature19844", note="Ancient Lapita-associated genomes from Vanuatu and Tonga: East Asian (Taiwan-linked) ancestry.")
S("denham2003","journal","Denham, Tim P.; Haberle, Simon G.; Lentfer, Carol; et al.",2003,"Origins of agriculture at Kuk Swamp in the highlands of New Guinea","Science",
  volume="301", issue="5630", pages="189–193", doi="10.1126/science.1085255", note="Independent early agriculture in New Guinea by c. 7,000–6,500 years ago.")
S("wilmshurst2011","journal","Wilmshurst, Janet M.; Hunt, Terry L.; Lipo, Carl P.; Anderson, Atholl J.",2011,"High-precision radiocarbon dating shows recent and rapid initial human colonization of East Polynesia","Proceedings of the National Academy of Sciences",
  volume="108", issue="5", pages="1815–1820", doi="10.1073/pnas.1015876108", oa=True)
S("cox2012","journal","Cox, Murray P.; Nelson, Michael G.; Tumonggor, Meryanne K.; Ricaut, François-X.; Sudoyo, Herawati",2012,"A small cohort of Island Southeast Asian women founded Madagascar","Proceedings of the Royal Society B",
  volume="279", issue="1739", pages="2761–2768", doi="10.1098/rspb.2012.0012", oa=True, note="Malagasy maternal lineages trace to Indonesia, settlement c. 1,200 years ago.")
S("adelaar2005","chapter","Adelaar, Alexander",2005,"The Austronesian languages of Asia and Madagascar: a historical perspective","The Austronesian Languages of Asia and Madagascar (ed. K. A. Adelaar & N. Himmelmann)",
  publisher="Routledge, London", pages="1–42", note="Malagasy as a Southeast Barito (Borneo) language with Malay and Javanese loans.")
S("bulbeck2011","chapter","Bulbeck, David",2011,"Biological and cultural evolution in the population and culture history of Malaysia's Orang Asli","Dynamics of Human Diversity: The Case of Mainland Southeast Asia (ed. N. J. Enfield)",
  publisher="Pacific Linguistics, Canberra", pages="207–255", oa=True)
S("benjamin2002","chapter","Benjamin, Geoffrey",2002,"On being tribal in the Malay World","Tribal Communities in the Malay World: Historical, Cultural and Social Perspectives (ed. G. Benjamin & C. Chou)",
  publisher="ISEAS / IIAS, Singapore & Leiden", pages="7–76", note="Semang, Senoi and Malayic 'Proto-Malay' as social modes, not races.")
S("endicott2016","book","Endicott, Kirk (ed.)",2016,"Malaysia's Original People: Past, Present and Future of the Orang Asli","NUS Press",
  publisher="NUS Press, Singapore", isbn="9789971698614")
S("kirch2017","book","Kirch, Patrick V.",2017,"On the Road of the Winds: An Archaeological History of the Pacific Islands before European Contact (rev. ed.)","University of California Press",
  publisher="University of California Press, Berkeley", isbn="9780520292819")
S("solheim2006","book","Solheim, Wilhelm G., II",2006,"Archaeology and Culture in Southeast Asia: Unraveling the Nusantao","University of the Philippines Press",
  publisher="University of the Philippines Press, Quezon City", note="Alternative 'Nusantao' maritime-network model to Out-of-Taiwan.")
S("higham2014","book","Higham, Charles",2014,"Early Mainland Southeast Asia: From First Humans to Angkor","River Books",
  publisher="River Books, Bangkok", isbn="9786167339443", note="Bronze-age Dong Son and mainland sequences.")
S("calo2009","book","Calo, Ambra",2009,"The Distribution of Bronze Drums in Early Southeast Asia: Trade Routes and Cultural Spheres","Archaeopress (BAR International Series 1913)",
  publisher="Archaeopress, Oxford", isbn="9781407304083")

# ---------- Indic and Buddhist ----------
S("coedes1968","book","Coedès, George",1968,"The Indianized States of Southeast Asia (ed. W. F. Vella, trans. S. B. Cowing)","East-West Center Press",
  publisher="East-West Center Press, Honolulu", isbn="0824803680", note="Classic (1944 French original). Its 'Indianization' frame is now criticised — see Wolters, Kulke.")
S("wolters1999","book","Wolters, O. W.",1999,"History, Culture, and Region in Southeast Asian Perspectives (rev. ed.)","Cornell Southeast Asia Program & ISEAS",
  publisher="Cornell SEAP, Ithaca / ISEAS, Singapore", isbn="0877277257", note="'Localisation': local elites selected Indic elements; mandala polities.")
S("wolters1967","book","Wolters, O. W.",1967,"Early Indonesian Commerce: A Study of the Origins of Śrīvijaya","Cornell University Press",
  publisher="Cornell University Press, Ithaca")
S("kulke1990","chapter","Kulke, Hermann",1990,"Indian colonies, Indianization or cultural convergence? Reflections on the changing image of India's role in South-East Asia","Onderzoek in Zuidoost-Azië (ed. H. Schulte Nordholt)",
  publisher="Rijksuniversiteit te Leiden", pages="8–32", note="Convergence model: Southeast Asian polities and Indian ones developed in parallel.")
S("pollock2006","book","Pollock, Sheldon",2006,"The Language of the Gods in the World of Men: Sanskrit, Culture, and Power in Premodern India","University of California Press",
  publisher="University of California Press, Berkeley", isbn="9780520245006", note="The 'Sanskrit cosmopolis' (c. 300–1300 CE) reaching from Afghanistan to Java.")
S("manguin2004","chapter","Manguin, Pierre-Yves",2004,"The archaeology of early maritime polities of Southeast Asia","Southeast Asia: From Prehistory to History (ed. I. Glover & P. Bellwood)",
  publisher="RoutledgeCurzon, London", pages="282–313")
S("bellina2004","chapter","Bellina, Bérénice; Glover, Ian",2004,"The archaeology of early contact with India and the Mediterranean world, from the fourth century BC to the fourth century AD","Southeast Asia: From Prehistory to History (ed. I. Glover & P. Bellwood)",
  publisher="RoutledgeCurzon, London", pages="68–88", note="Ban Don Ta Phet, Khao Sam Kaeo: Indian beads and craftsmen by the 4th c. BCE.")
S("hall2011","book","Hall, Kenneth R.",2011,"A History of Early Southeast Asia: Maritime Trade and Societal Development, 100–1500","Rowman & Littlefield",
  publisher="Rowman & Littlefield, Lanham MD", isbn="9780742567610")
S("sen2003","book","Sen, Tansen",2003,"Buddhism, Diplomacy, and Trade: The Realignment of Sino-Indian Relations, 600–1400","University of Hawai‘i Press",
  publisher="University of Hawai‘i Press, Honolulu", isbn="0824825934")
S("takakusu1896","primary","I-Tsing (Yijing); Takakusu, Junjirō (trans.)",1896,"A Record of the Buddhist Religion as Practised in India and the Malay Archipelago (A.D. 671–695)","Clarendon Press",
  pr=False, oa=True, publisher="Clarendon Press, Oxford", url="https://archive.org/details/recordofbuddhistr00yijiuoft", note="Primary source: Yijing studied Sanskrit and Buddhism in Srivijaya en route to Nalanda.")
S("miksic2017","book","Miksic, John N.; Goh, Geok Yian",2017,"Ancient Southeast Asia","Routledge",
  publisher="Routledge, London", isbn="9780415735544", note="Archaeology of early cities: Oc Eo, Angkor, Bagan, Trowulan, Srivijaya.")
S("miksic2013","book","Miksic, John N.",2013,"Singapore and the Silk Road of the Sea, 1300–1800","NUS Press",
  publisher="NUS Press, Singapore", isbn="9789971695743")
S("evans2007","journal","Evans, Damian; Pottier, Christophe; Fletcher, Roland; et al.",2007,"A comprehensive archaeological map of the world's largest preindustrial settlement complex at Angkor, Cambodia","Proceedings of the National Academy of Sciences",
  volume="104", issue="36", pages="14277–14282", doi="10.1073/pnas.0702525104", oa=True)
S("kulke2009","book","Kulke, Hermann; Kesavapany, K.; Sakhuja, Vijay (eds)",2009,"Nagapattinam to Suvarnadwipa: Reflections on the Chola Naval Expeditions to Southeast Asia","ISEAS",
  publisher="Institute of Southeast Asian Studies, Singapore", isbn="9789812309372")
S("robson1995","primary","Mpu Prapañca; Robson, Stuart (trans.)",1995,"Deśawarṇana (Nāgarakṛtāgama)","KITLV Press",
  pr=True, publisher="KITLV Press, Leiden", isbn="9067180947", note="1365 court poem describing Majapahit and its claimed tributaries.")
S("degroot2009","book","Degroot, Véronique",2009,"Candi, Space and Landscape: A Study on the Distribution, Orientation and Spatial Organization of Central Javanese Temple Remains","Sidestone Press",
  publisher="Sidestone Press, Leiden", oa=True, isbn="9789088900396", note="Spatial study of Central Javanese temples — relevant for architecture.")

# ---------- Age of commerce, Islam, cities ----------
S("reid1988","book","Reid, Anthony",1988,"Southeast Asia in the Age of Commerce, 1450–1680. Vol. 1: The Lands below the Winds","Yale University Press",
  publisher="Yale University Press, New Haven", isbn="0300039212")
S("reid1993","book","Reid, Anthony",1993,"Southeast Asia in the Age of Commerce, 1450–1680. Vol. 2: Expansion and Crisis","Yale University Press",
  publisher="Yale University Press, New Haven", isbn="0300054122", note="Ch. 2 on cities: estimates for Melaka, Ayutthaya, Aceh, Banten, Makassar, Mataram, Thang-long.")
S("reid1983","book","Reid, Anthony (ed.)",1983,"Slavery, Bondage and Dependency in Southeast Asia","University of Queensland Press",
  publisher="University of Queensland Press, St Lucia", note="Foundational volume; Reid's introduction distinguishes 'closed' and 'open' slave systems.")
S("reid2015","book","Reid, Anthony",2015,"A History of Southeast Asia: Critical Crossroads","Wiley-Blackwell",
  publisher="Wiley-Blackwell, Chichester", isbn="9780631179610")
S("lieberman2003","book","Lieberman, Victor",2003,"Strange Parallels: Southeast Asia in Global Context, c. 800–1830. Vol. 1: Integration on the Mainland","Cambridge University Press",
  publisher="Cambridge University Press, Cambridge", isbn="9780521800860")
S("lieberman2009","book","Lieberman, Victor",2009,"Strange Parallels: Southeast Asia in Global Context, c. 800–1830. Vol. 2: Mainland Mirrors: Europe, Japan, China, South Asia, and the Islands","Cambridge University Press",
  publisher="Cambridge University Press, Cambridge", isbn="9780521823524")
S("ricklefs2008","book","Ricklefs, M. C.",2008,"A History of Modern Indonesia since c. 1200 (4th ed.)","Palgrave Macmillan",
  publisher="Palgrave Macmillan, Basingstoke", isbn="9780230546851")
S("andaya2015","book","Andaya, Barbara Watson; Andaya, Leonard Y.",2015,"A History of Early Modern Southeast Asia, 1400–1830","Cambridge University Press",
  publisher="Cambridge University Press, Cambridge", isbn="9780521889926")
S("andaya2017","book","Andaya, Barbara Watson; Andaya, Leonard Y.",2017,"A History of Malaysia (3rd ed.)","Palgrave",
  publisher="Palgrave, London", isbn="9781137605146")
S("andaya1993","book","Andaya, Leonard Y.",1993,"The World of Maluku: Eastern Indonesia in the Early Modern Period","University of Hawai‘i Press",
  publisher="University of Hawai‘i Press, Honolulu", isbn="0824814908")
S("andaya2008","book","Andaya, Leonard Y.",2008,"Leaves of the Same Tree: Trade and Ethnicity in the Straits of Melaka","University of Hawai‘i Press",
  publisher="University of Hawai‘i Press, Honolulu", isbn="9780824831899", note="Malayu identity, Orang Laut and Orang Asli in the Straits economy.")
S("laffan2011","book","Laffan, Michael",2011,"The Makings of Indonesian Islam: Orientalism and the Narration of a Sufi Past","Princeton University Press",
  publisher="Princeton University Press, Princeton", isbn="9780691145303")
S("cortesao1944","primary","Pires, Tomé; Cortesão, Armando (ed. & trans.)",1944,"The Suma Oriental of Tomé Pires","Hakluyt Society",
  pr=False, oa=True, publisher="Hakluyt Society, London", note="Primary source (written 1512–15) on Melaka and the archipelago at Portuguese arrival.")
S("wade2005","journal","Wade, Geoff",2005,"The Zheng He voyages: a reassessment","Journal of the Malaysian Branch of the Royal Asiatic Society",
  volume="78", issue="1", pages="37–58")
S("cummings2002","book","Cummings, William",2002,"Making Blood White: Historical Transformations in Early Modern Makassar","University of Hawai‘i Press",
  publisher="University of Hawai‘i Press, Honolulu", isbn="0824825136")
S("pelras1996","book","Pelras, Christian",1996,"The Bugis","Blackwell",
  publisher="Blackwell, Oxford", isbn="0631172319")
S("macknight1976","book","Macknight, C. C.",1976,"The Voyage to Marege': Macassan Trepangers in Northern Australia","Melbourne University Press",
  publisher="Melbourne University Press, Carlton")

# ---------- Slavery ----------
S("vink2003","journal","Vink, Markus",2003,"\"The World's Oldest Trade\": Dutch slavery and slave trade in the Indian Ocean in the seventeenth century","Journal of World History",
  volume="14", issue="2", pages="131–177", doi="10.1353/jwh.2003.0026")
S("warren1981","book","Warren, James Francis",1981,"The Sulu Zone, 1768–1898: The Dynamics of External Trade, Slavery, and Ethnicity in the Transformation of a Southeast Asian Maritime State","Singapore University Press",
  publisher="Singapore University Press, Singapore", note="Iranun and Balangingi raiding supplied slaves for the Sulu sultanate's trade with China.")
S("sutherland1983","chapter","Sutherland, Heather",1983,"Slavery and the slave trade in South Sulawesi, 1660s–1800s","Slavery, Bondage and Dependency in Southeast Asia (ed. A. Reid)",
  publisher="University of Queensland Press, St Lucia", pages="263–285")
S("vanderkraan1983","chapter","Van der Kraan, Alfons",1983,"Bali: slavery and slave trade","Slavery, Bondage and Dependency in Southeast Asia (ed. A. Reid)",
  publisher="University of Queensland Press, St Lucia", pages="315–340")
S("needham1983","book","Needham, Rodney",1983,"Sumba and the Slave Trade","Centre of Southeast Asian Studies, Monash University (Working Paper 31)",
  publisher="Monash University, Clayton", note="Ende and Bima raiders, Dutch and Chinese buyers; Sumba as a slave-exporting island into the 19th c.")
S("raben1996","thesis","Raben, Remco",1996,"Batavia and Colombo: The Ethnic and Spatial Order of Two Colonial Cities, 1600–1800","PhD thesis, Leiden University",
  publisher="Leiden University", url="https://hdl.handle.net/1887/37853")
S("bosma2008","book","Bosma, Ulbe; Raben, Remco",2008,"Being \"Dutch\" in the Indies: A History of Creolisation and Empire, 1500–1920","NUS Press / Ohio University Press",
  publisher="NUS Press, Singapore", isbn="9789971693732")
S("loth1995","journal","Loth, Vincent C.",1995,"Pioneers and perkeniers: the Banda Islands in the seventeenth century","Cakalele",
  volume="6", pages="13–35", url="http://hdl.handle.net/10125/4207", oa=True)
S("kaartinen2010","book","Kaartinen, Timo",2010,"Songs of Travel, Stories of Place: Poetics of Absence in an Eastern Indonesian Society","Academia Scientiarum Fennica (FF Communications 299)",
  publisher="Finnish Academy of Science and Letters, Helsinki", note="Banda Eli in the Kei Islands: descendants of Bandanese who fled the 1621 conquest.")

# ---------- Europeans & colonial states ----------
S("subrahmanyam2012","book","Subrahmanyam, Sanjay",2012,"The Portuguese Empire in Asia, 1500–1700: A Political and Economic History (2nd ed.)","Wiley-Blackwell",
  publisher="Wiley-Blackwell, Chichester", isbn="9780470672914")
S("boxer1965","book","Boxer, C. R.",1965,"The Dutch Seaborne Empire, 1600–1800","Hutchinson",
  publisher="Hutchinson, London")
S("gaastra2003","book","Gaastra, Femme S.",2003,"The Dutch East India Company: Expansion and Decline","Walburg Pers",
  publisher="Walburg Pers, Zutphen", isbn="9057302950")
S("tarling1992","book","Tarling, Nicholas (ed.)",1992,"The Cambridge History of Southeast Asia (2 vols)","Cambridge University Press",
  publisher="Cambridge University Press, Cambridge", isbn="0521355052")
S("tarling1962","book","Tarling, Nicholas",1962,"Anglo-Dutch Rivalry in the Malay World, 1780–1824","Cambridge University Press / University of Queensland Press",
  publisher="Cambridge University Press, Cambridge")
S("phelan1959","book","Phelan, John Leddy",1959,"The Hispanization of the Philippines: Spanish Aims and Filipino Responses, 1565–1700","University of Wisconsin Press",
  publisher="University of Wisconsin Press, Madison")
S("flynn1995","journal","Flynn, Dennis O.; Giráldez, Arturo",1995,"Born with a \"silver spoon\": the origin of world trade in 1571","Journal of World History",
  volume="6", issue="2", pages="201–221")
S("andrade2008","book","Andrade, Tonio",2008,"How Taiwan Became Chinese: Dutch, Spanish, and Han Colonization in the Seventeenth Century","Columbia University Press",
  publisher="Columbia University Press, New York", oa=True, url="http://www.gutenberg-e.org/andrade/", isbn="9780231128551")
S("winichakul1994","book","Thongchai Winichakul",1994,"Siam Mapped: A History of the Geo-Body of a Nation","University of Hawai‘i Press",
  publisher="University of Hawai‘i Press, Honolulu", isbn="0824819748", note="How mapping and boundary treaties produced the Siamese 'geo-body' between British and French empires.")
S("baker2009","book","Baker, Chris; Phongpaichit, Pasuk",2009,"A History of Thailand (2nd ed.)","Cambridge University Press",
  publisher="Cambridge University Press, Cambridge", isbn="9780521759151")
S("saunders2002","book","Saunders, Graham",2002,"A History of Brunei (2nd ed.)","RoutledgeCurzon",
  publisher="RoutledgeCurzon, London", isbn="0700716971")
S("hagerdal2012","book","Hägerdal, Hans",2012,"Lords of the Land, Lords of the Sea: Conflict and Adaptation in Early Colonial Timor, 1600–1800","KITLV Press",
  publisher="KITLV Press, Leiden", oa=True, isbn="9789067183789")
S("carey2007","book","Carey, Peter",2007,"The Power of Prophecy: Prince Dipanagara and the End of an Old Order in Java, 1785–1855","KITLV Press",
  publisher="KITLV Press, Leiden", isbn="9789067183031")
S("broome2010","book","Broome, Richard",2010,"Aboriginal Australians: A History since 1788 (4th ed.)","Allen & Unwin",
  publisher="Allen & Unwin, Sydney", isbn="9781742371726")
S("ileto1979","book","Ileto, Reynaldo C.",1979,"Pasyon and Revolution: Popular Movements in the Philippines, 1840–1910","Ateneo de Manila University Press",
  publisher="Ateneo de Manila University Press, Quezon City")

# ---------- Plantations, indenture, mining ----------
S("elson1994","book","Elson, R. E.",1994,"Village Java under the Cultivation System, 1830–1870","Allen & Unwin",
  publisher="Allen & Unwin / ASAA, Sydney", isbn="1863735577")
S("fasseur1992","book","Fasseur, Cornelis",1992,"The Politics of Colonial Exploitation: Java, the Dutch, and the Cultivation System","Cornell Southeast Asia Program",
  publisher="Cornell SEAP, Ithaca", isbn="0877271240")
S("breman1989","book","Breman, Jan",1989,"Taming the Coolie Beast: Plantation Society and the Colonial Order in Southeast Asia","Oxford University Press",
  publisher="Oxford University Press, Delhi", isbn="0195623649", note="Penal sanction (poenale sanctie) and violence on Deli's tobacco estates.")
S("stoler1985","book","Stoler, Ann Laura",1985,"Capitalism and Confrontation in Sumatra's Plantation Belt, 1870–1979","Yale University Press",
  publisher="Yale University Press, New Haven", isbn="0300032803")
S("hoefte1998","book","Hoefte, Rosemarijn",1998,"In Place of Slavery: A Social History of British Indian and Javanese Laborers in Suriname","University Press of Florida",
  publisher="University Press of Florida, Gainesville", isbn="0813015944")
S("sandhu1969","book","Sandhu, Kernial Singh",1969,"Indians in Malaya: Some Aspects of Their Immigration and Settlement (1786–1957)","Cambridge University Press",
  publisher="Cambridge University Press, Cambridge")
S("kaur2004","book","Kaur, Amarjit",2004,"Wage Labour in Southeast Asia since 1840: Globalisation, the International Division of Labour and Labour Transformations","Palgrave Macmillan",
  publisher="Palgrave Macmillan, Basingstoke", isbn="0333729765")
S("heidhues1992","book","Heidhues, Mary F. Somers",1992,"Bangka Tin and Mentok Pepper: Chinese Settlement on an Indonesian Island","ISEAS",
  publisher="Institute of Southeast Asian Studies, Singapore", isbn="9813016426")
S("heidhues2003","book","Heidhues, Mary Somers",2003,"Golddiggers, Farmers, and Traders in the \"Chinese Districts\" of West Kalimantan, Indonesia","Cornell Southeast Asia Program",
  publisher="Cornell SEAP, Ithaca", isbn="0877277338", note="The kongsi gold-mining federations of West Borneo, 18th–19th c.")
S("wong1965","book","Wong, Lin Ken",1965,"The Malayan Tin Industry to 1914","University of Arizona Press",
  publisher="University of Arizona Press, Tucson")
S("unesco2019","web","UNESCO World Heritage Centre",2019,"Ombilin Coal Mining Heritage of Sawahlunto (inscription 1610)","UNESCO World Heritage List",
  pr=False, oa=True, url="https://whc.unesco.org/en/list/1610/")
S("leith2003","book","Leith, Denise",2003,"The Politics of Power: Freeport in Suharto's Indonesia","University of Hawai‘i Press",
  publisher="University of Hawai‘i Press, Honolulu", isbn="0824825667")
S("sato1994","book","Sato, Shigeru",1994,"War, Nationalism and Peasants: Java under the Japanese Occupation, 1942–1945","M. E. Sharpe",
  publisher="M. E. Sharpe, Armonk NY", isbn="1563243333", note="Romusha forced labour mobilisation.")

# ---------- Nationalism, independence, 20th c. ----------
S("anderson1983","book","Anderson, Benedict",1983,"Imagined Communities: Reflections on the Origin and Spread of Nationalism","Verso",
  publisher="Verso, London")
S("kahin1952","book","Kahin, George McTurnan",1952,"Nationalism and Revolution in Indonesia","Cornell University Press",
  publisher="Cornell University Press, Ithaca")
S("reid1974","book","Reid, Anthony",1974,"The Indonesian National Revolution, 1945–1950","Longman",
  publisher="Longman, Hawthorn, Vic.")
S("elson2008","book","Elson, R. E.",2008,"The Idea of Indonesia: A History","Cambridge University Press",
  publisher="Cambridge University Press, Cambridge", isbn="9780521876483")
S("harper1999","book","Harper, T. N.",1999,"The End of Empire and the Making of Malaya","Cambridge University Press",
  publisher="Cambridge University Press, Cambridge", isbn="0521591554")
S("mackie1974","book","Mackie, J. A. C.",1974,"Konfrontasi: The Indonesia–Malaysia Dispute, 1963–1966","Oxford University Press",
  publisher="Oxford University Press, Kuala Lumpur")
S("robinson2018","book","Robinson, Geoffrey B.",2018,"The Killing Season: A History of the Indonesian Massacres, 1965–66","Princeton University Press",
  publisher="Princeton University Press, Princeton", isbn="9780691161389")
S("drooglever2009","book","Drooglever, Pieter",2009,"An Act of Free Choice: Decolonisation and the Right to Self-Determination in West Papua","Oneworld",
  publisher="Oneworld, Oxford", isbn="9781851687152")
S("chauvel2005","book","Chauvel, Richard",2005,"Constructing Papuan Nationalism: History, Ethnicity, and Adaptation","East-West Center Washington (Policy Studies 14)",
  publisher="East-West Center, Washington DC", oa=True, url="https://www.eastwestcenter.org/publications/constructing-papuan-nationalism-history-ethnicity-and-adaptation")
S("aspinall2009","book","Aspinall, Edward",2009,"Islam and Nation: Separatist Rebellion in Aceh, Indonesia","Stanford University Press",
  publisher="Stanford University Press, Stanford", isbn="9780804760447")
S("reid2005","book","Reid, Anthony",2005,"An Indonesian Frontier: Acehnese and Other Histories of Sumatra","Singapore University Press",
  publisher="Singapore University Press, Singapore", isbn="9971692988")
S("cavr2005","primary","Commission for Reception, Truth and Reconciliation in East Timor (CAVR)",2005,"Chega! Final Report of the Commission for Reception, Truth and Reconciliation in Timor-Leste","CAVR",
  pr=False, oa=True, url="https://chegareport.org/")
S("fearnside1997","journal","Fearnside, Philip M.",1997,"Transmigration in Indonesia: lessons from its environmental and social impacts","Environmental Management",
  volume="21", issue="4", pages="553–570", doi="10.1007/s002679900049")
S("hardjono1977","book","Hardjono, J. M.",1977,"Transmigration in Indonesia","Oxford University Press",
  publisher="Oxford University Press, Kuala Lumpur")
S("margono2014","journal","Margono, Belinda Arunarwati; Potapov, Peter V.; Turubanova, Svetlana; Stolle, Fred; Hansen, Matthew C.",2014,"Primary forest cover loss in Indonesia over 2000–2012","Nature Climate Change",
  volume="4", pages="730–735", doi="10.1038/nclimate2277")
S("gaveau2016","journal","Gaveau, David L. A.; Sheil, Douglas; Husnayaen; et al.",2016,"Rapid conversions and avoided deforestation: examining four decades of industrial plantation expansion in Borneo","Scientific Reports",
  volume="6", pages="32017", doi="10.1038/srep32017", oa=True)
S("ricklefs1993","note","—",0,"","",pr=False)  # placeholder removed below

# ---------- Indigeneity, adat, land ----------
S("li2000","journal","Li, Tania Murray",2000,"Articulating indigenous identity in Indonesia: resource politics and the tribal slot","Comparative Studies in Society and History",
  volume="42", issue="1", pages="149–179", doi="10.1017/S0010417500002632")
S("li2007","book","Li, Tania Murray",2007,"The Will to Improve: Governmentality, Development, and the Practice of Politics","Duke University Press",
  publisher="Duke University Press, Durham NC", isbn="9780822340270")
S("li2014","book","Li, Tania Murray",2014,"Land's End: Capitalist Relations on an Indigenous Frontier","Duke University Press",
  publisher="Duke University Press, Durham NC", isbn="9780822357056")
S("li2021","book","Li, Tania Murray; Semedi, Pujo",2021,"Plantation Life: Corporate Occupation in Indonesia's Oil Palm Zone","Duke University Press",
  publisher="Duke University Press, Durham NC", isbn="9781478014409")
S("henley2007","book","Davidson, Jamie S.; Henley, David (eds)",2007,"The Revival of Tradition in Indonesian Politics: The Deployment of Adat from Colonialism to Indigenism","Routledge",
  publisher="Routledge, London", isbn="9780415437386")
S("burns2004","book","Burns, Peter",2004,"The Leiden Legacy: Concepts of Law in Indonesia","KITLV Press",
  publisher="KITLV Press, Leiden", isbn="9067182281", note="Van Vollenhoven's adat-law school and its colonial uses.")
S("butt2014","journal","Butt, Simon",2014,"Traditional land rights before the Indonesian Constitutional Court","Law, Environment and Development Journal",
  volume="10", issue="1", pages="57–73", oa=True, url="https://lead-journal.org/content/14057.pdf")
S("mk2012","legal","Mahkamah Konstitusi Republik Indonesia",2013,"Putusan Nomor 35/PUU-X/2012 (customary forest is not state forest)","Constitutional Court of Indonesia",
  pr=False, oa=True, url="https://www.mkri.id/", note="Decision read 16 May 2013.")
S("nicholas2000","book","Nicholas, Colin",2000,"The Orang Asli and the Contest for Resources: Indigenous Politics, Development and Identity in Peninsular Malaysia","IWGIA / COAC",
  publisher="IWGIA, Copenhagen", oa=True)
S("leary1995","book","Leary, John D.",1995,"Violence and the Dream People: The Orang Asli in the Malayan Emergency, 1948–1960","Ohio University Center for International Studies",
  publisher="Ohio University CIS, Athens OH", isbn="0896801861")
S("sager2008","thesis","Sager, Steven",2008,"The Sky is our Roof, the Earth our Floor: Orang Rimba Customs and Religion in the Bukit Duabelas Region of Jambi, Sumatra","PhD thesis, Australian National University",
  publisher="ANU, Canberra", oa=True, url="https://openresearch-repository.anu.edu.au/handle/1885/49345", note="Ethnography of the Orang Rimba of Bukit Duabelas.")
S("king1993","book","King, Victor T.",1993,"The Peoples of Borneo","Blackwell",
  publisher="Blackwell, Oxford", isbn="0631172289")
S("hoskins1993","book","Hoskins, Janet",1993,"The Play of Time: Kodi Perspectives on Calendars, History, and Exchange","University of California Press",
  publisher="University of California Press, Berkeley", oa=True, url="https://publishing.cdlib.org/ucpressebooks/view?docId=ft4199n900", isbn="0520080068")
S("keane1997","book","Keane, Webb",1997,"Signs of Recognition: Powers and Hazards of Representation in an Indonesian Society","University of California Press",
  publisher="University of California Press, Berkeley", isbn="0520204751", note="Anakalang, Sumba.")
S("vel2008","book","Vel, Jacqueline",2008,"Uma Politics: An Ethnography of Democratization in West Sumba, Indonesia, 1986–2006","KITLV Press",
  publisher="KITLV Press, Leiden", oa=True, isbn="9789067183253")
S("dobbin1983","book","Dobbin, Christine",1983,"Islamic Revivalism in a Changing Peasant Economy: Central Sumatra, 1784–1847","Curzon Press",
  publisher="Curzon Press, London", isbn="0700701559")
S("kahn1993","book","Kahn, Joel S.",1993,"Constituting the Minangkabau: Peasants, Culture, and Modernity in Colonial Indonesia","Berg",
  publisher="Berg, Providence RI", isbn="0854968792")
S("kirksey2012","book","Kirksey, Eben",2012,"Freedom in Entangled Worlds: West Papua and the Architecture of Global Power","Duke University Press",
  publisher="Duke University Press, Durham NC", isbn="9780822351337")
S("schulte2010","book","Schulte Nordholt, Henk; van Klinken, Gerry (eds)",2007,"Renegotiating Boundaries: Local Politics in Post-Suharto Indonesia","KITLV Press",
  publisher="KITLV Press, Leiden", oa=True, isbn="9789067182836")
S("aman1999","web","Aliansi Masyarakat Adat Nusantara (AMAN)",1999,"About AMAN — founding at the Kongres Masyarakat Adat Nusantara, Jakarta, March 1999","AMAN",
  pr=False, oa=True, url="https://aman.or.id/")
S("vickers2013","book","Vickers, Adrian",2013,"A History of Modern Indonesia (2nd ed.)","Cambridge University Press",
  publisher="Cambridge University Press, Cambridge", isbn="9781107624450")
S("vickers1989","book","Vickers, Adrian",1989,"Bali: A Paradise Created","Periplus",
  publisher="Periplus, Ringwood Vic.", isbn="0945971281", note="Colonial and tourist construction of 'Bali'; puputan of 1906/1908.")
S("picard1996","book","Picard, Michel",1996,"Bali: Cultural Tourism and Touristic Culture","Archipelago Press",
  publisher="Archipelago Press, Singapore", isbn="9813018941")
S("glottolog2026","dataset","Hammarström, Harald; Forkel, Robert; Haspelmath, Martin; Bank, Sebastian",2026,"Glottolog 5.4","Max Planck Institute for Evolutionary Anthropology",
  pr=True, oa=True, url="https://glottolog.org", note="Language locations and classification used for the language-territory layer (CC-BY-4.0).")
S("wiki-langmap","web","Wikipedia contributors",2026,"Languages of Indonesia (incl. the ethnolinguistic map of Indonesia)","Wikipedia",
  pr=False, oa=True, url="https://en.wikipedia.org/wiki/Languages_of_Indonesia", note="Cross-check for ethnolinguistic locations; not a scholarly authority.")
S("naturalearth","dataset","Natural Earth",2024,"Admin 0 – Countries and Rivers, 1:50m (v5.1)","naturalearthdata.com",
  pr=False, oa=True, url="https://www.naturalearthdata.com/", note="Public-domain coastlines and borders; base of the procedural hex map.")

S("thurgood1999","book","Thurgood, Graham",1999,"From Ancient Cham to Modern Dialects: Two Thousand Years of Language Contact and Change","University of Hawai‘i Press (Oceanic Linguistics Special Publication 28)",
  publisher="University of Hawai‘i Press, Honolulu", isbn="0824821319", note="Chamic history; Acehnese as a Chamic language that moved to Sumatra.")
S("ginting2013","journal","Ginting, Longgena; Pye, Oliver",2013,"Resisting agribusiness development: the Merauke Integrated Food and Energy Estate in West Papua, Indonesia","Austrian Journal of South-East Asian Studies (ASEAS)",
  volume="6", issue="1", pages="160–182", oa=True)
S("endicott1983","chapter","Endicott, Kirk",1983,"The effects of slave raiding on the aborigines of the Malay Peninsula","Slavery, Bondage and Dependency in Southeast Asia (ed. A. Reid)",
  publisher="University of Queensland Press, St Lucia", pages="216–245")
S("larena2021b","journal","Larena, Maximilian; McKenna, James; Sanchez-Quinto, Federico; et al.",2021,"Philippine Ayta possess the highest level of Denisovan ancestry in the world","Current Biology",
  volume="31", issue="19", pages="4219–4230.e10", doi="10.1016/j.cub.2021.07.022", oa=True)
S("ananta2014","journal","Ananta, Aris; Arifin, Evi Nurvidya; Hasbullah, M. Sairi; Handayani, Nur Budi; Pramono, Agus",2014,"A New Classification of Indonesia's Ethnic Groups (Based on the 2010 Population Census)","ISEAS Working Paper No. 1",
  pr=False, oa=True, publisher="Institute of Southeast Asian Studies, Singapore", url="https://www.iseas.edu.sg", library="mendeley", note="Source of the 633 ethnic groups (1,331 census codes regrouped). Working paper; expanded in Ananta et al. 2015, Demography of Indonesia's Ethnicity (ISEAS).")
S("kartapranata-map","web","Kartapranata, Gunawan",2020,"Peta Suku Bangsa, Bahasa, dan Aksara di Indonesia (map, SVG)","Wikimedia Commons",
  pr=False, oa=True, url="https://commons.wikimedia.org/wiki/File:Peta_Suku_Bangsa,_Bahasa,_dan_Aksara_di_Indonesia.svg", note="Ethnolinguistic map of Indonesia; georeferenced here (rms ≈0.22°) and used as an overlay and to locate ethnic groups. Year approximate; see Commons page for licence.")
SRC[:] = [s for s in SRC if s["id"]!="ricklefs1993"]
ids=[s["id"] for s in SRC]; assert len(ids)==len(set(ids)), "dup"
json.dump(SRC, open("/home/claude/vih/data/sources.json","w"), ensure_ascii=False, indent=1)
print(len(SRC), "sources")
