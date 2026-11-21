---
id: sumba
title: "Sandalwood Island"
subtitle: "Sumba through time, c. 1500–2018"
author: "Ejak (Reza Arlianda), with Claude"
date: 2026-11-21
region: [[-10.6, 118.8], [-9.0, 121.2]]
basemap: relief
geo: [sumba-kab, sumba-kec, indonesia-prov]
cover: "One island, five centuries of being claimed, bought, taxed and converted."
---
This story follows one island from the age of sandalwood to the sugarcane permits of the 2010s. Each slide rests on sources from Ejak's library, and the arrows show movement: captives, goods, soldiers, settlers and missionaries. Where authors disagree on a date or a fact, the slide says so. Sumbanese voices mostly reach us through the people who wrote about them, and the earliest centuries rest on very few authors. Modern district boundaries are used only as rough stand-ins for older domains.

## c. 1500–1650 · Sandalwood Island
```yaml
year: [1500, 1650]
camera: [-9.2, 119.6, 7]
areas:
  - { ref: sumba-kec:Kodi, role: focus, label: "Makassarese and Bugis settlers (Soelarto)" }
places:
  - { name: Kodi, at: [-9.56, 119.03], kind: port, note: "Traders from Sulawesi settled here, per Soelarto (approximate)" }
  - { name: Makassar, at: [-5.14, 119.42], kind: city, note: "Home port of many visiting traders" }
flows:
  - { kind: trade, from: [119.03, -9.56], to: [119.42, -5.14], via: [[118.95, -9.2], [119.25, -8.4], [119.2, -7.0]], label: "Sandalwood, cloth, livestock (Soelarto)", weight: 2 }
sources:
  - hoskins1996: "p. 221"
  - soelarto1980: "p. 28"
  - pietrow2024: "p. 23"
```
Hoskins reports that Sumba earned the name Sandalwood Island in the sixteenth and seventeenth centuries, and that its scented forests were soon used up. The cleared hills became pasture for small, hardy horses, traded with textiles and food for foreign cloth, porcelain, gold and metal. Soelarto adds that traders from Makassar and Bugis lands came for wood, cloth and livestock. Pietrow finds the VOC still preferred Timor's sandalwood, since Sumba's grew high in the mountains.

## 1667–1680 · After Makassar fell
```yaml
year: [1667, 1680]
camera: [-7.6, 114.0, 5]
areas: []
places:
  - { name: Makassar, at: [-5.14, 119.42], kind: city, note: "Conquered by the Company and its allies, 1667-69" }
  - { name: Batavia, at: [-6.13, 106.81], kind: city, note: "Slave market of the Company" }
  - { name: Bima, at: [-8.46, 118.73], kind: kingdom, note: "Sultanate, formerly a vassal of Makassar" }
  - { name: Ende, at: [-8.84, 121.66], kind: port, note: "Home port of raiders named in a 1645 letter" }
flows:
  - { kind: slave, from: [119.42, -5.14], to: [106.81, -6.13], via: [[117.0, -5.8], [112.5, -5.8], [108.5, -5.6]], label: "Captives from Makassar to Batavia", weight: 4 }
  - { kind: slave, from: [118.73, -8.46], to: [106.81, -6.13], via: [[118.4, -7.8], [116.0, -7.9], [113.5, -6.4], [109.5, -5.8]], label: "Slaves from Sumbawa and Bima to Batavia", weight: 1 }
  - { kind: military, from: [121.66, -8.84], to: [120.3, -9.55], via: [[121.0, -9.2]], label: "Endenese raid on Sumba (1645 letter)", weight: 1 }
sources:
  - raben2008: "p. 127"
  - pietrow2024: "pp. 24-25"
```
Raben shows that the Company's conquest of Makassar in 1667 to 1669 enslaved many people and pulled Batavia into Makassar's trading network, including slaves shipped from Sumbawa and Bima. Pietrow adds Sumba-specific traces from VOC letters. A 1645 letter documents an Endenese raid on Sumba, which he reads as probably not the only one, and in 1680 the ship Negombo went to Sumba to buy captives. Sumba itself sent no recorded shipments to Batavia in these sources.

