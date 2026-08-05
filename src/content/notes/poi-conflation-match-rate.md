---
title: "POI conflation thresholds: why a 2% cross-source match rate is the honest answer"
date: 2026-06-23
tags: [Conflation, Open data, OpenStreetMap]
project: anythingpoi
draft: false
---

Two POIs sit 30 m apart with similar names. Same shop, or two shops? Every
conflation pipeline answers that question and almost none of them publish the
answer.

[AnythingPOI](/work/anythingpoi), which fuses OpenStreetMap and Overture Maps
into 22.7M points across six countries, uses three gates, all of which must
hold: 50 m Haversine, agreement
on Tier-1 category, and Jaro-Winkler name similarity of 0.85 on normalised
names. Candidates are blocked first by [H3 at resolution
11](/notes/h3-kring-is-not-the-radius-you-asked-for), which is the same
parameter choice in a different costume. Across six countries the gates match
1.4% to 3.2% of records.

The number looks like failure. Loosening it is trivial: take the gate to 150 m,
drop the category check, and the merged count climbs to something that reads
well in a table. What you have actually done is fuse the barber and the
newsagent that share a parade and a family name, and you cannot tell which of
your merges are real.

A cross-source match is worth something in the confidence score precisely
because it is rare. It means two independently built datasets agree. Inflate
the rate and you destroy the signal that made the field worth adding.

Recall is what this costs. Transliterated names go unmatched, and so does a
shopping centre whose centroid sits 200 m from its entrance. That is a
deliberate trade, and it belongs in the documentation rather than in a
footnote.
