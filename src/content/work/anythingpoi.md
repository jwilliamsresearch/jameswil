---
title: "AnythingPOI: a fused, confidence-scored points of interest dataset"
summary: "OpenStreetMap and Overture Maps conflated into one deduplicated, classified, openly licensed dataset. 22.7M points across six countries, every record carrying a confidence score and the evidence behind it."
period: 2026 to present
status: Active
role: Author and lead developer
tags: [OpenStreetMap, Overture Maps, H3, DuckDB, GeoParquet, PMTiles, Open data]
featured: true
order: 2
updated: 2026-08-04

logo: ../../assets/work/anythingpoi/logo.png
cover: ../../assets/work/anythingpoi/background-countries.png
coverAlt: "Three countries rendered as dense constellations of white points against black, each point a place of interest, with cities showing as bright clusters."
coverCaption: "Three of the six national datasets, drawn as their own points. Settlement structure emerges without any basemap underneath, because at this density the places are the map."

links:
  - label: Explore the map
    href: "https://jwilliams.science/anythingpoi/"
  - label: Code
    href: "https://github.com/jwilliamsresearch/anythingpoi"

metrics:
  - value: 22.7M
    label: Points of interest
    note: "Fused from OpenStreetMap and Overture Maps across six countries, deduplicated and individually scored."
  - value: "6"
    label: Countries released
    note: "Germany, Canada, the United Kingdom, Türkiye, the Netherlands and Australia, each published as a citable versioned dataset."
  - value: 545k
    label: Cross-source matches
    note: "Records independently confirmed by both sources under a 50 m gate, category agreement and 0.85 name similarity."
  - value: "93%"
    label: Wikidata match rate
    note: "On conflated pairs. A QID is the strongest single confidence signal in the scoring model, worth +0.15."

steps:
  - title: Ingest from two sources with opposite strengths
    body: "OSM PBF extracts are parsed with a streaming PyOsmium handler that accepts any named or branded feature and rejects primary tags on a non-POI blocklist. Overture places are pulled through DuckDB straight from the public S3 release, with the bounding box pushed down into the Parquet predicate."
    detail: "Ways and relations resolve to centroids via WKBFactory and Shapely. PBFs over 1.5 GB are clipped with osmconvert first, cutting parse time by 60 to 90 percent."
  - title: Block spatially before comparing anything
    body: "Every record is assigned an H3 index at resolution 11, roughly a 24 m edge. Candidates are then compared only within a cell and its six neighbours, which is what makes the problem tractable: comparing all pairs globally is quadratic and hopeless at this scale."
    detail: "Four to five orders of magnitude fewer comparisons, while still guaranteeing that any two features within about 150 m of each other are evaluated against one another."
  - title: Match on three gates, not a similarity score
    body: "A pair must clear all three: Haversine distance under 50 m, agreement on Tier-1 category through the taxonomy crosswalk, and Jaro-Winkler name similarity of at least 0.85 on normalised names. The highest-scoring surviving candidate wins, and each Overture record can claim at most one OSM record."
    detail: "Deliberately conservative. Matching thresholds this tight mean the pipeline under-claims rather than fusing two different shops into one plausible-looking record."
  - title: Score every record, and say why
    body: "Confidence starts at 0.5 and moves on evidence. A Wikidata QID adds 0.15, dual-source corroboration 0.05, and website, phone, address and opening hours add smaller amounts. A digit-only name subtracts 0.15, a name that is actually a URL subtracts 0.10."
    detail: "Observed distribution across the current release: mean 0.734, median 0.73, IQR 0.68 to 0.79. Only 0.2 percent of records fall below 0.5, and 15 percent reach 0.8 or higher."
  - title: Publish for analysis and for the browser
    body: "Output is written twice. Cloud-optimised GeoParquet, one file per Tier-1 category, sorted by H3 cell for spatial locality and readable by GeoPandas, DuckDB or QGIS. And a PMTiles v3 archive banded across four zoom ranges so a national view loads only the highest-confidence records."
    detail: "18 GeoParquet files, 35 columns each, Snappy compressed. Tiles run z4 to z16, with the national band filtered to confidence 0.7 and above."