## 1674–1677 · Tribute, powder and a fleet
```yaml
year: [1674, 1677]
evidence: contested
camera: [-8.9, 119.3, 7]
areas:
  - { ref: sumba-kec:Mamboro, role: contested, label: "Villagers reportedly submitted to Bima (Pietrow)" }
places:
  - { name: Bima, at: [-8.46, 118.73], kind: kingdom, note: "Sultanate claiming Sumba" }
  - { name: Mamboro, at: [-9.48, 119.7], kind: village, note: "Residents hailed the Company ships, 1677 (approximate)" }
flows:
  - { kind: trade, from: [109.5, -5.8], to: [118.73, -8.46], via: [[113.5, -6.4], [116.0, -7.9], [118.4, -7.8]], label: "Gunpowder, lead and iron bought in Batavia", weight: 1 }
  - { kind: military, from: [118.73, -8.46], to: [119.8, -9.3], via: [[118.95, -8.3], [119.28, -8.5], [119.6, -9.0]], label: "Bimanese and Company fleets, April 1677", weight: 3 }
sources:
  - pietrow2024: "pp. 31-32, 40-45"
  - raben2008: "p. 127"
```
Pietrow reads VOC letters showing that Sumbanese refused Bima's tribute and that the Company knew of the rebellion by 1674. Bima's envoy sold captives and sappanwood in Batavia and returned with powder and nine vessels. In April 1677 Bimanese and Company ships sailed for Sumba. The sources disagree on the outcome: some villages submitted, another account has an ambush and a shameful Bimanese retreat.

> More
By 1686 a VOC letter doubted that Bima had ever mastered Sumba, and in the 1690s the Company explored the island on its own terms while the Portuguese competed in the east. Pietrow also reports a 1726 record recognising the Portuguese as overlords of eastern Sumba. Bima's wider chronicle claims over Savu, Manggarai, Solor and Rote are probably exaggerated, he argues, while those over Sumba and Manggarai have more evidence behind them.

## 1750–1759 · Surveying an island of slaves
```yaml
year: [1750, 1759]
evidence: primary
camera: [-9.4, 121.0, 6]
areas: []
places:
  - { name: Kupang, at: [-10.16, 123.6], kind: fort, note: "Company post on Timor, whose chief ordered the 1757 survey" }
  - { name: Lewa, at: [-9.72, 120.05], kind: village, note: "Ruler handed fifty-five slaves to Makassarese raiders, 1758 (approximate)" }
  - { name: Batavia, at: [-6.13, 106.81], kind: city, note: "Main destination of the Timor-linked slave trade" }
flows:
  - { kind: colonial, from: [123.6, -10.16], to: [120.26, -9.65], via: [[122.5, -9.9], [121.3, -9.8]], label: "1750 expedition and 1757 survey order", weight: 1 }
  - { kind: slave, from: [120.26, -9.65], to: [123.6, -10.16], via: [[121.3, -9.8], [122.5, -10.0]], label: "Captives bought on Sumba for the Timor trade", weight: 2 }
  - { kind: slave, from: [123.6, -10.16], to: [106.81, -6.13], via: [[122.5, -9.9], [121.3, -9.3], [120.2, -9.0], [119.3, -8.5], [118.4, -7.8], [116.0, -7.9], [113.5, -6.4]], label: "Onward to Batavia (Raben)", weight: 2 }
sources:
  - leupe1879: "pp. 224-231"
  - raben2008: "p. 130"
  - hoskins2002: "p. 800"
```
Raben says many slaves for the booming Timor trade were bought on Sumba, Ende and Solor. In 1757 the Council of the Indies ordered a survey of Sumba. The 1759 report, edited by Leupe, treats the island mainly as a source of slaves and sandalwood, and its surveyor Erasmusz saw no profit until the constant wars ended. It also records that in 1758 the ruler of Lewa gave Makassarese raiders fifty-five slaves. Hoskins dates the Company's treaty mission to 1750.

