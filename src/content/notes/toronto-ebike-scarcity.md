---
title: "Two thirds of Toronto's bike docks have no e-bike, and 52 docks explain why"
date: 2026-09-12
tags: [Micromobility, Toronto, GBFS, Open data]
draft: false
---

Bike Share Toronto publishes a GBFS feed, and unlike most schemes it reports
inventory by bike model at every dock. Classic and electric are separately
countable, 1,068 times over, every minute. That is enough to ask a question the
operator's own headline numbers never answer: not how many e-bikes exist, but
how far you are from one.

I took a snapshot at 12:23 on Saturday 12 September 2026, Toronto time. Across the
whole network:

| | |
| --- | ---: |
| stations | 1,068 |
| docks | 20,643 |
| bikes out | 6,657 |
| classic | 5,707 |
| electric | 950 |

The system was 32.2% full. Electric was **14.3% of the stock on the street**.

That number is the advertised one, and it is the least useful thing in the
table, because a bike you cannot walk to is not supply. Counted per dock rather
than per fleet, **732 of the 1,068 stations, 68.5%, held no e-bike at all**.
Two thirds of the network offers you a classic bike or nothing.

<iframe
  src="/notes/toronto-ebike-map.html"
  style="width:100%;height:620px;border-radius:6px;border:1px solid var(--line);display:block;margin:2rem 0;"
  loading="lazy"
  title="E-bike availability across Bike Share Toronto, with a charge-space projection"
></iframe>

Click anywhere on the city view and it measures both distances from that point:
the nearest bike of any kind, and the nearest e-bike. The gap between those two
numbers is the whole note.

## The 52 docks

Toronto has 1,068 stations. **52 of them are charging docks**, 4.9% of the
network. An e-bike returned anywhere else is a battery that will not be
refilled until somebody drives to it.

Those 52 docks were holding **452 e-bikes, 47.6% of every electric bike on the
street**. Just under half the electric fleet sits on 4.9% of the stations.

Normalising for the fact that charging stations are slightly larger, mean
capacity 26.0 docks against 19.0 elsewhere, does not soften it:

| | e-bikes per dock |
| --- | ---: |
| at a charging station | **0.334** |
| everywhere else | **0.026** |

A dock that can charge is almost **thirteen times** more likely to have an e-bike in
it. Concentration follows: 34 stations hold half the electric fleet, and the
top decile of stations holds 71.9% of it.

This is not the operator failing to distribute. It is the only arrangement the
infrastructure permits. Electric supply pools where electric supply can
replenish itself, and the rest of the network gets whatever the vans managed to
move that morning.

## A projection that throws away geography

The second view drops the map. Every charging dock is moved to a single shared
origin, and each station then keeps the true bearing and the true distance to
the charging dock nearest to it. Nothing is invented: both quantities are
measured on the ground. Only the origin is shared.

What you get is the network sorted by its relationship to the thing that
constrains it. The centre is the charged core. The outer ring is every dock for
which a charger is a long van journey away, and it is crowded, because the
median station is **816 m from the nearest charging dock** and the ninetieth
percentile is **3,768 m**.

Radius is drawn on a square-root scale, so the inner ring stays readable. That
means pixel distance is not proportional to metres, and the rings are labelled
so distance is read off them rather than off the spacing.

The worst-placed station in the system is Starspray Blvd / Lawrence Ave E in
Scarborough: **10.3 km from the nearest charging dock**, and, at the moment of
the snapshot, 4.75 km from the nearest e-bike of any charge at all.

## The core is the worst served

The obvious guess is that electric is a downtown product and the suburbs go
without. The snapshot says the opposite. Banding the network by distance from
Union Station:

| ring | stations | e-bikes | stations with none |
| --- | ---: | ---: | ---: |
| 0 to 2 km | 205 | 72 | 75% |
| 2 to 5 km | 296 | 255 | 69% |
| 5 to 10 km | 309 | 382 | 61% |
| beyond 10 km | 258 | 241 | 72% |

The downtown core has 19% of the stations and 7.6% of the e-bikes. Three
quarters of its docks are empty of electric.

Read that as demand rather than as neglect. At midday on a Saturday the core's
e-bikes are not in the core, they are out being ridden, and the docks that
should catch them on return are the 1,016 that cannot charge them. The
suburban rings look better stocked because their bikes are sitting still.

Which is the honest limit of this note. **It is one snapshot.** A single moment
cannot separate a dock that is chronically empty from one that emptied eleven
minutes ago, and the midday reading is the least flattering hour to choose. The
52 charging docks and the 13x ratio are structural and will hold at any hour.
The ring table is a photograph of lunchtime.

## Two footnotes from the feed

The dock records list ten bike models they will accept: `ASTRO`, `BOOST`,
`CHLOE`, `COSMO`, `EFIT`, `EFIT G5`, `FIT`, `ICONIC`, `METRO` and
`METRO_CONNECTED`. Three were actually out on the street: 5,707 `ICONIC`, 929
`EFIT`, 21 `ASTRO`. The dock vocabulary is a fossil record of the fleet, which
is a thing gazetteers do too.

And 17 of the 52 charging docks held no e-bike at the moment I looked. The
constraint is not that the chargers are full. It is that there are 52 of them.

The snapshot is rebuilt by `scripts/build-toronto-ebikes.cjs`, which reads the
live feed and writes the file the map above loads. Run it and you get a
different Toronto, which is the point of the follow-up: poll it every five
minutes for a week, and the vans become visible.
