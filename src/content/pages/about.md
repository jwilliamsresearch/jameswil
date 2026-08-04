---
title: About
label: About
lead: "Geospatial data developer building production pipelines and spatial platforms at national and global scale."
description: James Williams is a geospatial data developer building production ETL, spatial platforms and geocoding infrastructure. Python, SQL, PostGIS, DuckDB, Spark, H3, FastAPI, Docker and AWS.
updated: 2026-08-04

metrics:
  - value: 894M+
    label: Place references resolved
    note: A geocoder reconciling nine gazetteer sources that spell the same place nine ways.
  - value: "53"
    label: Sources unified
    note: A single 23.5M-record platform, so thirty researchers stopped filing requests for extracts.
  - value: 23M+
    label: Points of interest conflated
    note: Across six countries, published openly as versioned datasets.
  - value: 4h → min
    label: Map preparation
    note: A four-hour manual process cut to minutes. Ground truth analysis went from weeks to days.

affiliations:
  - name: University of Nottingham
    href: "https://www.nottingham.ac.uk/"
    logo: ../../assets/about/uniOfNottingham.png
  - name: Rights Lab
    href: "https://www.nottingham.ac.uk/research/beacons-of-excellence/rights-lab/"
    logo: ../../assets/about/rightslab.png
  - name: Leverhulme Centre for Research on Slavery in War
    href: "https://www.nottingham.ac.uk/research/beacons-of-excellence/rights-lab/"
    logo: ../../assets/about/slaveryinwar.png
  - name: King's College London
    href: "https://www.kcl.ac.uk/"
    logo: ../../assets/about/kcl.png
  - name: Birmingham Newman University
    href: "https://www.newman.ac.uk/"
    logo: ../../assets/about/birminghamNewman.png
  - name: Ordnance Survey
    href: "https://www.ordnancesurvey.co.uk/"
    logo: ../../assets/about/ordnanceSurvey.png
  - name: Engineering and Physical Sciences Research Council
    href: "https://www.ukri.org/councils/epsrc/"
    logo: ../../assets/about/ukri.png
  - name: Horizon Centre for Doctoral Training
    href: "https://www.horizon.ac.uk/"
    logo: ../../assets/about/horizonCDT.png
---

I design reproducible ETL for large heterogeneous datasets, covering
ingestion, conflation, entity resolution, validation, and publication to
GeoParquet, PMTiles and vector tiles.

Recent deliveries include [CDISAW](/work/cdisaw), a 23.5M-record platform
unifying 53 source datasets; [AnythingPOI](/work/anythingpoi), 22.7M conflated
points of interest across six countries; [Topodex](/work/topodex), a geocoder
resolving 894M+ place references across nine gazetteers; and
[WalkGrid](/work/walkgrid), a routing engine fusing 49 datasets at millisecond
response.

I hold a PhD in Geospatial Computer Science, an MSc in Computer Science and a
BSc in Information and Communications Technology.

## What I am working towards

A place is not the same thing as a coordinate, and the difference is
computable. Most spatial infrastructure is built to answer where something is,
which leaves the questions people actually ask, about what somewhere is like
and whether it is worth going, outside the schema entirely.

My research puts those questions inside it. That has meant modelling
environmental preference across [51 features of a city](/work/walkgrid),
convening [the standards work](/work/lwswg) the field was missing, and
proposing [a format](/work/geon) that lets a language model reason about a
place rather than render it. The production side is the same problem at
volume: infrastructure only earns trust when somebody who did not build it can
pick it up and rely on it.

## How I work

Systems at this scale fail quietly. A geocoder resolves the wrong settlement.
A join succeeds against the wrong projection and nobody notices for a year. A
conflation match looks plausible and is not. So the effort goes into
validation, provenance, and making a pipeline legible to whoever inherits it.

The numbers I care most about are the unglamorous ones: a four-hour manual map
preparation process cut to minutes, ground truth analysis cut from weeks to
days, prototypes taken through to commercial deployment rather than left at
the paper.

## Technical skills

| Area | Tools |
| --- | --- |
| Languages | Python (pandas, geopandas, Shapely, PyOsmium), SQL, PySpark, Scala, JavaScript and TypeScript, Node.js |
| Data engineering | ETL and ELT design, Apache Spark, DuckDB, GeoParquet, conflation, entity resolution, validation |
| Spatial data | PostGIS, spatial SQL, H3 discrete global grids, vector tiles, OpenStreetMap, Overture Maps |
| Databases and cloud | PostgreSQL, Elasticsearch, AWS (EC2, S3, Lambda), Docker, FastAPI, REST API design |
| Practice | Git, CI/CD with GitHub Actions, pytest, code review, containerized deployment, orchestration |
| ML and GIS | Embeddings, graph neural networks, NLP geoparsing, LLM integration, QGIS, ArcGIS Pro, FME, MapLibre |

## Experience

| Period | Role | Organisation |
| --- | --- | --- |
| 2026 to present | Leverhulme Research Fellow in GeoAI and Data Science | Rights Lab and Leverhulme Centre for Research on Slavery in War, University of Nottingham |
| 2025 to 2026 | Assistant Professor in Computer Science | Birmingham Newman University |
| 2025 to 2026 | Geospatial Developer, Digital Twin Platform (contract) | City as Lab, University of Nottingham |
| 2024 to 2025 | Project Lead, Leisure Walking Systems Working Group | Horizon CDT, University of Nottingham |
| 2020 to 2024 | Doctoral Researcher, Geospatial Data Science | Nottingham Geospatial Institute, Ordnance Survey funded |

## Credentials

AWS Certified Cloud Practitioner, 2025 to 2028.

Peer-reviewed publications in platial analysis, leisure walking systems,
walkability and spatial data formats, alongside published points of interest
datasets covering six countries. The full record, with abstracts, PDFs and
citation data, is on the [publications page](/publications).

## Availability

Open to consulting engagements and research collaborations in geospatial data
engineering, spatial platforms and GeoAI. The fastest route is email, at
[james@jameswil.com](mailto:james@jameswil.com).
