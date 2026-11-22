---
id: europeans-in-sumba
title: "Strangers on the Shore"
subtitle: "Europeans in Sumba: ships, contracts, officials, schools and ethnographers, c. 1512–1990"
author: "Ejak (Reza Arlianda), with Claude"
date: 2026-11-22
region: [[-10.6, 118.6], [-9.0, 121.4]]
basemap: paper
geo: [sumba-kab, sumba-kec, indonesia-prov]
cover: "Who came to Sumba from Europe, when, where they landed, and what they wrote down."
---
This story follows the Europeans who reached Sumba: Portuguese and Dutch ships, the VOC acting through its ally Bima, contracts signed in Kupang, the first official at Kambaniru, the missions and their schools, and the ethnographers who lived in Sumbanese domains and wrote the books we still read. For more than two centuries Europeans claimed Sumba on paper long before they governed it. Most of the early record comes from Company letters, so Sumbanese voices reach us at second hand. Where sources give different dates, the slide says so. Places marked "approximate" are placed by district, not surveyed.

## c. 1512–1600 · Known by rumour, named for sandalwood
```yaml
year: [1512, 1600]
camera: [-9.2, 121.0, 6]
areas:
  - { ref: sumba-kab:Sumba Timur, role: focus }
  - { ref: sumba-kab:Sumba Tengah, role: focus }
  - { ref: sumba-kab:Sumba Barat, role: focus }
  - { ref: sumba-kab:Sumba Barat Daya, role: focus }
places:
  - { name: Larantuka, at: [-8.34, 122.98], kind: port, note: "Later the Portuguese and Topass base in the region" }
  - { name: Ende, at: [-8.84, 121.66], kind: port, note: "Traders from here sailed to Sumba every year" }
flows:
  - { kind: trade, from: [122.98, -8.34], to: [120.4, -9.6], via: [[122.2, -8.9], [121.3, -9.3]], label: "Portuguese traders, 16th century (Soelarto)", weight: 1 }
sources:
  - soelarto1980: "p. 28"
  - hagerdal2012: "p. 21"
```
Soelarto reports that the first Europeans Sumbanese remembered were Portuguese traders, followed later by the English. Europeans called the island Sandalwood Island, Pulau Cendana. Hägerdal points out that the name misled them: when the island was properly examined it turned out to be a poor source of sandalwood. For a century Sumba sat at the edge of European charts, approached from Solor, Flores and Timor rather than visited for itself.

## 1636–1658 · First Dutch ships, a passing missionary
```yaml
year: [1636, 1658]
camera: [-8.6, 119.8, 6]
areas: []
places:
  - { name: Memboro coast, at: [-9.42, 119.73], kind: port, note: "Endenese traders came here yearly (approximate)" }
  - { name: Makassar, at: [-5.14, 119.41], kind: city, note: "Gowa; said to control Sumba in 1650" }
flows:
  - { kind: colonial, from: [106.81, -6.13], to: [119.73, -9.3], via: [[109.5, -5.8], [113.5, -6.4], [116.0, -7.9], [118.4, -8.2], [119.4, -8.9]], label: "VOC ship reaches Sumba after a calm, 1636", weight: 1 }
  - { kind: trade, from: [121.66, -8.84], to: [119.73, -9.42], via: [[121.0, -9.0], [120.3, -9.2]], label: "Endenese cotton traders", weight: 2 }
sources:
  - pietrow2024: "p. 19"
  - hagerdal2012: "pp. 94, 177"
```
The first VOC mention Pietrow found is from 1636, when a ship becalmed by contrary currents only reached Sumba at the end of the month. In 1650 a Company report, cited by Hägerdal, thought the island was under Makassarese control and its slaves very expensive. Hägerdal also notes a short missionary visit in 1658 that changed nothing, and Endenese traders who came every year to the north coast at Memboro.