## 1775–1830s · Fleets from Makassar, a monopoly from Ende
```yaml
year: [1775, 1838]
camera: [-8.3, 120.3, 6]
areas: []
places:
  - { name: Ende, at: [-8.84, 121.66], kind: port, note: "Raiders' home port" }
  - { name: Makassar, at: [-5.14, 119.42], kind: city, note: "Slavers sailed from here" }
flows:
  - { kind: slave, from: [120.0, -9.45], to: [121.66, -8.84], via: [[120.8, -9.2]], label: "Captives sold to Ende traders", weight: 3 }
  - { kind: slave, from: [119.6, -9.5], to: [119.42, -5.14], via: [[119.3, -9.1], [119.25, -8.4], [119.2, -7.0]], label: "Captives carried to Makassar", weight: 2 }
sources:
  - bosma2020: "pp. 111, 113"
  - pietrow2024: "p. 25"
  - vel2019: "p. 443"
```
Pietrow reports that by 1775 Makassarese slavers arrived every year with over thirty ships, and that Endenese raiders later held a monopoly. Bosma places this in a wider surge of slave raiding across the archipelago from the 1780s to the 1860s. Vel and Makambombu, drawing on a 1913 missionary, add that Sumbanese leaders raided other domains and bartered captives for rice or gunpowder with traders from Ende and Makassar.

## 19th century · Hired swords and captives marched inland
```yaml
year: [1800, 1880]
camera: [-9.6, 119.9, 8]
areas:
  - { ref: sumba-kec:Lewa, role: focus, label: "Domain of Umbu Tunggu" }
places:
  - { name: Lewa, at: [-9.72, 120.05], kind: kingdom, note: "East Sumba domain that hired Endenese soldiers (approximate)" }
  - { name: Wewewa, at: [-9.52, 119.28], kind: village, note: "West Sumba, where Endenese bands raided on their own (approximate)" }
flows:
  - { kind: military, from: [121.66, -8.84], to: [120.05, -9.72], via: [[121.0, -9.2], [120.3, -9.55]], label: "Endenese mercenaries hired by eastern rajas", weight: 2 }
  - { kind: slave, from: [119.2, -9.5], to: [120.0, -9.75], label: "Captives sold overland to central and east Sumba", weight: 1 }
sources:
  - hoskins1996: "pp. 233-234"
  - kuipers1998: "p. 31"
```
Hoskins, citing Needham, says eastern rajas hired Makassarese-Endenese fighters, and Umbu Tunggu of Lewa paid the most of them with slaves and plunder, while his monopoly on muskets kept him in power. In the west the Endenese found no strong ruler, so bands raided alone and sold captives overland to work land in central and east Sumba. Kuipers adds that as the Dutch gained control of the waters, the raiders pushed deeper inland.

## 1838–1845 · A wreck, a broker and a contract
```yaml
year: [1838, 1845]
camera: [-9.4, 121.5, 6]
areas: []
places:
  - { name: Waingapu, at: [-9.65, 120.26], kind: port, note: "Grew from the broker's settlement, 1843" }
  - { name: Kupang, at: [-10.16, 123.6], kind: city, note: "Seat of the Resident" }
flows:
  - { kind: colonial, from: [106.81, -6.13], to: [123.6, -10.16], via: [[109.5, -5.8], [113.5, -6.4], [116.0, -7.9], [118.4, -7.8], [119.3, -8.5], [120.2, -9.0], [121.3, -9.4], [122.5, -9.9]], label: "Batavia orders an inquiry, 1838", weight: 1 }
  - { kind: colonial, from: [123.6, -10.16], to: [120.26, -9.65], via: [[122.5, -9.9], [121.3, -9.8]], label: "Staffer settles at Waingapu, 1843", weight: 2 }
sources:
  - vel2008: "pp. 30-31"
  - hoskins1996: "p. 221"
  - soelarto1980: "p. 30"
```
After a British ship was wrecked and plundered off Sumba in 1838, Batavia told the Resident at Kupang to find out how the island could be made safe. Vel says he sent Sjarif Abdoelrachman, who settled in 1843, taxed horse exports and founded what became Waingapu. Soelarto instead calls him an Arab trader from Makassar. In 1845, from the government's view, some rajas signed a contract limiting their dealings with outsiders.

