---
title: CDISAW event database
summary: An open, queryable event and timeline database with a public API, so comparative work does not begin by rebuilding the same dataset from scratch.
period: 2024 to present
status: Active
role: Lead developer
tags: [PostGIS, API, Open data, Postgres]
featured: true
order: 10
links:
  - label: Documentation
    href: "#"
  - label: Source
    href: "#"
---

Placeholder copy. Replace this file with the real description.

## Background

Most comparative work in this area starts the same way: someone rebuilds a
dataset that already exists, using slightly different coding decisions, and the
results become impossible to compare. CDISAW exists so that step can be skipped.

## What it does

- A typed schema for events, actors and timelines
- Versioned, citable releases with a documented changelog
- A public read API with cursor pagination and stable identifiers
- Spatial queries through PostGIS, exposed as ordinary filter parameters

## Status

Active. The query layer is being rewritten to remove the slowest path in the
stack, and the second data release is in preparation.
