---
id: archipelago-layers
title: "Layers on the Archipelago"
subtitle: "Why Sumba? Hegemonic waves across Indonesia, and an island at their edge, c. 2000 BCE – 2018"
author: "Ejak (Reza Arlianda), with Claude"
date: 2026-11-21
region: [[-11.5, 94.5], [6.5, 141.5]]
basemap: relief
geo: [indonesia-prov, sumba-kab]
cover: "Five waves of outside power, read through Van Vollenhoven, and the island where they arrived late, thin, or as extraction."
---
Draft for the Research Conversation (24 Nov 2026), after Eva's request of 20 November: show the geography of Indonesia, then how its history unfolded, so that the choice of Sumba makes sense. The spine is Van Vollenhoven's own argument that adat grew from an Austronesian base onto which Hindu-Buddhist, Islamic, Chinese and Western elements were laid. Each slide asks the same two questions: where did this wave land hardest, and what reached Sumba?

## Today · An archipelago between two continents
```yaml
year: 2010
camera: [-3.0, 117.0, 4]
areas:
  - { ref: sumba-kab:Sumba Timur, role: focus, label: "Sumba" }
  - { ref: sumba-kab:Sumba Barat, role: focus }
  - { ref: sumba-kab:Sumba Barat Daya, role: focus }
  - { ref: sumba-kab:Sumba Tengah, role: focus }
places:
  - { name: "India (Coromandel coast)", at: [11.0, 79.8], kind: city, note: "Source of Indic religion and trade" }
  - { name: "South China (Guangzhou)", at: [23.13, 113.26], kind: city, note: "Source of Chinese trade and settlers" }
  - { name: "Northern Australia", at: [-12.3, 134.5], kind: village, note: "Visited by Makassan trepang fleets" }
  - { name: Sumba, at: [-9.7, 119.9], kind: adat, note: "South of the main east–west sea lanes" }
flows:
  - { kind: trade, from: [79.8, 11.0], to: [104.7, -2.9], via: [[92.0, 6.0], [98.5, 3.5]], label: "Monsoon route from India", weight: 3 }
  - { kind: trade, from: [113.26, 23.13], to: [106.8, -6.1], via: [[110.0, 12.0], [107.5, 2.0]], label: "South China Sea route", weight: 3 }
sources:
  - reid1988: "pp. 1–10"
  - bellwood2007: "pp. 1–39"
  - ananta2014: ""
```
Indonesia is a chain of some seventeen thousand islands between mainland Asia and Australia. Reid describes the region as lands joined, not split, by the sea and timed by the monsoon winds, so outsiders arrived along a few great routes from India and China. Ananta and colleagues count over six hundred ethnic groups in the 2010 census. Sumba sits south of these routes, beyond the busy straits of Java and Sumatra.

