---
title: "Topodex: contextual geocoding for conflict and human rights corpora"
summary: "A Python library that makes geocoders accountable to the document they are reading. Nine open sources reranked against document context, a six-category failure taxonomy, and a coherence check across every place a document names."
period: 2026 to present
status: Active
role: Author and lead developer
tags: [Python, NLP, Geocoding, Nominatim, Pleiades, OpenHistoricalMap, GeoAI]
featured: true
order: 1
updated: 2026-08-04

cover: ../../assets/work/topodex/toponym-dashboard.png
coverAlt: "The Topodex dashboard, showing toponym input alongside document context, temporal range and an LLM-synthesised candidate toggle."
coverCaption: "The dashboard. A toponym is never submitted alone: the document context and temporal range it came from are inputs to the resolution, not metadata attached afterwards."

links:
  - label: Live demo
    href: "#"
  - label: Source
    href: "https://github.com/jwilliamsresearch"

metrics:
  - value: "9"
    label: Open geocoders
    note: "Nominatim, GeoNames, Wikidata, Overpass, OpenHistoricalMap, NGA GEOnet, Overture, Pleiades and Who's on First. No proprietary API required."
  - value: "7"
    label: Scoring components
    note: "Administrative level, country, proximity to co-entities, temporal plausibility, name similarity, language and source importance."
  - value: "6"
    label: Failure modes
    note: "Formally classified, detected per toponym, and surfaced with evidence and a suggested correction rather than resolved silently."
  - value: MIT
    label: Open source
    note: "Built on open gazetteers throughout, so a result can be reproduced by anyone without a commercial licence."

steps:
  - title: Read the document before the gazetteer
    body: "Each toponym gets a disambiguation profile built from the surrounding text and temporal context: the implied administrative level, co-occurring place names, language and transliteration signals, and structured risk flags. This happens before any geocoder is queried."
    detail: "The profile is what converts a bare string into a question with constraints. Standard tools skip this step, which is the root of most of what follows."
  - title: Rerank on seven weighted components
    body: "Each geocoder returns candidates, and those candidates are scored rather than accepted in rank order. Administrative level carries the most weight, then country, then mean distance to co-entities already resolved in the same document, with temporal plausibility checked against Wikidata inception and dissolution dates."
    detail: "Administrative level uses asymmetric decay, penalising over-precision more heavily than under-precision. Name similarity is floored so a transliteration variant cannot collapse an otherwise strong candidate."
  - title: Let the risks reshape the weights
    body: "Detected risk flags adjust the weight budget before scoring runs. A homonym dominance flag boosts proximity and name similarity while suppressing popularity. A temporal anachronism flag doubles the weight on temporal plausibility."
    detail: "The scoring function is not fixed. It responds to what the profile says is likely to go wrong with this particular name in this particular document."
  - title: Reward agreement across sources
    body: "A candidate confirmed independently by more than one gazetteer earns a corroboration bonus, applied outside the weighted sum: +0.04 for two sources, +0.06 for three or more. Nine backends with different coverage strengths means agreement carries real information."
    detail: "GEOnet covers conflict regions in Africa, MENA and Southeast Asia where Nominatim thins out. Overpass carries native-script name tags. Pleiades covers the classical world. Agreement across that spread is not redundancy."
  - title: Check the document, not just the name
    body: "Once every toponym in a document is resolved, the full set is tested for geographic plausibility. Locations spanning implausible distances, statistical outliers relative to the cluster, and contextual contradictions between co-occurring names each raise a flag."
    detail: "The output is a spatial coherence score from 0 to 1 for the document, plus itemised issues. This is what catches a wrong-country match that looked perfectly reasonable on its own."