## 1667–1669 · The Company's ally claims the island
```yaml
year: [1667, 1669]
camera: [-8.4, 119.4, 7]
areas:
  - { ref: sumba-kab:Sumba Timur, role: claim, label: "Claimed by Bima" }
  - { ref: sumba-kab:Sumba Tengah, role: claim }
  - { ref: sumba-kab:Sumba Barat, role: claim }
  - { ref: sumba-kab:Sumba Barat Daya, role: claim }
places:
  - { name: Bima, at: [-8.46, 118.72], kind: kingdom, note: "Sultanate; VOC ally after 1667" }
flows:
  - { kind: colonial, from: [119.41, -5.14], to: [118.72, -8.46], via: [[119.0, -6.5], [118.8, -7.6]], label: "After Makassar falls (1667), Bima turns to the VOC", weight: 2 }
  - { kind: colonial, from: [118.72, -8.46], to: [119.6, -9.5], via: [[119.0, -8.9]], label: "Bima's claim over Sumba", weight: 2 }
sources:
  - pietrow2024: "pp. 24-30"
  - raben2008: "p. 127"
```
The VOC took Makassar in 1667 with Bugis allies. Bima, until then a tributary of Makassar, became a Company ally under a contract that barred it from trading with other Europeans. Bima's sultans said Sumba had belonged to them since long before any treaty, and Pietrow shows that the VOC repeated this claim in its own letters. Sumba would be reached through Bima, not directly.

## 1674–1676 · A refused tribute and a fleet turned back
```yaml
year: [1674, 1676]
camera: [-9.0, 119.8, 7]
areas:
  - { ref: sumba-kab:Sumba Tengah, role: contested, label: "Rebellion against Bima's tribute (area uncertain)" }
places:
  - { name: Bima, at: [-8.46, 118.72], kind: kingdom, note: "Fleet gathers here" }
  - { name: Komodo, at: [-8.55, 119.49], kind: village, note: "Some Bimanese soldiers were told to turn back here" }
  - { name: Savu, at: [-10.49, 121.84], kind: village, note: "VOC punitive force after a commander's murder, 1673" }
flows:
  - { kind: trade, from: [118.72, -8.46], to: [106.81, -6.13], via: [[117.0, -7.6], [114.0, -6.6], [110.0, -5.9]], label: "Slaves and sappanwood sold for gunpowder, lead and iron", weight: 1 }
  - { kind: military, from: [118.72, -8.46], to: [119.4, -8.9], via: [[119.1, -8.5]], label: "Joint fleet sails 8 May 1676; storm 19 May", weight: 2 }
  - { kind: military, from: [121.84, -10.49], to: [120.9, -10.0], label: "Eight VOC ships from Savu abort (sickness)", weight: 2 }
sources:
  - pietrow2024: "pp. 32-39"
```
By 1674 part of Sumba refused Bima's tribute. A Bimanese official sold slaves and sappanwood in Batavia for gunpowder, lead and iron, and the VOC promised ships under Adriaan van Dalen. Court quarrels in Bima cut the fleet down. Pietrow reconstructs the result: the joint fleet left Bima on 8 May 1676 and was driven back by a storm on 19 May, while a VOC force coming from Savu turned back with sick crews.

## April–May 1677 · Oaths on the kris, and Mamboro waves
```yaml
year: 1677
camera: [-9.35, 119.75, 9]
areas:
  - { ref: sumba-kec:Mamboro, role: focus, label: "Mamboro" }
places:
  - { name: Mamboro, at: [-9.42, 119.73], kind: village, note: "Villagers hailed the departing VOC ships, 17 May 1677 (approximate)" }
flows:
  - { kind: military, from: [118.72, -8.46], to: [119.6, -9.4], via: [[119.6, -8.6], [120.3, -8.8], [120.0, -9.2]], label: "20 Bimanese vessels, 1,300 men; land 1 May", weight: 3 }
  - { kind: colonial, from: [118.72, -8.46], to: [119.75, -9.38], via: [[118.9, -9.0], [119.3, -9.4]], label: "VOC ship De Parel: map the island; arrives 7 May", weight: 1 }
sources:
  - pietrow2024: "pp. 40-44"
```
The second attempt left Bima on 6 April 1677. The Bimanese landed on 1 May; the VOC ships, ordered to map the island and carrying cloth to trade, arrived on 7 May. Envoys from many villages submitted by drinking water from Bimanese kris. The Dutch left on 17 May, hailed by the people of Mamboro. Hidden rebels then killed two soldiers, panic followed, and the Bimanese fled home by 30 May.