## c. 1850–1860 · Abolition on paper, Savunese on the coast
```yaml
year: [1850, 1860]
camera: [-9.9, 120.7, 8]
areas: []
places:
  - { name: Savu, at: [-10.49, 121.84], kind: village, note: "Island the settlers came from (approximate)" }
  - { name: Waingapu, at: [-9.65, 120.26], kind: port, note: "Settled by Makassarese and Endenese by this time" }
flows:
  - { kind: migration, from: [121.84, -10.49], to: [120.26, -9.65], via: [[121.4, -10.0], [120.9, -9.7], [120.5, -9.55]], label: "400 Savunese moved to Sumba, 1860", weight: 1 }
  - { kind: slave, from: [120.0, -9.45], to: [115.2, -8.8], via: [[118.4, -9.2], [116.9, -9.3], [115.6, -9.0]], label: "Captives shipped to Bali and east Lombok", weight: 2 }
sources:
  - vel2008: "p. 32"
  - bosma2020: "pp. 111, 113, 117"
  - hoskins2002: "p. 800"
```
Bosma lists Sumba among places still selling thousands of slaves yearly, and notes that Dutch patrols targeted slave transports between Sumba and Bali and east Lombok. Slavery was banned across the Indies only in 1860. Vel reports that the same year two rajas asked the government to move four hundred Savunese to Sumba as defenders against Endenese raiders. Nooteboom places Savunese settlement earlier, around 1850.

## 1866–1881 · First official, first schools
```yaml
year: [1866, 1881]
camera: [-9.7, 120.1, 8]
areas: []
places:
  - { name: Kambaniru, at: [-9.69, 120.3], kind: mission, note: "Seat of the first controleur (approximate)" }
  - { name: Lewa, at: [-9.72, 120.05], kind: kingdom, note: "Tarandalu resisted until 1892 (approximate)" }
  - { name: Loura, at: [-9.52, 119.17], kind: mission, note: "Jesuit church and school, 1866, per Soelarto (approximate)" }
flows:
  - { kind: mission, from: [121.84, -10.49], to: [120.3, -9.69], via: [[121.4, -10.0], [120.9, -9.7], [120.5, -9.55]], label: "Savunese Christians found congregations", weight: 1 }
sources:
  - vel2008: "pp. 31-32"
  - kuipers1998: "p. 31"
  - soeriadiredja2013: "p. 66"
  - soelarto1980: "pp. 30-32"
```
Vel names S. Roos as the first government official in 1866, told to collect horses for plundered wrecks, learn local adat and prevent slave trading. Kuipers sees this as the start of orderly Dutch administration. The first Christians were Savunese settlers. Vel dates the first Dutch missionary, Van Alphen, to September 1881, working mostly with Savunese. Soeriadiredja dates a mission school at Kambaniru to 1875, Soelarto a Jesuit school at Loura to 1866.

## 1877–1892 · Last deportations, first rajas
```yaml
year: [1877, 1892]
camera: [-9.9, 120.9, 7]
areas:
  - { ref: sumba-kec:Kambera, role: claim, label: "Claimed by the raja of Lewa" }
places:
  - { name: Rindi, at: [-9.95, 120.7], kind: kingdom, note: "Skull tree drawn by a missionary, 1892 (approximate)" }
  - { name: Anakalang, at: [-9.6, 119.6], kind: kingdom, note: "First Dutch-recognised raja, 1880, per Vel (approximate)" }
flows:
  - { kind: slave, from: [120.0, -9.45], to: [115.2, -8.8], via: [[118.4, -9.2], [116.9, -9.3], [115.6, -9.0]], label: "About 500 deported in 1877", weight: 2 }
  - { kind: colonial, from: [120.26, -9.65], to: [123.6, -10.16], via: [[120.9, -9.7], [121.4, -10.0], [122.5, -10.0]], label: "Broker summoned to Kupang, 1877", weight: 1 }
  - { kind: military, from: [120.05, -9.72], to: [120.45, -9.85], label: "Lewa's conquest of Kambera (Hoskins)", weight: 2 }
sources:
  - bosma2020: "pp. 113, 123"
  - vel2008: "pp. 31, 43"
  - hoskins1996: "pp. 220, 235"
  - keane1995: "p. 296"
```
Bosma reports that about five hundred people were still deported from Sumba in 1877 and Endenese trafficking was seen in 1886. Vel says the broker Sjarif was called to Kupang in 1877 and died soon after, and that the Dutch installed the first raja of Anakalang in 1880. Hoskins describes the raja of Lewa claiming Kambera by conquest, and a missionary's 1892 sketch of sixteen heads at Rindi. Keane notes a brief Catholic mission in the west, 1885 to 1893.