figures:
  - src: ../../assets/work/anythingpoi/demo-map-poster.png
    alt: "An animated walkthrough of the AnythingPOI web map, panning and zooming through fused points of interest."
    caption: "The explorer. Zoom bands are the reason a national view stays responsive: at z4 to z6 only the highest-confidence records are carried, and the full dataset with all attributes appears only at street level."
    label: Fig. 1
    video:
      mp4: /assets/work/anythingpoi/demo-map.mp4
      webm: /assets/work/anythingpoi/demo-map.webm
  - src: ../../assets/work/anythingpoi/toronto-poster.png
    alt: "Visualisation options being switched over the same Toronto data, changing how the points are rendered."
    caption: "One dataset, several readings, over Toronto. Because confidence, source and category all travel with each record into the tiles, the rendering can be driven by any of them without going back to the pipeline."
    label: Fig. 2
    video:
      mp4: /assets/work/anythingpoi/toronto.mp4
      webm: /assets/work/anythingpoi/toronto.webm
  - src: ../../assets/work/anythingpoi/output-web-turkieye.png
    alt: "The AnythingPOI web interface showing the Türkiye dataset with category and attribute panels."
    caption: "Türkiye, 2.2M records. Each country is processed by the same region-agnostic pipeline, so adding one is a matter of an OSM extract and an Overture bounding box rather than new code."
    label: Fig. 3
  - src: ../../assets/work/anythingpoi/taxonomy.png
    alt: "The AnythingPOI taxonomy browser showing Tier-1 categories and their Tier-2 subcategories."
    caption: "The taxonomy: 17 Tier-1 categories over 196 subcategories, fed by 577 OSM rules and 1,539 Overture rules. Anything matching no rule is recorded as unclassified rather than forced into an approximate bucket."
    label: Fig. 4

outcomes:
  - title: Six national datasets, openly citable
    body: "Germany, Canada, the UK, Türkiye, the Netherlands and Australia are each released as a versioned dataset with a DOI, so a paper can cite the exact snapshot it used rather than a moving target."
  - title: A confidence score with its working shown
    body: "Every record carries not just a number but the signals that produced it, including per-attribute match flags for conflated pairs. A downstream user can filter on confidence or reconstruct the reasoning and disagree with it."
  - title: Two vocabularies reconciled
    body: "OSM tags and Overture category strings describe the world differently. 2,116 classification rules map both onto one two-level hierarchy, which is what makes category agreement usable as a matching gate rather than a source of false pairs."
  - title: Reproducible without a single API key
    body: "Ingestion, conflation, scoring and tile generation all run from open source code against public data. A full country takes roughly two to four hours on a sixteen-core machine, and anyone can rerun it."

stack:
  - group: Ingestion
    items: [PyOsmium, DuckDB, Geofabrik, osmconvert, Shapely]
  - group: Conflation
    items: ["H3 resolution 11", "Jaro-Winkler", "Haversine 50 m gate", "Taxonomy crosswalk"]
  - group: Output
    items: ["Cloud-optimised GeoParquet", "PMTiles v3", "MVT z4 to z16", "Snappy compression"]
  - group: Sources
    items: ["OpenStreetMap (ODbL)", "Overture Maps Foundation (CDLA 2.0)", "Wikidata (CC0)"]
  - group: Scale
    items: ["22.7M records", "2,116 classification rules", "18 category partitions", "2 to 4 hours per country"]

sponsors:
  - name: Leverhulme Centre for Research on Slavery in War
    role: Host centre
    href: "https://www.nottingham.ac.uk/research/beacons-of-excellence/rights-lab/"
    logo: ../../assets/work/anythingpoi/slaveryinwar.png
  - name: Rights Lab
    role: Host lab
    href: "https://www.nottingham.ac.uk/research/beacons-of-excellence/rights-lab/"
    logo: ../../assets/work/anythingpoi/rightslab.png
  - name: University of Nottingham
    role: Host institution
    href: "https://www.nottingham.ac.uk/"
    logo: ../../assets/work/anythingpoi/uniOfNottingham.png
  - name: King's College London
    role: Partner
    href: "https://www.kcl.ac.uk/"
    logo: ../../assets/work/anythingpoi/kcl.png

funding: >-
  AnythingPOI is developed as part of the Leverhulme Centre for Research on
  Slavery in War, University of Nottingham, in partnership with King's College
  London. Data © OpenStreetMap contributors (ODbL) and © Overture Maps
  Foundation (CDLA Permissive 2.0), with verification signals from Wikidata
  (CC0).

