---
id: sea-slave-network
title: "Bonds across the water"
subtitle: "The Southeast Asian slave network, c. 1500–1900"
author: "Ejak (Reza Arlianda), with Claude"
date: 2026-11-21
region: [[-12, 94], [20, 141]]
basemap: dusk
geo: [indonesia-prov]
cover: "Captives, debtors and the ports that wanted them: four centuries of forced movement."
---
For four centuries people were raided, sold, pledged for debt and shipped across the waters of the archipelago. Some stayed near home; some were carried past the edge of this map to Ceylon, the Cape or the Mascarene islands. This story follows the routes historians have been able to reconstruct, says where their numbers are guesses, and tries to remember that every line on the map was a person.

## Early 1500s · Bondage before the trade
```yaml
year: [1500, 1520]
camera: [-1.0, 103.5, 5]
areas:
  - { ref: indonesia-prov:Sumatera Selatan, role: focus }
places:
  - { name: Melaka, at: [2.19, 102.25], kind: port, note: "Emporium taken by the Portuguese in 1511" }
  - { name: Palembang, at: [-2.99, 104.76], kind: port, note: "Supplier of people and rice to Melaka" }
flows:
  - { kind: slave, from: [104.76, -2.99], to: [102.25, 2.19], via: [[104.0, -1.0]], label: "Junks from Palembang", weight: 1 }
  - { kind: trade, from: [104.76, -2.99], to: [102.25, 2.19], via: [[103.9, -1.2]], label: "Rice, the main cargo", weight: 2 }
sources:
  - raben2008: "pp. 119–122"
  - reid1983: "pp. 13–14, as cited by Raben 2008"
evidence: contested
```
Anthony Reid argued that slaves were everywhere in the great trading cities. Remco Raben re-reads the thin evidence, mostly Tomé Pires in the 1510s, and finds the numbers modest. Melaka's private slaves on the eve of 1511 were a few thousand, probably under a tenth of the city. Ten to twelve Palembang junks a year carried people alongside rice.

> More
Raben stresses that bondage took many forms: debt, punishment, war capture and trade, all blurring into each other. Most bonded labourers worked close to where they were born. Long-distance traffic existed, but it fed courts and elites more than it filled whole cities.

## Mid-1500s–1610s · Captives raised the forts
```yaml
year: [1545, 1615]
camera: [0.0, 107.0, 4]
areas:
  - { ref: indonesia-prov:Sulawesi Selatan, role: focus }
  - { ref: indonesia-prov:Aceh, role: focus }
places:
  - { name: Gowa (Makassar), at: [-5.14, 119.42], kind: kingdom, note: "Tunipalangga used captives to build forts" }
  - { name: Aceh, at: [5.55, 95.32], kind: kingdom, note: "Iskandar Muda's campaigns on the Malay peninsula" }
flows:
  - { kind: military, from: [95.32, 5.55], to: [102.25, 2.19], via: [[98.0, 4.5]], label: "Aceh's campaigns on the peninsula", weight: 2 }
  - { kind: slave, from: [102.25, 2.19], to: [95.32, 5.55], via: [[98.5, 4.2]], label: "Deported warriors to Aceh", weight: 2 }
sources:
  - raben2008: "pp. 124–125, 132"
```
Raben describes mass enslavement as a tool of ambitious rulers rather than of ordinary commerce. In mid-sixteenth-century South Sulawesi, Gowa's ruler Tunipalangga set captives to building his forts. In the 1610s Aceh's Iskandar Muda deported thousands of men from wars on the Malay peninsula. Raben calls such hunger for manpower exceptional, and notes it needed raiding, not purchase.

