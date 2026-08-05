---
title: "Choosing an H3 resolution for neighbourhood analysis: your k-ring is not the radius you asked for"
date: 2026-02-17
tags: [H3, GIS, Spatial]
project: walkgrid
draft: false
---

Ask for a [400 m walkable neighbourhood](/work/walkgrid), the standard
five-minute walk, and H3
hands you something else. At resolution 9 you get 702 m. That is not a rounding
error, it is a neighbourhood 76% too big.

The cause is that `k` is an integer and the grid step is fixed. A disk grows in
whole rings, so its radius is wherever the grid happens to land, never the
number you asked for. Coarse resolutions land badly.

<img class="fig-mono" src="/notes/h3-neighbourhood-radius.svg" alt="Bar chart of the radius actually reached when asking H3 for a 400 metre neighbourhood at 51.48 degrees north. Resolution 7 reaches 2,457 m using 7 cells; resolution 8, 922 m using 7 cells; resolution 9, 702 m using 19 cells; resolution 10, 527 m using 61 cells; resolution 11, 401 m using 217 cells; resolution 12, 414 m using 1,519 cells." />

Grown rather than estimated, at 51.48°N:

```python
k = 1
while disk_reach(cell, k) < 400:
    k += 1
```

Resolution 9 reaches 702 m for 19 cells, resolution 10 reaches 527 m for 61,
and only [resolution 11](/notes/poi-conflation-match-rate), the resolution
[AnythingPOI](/work/anythingpoi) blocks on, lands at 401 m, for 217. Measuring the disk a second
way, as the radius of the circle of equal area, agrees: 769 m, 521 m, 371 m.

So each step costs roughly 3.5× the cells, and what it buys is boundary
accuracy. It is not buying finer cells, which mostly encode precision your
input data does not have.

Pick the resolution from the error you will accept on the boundary, then check
the cell count you can afford. Choosing on cell size alone is how a 400 m study
quietly becomes a 700 m one.

Cells are not equal-area, so these are numbers for 51°N. Rerun them at yours.