figures:
  - src: ../../assets/work/topodex/lookup-poster.png
    alt: "A walkthrough of resolving a toponym, moving from input through ranked candidates to a scored result on the map."
    caption: "A resolution end to end. The chosen coordinate arrives with its ranked alternatives, a per-component score breakdown and any risk flags attached, so the decision can be inspected rather than trusted."
    label: Fig. 1
    video:
      mp4: /assets/work/topodex/lookup.mp4
      webm: /assets/work/topodex/lookup.webm
  - src: ../../assets/work/topodex/ranking-engine.png
    alt: "The ranking engine reference page listing seven scoring components with their default weights and descriptions."
    caption: "The seven components and their default weights, documented rather than buried. Administrative level at 0.25 and country at 0.20 carry the most, because those are the two decisions a standard geocoder makes silently and gets wrong most often."
    label: Fig. 2
  - src: ../../assets/work/topodex/datasets-listing.png
    alt: "The datasets catalogue listing all nine geocoder backends with their coverage strengths and integration types."
    caption: "The nine backends and where each is strong. The set is chosen for complementary coverage rather than redundancy, which is what makes corroboration between them meaningful."
    label: Fig. 3
  - src: ../../assets/work/topodex/cambridge-example.png
    alt: "Resolving the name Cambridge, showing ranked candidates, a score breakdown panel, a homonym dominance flag and the chosen result on a map."
    caption: "Homonym dominance, caught and mitigated. Cambridge is the friendly version of a problem that in a conflict corpus means a village in the wrong country, and the flag records both what was at risk and what the system did about it."
    label: Fig. 4
  - src: ../../assets/work/topodex/intro-poster.png
    alt: "An animated introduction to the Topodex interface."
    caption: "The interface in motion. Resolution, scoring and coherence checking are presented as one continuous flow, because in practice a researcher is never resolving a single name in isolation."
    label: Fig. 5
    video:
      mp4: /assets/work/topodex/intro.mp4
      webm: /assets/work/topodex/intro.webm

outcomes:
  - title: A named taxonomy for how geocoding fails here
    body: "Proximity collapse, temporal anachronism, homonym dominance, spatial incoherence, admin level mismatch and transliteration drift. Naming them makes them detectable, reportable and arguable, where previously they were just wrong coordinates nobody had a word for."
  - title: Geographic claims that can be challenged
    body: "Every resolved toponym exposes its chosen coordinate, ranked alternatives, per-component scores, risk flags and coherence result. For research feeding litigation, truth commissions or policy briefs, a geographic claim that cannot be interrogated is not usable evidence."
  - title: Small places stop losing to large ones
    body: "Forced labour sites, transit camps and rural detention locations are exactly what popularity-ranked geocoders bury under the nearest major city. Weighting proximity to co-entities and implied administrative level above source popularity inverts that default."
  - title: Weights that can be fitted to a corpus
    body: "Scoring weights can be learned from annotated candidate pairs using a Bayesian personalised ranking objective, and researcher corrections feed back into the training pool. Preliminary simulations suggest 20 to 30 corrections adapt the weights to a new conflict zone."

stack:
  - group: Library
    items: [Python, rapidfuzz, LLM disambiguation profiling, ACLED adapter]
  - group: Gazetteers
    items: ["Nominatim", "GeoNames", "Wikidata SPARQL", "OSM Overpass", "OpenHistoricalMap"]
  - group: Specialist sources
    items: ["NGA GEOnet Names Server", "Overture Maps", "Pleiades", "Who's on First"]
  - group: Scoring
    items: ["Seven-component weighted rerank", "Corroboration bonus", "Risk-adaptive weight budget", "Bayesian personalised ranking"]
  - group: Validation
    items: ["Spatial coherence scoring", "Outlier detection", "LLM contradiction review", "Six-mode failure taxonomy"]
  - group: Evaluation
    items: ["Mean reciprocal rank", "Precision@k", "Failure mode recall", "Ablation over scoring components"]