## 1678–1726 · Portuguese rivals in the east
```yaml
year: [1678, 1726]
camera: [-9.4, 121.3, 7]
areas:
  - { ref: sumba-kab:Sumba Timur, role: contested, label: "Portuguese overlordship acknowledged by the VOC, 1726" }
places:
  - { name: Larantuka, at: [-8.34, 122.98], kind: port, note: "Larantuqueiros (Topasses) already traded in eastern Sumba" }
  - { name: Sikka, at: [-8.67, 122.2], kind: kingdom, note: "Raids on Sumba; a captive became an interpreter, 1693" }
flows:
  - { kind: trade, from: [122.98, -8.34], to: [120.6, -9.9], via: [[122.4, -9.0], [121.4, -9.6]], label: "Portuguese/Topass trade with eastern Sumba", weight: 2 }
  - { kind: slave, from: [120.4, -9.6], to: [122.2, -8.67], via: [[121.3, -9.1]], label: "Captives taken in Sikka raids", weight: 1 }
sources:
  - pietrow2024: "pp. 23, 45-47"
  - hagerdal2012: "pp. 173, 177-178"
```
In 1678 Bima refused trading rights to a Portuguese captain the VOC had let through, and by 1686 Company officials doubted Bima ever ruled Sumba. Hägerdal describes a VOC visit around 1685 that found little sandalwood, and Larantuqueiros (Topasses) already trading in the east. Pietrow notes that in 1726 the VOC accepted the Portuguese as overlords of eastern Sumba.

## c. 1750–1756 · Signed in Kupang
```yaml
year: [1750, 1756]
camera: [-9.9, 121.9, 7]
areas: []
places:
  - { name: Kupang, at: [-10.16, 123.6], kind: fort, note: "VOC fort; Paravicini's treaty conference, 1756" }
  - { name: Mangili, at: [-10.15, 120.6], kind: kingdom, note: "Its ruler made an agreement with the VOC in 1756 (approximate)" }
flows:
  - { kind: colonial, from: [123.6, -10.16], to: [120.4, -9.75], via: [[122.5, -10.0], [121.3, -9.85]], label: "Van den Burg's terms with eight Sumbanese kings, c. 1750", weight: 1 }
  - { kind: colonial, from: [120.6, -10.15], to: [123.6, -10.16], via: [[121.8, -10.35], [122.8, -10.3]], label: "Mangili's ruler to Kupang, 1756", weight: 1 }
sources:
  - hoskins2002: "p. 800"
  - forth1981: "pp. 7, 11"
  - soelarto1980: "p. 30"
```
From Kupang, the VOC post on Timor, the Company tried again on its own account. Hoskins and Soelarto describe an envoy, Van den Burg, agreeing trade terms with eight Sumbanese kings around 1750. Forth records that in 1756 the VOC signed an agreement with the ruler of Mangili, part of the great treaty round that Commissioner Paravicini held in Kupang that year. On paper, Sumba now looked to Kupang.

## 1757–1759 · Erasmusz walks the island
```yaml
year: [1757, 1759]
camera: [-9.85, 120.5, 8]
areas:
  - { ref: sumba-kec:Umalulu, role: focus, label: "Umalulu" }
places:
  - { name: Umalulu, at: [-9.93, 120.62], kind: kingdom, note: "Main destination of the survey (approximate)" }
flows:
  - { kind: colonial, from: [123.6, -10.16], to: [120.62, -9.93], via: [[122.5, -10.1], [121.4, -10.0]], label: "Survey party from Kupang", weight: 1 }
sources:
  - leupe1879: "pp. 224-231"
  - raben2008: "p. 130"
evidence: primary
```
On orders from Batavia, the head of the Timor post sent a party to survey Sumba; Leupe later published its 1759 report, a Company record. Erasmusz reported heavy sandalwood and projected exports of wood, slaves and cotton, but also endless war between domains, and blamed Batu Kapadu for stirring it. Raben places this in a period when many slaves for the region were bought on Sumba.

