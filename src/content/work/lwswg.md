---
title: "Leisure Walking Systems Working Group: making place research buildable"
summary: "An EPSRC-funded academic and industry initiative that produced open technical documentation, design frameworks and evaluation tools for place-based walking systems. 25+ documents across 8 research areas, published for practitioners rather than archived for academics."
period: 2024 to 2025
status: Complete
role: Project lead
tags: [User research, Geospatial analysis, UX design, Policy frameworks, Open access]
featured: false
order: 7
updated: 2026-08-04

logo: ../../assets/work/lwswg/logo.png
cover: ../../assets/work/lwswg/main-image.png
coverAlt: "An illustration of people walking in a park: an older man with a stick, a woman beside him, a man walking a dog, and a runner."
coverCaption: "Leisure walking is a different problem from navigation. The people in this picture are not trying to get anywhere efficiently, and no standard geospatial format describes what any of them are actually looking for."

links:
  - label: Visit the platform
    href: "https://lwswg.jwilliams.science"
  - label: Planning Checklist
    href: "https://lwswg.jwilliams.science/documentation/methods-and-evaluation/checklist.html"

metrics:
  - value: "25+"
    label: Technical documents
    note: "Published openly as a practitioner knowledge base, structured for developers rather than as an academic archive."
  - value: "8"
    label: Research areas
    note: "Spanning walking system architecture, place-based design practice, and research and evaluation methods."
  - value: "4"
    label: Deliverables
    note: "A market analysis, the knowledge platform, the Planning Checklist, and a synthesis technical report."
  - value: Open
    label: Access
    note: "No institutional gatekeeping, and built to persist beyond the three-month grant period."

steps:
  - title: Convene across the divide
    body: "The group brought together academic researchers, walking system developers, GIS organisations and public health practitioners. These communities have overlapping goals and almost no shared vocabulary, which is a large part of why the gap it set out to close had stayed open."
    detail: "Three months, funded by the Horizon CDT Impact Grant. Short and focused suits knowledge transfer better than a long programme with a distant deliverable."
  - title: Name the structural problems
    body: "Three barriers turned out to compound each other. Data fragmentation, because environmental quality, safety, heritage and accessibility records sit with different bodies under incompatible schemas and licences. A representation gap, because formats like GeoJSON offer a flat bag of properties with no vocabulary for how a place feels. And evaluation blindspots, because apps get tested for whether the route works rather than whether the walk was good."
    detail: "Each is tractable alone. Together they mean a developer who wants to build something better has nowhere to start."
  - title: Document the technical landscape
    body: "The first domain covers the computational infrastructure of walking apps: recommendation architectures across collaborative, content-based and hybrid approaches, route algorithms and multi-criteria optimisation, walkability metrics and how they are actually operationalised, and contextual factors including weather, time of day and personal mobility."
    detail: "Written as a survey a developer can act on, not a literature review."
  - title: Build a design framework for place
    body: "Walking interfaces should not behave like navigation apps. The design strand covers accessibility-first practice, interface patterns that reduce screen time, and the deliberate design of slowness and serendipity, building in affordances for discovery rather than efficiency."
    detail: "Operationalises concepts from environmental psychology and space syntax into principles a designer can apply without a research background."
  - title: Ship an implementation guide
    body: "The flagship output is the Planning Checklist: a phase-by-phase guide through the design, development, testing and release of a context-specific walking app, alongside a framework for capturing place qualities and guidance on ethics for research with vulnerable users in urban environments."
    detail: "A developer can read the checklist, apply the patterns, adopt the evaluation framework, and produce a better walking app without reading a single paper."

figures:
  - src: ../../assets/work/lwswg/homepage-image.png
    alt: "The LWSWG website homepage showing the working group's three focus areas."
    caption: "The knowledge platform. Three entry points covering market differentiators, geospatial data barriers and routes to market, with direct paths for developers new to walking systems and for those ready to build."
    label: Fig. 1
  - src: ../../assets/work/lwswg/community-image.png
    alt: "The LWSWG community research hub showing topic areas across leisure walking systems and place and walking."
    caption: "Two parallel knowledge tracks. One covers the technical landscape of walking systems, the other the theoretical foundations of place-based design, so a reader can enter from either the engineering or the research side."
    label: Fig. 2
  - src: ../../assets/work/lwswg/framework-image.png
    alt: "The Designing for Place framework page showing core principles and design opportunities."
    caption: "The Designing for Place framework. Environmental psychology and space syntax are rich sources of ideas and hard to act on, so this translates them into design principles stated as things to build."
    label: Fig. 3
  - src: ../../assets/work/lwswg/planning-checklist.png
    alt: "The LWSWG Planning Checklist showing design phase, development phase and checklist summary."
    caption: "The Planning Checklist. The output most likely to be used, because it meets a developer at the point of a decision rather than at the point of a citation."
    label: Fig. 4

outcomes:
  - title: A shared frame of reference, not another algorithm
    body: "The contribution is deliberately not a new dataset or model. It is open documentation that bridges academic concepts such as platial GIS, environmental psychology and space syntax with practitioner needs such as APIs, schemas and evaluation protocols, so the next generation of walking applications can be built on better foundations."
  - title: Published for the people who build things
    body: "Everything sits at lwswg.jwilliams.science as a practitioner-facing knowledge base with no institutional gatekeeping. Any developer, researcher or local authority working on pedestrian systems can use it directly, and it was built to outlast the grant that funded it."
  - title: Evaluation methods written down in one place
    body: "Most walking apps are tested for technical correctness rather than experiential quality. The group produced a comparative evaluation framework, methodology guidance, and a structured approach to capturing place qualities across both subjective and objective measures."
  - title: A model for short-form knowledge transfer
    body: "Three months, industry-oriented, with outputs designed to be immediately usable. The impact grant format proved well suited to closing a gap that neither a research programme nor a commercial roadmap was going to close on its own."