## 1620s–1660s · Batavia looks abroad
```yaml
year: [1622, 1666]
camera: [8.0, 98.0, 3]
places:
  - { name: Batavia, at: [-6.13, 106.81], kind: city, note: "VOC headquarters, founded 1619" }
  - { name: Mrauk U (Arakan), at: [20.6, 93.2], kind: port }
flows:
  - { kind: colonial, from: [80.3, 13.1], to: [106.81, -6.13], via: [[90.0, 6.0], [98.0, 0.0]], label: "Famine captives from Coromandel", weight: 3 }
  - { kind: slave, from: [93.2, 20.6], to: [106.81, -6.13], via: [[96.0, 8.0], [103.0, 1.0]], label: "Arakan purchases, 1625–1666", weight: 2 }
  - { kind: slave, from: [119.42, -5.14], to: [106.81, -6.13], via: [[113.0, -7.5]], label: "Small private imports from the islands", weight: 1 }
sources:
  - raben2008: "pp. 125–126"
  - vink2003: "pp. 131–177 (article abstract; p. 141 as cited by Raben)"
```
Raben shows the Dutch Company struggled to buy slaves locally, so it shipped them from India. Famine, not routine trade, drove the Coromandel supply: about a thousand mostly women and children in 1622, over two thousand in 1646. Arakan became another source until 1666. Vink argues such Dutch slavery must be understood region by region, not as one uniform system.

## 1667–1669 · The fall of Makassar
```yaml
year: [1667, 1669]
camera: [-6.0, 113.0, 5]
areas:
  - { ref: indonesia-prov:Sulawesi Selatan, role: focus }
places:
  - { name: Makassar, at: [-5.14, 119.42], kind: battle, note: "Conquered by the VOC and its allies" }
  - { name: Batavia, at: [-6.13, 106.81], kind: city }
flows:
  - { kind: military, from: [106.81, -6.13], to: [119.42, -5.14], via: [[113.0, -6.8]], label: "VOC and allied campaigns", weight: 3 }
  - { kind: slave, from: [119.42, -5.14], to: [106.81, -6.13], via: [[113.0, -6.4]], label: "Prizes of war to Batavia", weight: 3 }
sources:
  - raben2008: "pp. 127, 133"
  - sutherland1983: "p. 267, as cited by Raben 2008"
```
Raben links the Company's campaigns in South Sulawesi in 1667–69 to a sudden jump in Batavia's slave imports, peaking at 1,584 in 1671. Many Sulawesi people were enslaved as war prizes. Raben argues the conquest also redirected Makassar's existing network towards Dutch Batavia, and encouraged further raiding. Sutherland has studied the region's slave trade in the same period.

## 1670 · What Makassar's traders knew
```yaml
year: 1670
camera: [-4.0, 118.0, 5]
areas:
  - { ref: indonesia-prov:Nusa Tenggara Timur, role: focus }
  - { ref: indonesia-prov:Sulawesi Tenggara, role: focus }
places:
  - { name: Makassar, at: [-5.14, 119.42], kind: market }
  - { name: Buton, at: [-5.47, 122.6], kind: kingdom }
  - { name: Banjarmasin, at: [-3.32, 114.59], kind: port, note: "Slaves worked its pepper gardens" }
flows:
  - { kind: slave, from: [122.6, -5.47], to: [119.42, -5.14], via: [[121.0, -5.0]], label: "Buton", weight: 2 }
  - { kind: slave, from: [123.6, -10.16], to: [119.42, -5.14], via: [[121.5, -8.0]], label: "Timor, Alor, Manggarai", weight: 2 }
  - { kind: slave, from: [119.42, -5.14], to: [114.59, -3.32], via: [[117.0, -4.3]], label: "To Banjarmasin pepper", weight: 1 }
  - { kind: slave, from: [119.42, -5.14], to: [95.32, 5.55], via: [[108.0, -2.0], [101.0, 2.0]], label: "To Jambi, Johor, Aceh", weight: 1 }
sources:
  - raben2008: "p. 132"
```
Raben uses Cornelis Speelman's 1670 note on Makassar's trade to map where captives came from: Manggarai, Timor, Tanimbar, Alor, Butung, Mindanao and Brunei. From Makassar they were sold on to Banjarmasin, Batavia, Palembang, Jambi, Aceh and Johor. Raben notes that supply areas stayed broadly the same through the seventeenth and eighteenth centuries: eastern, non-Muslim and politically fragmented.