## 1799–1838 · No garrison, then a wreck
```yaml
year: [1799, 1838]
camera: [-9.3, 121.0, 6]
areas: []
places:
  - { name: Kupang, at: [-10.16, 123.6], kind: city, note: "Seat of the Resident of Timor" }
flows:
  - { kind: military, from: [123.6, -10.16], to: [119.3, -9.8], via: [[122.0, -10.4], [120.5, -10.3]], label: "Four Dutch warships in a south-west Sumba bay, 1817 (Awa & Suana)", weight: 2 }
  - { kind: colonial, from: [106.81, -6.13], to: [123.6, -10.16], via: [[109.5, -5.8], [113.5, -6.4], [116.0, -7.9], [118.4, -7.8], [120.2, -9.0], [122.5, -9.9]], label: "Batavia orders an inquiry, 1838", weight: 1 }
sources:
  - soelarto1980: "p. 30"
  - forth1981: "p. 7"
  - awa2021: "p. 41"
  - vel2008: "p. 30"
```
The VOC was dissolved in 1799 without ever occupying Sumba, and the Netherlands Indies government took over its claims in 1800. Awa and Suana report four Dutch warships entering a south-west Sumba bay in 1817. In 1838, Vel writes, news that a British ship had been wrecked and plundered off Sumba led Batavia to order the Resident in Kupang to find out how the island could be made safe and governable.

## 1843–1845 · A broker at Waingapu
```yaml
year: [1843, 1845]
camera: [-9.6, 120.6, 8]
areas:
  - { ref: sumba-kec:Kota Waingapu, role: focus, label: "Waingapu" }
places:
  - { name: Waingapu, at: [-9.65, 120.26], kind: port, note: "Founded 1843 around the broker's settlement" }
flows:
  - { kind: trade, from: [120.26, -9.65], to: [121.66, -8.84], via: [[120.8, -9.3]], label: "Horse exports", weight: 2 }
  - { kind: colonial, from: [123.6, -10.16], to: [120.26, -9.65], via: [[122.5, -10.0], [121.3, -9.8]], label: "Contract with Sumbanese rajas, 1845", weight: 1 }
sources:
  - vel2008: "p. 31"
  - forth1981: "p. 8"
  - hoskins1996: "p. 221"
```
Kupang chose a broker rather than an official. Vel describes Sjarif Abdoelrachman, an Arab trader, settling in 1843, taxing horse exports and founding the town that became Waingapu, which Forth also dates to 1843. In 1845 some rajas signed a contract that, in the government's eyes, limited their dealings with outsiders. For three decades the broker, not a Dutchman, stood between Sumba and Kupang.

## 1866–1875 · The first official, at Kambaniru
```yaml
year: [1866, 1875]
camera: [-9.68, 120.3, 11]
areas:
  - { ref: sumba-kec:Kambera, role: focus, label: "Kambera" }
places:
  - { name: Kambaniru, at: [-9.69, 120.3], kind: fort, note: "Seat of controleur Roos, about 5 km from Waingapu (approximate)" }
  - { name: Waingapu, at: [-9.65, 120.26], kind: port, note: "Harbour" }
flows:
  - { kind: colonial, from: [123.6, -10.16], to: [120.3, -9.69], via: [[122.5, -10.0], [121.3, -9.85]], label: "Controleur S. Roos posted, 1866", weight: 2 }
sources:
  - vel2008: "p. 31"
  - nooteboom1940: "p. 3"
  - kuipers1998: "p. 31"
  - forth1981: "p. 7"
```
In 1866 the government finally posted an official. Vel lists Controleur S. Roos's tasks: collect horses as payment for plundered wrecks, study local customs to choose a form of indirect rule, and stop the slave trade. Nooteboom places him at Kambaniru, five kilometres from Waingapu, and dates his term 1866–1869. Roos's report became one of the first ethnographic descriptions of Sumba, though Nooteboom thought it was written from a distance.