sponsors:
  - name: Leverhulme Centre for Research on Slavery in War
    role: Host centre
    href: "https://www.nottingham.ac.uk/research/beacons-of-excellence/rights-lab/"
    logo: ../../assets/work/topodex/slaveryinwar.png
  - name: Rights Lab
    role: Host lab
    href: "https://www.nottingham.ac.uk/research/beacons-of-excellence/rights-lab/"
    logo: ../../assets/work/topodex/rightslab.png
  - name: University of Nottingham
    role: Host institution
    href: "https://www.nottingham.ac.uk/"
    logo: ../../assets/work/topodex/uniOfNottingham.png
  - name: King's College London
    role: Partner
    href: "https://www.kcl.ac.uk/"
    logo: ../../assets/work/topodex/kcl.png

funding: >-
  Topodex is developed as part of the Leverhulme Centre for Research on Slavery
  in War, University of Nottingham, in partnership with King's College London.
  Funded as part of a Research Fellowship in Slavery and War.

related:
  - label: "CDISAW: a queryable data infrastructure for slavery and armed conflict"
    href: /work/cdisaw
    note: Project
  - label: "GEON: an LLM-native format for representing places as meaning"
    href: /work/geon
    note: Project
---

## The brief

A place name in a document is not a coordinate. Between the two sits a
sequence of decisions, about which country, which administrative level and
which historical moment, that standard geocoding tools make silently and
without any awareness of what the document is about.

For most applications that silence is a minor nuisance. For research on
conflict, forced displacement and modern slavery it corrupts the evidentiary
record, and it does so in patterned rather than random ways. Village names
repeat dozens of times within a country and the most prominent one wins.
Administrative boundaries shift during a conflict, so the current map does not
describe the geography the document was written in. Arabic, Burmese, Amharic
and Lingala names are romanised differently across sources, degrading or
failing the match. And forced labour sites, transit camps and rural detention
locations are precisely the places a popularity ranking buries under the
nearest city.

**Topodex does not replace the gazetteers. It makes their output accountable
to the document it came from**, wrapping nine open sources in a disambiguation
engine that reasons from context and a validator that checks whether the
document's full set of locations is geographically plausible at all.

## The insight

Two ideas do most of the work, and both come from refusing to treat a toponym
as an isolated lookup key.

The first is that the document already contains the evidence needed to
disambiguate. Co-occurring place names constrain the plausible region. The
prose implies an administrative level, since a report naming a camp is not
naming a governorate. The temporal frame rules out entities that did not exist
yet or no longer existed. Building a profile from those signals before
querying anything turns a string into a question with constraints attached,
and reranking on seven weighted components then replaces generic popularity
with contextual relevance.

The second is that a document is a unit of validation, not just a container of
names. A single resolution can look entirely reasonable and still be wrong,
and the tell is usually its relationship to everything else the document
mentions. Checking the resolved set for implausible spans, statistical
outliers and contextual contradictions catches errors that no per-name
confidence score can, which is why the coherence score is computed across the
document rather than attached to individual results.

Making the weight budget respond to detected risk follows from both. If the
profile flags a likely homonym, popularity is exactly the wrong signal to
trust, so the system suppresses it and leans on proximity instead.

## What it does not do

The benchmark is small. Forty-two annotated toponyms across twelve conflict
zones, drawn from ICTY judgments, ReliefWeb situation reports and ACLED event
data, is enough to demonstrate the failure modes and not enough to make strong
claims about generalisation. The expansion target is 300 to 500 annotations
across Bosnia, Sudan, the DRC, Myanmar, Haiti and historical English-language
sources, and until that exists the reported numbers should be read as
indicative.

It inherits gazetteer coverage. Where no open source records a place, no
amount of reranking will find it, and the regions with the thinnest coverage
correlate uncomfortably well with the regions this work most wants to serve.

Learned weights are promising rather than proven. The estimate that 20 to 30
corrections adapt the system to a new conflict zone comes from simulation, not
from deployment. And the disambiguation profile depends on a language model,
which introduces a component whose failures are harder to characterise than
the six the taxonomy names. The audit trail is designed so that those failures
stay visible, which is a mitigation rather than a solution.
