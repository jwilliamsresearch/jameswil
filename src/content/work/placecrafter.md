---
title: "PlaceCrafter: curating urban functional regions from OpenStreetMap points of interest"
summary: "A browser-based platial analysis tool that finds the functional regions a city actually uses, rather than the ones it is administratively divided into. Three clustering algorithms over live Overpass data, every region scored against nearest neighbour index, silhouette and Moran's I before it is believed."
period: "2025"
status: Complete
role: Author and lead developer
tags: [TypeScript, React, Leaflet, Turf.js, D3.js, OpenStreetMap, Overpass, Clustering]
featured: false
order: 4
updated: 2026-08-05

logo: ../../assets/work/placecrafter/logo.png
cover: ../../assets/work/placecrafter/analysis.png
coverAlt: "The PlaceCrafter interface over central London, showing 2,537 visible points of interest as coloured dots across five shaded functional regions, with a statistics panel reporting a nearest neighbour index of 0.529 and spatial autocorrelation of 0.898."
coverCaption: "Central London, five functional regions from 2,537 visible POIs out of 10,939 loaded. The panel on the left is the part that matters: every region arrives with its own statistics, so a cluster can be rejected rather than admired."

links:
  - label: Paper (OSMScience 2025)
    href: "/publications/williams2025-place-crafter"
  - label: DOI
    href: "https://doi.org/10.5281/zenodo.17677086"
  - label: Source
    href: "https://github.com/jwilliamsresearch/PlaceCrafter"

metrics:
  - value: "18"
    label: Functional regions
    note: "Found in the Nottingham case study from 534 filtered POIs across tourism, historical, leisure and natural categories."
  - value: "0.83"
    label: Silhouette score
    note: "Internal cohesion of those regions. Moran's I of 0.68 on the same run confirms the clustering is spatial structure, not an artefact of the algorithm."
  - value: "186"
    label: OSM subcategories
    note: "Across 29 categories, read from the OSM Map Features schema, so the filter vocabulary is the one mappers already use."
  - value: "3"
    label: Clustering algorithms
    note: "K-Means for compact formations, DBSCAN for irregular spatial structures, hierarchical for multi-level nesting. The analyst picks, the tool does not decide."

steps:
  - title: Filter with the vocabulary OSM already has
    body: "Phase one is category selection. POIs are grouped using the OSM Map Features schema rather than a bespoke taxonomy, 29 categories over 186 subcategories, and the grouping is editable per analytical task. Data is pulled live from the Overpass API, so a study area is defined by panning the map rather than by preparing an extract."
    detail: "Filter efficiency is reported alongside the counts. In the London run, 2,537 of 10,939 loaded POIs pass the active filter, which is 23 percent of the data."
  - title: Cluster interactively, with the choice exposed
    body: "Phase two applies clustering to the filtered group. K-Means finds compact formations, DBSCAN finds irregular density-led structures, and hierarchical clustering exposes multi-level nesting. All three are user-selectable with live parameters, because the right algorithm depends on the urban form being examined and pretending otherwise hides the assumption."
    detail: "Clustering runs client-side over the loaded POI set, so parameters can be swept and compared without a round trip."
  - title: Make every region prove itself
    body: "Phase three is statistical validation, and it is the reason the tool is more than a hotspot renderer. Each region is scored with the nearest neighbour index for clustering intensity, silhouette scores for internal coherence, and a simplified Moran's I for category-based spatial dependency. A cluster that looks convincing and scores badly is visible as such."
    detail: "Nottingham: Moran's I 0.68, silhouette 0.83. London: nearest neighbour index 0.529, spatial autocorrelation 0.898."
  - title: Render ambiguity rather than hiding it
    body: "Phase four is platial readability. Regions carry POI type, diversity score and density, and the visualisation layer is modular: fuzzy spray-can rendering, region influence grids, convex hulls, kernel density heatmaps and per-region quality indicators. Functional regions have soft edges, and a hard boundary would be a claim the data does not support."
    detail: "POIs and regions both export as CSV or GeoJSON, so a session ends in something another tool can read."

outcomes:
  - title: Peer-reviewed and citable
    body: "Published at OSMScience 2025 in Manila, with Gary Priestnall, University of Nottingham. The Nottingham case study is reproducible from the paper: 534 POIs, 18 regions, 344 historical and 111 leisure POIs as the dominant categories."
  - title: Validation as a first-class feature
    body: "Most clustering interfaces stop at the visualisation. Reporting nearest neighbour index, silhouette and Moran's I next to every region turns an exploratory picture into a claim that can be checked, which is what makes the output usable in research."
  - title: Platial analysis without a GIS install
    body: "The whole pipeline, from Overpass query to validated regions to export, runs in a browser tab. That removes the setup cost that keeps this kind of analysis inside GIS departments."

stack:
  - group: Application
    items: [TypeScript, React, Vite]
  - group: Mapping
    items: [Leaflet, "Turf.js", "D3.js"]
  - group: Data
    items: ["Overpass API", "OpenStreetMap Map Features schema"]
  - group: Analysis
    items: ["K-Means", DBSCAN, "Hierarchical clustering", "Moran's I", "Silhouette score", "Nearest neighbour index"]

team:
  - name: James Williams
    affiliation: Birmingham Newman University
  - name: Gary Priestnall
    affiliation: University of Nottingham

related:
  - label: "PlaceCrafter: Curating Urban Functional Regions through Platial Clustering of OpenStreetMap Points of Interest"
    href: /publications/williams2025-place-crafter
    note: Conference paper, 2025
  - label: "AnythingPOI"
    href: /work/anythingpoi
    note: Project, the POI dataset at national scale
  - label: "WalkGIS"
    href: /work/walkgis
    note: Project, where the subjective side of place is captured
---

## The brief

A city is not the regions its administrators drew. It is the regions people
use, and those cross every boundary on the official map. Formal GIS handles
space well and place badly: it can tell you which ward a cafe sits in, and
nothing about the quarter the cafe belongs to.

PlaceCrafter identifies **platial** regions, functionally coherent areas that
emerge from dense concentrations of particular points of interest, using data
OpenStreetMap already holds. The question it answers is how space is used
rather than how it was divided.

## The insight

The useful decision was to make statistical validation part of the interface
rather than a separate step someone might skip.

Clustering POIs and drawing hulls around the result is easy, and it produces
convincing pictures whether or not the clusters mean anything. Every region
here carries a nearest neighbour index, a silhouette score and a Moran's I, so
the analyst can see the difference between structure and noise before building
an argument on it. In the Nottingham case study those numbers, 0.68 and 0.83,
are what allow the 18 regions to be reported as findings rather than as
suggestions.

The second decision was to leave the algorithm choice with the analyst. Compact
formations, density-led shapes and nested hierarchies are genuinely different
urban patterns, and a tool that silently picks K-Means for all of them is
making a claim about the city on the user's behalf.

## What it does not do

It captures place through the functional coherence of POIs, which is one
dimension of a much larger thing. Temporal change and subjective meaning are
both absent: this shows where the museums cluster, not what the quarter feels
like at 11pm.

The output inherits OSM's biases. Commercial and tourist features are mapped
far more completely than informal or everyday ones, so the regions skew toward
what is visible to mappers. Clustering responds to spatial density and tag
semantics, neither of which is how a resident draws a boundary.

Planned work runs in the obvious directions: historical analysis to track how
platial regions change, multi-comparative views across cities and timeframes,
and a qualitative study of how analysts actually read the output.