## 1663–1682 · Counting Batavia's imports
```yaml
year: [1663, 1682]
camera: [-6.5, 113.0, 5]
places:
  - { name: Batavia, at: [-6.13, 106.81], kind: city }
  - { name: Bali, at: [-8.11, 115.09], kind: market }
  - { name: Buton, at: [-5.47, 122.6], kind: market }
flows:
  - { kind: slave, from: [119.42, -5.14], to: [106.81, -6.13], via: [[113.0, -6.6]], label: "Makassar, over two-fifths", weight: 4 }
  - { kind: slave, from: [115.09, -8.11], to: [106.81, -6.13], via: [[111.0, -7.4]], label: "Bali, almost a quarter", weight: 2 }
  - { kind: slave, from: [122.6, -5.47], to: [106.81, -6.13], via: [[114.0, -6.5]], label: "Buton, about 12%", weight: 1 }
sources:
  - raben2008: "p. 127"
```
Raben counted Batavia's harbour diaries: 9,809 slaves arrived on Indonesian vessels over twenty years, about 490 a year. Almost a quarter came from Bali, over two-fifths from Makassar, around twelve per cent from Butung. Raben warns the figures are incomplete: many people were smuggled, the Company imported separately, and ports were often only transit points.

## 1650s–1700s · Bali sells to buy iron
```yaml
year: [1650, 1700]
camera: [-8.1, 113.5, 6]
areas:
  - { ref: indonesia-prov:Bali, role: focus }
places:
  - { name: Bali (Buleleng), at: [-8.11, 115.09], kind: market, note: "Exports of people grew after internal wars from 1650" }
  - { name: Batavia, at: [-6.13, 106.81], kind: city }
flows:
  - { kind: slave, from: [115.09, -8.11], to: [106.81, -6.13], via: [[111.0, -7.4]], label: "Balinese captives to Batavia", weight: 2 }
  - { kind: trade, from: [106.81, -6.13], to: [115.09, -8.11], via: [[111.0, -7.0]], label: "Ironware and foreign goods", weight: 1 }
sources:
  - raben2008: "pp. 127, 133, 135"
  - vanderkraan1983: "chapter, pp. 315–340"
```
Following Schulte Nordholt and Van der Kraan, Raben dates large-scale slave exports from Bali to after 1650, when internal wars broke the island's authority. Balinese states had little else to sell Batavia and relied on slaves to buy ironware. In 1688 Batavia banned Eastern slaves without permission and closed all Bali shipping, which Raben thinks hit Balinese revenues hard.

## 1688–1740s · Bans, loopholes and boom
```yaml
year: [1688, 1750]
camera: [-6.5, 114.0, 5]
places:
  - { name: Batavia, at: [-6.13, 106.81], kind: city, note: "25,000–40,000 slaves at any time" }
  - { name: Buton, at: [-5.47, 122.6], kind: kingdom, note: "Sultan allowed 50–60 slaves a year from 1701" }
flows:
  - { kind: colonial, from: [106.81, -6.13], to: [115.09, -8.11], via: [[111.0, -7.0]], label: "1688 ban on Bali traffic", weight: 1 }
  - { kind: slave, from: [122.6, -5.47], to: [106.81, -6.13], via: [[114.0, -6.5]], label: "Licensed Buton quota", weight: 1 }
  - { kind: slave, from: [119.42, -5.14], to: [106.81, -6.13], via: [[113.0, -6.6]], label: "Illicit and re-licensed imports", weight: 3 }
sources:
  - raben2008: "pp. 127–129"
```
Fearing slave unrest, Batavia restricted eastern imports after 1688, then bent its own rules. Buton's sultan, whose realm had almost nothing else to sell, won a quota of fifty or sixty people a year in 1701. Raben shows the bans were lifted in 1744 and 1752–58 when labour ran short after malaria and the 1740 massacre of Chinese residents.