## 1875–1892 · First missions, first schools
```yaml
year: [1875, 1892]
camera: [-9.75, 120.0, 8]
areas: []
places:
  - { name: Kambaniru, at: [-9.69, 120.3], kind: school, note: "Mission school, 1875 (Soeriadiredja)" }
  - { name: Melolo, at: [-9.89, 120.66], kind: school, note: "Savunese settlement; mission primary school, 1892 (Soeriadiredja)" }
  - { name: Laura, at: [-9.52, 119.17], kind: mission, note: "Jesuit church and school: 1866 (Soelarto) or 1880s (Keane) (approximate)" }
flows:
  - { kind: mission, from: [121.84, -10.49], to: [120.66, -9.89], via: [[121.3, -10.2]], label: "Savunese Christians, first converts", weight: 1 }
  - { kind: mission, from: [123.6, -10.16], to: [120.3, -9.69], via: [[122.5, -10.0], [121.3, -9.85]], label: "Van Alphen, first Dutch missionary, 1881", weight: 1 }
sources:
  - soeriadiredja2013: "p. 66"
  - vel2008: "p. 32"
  - keane1995: "p. 296"
  - soelarto1980: "p. 30"
evidence: contested
```
The dates of the first schools differ by source. Soeriadiredja dates a mission school at Kambaniru to 1875 and a primary school at Melolo to 1892. Vel dates the first Dutch missionary, Van Alphen, to 1881, working mostly among Savunese settlers. In the west, Soelarto places a Jesuit church and school at Laura in 1866, while Keane dates the Catholic mission there to 1885–1893.

## 1891–1892 · A naturalist's collections reach Leiden
```yaml
year: [1891, 1892]
camera: [-9.8, 120.4, 8]
areas:
  - { ref: sumba-kec:Rindi, role: focus, label: "Rindi" }
places:
  - { name: Waingapu, at: [-9.65, 120.26], kind: port, note: "Arrival port for visitors from Kupang and Java" }
  - { name: Rindi, at: [-9.95, 120.7], kind: kingdom, note: "Skull tree sketched by a missionary, 1892 (approximate)" }
flows:
  - { kind: colonial, from: [120.26, -9.65], to: [4.49, 52.16], via: [[115.0, -8.5], [106.8, -6.1], [95.0, 5.5], [80.0, 6.0], [55.0, 13.0], [43.0, 12.6], [32.5, 30.0], [15.0, 38.0], [-9.5, 38.7], [-5.0, 48.0]], label: "Ten Kate's Sumba specimens shipped to Leiden, 1891", weight: 1 }
sources:
  - buttikofer1892: "p. 196"
  - hoskins1996: "p. 221"
evidence: primary
```
In 1891 the Dutch anthropologist Herman ten Kate travelled through the Timor group. A Leiden Museum report of 1892, a contemporary record, says he was the first to send zoological collections from Sumba, shipped in September and November 1891. The next year, Hoskins notes, a missionary sketched sixteen heads hanging from a skull tree at Rindi. Science and mission were mapping a Sumba that was still independent of Dutch rule.

## 1901–1912 · Conquest and an afdeeling
```yaml
year: [1901, 1912]
camera: [-9.7, 119.9, 8]
areas:
  - { ref: sumba-kec:Rindi, role: claim }
  - { ref: sumba-kec:Lamboya, role: contested, label: "Lamboya: Lt de Neeve killed, 1909" }
  - { ref: sumba-kec:Kodi, role: contested }
places:
  - { name: Lambanapu, at: [-9.72, 120.28], kind: battle, note: "Lambanapu war, 1901 (approximate)" }
  - { name: Waingapu, at: [-9.65, 120.26], kind: city, note: "Seat of the colonial afdeeling" }
  - { name: Waikabubak, at: [-9.645, 119.42], kind: fort, note: "West Sumba post" }
flows:
  - { kind: military, from: [123.6, -10.16], to: [120.75, -9.97], via: [[122.5, -10.2], [121.4, -10.1]], label: "Warship to the Rindi estuary, 1901", weight: 3 }
  - { kind: military, from: [120.26, -9.65], to: [119.42, -9.645], via: [[119.9, -9.6]], label: "Pacification campaign, from 1906", weight: 3 }
sources:
  - forth1981: "pp. 7, 12-13"
  - vel2008: "pp. 31-32, 178"
  - soelarto1980: "p. 34"
```
In 1901, Forth writes, a Dutch warship anchored off the Rindi estuary during the Lambanapu war, with the Resident of Kupang involved. A campaign of pacification began in 1906; Soelarto describes Lamboya under Umbu Tadu Meli killing Lieutenant de Neeve in 1909. By 1912 Sumba was a colonial afdeeling of the Residency of Timor, divided into sub-departments, each under a noble appointed as zelfbestuurder (raja).

