---
title: "Liminal Toronto: measuring threshold space as divergence from its neighbours"
date: 2026-08-06
tags: [Liminality, OpenStreetMap, Toronto, Urban geography, H3]
project: anythingpoi
draft: false
---

Victor Turner described liminal space as the threshold between one social state
and another: neither here nor there, undefined, and generative because of it.
Urban geographers have applied the term to physical space, to railway lands and
waterfronts and former industrial margins, but almost always qualitatively.
This is a working note on whether you can read it from data instead.

A POI dataset is a record of declared urban function. Each point says: this
place is a café, a warehouse, a clinic. Zones with a settled character cluster
on a few categories. Zones in transition resist that clustering. The obvious
move is Shannon entropy over the category mix, and that is where I started.
Two things went wrong, and both were more interesting than the original idea.

## Forty-three percent of the data is benches

The first version used OpenStreetMap's top-level keys as categories: `amenity`,
`shop`, `leisure`, `office`. That is a tempting shortcut and it is wrong,
because those keys are not a functional taxonomy. `amenity` accounted for 68%
of all 74,314 nodes in the Toronto extract, and it covers restaurants, schools,
benches and waste baskets equally.

Sorting by tag value shows what is actually in there:

| OSM tag | nodes |
| --- | ---: |
| `amenity=bench` | 8,615 |
| `amenity=bicycle_parking` | 5,120 |
| `amenity=waste_basket` | 4,524 |
| `amenity=restaurant` | 4,168 |
| `amenity=parking_space` | 3,098 |
| `amenity=post_box` | 2,439 |

There are more benches in Toronto's OSM extract than restaurants. Street
fittings total **43% of every point in the file**. A cell containing a bench, a
bin and a bike rack was scoring as maximally mixed, which is to say the map was
substantially a picture of where sidewalks have been surveyed.

The fix is a functional crosswalk: 18 Tier-1 categories fed by explicit
tag rules, the same approach [AnythingPOI](/work/anythingpoi) uses to reconcile
OSM and Overture vocabularies. Street furniture is excluded outright, and
`shop=vacant` (865 nodes) is held aside as its own signal, since an empty unit
is evidence about transition rather than a category of use. What remains is
41,517 functional POIs with a mix that means something:

| Tier-1 category | share |
| --- | ---: |
| Food & Beverage | 27.3% |
| Retail | 21.6% |
| Personal Care & Services | 10.4% |
| Transportation | 9.0% |
| Healthcare | 7.0% |

Mean entropy went from 0.36 bits to 1.88. The signal had been there the whole
time, buried under municipal furniture.

## Mixedness is not betweenness

The second problem was conceptual, and it is the one worth writing up.

Entropy measures how internally jumbled a cell is. Turner's liminality is not
that. It is the condition of being *between* two states, of belonging to
neither of the things on either side. A cell that is half café and half
warehouse is mixed. A cell sitting on the seam where a café district becomes a
warehouse district is liminal. Those are different cells, and only the second
one is what the theory is about.

So the better measure compares a cell to its surroundings rather than to
itself: the mean Jensen-Shannon divergence between a cell's category
distribution and those of its six H3 neighbours. JSD is symmetric, bounded in
[0, 1] with log base 2, and stays finite when a category is missing from one
side, which matters on sparse cells where KL divergence would blow up.

Use the toggle to compare them. Mixedness is patchy and tracks commercial
intensity. Betweenness picks out lines.

<iframe
  src="/notes/toronto-entropy-map.html"
  style="width:100%;height:520px;border-radius:6px;border:1px solid var(--line);display:block;margin:2rem 0;"
  loading="lazy"
  title="Toronto POI category entropy and neighbour divergence by H3 cell"
></iframe>

Two floors keep noise out of the reading. Cells need at least five functional
POIs to appear, as subjects and as neighbours both: below that, entropy is a
coin flip, and 37% of cells at this resolution hold exactly one POI. That cuts
14,246 cells to 2,491. Betweenness then needs at least two qualifying
neighbours, because a cell compared against a single neighbour hits the maximum
whenever the two happen to share no category, which puts noise straight into
the top decile. That leaves 1,553 cells and drops spurious maximums from 2.2%
to 0.7%. The honest reading of those numbers is that most of Toronto is not
mapped densely enough to support the claim at all.

Colour runs by decile rather than linearly, because both measures are
right-skewed and a linear ramp leaves most of the range unused. That was the
bug in my first attempt: it normalised to 3 bits when nothing in the city
exceeded 2.25, so the map rendered almost entirely yellow.

## What it does not do

Coverage is the standing objection and it is not fully answered. A zone can
look uniform because it genuinely is, or because nobody has mapped it, and
divergence-from-neighbours inherits that ambiguity from the underlying data.
The n≥5 floor and the excluded-furniture count in each popup are partial
controls, not a solution. Conflating with Overture Maps would give an
independent second opinion on coverage, which is the obvious next step.

Every measure here is also computed on a snapshot. OSM is live, and a
liminality reading that cannot see time is describing the outcome of a
transition without seeing the transition.

## Where this goes

The temporal version is the real paper. OSM's edit history records when each
node appeared and how it was first tagged, so the category mix of a cell can be
reconstructed for any past date. Betweenness should then trace the arc of
redevelopment directly: a seam that moves across the map as one district's
character advances into another. Exhibition Place and the Portlands have run
from industrial to fairground to cultural to residential-in-waiting, and the
edit record should show those phases as a moving front rather than a static
score.

The comparison case is a planned waterfront, somewhere designed as a
single-use public amenity from the start. If liminality is a product of
unresolved land-use succession rather than of water, a planned shore should
show a low, flat divergence profile where Toronto shows a ridge.

And the null model is what would make any of it defensible: reshuffle category
labels across cells while holding each cell's POI count fixed, then ask which
cells are more divergent from their neighbours than that chance arrangement
allows. Without it, every claim on this page is an eyeball.