## 1901–1912 · The pacification campaign
```yaml
year: [1901, 1912]
camera: [-9.7, 120.6, 7]
areas:
  - { ref: sumba-kec:Lewa, role: contested, label: "Raja of Lewa-Kambera" }
places:
  - { name: Waingapu, at: [-9.65, 120.26], kind: port, note: "Rumoured target of attack, 1901" }
  - { name: Kupang, at: [-10.16, 123.6], kind: fort, note: "Garrison base" }
flows:
  - { kind: military, from: [123.6, -10.16], to: [120.26, -9.65], via: [[122.5, -10.0], [121.4, -10.0], [120.9, -9.7]], label: "Reinforcements by ship, August 1901", weight: 3 }
sources:
  - vel2008: "pp. 31-32"
  - soelarto1980: "p. 32"
  - keane1995: "p. 295"
  - kuipers1998: "p. 31"
evidence: contested
```
Vel traces the end of Dutch non-interference to 1901, when a rumour said the raja of Lewa-Kambera would seize Waingapu. The government answered with a violent campaign, completed in 1912, which freed slaves, banned warfare, seized firearms, imposed forced labour and levied taxes. Soelarto says reinforcements came from Kupang by ship. Keane and Kuipers date the pacification from 1906 instead, so even its starting point is disputed.

## 1905–1913 · West Sumba fights back
```yaml
year: [1905, 1913]
camera: [-9.6, 119.2, 9]
areas:
  - { ref: sumba-kec:Kodi, role: focus }
  - { ref: sumba-kec:Lamboya, role: focus }
places:
  - { name: Bongu (Kodi), at: [-9.6, 119.06], kind: battle, note: "Home clan of Wona Kaka (approximate)" }
  - { name: Wewewa, at: [-9.52, 119.28], kind: battle, note: "Post and tax office destroyed, 1909 (approximate)" }
  - { name: Lamboya, at: [-9.704, 119.344], kind: battle, note: "Lt de Neeve killed, 1909 (approximate)" }
flows: []
sources:
  - hoskins1996: "pp. 239-240"
  - awa2021: "p. 39"
  - soelarto1980: "pp. 33-34"
evidence: contested
```
The west resisted. Hoskins writes that Wona Kaka, of the headhunting clan of Bongu in Kodi, killed Dutch soldiers around 1911 and drew the whole region into a three-year guerrilla war. Rebels surrendered in 1913 and were exiled. Soelarto adds risings at Wewewa and Lamboya in 1909 and dates Wona Kaka's arrest to 1912. Awa and Suana claim a Kodi victory in 1913, and accounts give 1905, 1908, 1910 or 1911 as the start.

## 1913–1930 · A pacified island, divided churches
```yaml
year: [1913, 1930]
camera: [-9.7, 120.0, 8]
areas: []
places:
  - { name: Rindi, at: [-9.95, 120.7], kind: kingdom, note: "Hilltop village abandoned; kingdom confirmed 1918 (approximate)" }
  - { name: Waingapu, at: [-9.65, 120.26], kind: city, note: "Government centre" }
flows: []
sources:
  - hoskins1996: "pp. 219, 241"
  - vel2008: "pp. 37, 178"
  - keane1995: "p. 296"
  - forth1981: "p. 46"
```
Hoskins says Dutch control was effective by around 1915, and the idiom of headhunting was reused for welcomes, alliances and nationalism. Forth describes hilltop villages such as Rindi gradually abandoned for lower sites. Vel notes that in 1913 the Flores-Sumba Contract gave Sumba to the Protestants and Flores to the Catholics, while Keane says Catholics gained an exception in 1929. Vel dates colonial administration from 1912.