related:
  - label: "AnythingPOI, United Kingdom POI Dataset v0.1"
    href: /publications/anything-poi-uk2026
    note: Dataset, 2026
  - label: "AnythingPOI, Germany POI Dataset v0.1"
    href: /publications/anything-poi-germany2026
    note: Dataset, 2026
  - label: "AnythingPOI, Canada POI Dataset v0.1"
    href: /publications/anything-poi-canada2026
    note: Dataset, 2026
  - label: "AnythingPOI, Türkiye POI Dataset v0.1"
    href: /publications/anything-poi-turkiye2026
    note: Dataset, 2026
  - label: "AnythingPOI, Netherlands POI Dataset v0.1"
    href: /publications/anything-poi-netherlands2026
    note: Dataset, 2026
  - label: "AnythingPOI, Australia POI Dataset v0.1"
    href: /publications/anything-poi-australia2026
    note: Dataset, 2026
---

## The brief

Two open datasets describe the world's points of interest and neither is
sufficient alone. OpenStreetMap is community-verified and often hand-tagged,
with strong geographic fidelity and real gaps in commercial coverage. Overture
Maps, backed by Meta, Microsoft, Amazon and TomTom, has commercial-scale
breadth and lacks the granular tagging and human verification that makes OSM
trustworthy.

Anyone who needs both ends up doing the same work: pull two extracts, discover
they disagree about where things are and what to call them, write matching
logic, and produce a merged file that nobody else can reproduce or check. The
result is a private dataset with private assumptions, rebuilt from scratch by
the next person who needs one.

**AnythingPOI does that fusion once, in the open, and publishes both the
output and the pipeline.** 22.7 million records across six countries, every
one deduplicated, classified against a shared taxonomy, and carrying a
confidence score you can interrogate.

## The insight

The useful decision was to make the pipeline conservative and then say so
loudly, rather than optimising for an impressive-looking match rate.

Conflation is where this kind of project usually oversells. Loosen the
thresholds and the merged count climbs, which reads as success and quietly
fuses two different businesses that happen to share a name and a street.
Tighten them and the match rate looks unimpressive. AnythingPOI takes the
second path: a hard 50 m gate, required category agreement, and 0.85 name
similarity, all three of which must hold. The result is that cross-source
matches run between 1.4 and 3.2 percent by country.

That number is low and it is honest. A match here means two independent
datasets agree, which is why dual-source corroboration is worth something in
the confidence score at all. Inflating it would have destroyed the signal it
exists to provide.

The per-country pattern is itself informative:

| Country | Total POIs | Conflated | OSM share |
| --- | --- | --- | --- |
| Germany | 6,763,796 | 3.2% | 35.8% |
| Canada | 5,565,256 | 1.4% | 8.1% |
| United Kingdom | 4,622,174 | 2.7% | 20.5% |
| Türkiye | 2,201,304 | 1.4% | 13.9% |
| Netherlands | 1,782,538 | 2.8% | 15.8% |
| Australia | 1,735,980 | 3.0% | 18.4% |

Germany and the UK carry the richest community mapping and the highest
conflation rates, which is what you would expect and is worth being able to
demonstrate rather than assume.

The second decision was to score every record individually instead of
publishing a clean subset. A dataset that silently drops uncertain records
looks better and tells the user less. Scoring keeps everything and hands the
filtering decision to whoever knows their own tolerance.

## What it does not do

Each release is a snapshot. OSM and Overture are live, and the fused output
describes the moment the pipeline ran, which is why releases are versioned and
citable rather than continuously updated.

Conflation recall is the known weakness, and it follows directly from the
conservative thresholds. Real duplicates with transliterated names,
address-only correspondences, or a large polygon whose centroid sits far from
its entrance will not be caught. Recall is the price of precision here, paid
deliberately.

Every output record is a point. A park or a shopping centre becomes its
centroid, which is wrong in a way that matters for anything measuring area or
containment. Address completeness varies enormously by country and category:
around 42 percent street coverage for Parks and Nature against roughly 97
percent for Healthcare in Canada. And names are stored exactly as they appear
in source data, with no transliteration or translation, so cross-script
querying is left to the user.