## 1904–1922 · Missionaries who wrote things down
```yaml
year: [1904, 1922]
camera: [-9.7, 119.9, 8]
areas: []
places:
  - { name: Payeti, at: [-9.67, 120.27], kind: mission, note: "Reformed mission station near Waingapu (approximate)" }
  - { name: Kambaniru, at: [-9.69, 120.3], kind: mission, note: "Mission post" }
flows:
  - { kind: mission, from: [120.27, -9.67], to: [119.4, -9.6], via: [[119.9, -9.55]], label: "Wielenga's long journeys on horseback", weight: 1 }
  - { kind: mission, from: [120.27, -9.67], to: [122.0, -8.7], via: [[121.0, -9.1]], label: "Flores–Sumba contract, 1913: Catholics to Flores", weight: 1 }
sources:
  - nooteboom1940: "pp. 4-5"
  - vel2008: "p. 37"
  - onvlee1973
```
Nooteboom singles out D. K. Wielenga, a Reformed missionary who spoke the main language, rode across the whole island and wrote a grammar, a wordlist and many reports. In 1913 a contract between the missions gave Sumba to the Protestants and Flores to the Catholics. The missionary-ethnographer A. C. Kruyt spent only about six weeks on Sumba, mostly in the west and centre, but his article on the Sumbanese was still cited by Onvlee decades later.

## 1926–1955 · Onvlee and Kapita
```yaml
year: [1926, 1955]
camera: [-9.65, 119.9, 8]
areas:
  - { ref: sumba-kec:Loli, role: focus, label: "Laoeli (Loli), near Waikabubak" }
places:
  - { name: Karuni, at: [-9.43, 119.22], kind: village, note: "First lodging, until a fire in October 1927 (approximate)" }
  - { name: Laoeli, at: [-9.64, 119.39], kind: mission, note: "Onvlee's house outside Waikabubak (approximate)" }
  - { name: Mangili, at: [-10.15, 120.6], kind: village, note: "Home of Umbu Hina Kapita (approximate)" }
  - { name: Melolo, at: [-9.89, 120.66], kind: village, note: "Where the Onvlees lived in the late 1940s" }
flows:
  - { kind: mission, from: [120.6, -10.15], to: [119.39, -9.64], via: [[120.0, -9.9], [119.7, -9.75]], label: "Kapita joins Onvlee, early 1929", weight: 2 }
sources:
  - swellengrebel1978: "pp. 184-188"
  - onvlee1973: "pp. 118-119, 135"
```
Louis Onvlee, sent by the Netherlands Bible Society, arrived in 1926. Swellengrebel traces his first lodging at Karuni on the north coast, a fire in October 1927, and a house at Laoeli outside Waikabubak. From early 1929 Umbu Hina Kapita of Mangili worked with him as teacher and collaborator. Onvlee later lived at Melolo, and names 1955 as the last year of his stay.

## c. 1930s · Nooteboom's East Sumba
```yaml
year: [1930, 1940]
camera: [-9.85, 120.3, 8]
areas:
  - { ref: sumba-kec:Lewa, role: focus }
  - { ref: sumba-kec:Tabundung, role: focus }
  - { ref: sumba-kec:Kambera, role: focus }
  - { ref: sumba-kec:Kanatang, role: focus }
  - { ref: sumba-kec:Rindi, role: focus }
  - { ref: sumba-kec:Umalulu, role: focus }
places:
  - { name: Melolo, at: [-9.89, 120.66], kind: port, note: "Port and former sub-district capital" }
  - { name: Waingapu, at: [-9.65, 120.26], kind: city, note: "Capital of the sub-district East Sumba" }
flows: []
sources:
  - nooteboom1940: "pp. 3, 7, 14"
```
Christiaan Nooteboom's Oost-Soemba (1940) rests on a stay of more than a year and a half in the sub-district of East Sumba. He lists where he travelled himself: the centre of the island (Kanatang, Kapunduk, Napu, Lewa, Tidas, Tabundung, Kambera), and Masu, Kadumbul, Melolo, Rende and Mangili. He also says plainly which areas he never saw, including Karera and the south of Mangili.

