---
title: "GEON: an LLM-native format for representing places as meaning, not coordinates"
summary: "An open text format that describes what a place is, how it works and how it feels, rather than where its vertices are. Three reference implementations, bidirectional GeoJSON conversion, and measurably fewer tokens than the format it complements."
period: 2024 to 2026
status: Active
role: Author and lead developer
tags: [Open format, GeoAI, LLM, Python, Rust, TypeScript, Semantic data]
featured: false
order: 7
updated: 2026-08-04

logo: ../../assets/work/geon/logo.png
cover: ../../assets/work/geon/geon-notts-castle-example.png
coverAlt: "The GEON Explorer with Nottingham Castle selected on a map, its GEON document in the centre panel and an LLM-generated contextual analysis on the right."
coverCaption: "The GEON Explorer. A place selected on the map, its GEON document rendered beside it, and a language model reasoning over that document rather than over a coordinate array."

links:
  - label: Read the paper
    href: /assets/papers/Williams2026GEON.pdf
  - label: Live demo
    href: "#"
  - label: Code
    href: "https://github.com/jwilliamsresearch"

metrics:
  - value: "3"
    label: Reference implementations
    note: "Python, Rust and TypeScript, each supporting the full 0.1.0 spec including parsing, validation and bidirectional GeoJSON conversion."
  - value: "5"
    label: Field categories
    note: "Identity, Geometry, Semantic, Relational and Temporal, with EXPERIENCE encoding qualities absent from every standard format."
  - value: "0.1"
    label: Specification version
    note: "Published February 2026. Versioned and open, designed for community extension rather than as a finished standard."
  - value: MIT
    label: Open source
    note: "Code under MIT, specification under CC BY 4.0, so neither the format nor the tooling can be captured."

steps:
  - title: Treat a place as an object, not a geometry
    body: "A GEON document describes one or more PLACE entities. The minimum is three fields: what it is called, what type of thing it is, and where it sits. Everything beyond that enriches rather than qualifies, so a valid document can be three lines or three hundred."
    detail: "PLACE, TYPE and LOCATION are the only required fields. UTF-8 text throughout, close enough to YAML to feel familiar on sight."
  - title: Encode how a place is used
    body: "PURPOSE captures what a space is for, expressed as the activities it actually hosts rather than as a land use classification. A market square is civic gathering, events and festivals, and informal commerce, which is three claims a planner can act on and a zoning code cannot express."
    detail: "Controlled vocabulary with room for extension, so documents stay comparable without becoming a straitjacket."
  - title: Encode how a place feels
    body: "EXPERIENCE is the distinctive field and the one with no equivalent anywhere else. Openness, enclosure, noise level, visual complexity, social diversity and sense of safety, the last of which can vary by time of day because in practice it always does."
    detail: "The vocabulary draws on environmental psychology and space syntax, and on the platial clustering work in PlaceCrafter and PlaceAgents, making concepts like enclosure and permeability machine-readable."
  - title: Make relationships explicit
    body: "Places contain other places and relate to them in ways that matter more than distance. CONTAINS, ADJACENCIES, VIEWSHEDS and PART_OF build a graph connected by meaning rather than by proximity, so a tram stop fifty metres north is a named relation and not a coordinate difference."
    detail: "This is what makes GEON repositories traversable as spatial knowledge graphs, with places as nodes and semantics on the edges."
  - title: Stay interoperable in both directions
    body: "GEON does not replace GeoJSON and is not trying to. It can be generated from GeoJSON by enriching coordinates with semantic metadata, and serialised back for any existing GIS tool. GeoJSON handles geometry and rendering, GEON handles meaning and reasoning."
    detail: "Bidirectional conversion is a first-class concern in all three implementations, not an afterthought bolted on for compatibility."

figures:
  - src: ../../assets/work/geon/geon-example-token-count.png
    alt: "The GEON Explorer showing a token count comparison in which GEON uses significantly fewer tokens than GeoJSON for equivalent place descriptions."
    caption: "Token efficiency against GeoJSON for equivalent semantic content. This is the argument in one screenshot: a context window is finite, and a format that spends it on coordinate precision has less left for the reasoning the coordinates were meant to support."
    label: Fig. 1
  - src: ../../assets/work/geon/geon-builder.png
    alt: "The GEON Builder web interface showing form-based construction of a place description with live validation."
    caption: "The Builder. A planner, architect or community researcher can produce a valid document without writing the format by hand or knowing that it has a grammar, which is the point of a format meant to be authored by people."
    label: Fig. 2
  - src: ../../assets/work/geon/geon-from-osm-poster.png
    alt: "An animated demonstration of GEON documents being generated automatically from OpenStreetMap features."
    caption: "Generation from OpenStreetMap. Tags populate PURPOSE and CHARACTER, which gets a repository to a usable baseline quickly, though the experiential fields still need a human. OSM is a source for GEON, not a substitute."
    label: Fig. 3
    video:
      mp4: /assets/work/geon/geon-from-osm.mp4
      webm: /assets/work/geon/geon-from-osm.webm
  - src: ../../assets/work/geon/example-places-loop-poster.png
    alt: "An animated loop through example GEON place descriptions for a range of Nottingham locations."
    caption: "Documents for a range of Nottingham places, from market squares to transport interchanges. The format holds its shape across wildly different kinds of space, which is the test any general place representation has to pass."
    label: Fig. 4
    video:
      mp4: /assets/work/geon/example-places-loop.mp4
      webm: /assets/work/geon/example-places-loop.webm