## 1700s–1770s · Batavia's slave city
```yaml
year: [1700, 1779]
camera: [-6.5, 112.0, 5]
places:
  - { name: Batavia, at: [-6.13, 106.81], kind: city, note: "Slave population 25,000–40,000" }
  - { name: Banjarmasin, at: [-3.32, 114.59], kind: port }
flows:
  - { kind: slave, from: [119.42, -5.14], to: [106.81, -6.13], via: [[113.0, -6.6]], label: "Makassar and Sulawesi", weight: 3 }
  - { kind: slave, from: [115.09, -8.11], to: [106.81, -6.13], via: [[111.0, -7.4]], label: "Bali", weight: 3 }
  - { kind: slave, from: [114.59, -3.32], to: [106.81, -6.13], via: [[110.5, -4.5]], label: "Kalimantan ports", weight: 1 }
  - { kind: colonial, from: [80.3, 13.1], to: [106.81, -6.13], via: [[90.0, 6.0], [98.0, 0.0]], label: "Company imports from India", weight: 2 }
sources:
  - raben2008: "pp. 128–131"
  - vink2003: "pp. 131–177 (abstract only)"
evidence: contested
```
Batavia's registers show 25,000 to 40,000 slaves in the city and its surroundings. When freed in 1749–50, almost half came from Bali and Sulawesi. Raben reckons the true yearly import was several thousand, and cites a Dutch resident's claim of 4,000 in 1779, but he treats it cautiously. Vink likewise calls Dutch slave-trade volumes tentative.

## 1700s · Eastern Nusa Tenggara and the Savu Sea
```yaml
year: [1700, 1800]
camera: [-9.0, 121.5, 6]
areas:
  - { ref: indonesia-prov:Nusa Tenggara Timur, role: focus }
  - { ref: indonesia-prov:Nusa Tenggara Barat, role: contested }
places:
  - { name: Ende, at: [-8.84, 121.66], kind: port }
  - { name: Bima, at: [-8.46, 118.73], kind: kingdom }
  - { name: Waingapu (Sumba), at: [-9.65, 120.26], kind: village }
  - { name: Kupang, at: [-10.16, 123.6], kind: fort }
flows:
  - { kind: slave, from: [120.26, -9.65], to: [121.66, -8.84], via: [[121.0, -9.4]], label: "Sumba raided by Ende", weight: 2 }
  - { kind: slave, from: [120.26, -9.65], to: [118.73, -8.46], via: [[119.5, -9.2]], label: "Sumba to Bima", weight: 2 }
  - { kind: slave, from: [118.73, -8.46], to: [106.81, -6.13], via: [[112.0, -7.6]], label: "Bima and Sumbawa to Batavia", weight: 1 }
  - { kind: slave, from: [123.6, -10.16], to: [119.42, -5.14], via: [[121.5, -8.0]], label: "Timor captives", weight: 1 }
sources:
  - raben2008: "p. 130"
  - hoskins1996: "pp. 224–225"
  - needham1983: "passim, alongside the peer-reviewed sources"
```
Raben notes that Timor and Bima shipped slaves to Batavia, and that many were bought on neighbouring Sumba, Flores (Ende) and Solor. Hoskins reports that early Dutch officials saw Sumba as torn by warfare and the slave trade, with raiders from Ende, and described Sumbanese warriors seizing women and children to sell. Needham's study of Sumba and the slave trade covers this ground.

## 1681–1700s · Protecting the spice islands
```yaml
year: [1681, 1710]
camera: [-3.0, 128.0, 5]
areas:
  - { ref: indonesia-prov:Maluku, role: focus }
  - { ref: indonesia-prov:Maluku Utara, role: focus }
places:
  - { name: Banda Neira, at: [-4.52, 129.9], kind: plantation, note: "Slaves on nutmeg estates" }
  - { name: Ambon, at: [-3.7, 128.18], kind: fort }
  - { name: Tidore, at: [0.68, 127.4], kind: kingdom }
flows:
  - { kind: colonial, from: [128.18, -3.7], to: [129.9, -4.52], via: [[129.0, -4.2]], label: "Slaves for Banda nutmeg", weight: 2 }
  - { kind: military, from: [127.4, 0.68], to: [122.6, -5.47], via: [[125.0, -2.5]], label: "Ternate and Tidore coast raids", weight: 1 }
sources:
  - raben2008: "pp. 133–134"
  - bosma2020: "p. 110"
```
The Company controlled the spice islands, and Raben shows it shaped slaving there: Ambon banned slave imports from the south-east in 1681 to protect Banda's supply for nutmeg planters. The sultans of Ternate and Tidore were scolded for raids on Sulawesi and Butung coasts. Raben adds that slaves from Maluku, eastern Nusa Tenggara and Papua did not travel west in large numbers.