> More: Speaking notes: about 17,000 islands; over 600 ethnic groups (check Ananta's exact figure, 633 or 630, before saying it aloud).

## c. 2000 BCE – 500 CE · The base layer
```yaml
year: [-2000, 500]
camera: [-3.0, 117.0, 4]
areas: []
places:
  - { name: Taiwan, at: [23.7, 121.0], kind: village, note: "Starting point of the Austronesian dispersal" }
flows:
  - { kind: migration, from: [121.0, 23.7], to: [121.0, 14.0], label: "Into the Philippines", weight: 3 }
  - { kind: migration, from: [121.0, 14.0], to: [119.4, -5.1], via: [[122.0, 5.0], [120.0, 0.0]], label: "South into Sulawesi", weight: 2 }
  - { kind: migration, from: [119.4, -5.1], to: [119.9, -9.7], via: [[119.6, -8.0]], label: "To Nusa Tenggara and Sumba", weight: 2 }
  - { kind: migration, from: [119.4, -5.1], to: [106.8, -6.1], via: [[113.0, -5.0]], label: "West to Java and Sumatra", weight: 2 }
sources:
  - vollenhoven1906: "pp. 4–5"
  - bellwood2007: "pp. 201–254"
```
Van Vollenhoven begins his account of adat with a time before any foreign influence, when only the indigenous law of the Malayo-Polynesians existed in the archipelago. Bellwood traces those Austronesian speakers south from Taiwan through the Philippines and Sulawesi into the island chains. Sumba shares this base with the rest of the archipelago. What differs from island to island is how much was laid on top.

## c. 400 – 1400 · The Hindu-Buddhist layer
```yaml
year: [400, 1400]
camera: [-4.5, 108.0, 5]
areas:
  - { ref: indonesia-prov:Sumatera Selatan, role: claim, label: "Srivijaya" }
  - { ref: indonesia-prov:Jambi, role: claim }
  - { ref: indonesia-prov:Jawa Tengah, role: claim, label: "Temple kingdoms of Central Java" }
  - { ref: indonesia-prov:Daerah Istimewa Yogyakarta, role: claim }
  - { ref: indonesia-prov:Jawa Timur, role: claim, label: "Majapahit" }
  - { ref: indonesia-prov:Bali, role: claim }
  - { ref: indonesia-prov:Kalimantan Timur, role: claim, label: "Kutai inscriptions" }
places:
  - { name: Kutai, at: [-0.4, 116.98], kind: kingdom, note: "Earliest Sanskrit inscriptions in Indonesia" }
  - { name: Palembang, at: [-2.99, 104.76], kind: kingdom, note: "Centre of Srivijaya" }
  - { name: Borobudur, at: [-7.61, 110.2], kind: kingdom, note: "Buddhist monument, Central Java" }
flows:
  - { kind: mission, from: [79.8, 11.0], to: [104.76, -2.99], via: [[92.0, 6.0], [98.5, 3.5]], label: "Indic religion and scripts by sea", weight: 3 }
  - { kind: mission, from: [104.76, -2.99], to: [110.2, -7.61], via: [[107.0, -5.5]], label: "Into Java", weight: 2 }
sources:
  - vollenhoven1906: "pp. 4–5"
  - coedes1968: "p. 52"
  - wolters1999: "pp. 41–55"
```
Van Vollenhoven dates the Hindu contribution to adat from the eighth century, after Hindu civilisation reached Java. Coedès places the earliest Indonesian inscriptions at Kutai in Borneo. Wolters argues that local rulers chose and localised Indian ideas rather than receiving them whole. The map shows where that layer settled: along the western sea lanes, in Sumatra, Java and Bali. Nothing marks it on Sumba.

## 1365 · A name on Majapahit's list
```yaml
year: 1365
camera: [-8.5, 116.0, 6]
areas:
  - { ref: indonesia-prov:Jawa Timur, role: focus, label: "Majapahit court" }
  - { ref: sumba-kab:Sumba Timur, role: claim, label: "Listed as tributary" }
  - { ref: sumba-kab:Sumba Barat, role: claim }
  - { ref: sumba-kab:Sumba Barat Daya, role: claim }
  - { ref: sumba-kab:Sumba Tengah, role: claim }
places:
  - { name: Trowulan, at: [-7.56, 112.38], kind: kingdom, note: "Majapahit's capital" }
flows:
  - { kind: colonial, from: [112.38, -7.56], to: [119.9, -9.7], via: [[115.5, -8.3], [118.0, -8.9]], label: "Claimed overlordship (Deśawarṇana)", weight: 1 }
sources:
  - robson1995: "canto 14"
  - ricklefs2008: "pp. 3–20"
evidence: primary
```
The Deśawarṇana, a court poem of 1365 translated by Robson, lists Sumba among the lands that paid homage to Majapahit. It is a court record, and Ricklefs warns that such lists show the reach of a court's imagination more than its rule. For Sumba, this is the first appearance in a written source, and it comes as a name on someone else's list.

> More: Check before presenting: the exact canto and verse where Sumba appears in Robson's translation (it is usually given as canto 14). This slide is the first instance of a pattern the rest of the story repeats: Sumba is claimed from outside long before it is governed.

## 1290s – 1660s · The Islamic layer
```yaml
year: [1290, 1669]
camera: [-4.0, 112.0, 5]
areas:
  - { ref: indonesia-prov:Aceh, role: claim, label: "Pasai, then Aceh" }
  - { ref: indonesia-prov:Jawa Tengah, role: claim, label: "Demak and the north coast" }
  - { ref: indonesia-prov:Banten, role: claim }
  - { ref: indonesia-prov:Sulawesi Selatan, role: claim, label: "Gowa-Tallo (Makassar), Muslim from 1605" }
  - { ref: indonesia-prov:Maluku Utara, role: claim, label: "Ternate and Tidore" }
places:
  - { name: Pasai, at: [5.18, 97.14], kind: kingdom, note: "Early Muslim port-state" }
  - { name: Melaka, at: [2.19, 102.25], kind: port, note: "Great entrepôt" }
  - { name: Makassar, at: [-5.14, 119.42], kind: city, note: "Its traders came to Sumba's coast" }
  - { name: Kodi, at: [-9.56, 119.03], kind: port, note: "Makassarese and Bugis traders settled here (Soelarto)" }
flows:
  - { kind: mission, from: [97.14, 5.18], to: [102.25, 2.19], label: "Islam along the straits", weight: 3 }
  - { kind: mission, from: [102.25, 2.19], to: [110.6, -6.9], via: [[106.0, -3.0]], label: "To Java's north coast", weight: 3 }
  - { kind: mission, from: [110.6, -6.9], to: [119.42, -5.14], via: [[115.0, -5.8]], label: "East to Makassar", weight: 2 }
  - { kind: trade, from: [119.42, -5.14], to: [119.03, -9.56], via: [[119.2, -7.0], [119.25, -8.4], [118.95, -9.2]], label: "Muslim traders to Sumba's coast", weight: 1 }
sources:
  - vollenhoven1906: "pp. 4–5"
  - ricklefs2008: "pp. 3–17"
  - reid1993: "pp. 62–90"
  - cummings2002: ""
  - soelarto1980: "p. 28"
```
Van Vollenhoven places the Islamic contribution to adat in the fourteenth and fifteenth centuries. Ricklefs traces Islam from Pasai in north Sumatra, and Reid shows it spreading with trade through Melaka and the ports of Java's north coast. Gowa-Tallo in Makassar accepted Islam in 1605. Sumba met this wave on its shoreline, through traders from Makassar and Bugis lands, while the interior kept its own ancestral religion.

## 1405 – 1700s · The Chinese layer
```yaml
year: [1405, 1740]
camera: [-1.0, 108.0, 5]
areas:
  - { ref: indonesia-prov:Daerah Khusus Ibukota Jakarta, role: claim, label: "Chinese quarter of Batavia" }
  - { ref: indonesia-prov:Jawa Tengah, role: claim }
  - { ref: indonesia-prov:Kalimantan Barat, role: claim, label: "Later gold kongsi" }
  - { ref: indonesia-prov:Kepulauan Bangka Belitung, role: claim, label: "Later tin mining" }
places:
  - { name: Semarang, at: [-6.97, 110.42], kind: port, note: "North-coast port linked to Zheng He's memory" }
flows:
  - { kind: trade, from: [113.26, 23.13], to: [110.42, -6.97], via: [[110.0, 12.0], [108.0, 2.0], [109.5, -4.5]], label: "Zheng He's fleets, then junk trade", weight: 3 }
  - { kind: migration, from: [113.26, 23.13], to: [106.8, -6.1], via: [[110.0, 12.0], [107.5, 2.0]], label: "Settlers to Java's ports", weight: 2 }
sources:
  - vollenhoven1906: "pp. 4–5"
  - wade2005: ""
  - reid1993: "pp. 62–90"
```
Van Vollenhoven notes that the late Middle Ages brought Chinese settlers with their own popular law, which colonial law later treated as the law of "foreign orientals". Wade reassesses the Zheng He voyages of the early 1400s as a show of Ming power. Chinese communities grew in the ports of Java and later in the mining districts of Borneo and Bangka. In the sources used here, Sumba lay outside this network.

## 1511 – 1700s · Western contact
```yaml
year: [1511, 1760]
camera: [-6.0, 114.0, 5]
areas:
  - { ref: indonesia-prov:Daerah Khusus Ibukota Jakarta, role: claim, label: "Batavia, 1619" }
  - { ref: indonesia-prov:Maluku, role: claim, label: "Spice islands" }
  - { ref: indonesia-prov:Sulawesi Selatan, role: contested, label: "Makassar, conquered 1667–69" }
places:
  - { name: Batavia, at: [-6.13, 106.81], kind: fort, note: "VOC headquarters" }
  - { name: Kupang, at: [-10.16, 123.6], kind: fort, note: "VOC post on Timor" }
  - { name: Melaka, at: [2.19, 102.25], kind: fort, note: "Taken by the Portuguese, 1511" }
flows:
  - { kind: colonial, from: [102.25, 2.19], to: [106.81, -6.13], via: [[105.0, -2.5]], label: "From Portuguese Melaka to Dutch Batavia", weight: 2 }
  - { kind: military, from: [106.81, -6.13], to: [119.42, -5.14], via: [[112.5, -5.8], [117.0, -5.8]], label: "Makassar War, 1667–69", weight: 3 }
  - { kind: slave, from: [119.42, -5.14], to: [106.81, -6.13], via: [[117.0, -5.6], [112.5, -5.6], [108.5, -5.4]], label: "Captives to Batavia", weight: 3 }
sources:
  - vollenhoven1906: "pp. 4–5"
  - gaastra2003: ""
  - raben2008: "p. 127"
```
For Van Vollenhoven, only with the Portuguese, English and Dutch from the sixteenth century did written Western rules begin to replace or supplement uncodified law. Gaastra describes the VOC, founded in 1602, as a trading company that made itself a state. Raben shows how its conquest of Makassar pulled eastern Indonesia into Batavia's slave market. This is the wave that reached Sumba first and hardest.

## 1750 – 1860 · Sumba enters the record as a source of people
```yaml
year: [1750, 1860]
camera: [-8.0, 118.5, 6]
areas:
  - { ref: sumba-kab:Sumba Timur, role: contested }
  - { ref: sumba-kab:Sumba Barat, role: contested }
  - { ref: sumba-kab:Sumba Barat Daya, role: contested }
  - { ref: sumba-kab:Sumba Tengah, role: contested }
places:
  - { name: Ende, at: [-8.84, 121.66], kind: port, note: "Raiders' home port" }
  - { name: Makassar, at: [-5.14, 119.42], kind: city, note: "Over thirty slave ships a year by 1775 (Pietrow)" }
  - { name: Kupang, at: [-10.16, 123.6], kind: fort, note: "Company post that sent the 1750 mission" }
flows:
  - { kind: colonial, from: [123.6, -10.16], to: [120.26, -9.65], via: [[122.5, -9.9], [121.3, -9.8]], label: "1750 treaty mission", weight: 1 }
  - { kind: slave, from: [119.6, -9.5], to: [119.42, -5.14], via: [[119.3, -9.1], [119.25, -8.4], [119.2, -7.0]], label: "Captives to Makassar", weight: 3 }
  - { kind: slave, from: [120.0, -9.45], to: [121.66, -8.84], via: [[120.8, -9.2]], label: "Captives to Ende traders", weight: 3 }
  - { kind: trade, from: [121.66, -8.84], to: [120.3, -9.55], via: [[121.0, -9.15]], label: "Muskets and gunpowder in return", weight: 2 }
sources:
  - hoskins2002: "p. 800"
  - pietrow2024: "p. 25"
  - bosma2020: "pp. 111, 113"
  - vel2019: "p. 443"
```
Hoskins dates the Company's treaty mission to Sumba to 1750. Pietrow reports more than thirty Makassarese slave ships a year by 1775, and Bosma sets this inside a surge of raiding across the archipelago until the 1860s. Vel and Makambombu add the Sumbanese side: leaders raided rival domains and traded captives for rice or gunpowder. Sumba navigated the Western wave by joining it, and the trade split its clans.

## 1901 – 1919 · Codifying adat while conquering Sumba
```yaml
year: [1901, 1919]
camera: [-6.5, 113.0, 5]
areas:
  - { ref: indonesia-prov:Nusa Tenggara Timur, role: claim, label: "Residency of Timor and dependencies (modern boundary)" }
  - { ref: sumba-kab:Sumba Barat, role: lost, label: "Pacification campaign, 1906–1912" }
  - { ref: sumba-kab:Sumba Barat Daya, role: lost }
  - { ref: sumba-kab:Sumba Timur, role: lost }
  - { ref: sumba-kab:Sumba Tengah, role: lost }
places:
  - { name: Batavia, at: [-6.13, 106.81], kind: fort, note: "Colonial capital" }
  - { name: Kupang, at: [-10.16, 123.6], kind: fort, note: "Seat of the Resident who governed Sumba" }
flows:
  - { kind: colonial, from: [106.81, -6.13], to: [123.6, -10.16], via: [[109.5, -5.8], [113.5, -6.4], [116.0, -7.9], [118.4, -7.8], [121.3, -9.4]], label: "Batavia → Kupang", weight: 2 }
  - { kind: military, from: [123.6, -10.16], to: [119.41, -9.64], via: [[122.5, -9.9], [121.0, -9.9], [120.2, -9.8]], label: "Troops into West Sumba", weight: 3 }
sources:
  - holleman2023: "pp. XXXIV–XLVII"
  - burns2004: ""
  - vel2008: "pp. 30–32"
```
Holleman shows Van Vollenhoven fighting a 1904 bill to unify all law on the Dutch Civil Code, then, in 1919, a bill for Western-style land ownership that suited plantations. Burns shows how his school mapped the Indies into adat law circles. In the same years troops pacified Sumba, governed from Kupang as part of the Residency of Timor. Adat was being written down for the colony while Sumba was conquered.

> More: Next step for the drawing: Van Vollenhoven's nineteen adat law circles, with Sumba inside the Timor group. Take the list and map from Holleman's edition before drawing it; the app does not yet hold that boundary.

## 1945 – 1998 · One nation, one centre
```yaml
year: [1945, 1998]
camera: [-5.0, 114.0, 5]
areas:
  - { ref: indonesia-prov:Jawa Barat, role: claim, label: "Java: the political centre" }
  - { ref: indonesia-prov:Jawa Tengah, role: claim }
  - { ref: indonesia-prov:Jawa Timur, role: claim }
  - { ref: indonesia-prov:Daerah Istimewa Yogyakarta, role: claim }
  - { ref: indonesia-prov:Daerah Khusus Ibukota Jakarta, role: claim }
  - { ref: indonesia-prov:Banten, role: claim }
  - { ref: sumba-kab:Sumba Barat, role: focus, label: "Marapu excluded from the recognised religions" }
  - { ref: sumba-kab:Sumba Timur, role: focus }
places:
  - { name: Jakarta, at: [-6.2, 106.85], kind: city, note: "National capital" }
flows:
  - { kind: colonial, from: [106.85, -6.2], to: [119.41, -9.64], via: [[110.0, -6.5], [114.0, -7.6], [117.0, -8.7]], label: "Rule from Jakarta", weight: 3 }
sources:
  - elson2008: ""
  - ananta2014: ""
  - vel2008: "pp. 34, 39"
  - robinson2018: ""
```
Elson traces how the idea of Indonesia took over the Dutch colonial territory whole. Ananta and colleagues show the Javanese as by far the largest group, and Java held the capital. Vel writes that from 1965 Sumba was ruled by a bureaucracy directed from Jakarta, which brought schools and roads and required everyone to belong to one of five recognised religions. Marapu was not one. Robinson describes the killings of 1965 that made that requirement dangerous.

> More: Eva's point for this slide: the new nation-state reproduced the colonial structure (a centre on Java governing a periphery), which is different from settler colonialism as in Australia, where the colonisers stayed as the majority.

## 2001 – 2018 · New frontiers, and adat as a strategy
```yaml
year: [2001, 2018]
camera: [-9.7, 119.9, 8]
areas:
  - { ref: sumba-kab:Sumba Timur, role: concession, label: "Sugarcane location permit, 2015" }
  - { ref: sumba-kab:Sumba Barat Daya, role: focus, label: "New district, 2007" }
places:
  - { name: Wanga, at: [-9.99, 120.66], kind: plantation, note: "Village in the permit area (approximate)" }
  - { name: Nihiwatu, at: [-9.74, 119.02], kind: resort, note: "Luxury resort (approximate)" }
  - { name: Waingapu, at: [-9.65, 120.26], kind: city, note: "East Sumba's capital" }
flows:
  - { kind: capital, from: [106.85, -6.2], to: [120.66, -9.99], via: [[110.0, -6.5], [114.0, -7.6], [118.0, -9.0]], label: "Plantation capital", weight: 2 }
  - { kind: capital, from: [115.2, -8.7], to: [119.02, -9.74], via: [[117.0, -9.2]], label: "Tourism capital via Bali", weight: 1 }
sources:
  - vel2019: "pp. 436, 440–441, 447"
  - morizcha2021: "p. 10"
  - henley2007: ""
  - mk2012: ""
```
After decentralisation, the newest wave is capital. Vel and Makambombu report a 2015 location permit of nearly 53,000 hectares for sugarcane in East Sumba, and the founding of AMAN's Sumba branch in 2017. Morizcha records a continuing dispute with the Marapu community. Davidson and Henley show how adat, a colonial category, became the language of indigenous claims, and the Constitutional Court in 2012 ruled that customary forest is not state forest.

## Why Sumba
```yaml
year: [1365, 2018]
camera: [-6.0, 114.0, 5]
areas:
  - { ref: sumba-kab:Sumba Timur, role: adat, label: "Sumba" }
  - { ref: sumba-kab:Sumba Barat, role: adat }
  - { ref: sumba-kab:Sumba Barat Daya, role: adat }
  - { ref: sumba-kab:Sumba Tengah, role: adat }
places:
  - { name: Sumba, at: [-9.7, 119.9], kind: adat, note: "Marapu, clans and kampung still structure land" }
flows: []
sources:
  - vel2008: "pp. 34, 39"
  - keane1997: ""
  - vollenhoven1906: "pp. 4–5"
```
Read through Van Vollenhoven's layers, Sumba is unusual. The Hindu-Buddhist and Chinese waves barely touched it, Islam stayed on its coast, and the West came first as a slave trade and late as a government. Keane and Vel describe an island where ancestral ritual and clan still order land and status. That makes Sumba a place to see how indigenous space is made and defended when each new power claims it.

> More: This is the argument of the thesis, not a finding of the sources. It leads straight into the research questions slide.