## 1942–1950 · Japanese, NICA and a Sumbanese state
```yaml
year: [1942, 1950]
camera: [-9.55, 119.6, 9]
areas: []
places:
  - { name: Waikabubak, at: [-9.64, 119.41], kind: city, note: "Site of a 1946 meeting with local heads" }
  - { name: Mamboro, at: [-9.48, 119.7], kind: kingdom, note: "Raja headed Sumba's state in the federation, per Soelarto (approximate)" }
flows: []
sources:
  - hoskins2002: "p. 801"
  - onvlee1973: "pp. 118-119"
  - vel2008: "p. 179"
  - soelarto1980: "p. 36"
evidence: contested
```
Hoskins says the Japanese displaced the Dutch in 1942 and are remembered as especially brutal. Soelarto notes that the returning Dutch civil administration held Sumba from November 1945 to November 1946. Onvlee describes a meeting in Waikabubak in 1946 announcing a democratic order, and Soelarto says Sumba became a state in East Indonesia under the Raja of Mamboro. Vel dates Sumba's joining to 1945 and says the federation ended in 1950.

## 1946–1962 · Church, schools and a Sumbanese regent
```yaml
year: [1946, 1962]
camera: [-9.7, 119.5, 9]
areas:
  - { ref: sumba-kec:Wanokaka, role: focus }
places:
  - { name: Anakalang, at: [-9.6, 119.6], kind: mission, note: "Only 180 baptised members in 1946, per Keane (approximate)" }
  - { name: Wanokaka, at: [-9.73, 119.48], kind: village, note: "Christians left hilltop villages (approximate)" }
flows: []
sources:
  - keane1995: "p. 296"
  - vel2008: "pp. 34, 189"
  - mross2000: "p. 262"
  - soeriadiredja2013: "p. 66"
```
Vel says indirect rule continued after independence, with local nobles under the national government and the missions leading education and health. Keane reports Anakalang had only 180 baptised members by 1946, when the Sumbanese Christian Church was founded. Soeriadiredja dates that founding to 1947. Keane says the dead raja's son became West Sumba's first regent, while Vel dates the election to 1962. Mross notes Christians in Wanokaka leaving hilltop settlements.

## 1965–1986 · The killings and the registered religion
```yaml
year: [1965, 1986]
camera: [-9.65, 119.55, 9]
areas: []
places:
  - { name: Anakalang, at: [-9.6, 119.6], kind: mission, note: "Church growth after 1965 studied by Keane (approximate)" }
  - { name: Waikabubak, at: [-9.64, 119.41], kind: city, note: "West Sumba's regency town" }
flows: []
sources:
  - vel2008: "pp. 34, 39"
  - keane1995: "p. 296"
  - kamuri2020: "p. 91"
```
Vel writes that from 1965 Sumba experienced rule by a bureaucracy directed from Jakarta, with schools, roads and electricity, and a rule that people belong to one of five recognised religions, which excluded Marapu. Keane and Kamuri tie conversion to the killings of 1965 to 1966, when having no recognised religion looked like communism. Vel reports church membership rising from 52,000 in 1976 to 100,000 in 1986, which measures registration, not belief.

## 1977–1997 · Tombstones, tourists and tarmac
```yaml
year: [1977, 1997]
camera: [-9.65, 119.7, 8]
areas: []
places:
  - { name: Waikabubak, at: [-9.64, 119.41], kind: resort, note: "Hotels and backpacker lodging" }
  - { name: Lamboya, at: [-9.704, 119.344], kind: resort, note: "Backpacker lodging (approximate)" }
  - { name: Kodi, at: [-9.56, 119.03], kind: plantation, note: "Cashew planting promoted from 1991 (approximate)" }
flows:
  - { kind: capital, from: [120.26, -9.65], to: [119.41, -9.64], via: [[119.9, -9.7]], label: "New paved road: 13 hours cut to 3.5", weight: 1 }
sources:
  - hoskins2002: "pp. 802, 805"
  - keane1995: "p. 291"
  - waskitojati2020: "pp. 60-61"
  - mross2000: "p. 260"
```
Hoskins recalls that 1970s guidebooks found little in Sumba beyond giant tombstones and mosquitoes, yet a modest tourist boom came in the 1990s, helped by a paved road that cut the trip from Waingapu to the west from thirteen hours to three and a half. Keane says West Sumba still had a majority without a recognised religion in 1986. Waskitojati and colleagues report clan land turning into family holdings and cashew planting from 1991.