## 1770s–1870s · The Sulu zone
```yaml
year: [1770, 1870]
camera: [3.0, 118.0, 4]
places:
  - { name: Jolo (Sulu), at: [6.05, 121.0], kind: market, note: "Slave market of the Sulu sultanate" }
  - { name: Balangingi, at: [6.3, 121.7], kind: raid, note: "Raiding home base" }
flows:
  - { kind: military, from: [121.7, 6.3], to: [109.0, 1.5], via: [[117.0, 4.0]], label: "Balangingi fleets west", weight: 3 }
  - { kind: military, from: [121.0, 6.05], to: [122.0, -2.0], via: [[121.5, 2.0]], label: "Raids on Sulawesi coasts", weight: 2 }
  - { kind: slave, from: [109.0, 1.5], to: [121.0, 6.05], via: [[117.0, 3.5]], label: "Captives to Jolo", weight: 3 }
  - { kind: trade, from: [121.0, 6.05], to: [118.0, 20.0], via: [[119.5, 12.0]], label: "Pearls, trepang, to China", weight: 2 }
sources:
  - warren1981: "whole book"
  - warren2002: "whole book"
  - bosma2020: "p. 110"
  - sutherland2004: "pp. 133–157 (abstract only)"
evidence: contested
```
James Warren argues that China's demand for sea and forest goods drove organised Iranun and Balangingi raiding, feeding the Sulu sultanate with captives. Bosma reports his estimate of 200,000 to 300,000 people taken to Sulu between 1770 and 1870. Heather Sutherland's review finds Warren's picture of servility too uniform and his labour needs possibly overstated.

## 1780s–1860s · Raiding in Indonesian waters
```yaml
year: [1780, 1862]
camera: [1.0, 117.0, 4]
places:
  - { name: Gorontalo, at: [0.54, 123.06], kind: port }
  - { name: Zamboanga, at: [6.91, 122.07], kind: fort, note: "Spanish post where escapees sought safety" }
flows:
  - { kind: slave, from: [123.06, 0.54], to: [121.0, 6.05], via: [[122.5, 3.5]], label: "Kalunea, seized at sea, sold at Jolo", weight: 1 }
  - { kind: slave, from: [120.8, 5.55], to: [117.37, 2.84], via: [[119.0, 4.0]], label: "Dandajoe, taken from Siasi", weight: 1 }
  - { kind: military, from: [121.7, 6.3], to: [116.0, -3.0], via: [[119.0, 1.5]], label: "Raids in Java Sea and Borneo waters", weight: 2 }
sources:
  - bosma2020: "pp. 111, 113, 116–117"
```
Bosma says raiding intensified in Indonesian waters from the 1780s, helped by firearms traded through Singapore. Most captives were seized at sea. Kalunea, a sailor from Gorontalo, was sold at Jolo and escaped to Zamboanga after seven years. Dandajoe, taken from Siasi and sold in Bulungan, married as a free woman, though Bosma doubts the record tells everything.