## 1942–1955 · The Europeans step back
```yaml
year: [1942, 1955]
camera: [-9.7, 120.0, 7]
areas: []
places:
  - { name: Waikabubak, at: [-9.645, 119.42], kind: city, note: "Onvlee attends a meeting here in 1946" }
  - { name: Waingapu, at: [-9.65, 120.26], kind: city, note: "Seat of NICA administration" }
flows:
  - { kind: colonial, from: [123.6, -10.16], to: [120.26, -9.65], via: [[122.5, -10.0], [121.3, -9.85]], label: "NICA returns for a year, 1945–46", weight: 1 }
sources:
  - hoskins2002: "p. 801"
  - soelarto1980: "p. 36"
  - onvlee1973: "p. 118"
```
The Japanese displaced the Dutch on Sumba in 1942. Soelarto reports a year of NICA administration after 1945, and then a Sumbanese state inside the Negara Indonesia Timur. Onvlee recalls a meeting at the Waikabubak office in 1946 where a Dutch representative announced democracy to Sumbanese heads. When he left in 1955, the colonial order he had worked under was gone.

## 1960s–1976 · Ethnographers return
```yaml
year: [1960, 1976]
camera: [-9.65, 120.1, 8]
areas:
  - { ref: sumba-kec:Mamboro, role: focus, label: "Mamboro (Needham)" }
  - { ref: sumba-kec:Rindi, role: focus, label: "Rindi (Forth)" }
places:
  - { name: Kapunduk, at: [-9.5, 119.95], kind: village, note: "Adams's field site on the north coast; capital village Parai Bakul (approximate)" }
  - { name: Mamboro, at: [-9.42, 119.73], kind: village, note: "Needham's monograph, 1987 (approximate)" }
  - { name: Rindi, at: [-9.95, 120.7], kind: village, note: "Forth: 7 Feb 1975 – 21 Dec 1976 (approximate)" }
flows: []
sources:
  - adams1970: "pp. 81-82"
  - forth1981: "pp. V, 20"
  - needham1987
```
After independence, foreign anthropologists came back. Marie Jeanne Adams spent two years in East Sumba, working in Kapunduk on the north coast. Gregory Forth reached Waingapu on 10 January 1975 and lived in Rindi from 7 February 1975 to 21 December 1976, on a grant held by Rodney Needham. Needham's own book on Mamboru, published in 1987, returned to the domain whose people had hailed the VOC ships in 1677.

## 1978–1990 · A crowded field in the west
```yaml
year: [1978, 1990]
camera: [-9.6, 119.45, 9]
areas:
  - { ref: sumba-kec:Kodi, role: focus, label: "Kodi (Hoskins)" }
  - { ref: sumba-kec:Wewewa Timur, role: focus, label: "Weyewa (Kuipers)" }
  - { ref: sumba-kec:Katiku Tana, role: focus, label: "Anakalang (Keane)" }
  - { ref: sumba-kec:Umbu Ratu Nggay Barat, role: focus, label: "Lawonda (Vel)" }
  - { ref: sumba-kec:Lamboya, role: focus, label: "Laboya (Geirnaert)" }
places:
  - { name: Kodi, at: [-9.57, 119.0], kind: village, note: "Hoskins, from 1979 (approximate)" }
  - { name: Weyewa highlands, at: [-9.55, 119.3], kind: village, note: "Kuipers, from 1978 (approximate)" }
  - { name: Anakalang, at: [-9.6, 119.6], kind: village, note: "Keane, 1980s (approximate)" }
  - { name: Lawonda, at: [-9.66, 119.78], kind: village, note: "Vel, from 1986 (approximate)" }
  - { name: Laboya, at: [-9.72, 119.33], kind: village, note: "Geirnaert (approximate)" }
flows: []
sources:
  - hoskins2002
  - kuipers1998
  - keane1997
  - vel2008: "p. 39"
  - geirnaert1996: "p. 92"
```
From the late 1970s West Sumba became one of the most studied places in eastern Indonesia. Kuipers began in the Weyewa highlands in 1978 and Hoskins in Kodi in 1979; Keane worked in Anakalang in the 1980s; Vel lived around Lawonda from 1986 as a development worker; Geirnaert studied the Laboya. Their books shape how Sumba is read today, which is also why this story asks whose voices they carry.