## 1994–2000 · Marosi, riots and a stalled boom
```yaml
year: [1994, 2000]
camera: [-9.55, 119.2, 9]
areas: []
places:
  - { name: Marosi Beach, at: [-9.4, 119.0], kind: resort, note: "Beach concession, 1994 (approximate)" }
  - { name: Waikabubak, at: [-9.64, 119.41], kind: raid, note: "Riots, October and November 1998" }
flows: []
sources:
  - fowler2022: "pp. 4, 10"
  - vel2008: "p. 136"
  - hoskins2002: "p. 804"
  - mross2000: "p. 260"
evidence: contested
```
Fowler reports that in 1994 a company obtained thirty-year building rights over fifty hectares around Marosi Beach in North Kodi. In late 1998 Waikabubak saw riots. Vel counts 26 dead and 891 houses destroyed and calls it a Loli-Wewewa clash. Hoskins gives 26 to 114 dead and a Lauli-Weyewa clash, and Mross reads it as old warfare. Hoskins says tourism stalled by 2000 after Suharto's fall.

## 2001–2007 · Autonomy, new districts and plantation hopes
```yaml
year: [2001, 2007]
camera: [-9.65, 119.7, 8]
areas:
  - { ref: sumba-kab:Sumba Barat Daya, role: focus, label: "New district (modern boundary)" }
  - { ref: sumba-kab:Sumba Tengah, role: focus, label: "New district (modern boundary)" }
places:
  - { name: Tambolaka, at: [-9.41, 119.25], kind: city, note: "Seat of Southwest Sumba" }
  - { name: Waikabubak, at: [-9.64, 119.41], kind: city, note: "West Sumba" }
  - { name: Nihiwatu, at: [-9.74, 119.02], kind: resort, note: "Luxury resort, 2006 (approximate)" }
flows: []
sources:
  - fowler2022: "p. 4"
  - vel2008: "pp. 23, 62, 164"
  - mccarthy2012: "pp. 535-536"
```
Fowler says that after autonomy began in 2001 the island was split into four districts: Southwest, West, Central and East Sumba. Vel dates the campaign for new districts from 2002. McCarthy, Vel and Afiff report that plantation schemes for Jatropha, maize, cotton, sugarcane, cashew and sorghum mostly did not materialise. Vel also describes a luxury resort selling remoteness to wealthy visitors, at room rates equal to months of a local teacher's salary.

## 2012–2018 · Sugarcane, adat and AMAN
```yaml
year: [2012, 2018]
camera: [-9.95, 120.6, 9]
areas:
  - { ref: sumba-kec:Umalulu, role: concession, label: "Sugarcane permit area (PT MSM)" }
places:
  - { name: Wanga, at: [-9.99, 120.66], kind: plantation, note: "Village in the permit area (approximate)" }
  - { name: Waingapu, at: [-9.65, 120.26], kind: city, note: "East Sumba's district capital" }
flows: []
sources:
  - vel2019: "pp. 436, 440-441, 447"
  - fowler2022: "p. 4"
  - morizcha2021: "p. 10"
```
Vel and Makambombu say Djarum Group was exploring sugar production on Sumba in 2012. In April 2015 East Sumba's district government gave PT MSM a location permit of nearly 53,000 hectares for sugarcane and a mill, which Morizcha gives as 52,817. It included land in Umalulu near Wanga. The Sumba branch of the indigenous peoples' alliance AMAN was set up in 2017. Morizcha reports a continuing dispute with the Marapu community.