## 1800s · Debt as well as capture
```yaml
year: [1800, 1880]
camera: [-2.5, 113.0, 5]
areas:
  - { ref: indonesia-prov:Sulawesi Selatan, role: focus }
  - { ref: indonesia-prov:Kalimantan Barat, role: focus }
places:
  - { name: Pontianak, at: [-0.03, 109.33], kind: port }
flows:
  - { kind: slave, from: [119.42, -5.14], to: [109.33, -0.03], via: [[114.0, -3.5]], label: "Debt slaves to coconut estates, 1870", weight: 2 }
  - { kind: labour, from: [119.42, -5.14], to: [117.0, 0.0], via: [[118.0, -2.5]], label: "Sulawesi to East Kalimantan forests", weight: 2 }
sources:
  - bosma2020: "pp. 111–113"
  - reid1983: "volume on bondage and dependency"
```
Reid's distinction between slavery, bondage and dependency matters here. Bosma argues that nineteenth-century commerce turned debt into a trap: interest could reach 30 to 100 per cent, fines and invented debts bound people, and Bugis traders staged gambling to indebt Toraja. In 1870 four Pontianak ships loaded slaves in Sulawesi, while Dutch authorities hesitated to intervene.

## 1800s–1860s · The Mascarene route
```yaml
year: [1800, 1830]
camera: [-9.0, 112.0, 4]
places:
  - { name: Bali, at: [-8.11, 115.09], kind: market, note: "500–1,200 sold yearly in the early 1800s (estimates)" }
flows:
  - { kind: slave, from: [115.09, -8.11], to: [57.5, -20.2], via: [[108.0, -12.0], [80.0, -17.0]], label: "French ships to Bourbon and Mauritius", weight: 2 }
  - { kind: slave, from: [118.73, -8.46], to: [57.5, -20.2], via: [[108.0, -12.5], [80.0, -17.5]], label: "From the Nusa Tenggara islands", weight: 1 }
sources:
  - bosma2020: "p. 113"
  - allen2015: "book (known only through Bennett's 2016 review)"
evidence: contested
```
Bosma reports estimates of 500 to 1,200 people sold yearly from Bali in the early 1800s despite British and Dutch patrols, and says thousands from Bali and the islands east of it were carried by French ships to Bourbon and Mauritius. Richard Allen's wider study of European slave trading in the Indian Ocean treats Asian captives as part of this system.

## 1820s–1850s · Slaves for global goods
```yaml
year: [1820, 1855]
camera: [-1.5, 108.0, 4]
areas:
  - { ref: indonesia-prov:Sumatera Utara, role: focus }
  - { ref: indonesia-prov:Aceh, role: focus }
places:
  - { name: Nias, at: [-1.1, 97.6], kind: market }
  - { name: Banda Neira, at: [-4.52, 129.9], kind: plantation }
flows:
  - { kind: slave, from: [97.6, -1.1], to: [95.32, 5.55], via: [[96.0, 2.0]], label: "Nias to Aceh, c. 1,500 a year", weight: 3 }
  - { kind: slave, from: [120.26, -9.65], to: [115.09, -8.11], via: [[118.0, -9.5]], label: "Savu Sea to Bali and Lombok", weight: 2 }
  - { kind: slave, from: [132.3, -2.9], to: [127.4, 0.68], via: [[130.0, -1.5]], label: "From New Guinea (no figures)", weight: 1 }
  - { kind: slave, from: [119.42, -5.14], to: [116.0, -2.0], via: [[117.5, -3.5]], label: "Sulawesi to Kalimantan", weight: 2 }
sources:
  - bosma2020: "pp. 110, 113–115"
```
Bosma argues slavery grew with global demand for pepper, nutmeg, rice, trepang, bird's nests and forest goods. He puts Nias at around 1,500 a year before 1863, most going to Aceh, and 500 to 1,000 a year for each major Savu Sea island. His estimate of seven to nine thousand people carried yearly mid-century is, he admits, tentative.

## 1860–1863 · Abolition and the Nias expedition
```yaml
year: [1860, 1863]
camera: [-1.0, 100.0, 5]
places:
  - { name: Nias, at: [-1.1, 97.6], kind: battle, note: "1863 expedition against slaving villages" }
  - { name: Batavia, at: [-6.13, 106.81], kind: city }
flows:
  - { kind: colonial, from: [106.81, -6.13], to: [97.6, -1.1], via: [[101.0, -3.8]], label: "1863 military expedition", weight: 2 }
sources:
  - bosma2020: "pp. 117–118"
```
Bosma says a comprehensive ban on slavery in the Netherlands Indies came only in 1860, and that abolition had not been a priority before. Where slaving was entrenched, enforcement could be violent: on Nias in 1863 the colonial government sent an expedition that destroyed villages and killed about seven hundred people. Abolition arrived as law, and as force.

