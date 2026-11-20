#!/usr/bin/env python3
"""WCAG contrast check for the text/background pairs used in css/app.css, listed by nesting.
Gradient surfaces are checked at both end colours; translucent glass is checked against its dark base."""
def lum(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=.03928 else ((x+.055)/1.055)**2.4 for x in c]; return .2126*c[0]+.7152*c[1]+.0722*c[2]
def cr(a,b):
    la,lb=sorted((lum(a),lum(b)),reverse=True); return (la+.05)/(lb+.05)
def mixc(a,b,t):
    a=a.lstrip('#');b=b.lstrip('#'); return '#'+''.join('%02x'%round(int(a[i:i+2],16)*(1-t)+int(b[i:i+2],16)*t) for i in (0,2,4))
F,I,R,V,G,D,W,S='#33393B','#49546D','#B2ABB4','#DFDDD7','#F6F4EF','#EEDED1','#CCD6E6','#5B6264'
ROSE='#6E4540'
P=[ # (description, fg, bg, min)
("Top bar / title gradient start #F6F4EF on dusk-start", G,F,4.5),("Top bar title gradient end #CCD6E6 on dusk-end", W,I,4.5),
("Top bar title gradient end #CCD6E6 on dusk-start", W,F,4.5),
("Top bar subtitle #DFDDD7 on dusk-end", V,I,4.5),("Top bar buttons #F6F4EF on dusk-end (glass over)", G,I,4.5),
("Search placeholder #DFDDD7 on indigo", V,I,4.5),
("Layers: names #F6F4EF on indigo", G,I,4.5),("Layers: counts/headings #DFDDD7 on indigo", V,I,4.5),
("Timeline: era name #F6F4EF on indigo", G,I,4.5),("Timeline: band label #F6F4EF on glass over indigo (+14% water)", G,mixc(I,W,.2),4.5),
("Timeline: year labels #DFDDD7 on indigo",V,I,4.5),("Timeline: segmented off #DFDDD7 on indigo",V,I,4.5),("Timeline: segmented on #33393B on #F6F4EF",F,G,4.5),
("Play button #33393B on #CCD6E6",F,W,4.5),
("Map: sea label #CCD6E6 (opacity .8) on mid dusk #3E4659", mixc('#3E4659',W,.8),'#3E4659',4.5),
("Map: land label #33393B on halo/light hex #F6F4EF",F,G,4.5),("Map: land label #33393B on highland hex (Vapor+Raindrops 30%)",F,mixc(V,R,.3),4.5),
("Banner text #F6F4EF on banner gradient end #49546D",G,I,4.5),
("Badge glyph #33393B on lightest theme face #F6F4EF-ish",F,mixc(W,'#FFFFFF',.45),4.5),("Badge glyph #33393B on Raindrops theme colour (slavery/colonial)",F,R,4.5),
("Badge glyph #33393B on Dew/Vapor/Water faces",F,W,4.5),
("Card header: title #F6F4EF on dusk-end",G,I,4.5),("Card header: sub #DFDDD7 on dusk-end",V,I,4.5),("Card header chips #F6F4EF on glass over dusk-end",G,mixc(I,G,.15),4.5),
("Card body text #33393B on #F6F4EF",F,G,4.5),("Card soft text #5B6264 on #F6F4EF",S,G,4.5),("Card soft text #5B6264 on Dew",S,D,4.5),
("Card links #49546D on #F6F4EF",I,G,4.5),("Chip #33393B on Dew",F,D,4.5),("Chip hover #33393B on Water",F,W,4.5),
("Source card #33393B on Dew end of gradient",F,D,4.5),("Source number #F6F4EF on dusk-end",G,I,4.5),("Source soft note #5B6264 on Dew",S,D,4.5),
("Tag #33393B on Vapor",F,V,4.5),("Tag peer-reviewed #33393B on Water",F,W,4.5),("Tag local #F6F4EF on Forest",G,F,4.5),
("Verify ok #33393B on Water",F,W,4.5),("Verify warn #6E4540 on Dew",ROSE,D,4.5),("Verify offline/search #33393B on Vapor",F,V,4.5),
("Modal title #33393B on mist start #F6F4EF",F,G,4.5),("Modal title #33393B on mist end #CCD6E6",F,W,4.5),
("Buttons on light #33393B on Dew",F,D,4.5),("Primary button #F6F4EF on dusk-end",G,I,4.5),
("Search results #5B6264 on #F6F4EF",S,G,4.5),("Question count #5B6264 on #F6F4EF",S,G,4.5),
("Tooltip #F6F4EF on dusk-end",G,I,4.5),("Tooltip sub #DFDDD7 on dusk-end",V,I,4.5),("Tooltip link #CCD6E6 on dusk-end",W,I,4.5),
("Tour HUD #DFDDD7 on dusk-end",V,I,4.5),
]
bad=0
for d,f,b,m in P:
    r=cr(f,b); ok=r>=m; bad+=not ok
    print(f"{'PASS' if ok else 'FAIL'} {r:5.2f}:1 (min {m})  {d}  [{f} on {b}]")
print(f"\n{len(P)-bad}/{len(P)} pass"); raise SystemExit(1 if bad else 0)