outcomes:
  - title: Format design is an AI capability question
    body: "The same place, described two ways, produces different reasoning from the same model. That makes the choice of representation a design decision with consequences rather than a plumbing detail. The claim is argued and demonstrated rather than measured, since the evaluation framework that would settle it does not exist yet."
  - title: Experiential qualities became machine-readable
    body: "Enclosure, permeability, visual complexity and social diversity have decades of research behind them and no route into a data file. EXPERIENCE gives them one, with a controlled vocabulary that keeps documents comparable across authors."
  - title: Three implementations, one specification
    body: "Python for data science and pipelines, Rust for high-performance parsing and CLIs, TypeScript for web and Node services. All three cover the full 0.1.0 spec, so adoption is not gated on a single language community."
  - title: Designed to be written by people who are not programmers
    body: "The format reads like a document rather than a data file, so a historian or community researcher can write GEON directly. That is a design goal rather than a demonstrated result, and it matters because the knowledge the format exists to capture mostly sits with people who do not write code."

stack:
  - group: Implementations
    items: ["geon-py (Python)", "geon-rs (Rust)", "geon-js (JavaScript and TypeScript)"]
  - group: Capabilities
    items: [Parsing, Programmatic generation, Schema validation, Bidirectional GeoJSON conversion]
  - group: Tooling
    items: ["VS Code extension (geon-vscode)", GEON Builder, GEON Explorer]
  - group: Planned
    items: [MCP server, Unified CLI, QGIS plugin, Browser validator]
  - group: Foundations
    items: [Environmental psychology, Space syntax, Urban design theory, OpenStreetMap]
  - group: Licensing
    items: ["Specification CC BY 4.0", "Code MIT", "Version 0.1.0, February 2026"]

sponsors:
  - name: Birmingham Newman University
    role: Affiliation
    href: "https://www.newman.ac.uk/"
    logo: ../../assets/work/geon/birminghamNewman.png
  - name: University of Nottingham
    role: Affiliation
    href: "https://www.nottingham.ac.uk/"
    logo: ../../assets/work/geon/uniOfNottingham.png

funding: >-
  GEON was developed across affiliations with Birmingham Newman University and
  the University of Nottingham. No external funding was received.

related:
  - label: "Geospatial Experience-Oriented Notation (GEON): A Semantic Format for LLM-Native Spatial Intelligence"
    href: /publications/williams2026-geon
    note: Preprint, 2026
  - label: "WalkGrid: personalising urban walking through environmental similarity"
    href: /work/walkgrid
    note: Project
  - label: "PlaceCrafter: Curating Urban Functional Regions through Platial Clustering of OpenStreetMap Points of Interest"
    href: /publications/williams2025-place-crafter
    note: OSMScience, 2025
  - label: "PlaceAgents: Multi-Stop Pedestrian Itineraries as Platial Flows on Urban Networks"
    href: /publications/williams2025-place-agents
    note: SDSS, 2025
  - label: "Context for Leisure Walking Routes: A Vision for a Spatial-Platial Approach"
    href: /publications/williams2022
    note: SDSS, 2022
---

## The brief

Open a GIS dataset and you get polygons and attributes. Before any useful
analysis can start, a planner has to mentally reconstruct what the place
actually is from a list of numbers. Ask a language model to do the same thing
and it has no way to perform that reconstruction at all.

A coordinate array says nothing about whether a street is vibrant or desolate,
safe or hostile, historically loaded or finished last year. Attributes help a
little, and standard formats offer them as a flat bag of properties with no
hierarchy, no relationships and no indication of what any of it means to the
people using the space.

This is not a failure of GeoJSON or WKT. Those formats were built for geometry
and they are excellent at it. **The gap is that spatial workflows now run
through language models, and nothing exists that is optimised for reasoning
about place rather than rendering it.**

The problem arrived from the other direction first. Building
[WalkGrid](/work/walkgrid) meant scoring 51 environmental features across a
hexagonal grid, and every one of those scores had to live in a column because
there was nowhere else to put it. A format that could carry the meaning
alongside the geometry would have made that system simpler, and no such format
existed.

## The insight

The move is to treat a place as a semantic object rather than as a shape with
labels attached.

GEON takes its cue from TOON, which showed that describing objects by purpose
and behaviour rather than by physical properties unlocks substantially better
model reasoning. The spatial equivalent is a format where every field name
carries meaning, every value is interpretable, and relationships are named
rather than implied by coordinate arithmetic.

What that buys is semantic density: reasoning-relevant information per token.
A model asked which public spaces near a station suit outdoor dining can
actually reason over PURPOSE, EXPERIENCE and ADJACENCIES, instead of
attempting geometric computation it was never built for. The token comparison
in Fig. 1 is the same argument from the other direction, since a context
window spent on coordinate precision is a context window unavailable for
thinking.

The second consequence took longer to notice. Because the format is legible to
a model in both directions, it supports generative spatial reasoning. Give a
model a GEON description of an underused street and it can propose
interventions and express them back in GEON, which closes a loop between
analysis and design that previously required a human at every handoff.

## What it does not do

Experiential fields are observer-dependent, and honestly so. One field visit in
February does not capture a place, two researchers will not agree on visual
complexity, and no amount of controlled vocabulary makes a subjective judgement
objective. The fields record an observation with provenance, which is the
strongest claim available and weaker than a measurement.

Human curation is simultaneously the point and the bottleneck. Rich documents
require someone who knows the place to sit down and write one, and that does
not scale to a city, let alone a country. Generation from OpenStreetMap gets a
baseline in place but cannot populate the fields that justify the format.

It is version 0.1.0 with community conventions still forming. There is no
governance process yet for vocabulary extensions or domain-specific fields, no
empirical evaluation of whether GEON representation measurably improves
downstream model performance on spatial reasoning benchmarks, and no temporal,
3D or real-time variants beyond sketches. Calling it a standard would be
premature. It is a proposal, versioned so it can be argued with.