## 1870s–1906 · Registration, peonage, restraint
```yaml
year: [1870, 1906]
camera: [-5.0, 118.0, 5]
areas:
  - { ref: indonesia-prov:Sulawesi Selatan, role: focus }
  - { ref: indonesia-prov:Nusa Tenggara Timur, role: contested }
places:
  - { name: Makassar, at: [-5.14, 119.42], kind: city, note: "Ten thousand slaves registered in the early 1870s" }
  - { name: Aceh, at: [5.55, 95.32], kind: battle, note: "War from 1873 absorbed Dutch forces" }
flows:
  - { kind: colonial, from: [106.81, -6.13], to: [119.42, -5.14], via: [[113.0, -6.6]], label: "Registration of slaves", weight: 1 }
  - { kind: military, from: [106.81, -6.13], to: [95.32, 5.55], via: [[100.0, -1.0]], label: "Aceh War diverts force", weight: 3 }
sources:
  - bosma2020: "pp. 117–118"
```
In South Sulawesi, Bosma explains, registration began in the 1870s, meant to lead to emancipation, with slaves becoming peons who still worked for their masters. About ten thousand were registered, and then nothing more happened. After war began in Aceh in 1873, Batavia chose restraint; in 1878 officials in Timor and Kalimantan were told not to enforce abolition.

## 1890s–1900s · Afterlives
```yaml
year: [1890, 1910]
camera: [-2.0, 118.0, 4]
areas:
  - { ref: indonesia-prov:Sulawesi Tengah, role: focus }
  - { ref: indonesia-prov:Bali, role: focus }
  - { ref: indonesia-prov:Nusa Tenggara Timur, role: focus }
places:
  - { name: Central Sulawesi, at: [-1.4, 120.0], kind: village, note: "Kidnapping and slave trading reported as epidemic by the 1890s" }
  - { name: Lombok, at: [-8.6, 116.3], kind: kingdom, note: "Rulers objected to naval inspections in 1888" }
flows:
  - { kind: slave, from: [120.0, -1.4], to: [117.0, 0.0], via: [[118.5, -0.7]], label: "Central Sulawesi captives", weight: 1 }
  - { kind: colonial, from: [106.81, -6.13], to: [116.3, -8.6], via: [[111.5, -7.6]], label: "Naval inspection ordered", weight: 1 }
sources:
  - bosma2020: "pp. 112–113, 118–119"
```
Bosma shows that trafficking embarrassed colonial officials into the 1890s and lingered into the twentieth century. Lombok's rulers refused naval inspections of their ports in 1888, and kidnapping in Central Sulawesi was described as epidemic. After the Aceh War ended in 1906, expeditions went to Sulawesi and Bali. Bosma adds that colonial narratives largely forgot this history.

## 1652–1808 · Beyond the frame: the Cape
```yaml
year: [1652, 1808]
camera: [-6.0, 106.0, 3]
places:
  - { name: Batavia, at: [-6.13, 106.81], kind: city }
flows:
  - { kind: slave, from: [106.81, -6.13], to: [18.42, -33.92], via: [[90.0, -14.0], [55.0, -30.0]], label: "To Cape Town (leaves the frame)", weight: 1 }
  - { kind: colonial, from: [106.81, -6.13], to: [79.85, 6.93], via: [[93.0, -2.0]], label: "Company networks to Ceylon", weight: 1 }
sources:
  - worden2018: "section on the origins of Cape slaves"
  - ward2009: "book description (chs 4–6)"
```
The Company's network reached past this map. Worden notes that the Cape's slaves came from South and Southeast Asia, Madagascar and south-eastern Africa, including Bugis people from eastern Indonesia and others arriving from Batavia; there were almost 17,000 by 1795. Ward's study treats such forced movement, including exile of political prisoners from Java, as a core part of the Company's empire.