stack:
  - group: Research methods
    items: [User research, Comparative evaluation, Ethics frameworks, Stakeholder convening]
  - group: Domains
    items: [Platial GIS, Environmental psychology, Space syntax, Walkability metrics]
  - group: Systems covered
    items: [Recommender architectures, Multi-criteria routing, Pedestrian constraints, Contextual modelling]
  - group: Design practice
    items: [Accessibility-first design, Low-screen-time patterns, Designing for serendipity, Visual cue systems]
  - group: Outputs
    items: [Knowledge platform, Planning Checklist, Market analysis, Technical report]

sponsors:
  - name: Engineering and Physical Sciences Research Council
    role: Funder, grant EP/S023305/1
    href: "https://www.ukri.org/councils/epsrc/"
    logo: ../../assets/work/lwswg/ukri.png
  - name: Horizon Centre for Doctoral Training
    role: Impact Grant award
    href: "https://www.horizon.ac.uk/"
    logo: ../../assets/work/lwswg/horizonCDT.png
  - name: Ordnance Survey
    role: Industry partner
    href: "https://www.ordnancesurvey.co.uk/"
    logo: ../../assets/work/lwswg/ordnanceSurvey.png
  - name: University of Nottingham
    role: Host institution
    href: "https://www.nottingham.ac.uk/"
    logo: ../../assets/work/lwswg/uniOfNottingham.png

funding: >-
  This activity was supported by the Horizon CDT Impact Grant, made possible
  through funding from the Engineering and Physical Sciences Research Council
  (EPSRC) [grant number EP/S023305/1].

related:
  - label: "WalkGrid: personalising urban walking through environmental similarity"
    href: /work/walkgrid
    note: Project
  - label: "A Framework for Curating Personalised Leisure Walking Experiences"
    href: /publications/williams2025-thesis
    note: PhD thesis, 2025
  - label: "Towards a Framework for Personalising Leisure Walking Route Recommendations"
    href: /publications/williams2024
    note: Conference paper, 2024
  - label: "Multi-Resolution H3 Walkability Surfaces: A Scalable Framework for Cross-City Pedestrian Environment Assessment"
    href: /publications/williams2026-hwsframework
    note: Conference paper, 2026
  - label: "Survey of Leisure Walking Behaviours and Activity Tracking Use"
    href: /publications/williams2021
    note: LBS, 2021
  - label: "GEON: an LLM-native format for representing places as meaning"
    href: /work/geon
    note: Project
---

## The brief

Navigation apps are very good at getting somebody from A to B without wasting
time. Leisure walking inverts the objective. The point is not to arrive
efficiently, and the questions a recreational walker actually asks are ones no
routing system can answer: is this scenic or bleak, is it safe alone after
dark, does it pass anywhere worth stopping.

Those qualities are real, and they exist nowhere in standard geospatial
formats. The pipelines every walking app depends on, including road networks,
points of interest and terrain models, were built for logistics. Asking them
about the character of a place is asking a question the schema has no field
for.

**The working group set out to give the field the shared reference it was
missing**, on the argument that the barrier to better walking applications is
no longer computational. It is that everybody building one starts from
scratch, invents their own vocabulary, and produces something the next team
cannot build on.

## The insight

The useful move was to stop treating this as a research problem and treat it
as a translation problem.

There is no shortage of relevant theory. Environmental psychology has decades
of work on how people respond to places. Space syntax formalises how spatial
configuration shapes movement. Platial GIS has been arguing for place over
coordinates for years. None of it arrives in a form a developer with a sprint
deadline can use, so in practice none of it reaches the applications where it
would matter.

This was not an abstract observation. [WalkGrid](/work/walkgrid) had spent
four years demonstrating both halves of the problem, first that environmental
preference can be modelled and routed on, as set out in
[the thesis](/publications/williams2025-thesis), and second that every piece
of it had to be built from scratch because no shared foundation existed.

So the outputs were built backwards from the point of use. Not a paper arguing
that place representation matters, but a checklist that tells you what to do
in the design phase and what to test before release. Not a call for better
evaluation, but an evaluation framework somebody can run. The theory is all
still in there, and it is packaged as instructions rather than as argument.

Publishing it openly and outside an institutional repository was part of the
same reasoning. A local authority team or a two-person startup is exactly who
needs this, and exactly who will not pay for journal access or know to look.

## What it does not do

It sets no standard. The representation gap is named, described and argued
about, but the group did not produce a schema, and until somebody does the
underlying interoperability problem remains exactly where it was.

The documentation is a synthesis of existing work and expert convening rather
than new empirical research. That was the right shape for a three-month impact
grant and it means the frameworks here are reasoned rather than validated. The
Planning Checklist has not been through a controlled trial against teams who
did not use it.

Adoption is unmeasured. The platform is public and built to persist, but the
project ended before there was any evidence about who found it or whether the
applications built afterwards were better for it.
