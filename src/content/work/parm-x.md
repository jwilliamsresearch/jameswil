---
title: "PARM-X: projecting live geospatial data onto physical city models"
summary: "The interactive software layer for Nottingham's projection augmented relief model. Live council data, crowd simulations and public responses draped onto physical terrain across four synchronised screens, cutting a four-hour preparation process to minutes for executive planning sessions."
period: 2025 to 2026
status: Active
role: Lead developer
tags: [React, TypeScript, Leaflet, Esri, H3, Three.js, Supabase, PostGIS]
featured: true
order: 3
updated: 2026-08-04

logo: ../../assets/work/parm-x/logo.png
cover: ../../assets/work/parm-x/physical-model.png
coverAlt: "The physical projection augmented relief model of Nottingham: a white 3D printed terrain surface roughly two metres across, with an Ordnance Survey style map projected onto it so roads, greenspace and the River Trent land on the modelled buildings. An operator console sits at the near edge and a wall screen behind shows the PARM welcome slide."
coverCaption: "The model in the City as Lab space. The surface is bare white terrain, so everything visible on it is projected: basemap, council data, agents and annotations all land on real buildings rather than a flat plane. The console at the near edge is the Controls window and the screen behind is the Presentation window, both driven by the same store."


links:
  - label: Live app
    href: "https://parmx.jameswil.com"
  - label: Project page
    href: "https://www.nottingham.ac.uk/city-as-lab/digital-nottingham-assets/projection-augmented-relief-model-parm.aspx"
  - label: City as Lab
    href: "https://www.greenmeadowsknowledgebank.uk/city-as-lab"

metrics:
  - value: 4h → min
    label: Map preparation
    note: "A four-hour manual process reduced to minutes, producing cartographic outputs and live 3D displays for executive planning sessions."
  - value: "5"
    label: Data pipelines
    note: "ArcGIS REST, file upload, OSM Overpass, WMS and authenticated ArcGIS Online, all loading into one unified layer list."
  - value: "4"
    label: Screen routes
    note: "Controls, Map Display, Presentation and a mobile participant view, kept in sync with no server-side relay."
  - value: MIT
    label: Open source
    note: "Built entirely on open components and open standards, and reconfigurable to any city by changing the bounds constants."

steps:
  - title: Run three windows as one application
    body: "The operator console, the projected map and the public presentation screen are independent browser windows served from the same origin. A single Zustand store serialises application state and broadcasts changes over named BroadcastChannel instances, so a layer toggled on the console appears on the model within milliseconds."
    detail: "Separate channels isolate concerns: parm-video for overlays, music_sync_channel for audio, parm-games for game state, parm-screenshot for exports. No websocket server, no backend relay, no deployment dependency."
  - title: Calibrate the projection onto a physical surface
    body: "Aligning a digital map to a physical model is a genuine geometric problem, because the projector is rarely mounted directly overhead. The operator clicks the four corners of the model on the map screen and the system solves a homography, applying it to the map viewport as a CSS matrix3d transform."
    detail: "A bespoke Gaussian elimination solver computes the perspective transform. The map is then refitted to exact geographic bounds so tiles, vector overlays and drawn shapes all land in the right physical place."
  - title: Load anything the council already publishes
    body: "Five pipelines feed one layer list. The ArcGIS REST browser walks Nottingham City Council's service tree and parses styling straight from each service's drawingInfo renderer. Shapefiles, GeoJSON and CSV are parsed client-side, Overpass queries are run live, and a serverless function proxies authenticated ArcGIS Online portals so credentials never reach the browser."
    detail: "CSV parsing handles quoted fields and the usual column name variants. Derived layers, including heatmap, Voronoi, H3 grid, Turf hexgrid and clusters, are computed on demand from any point dataset."
  - title: Simulate movement across the model
    body: "A pedestrian agent engine loads Nottingham's road network live from Overpass and moves agents between landmarks, transport hubs, stadiums and neighbourhoods. Presets model real scenarios: matchday arrival and dispersal for Forest and County, commuter peaks, the Robin Hood Marathon, Hockley's night economy."
    detail: "Road type filters restrict movement to chosen highway categories, so trunk-road traffic and footway wandering can be modelled separately on the same network."
  - title: Collect responses from the people in the room
    body: "Participants scan one QR code and reach a mobile-first interface offering drawing, polls, free text and sliders. Projects can be sequenced into a multi-step survey that advances automatically. Contributions land in Supabase and appear on the projected surface immediately."
    detail: "Spray drawing upserts into a single record per user rather than inserting a row per stroke, cutting write volume while preserving spatial fidelity. PostGIS-compatible payloads, Row Level Security, live updates over Supabase Realtime."

figures:
  - src: ../../assets/work/parm-x/controls-layers.png
    alt: "The PARM-X Controls interface showing the data sources panel, an ArcGIS REST service browser, and the active layer list with styling controls."
    caption: "The operator console. Data sources on the left, the ArcGIS REST service browser in the centre, and the active layer list with per-layer visibility, z-index, opacity, colour and filter controls on the right. Everything here is mirrored onto the projected map as it changes."
    label: Fig. 1
  - src: ../../assets/work/parm-x/controls-screenshot.png
    alt: "The ArcGIS REST layer browser navigating Nottingham City Council service folders and feature layers."
    caption: "Navigating the council's published service directory. Styling is read directly from each service's renderer definition, so a layer arrives on the model looking the way its publisher intended rather than as undifferentiated default geometry."
    label: Fig. 2
  - src: ../../assets/work/parm-x/controls-agents.png
    alt: "The agent simulation panel showing preset scenarios, agent configuration and road network controls."
    caption: "The agent simulation panel. Preset scenarios cover matchdays, the marathon, commuter peaks and Christmas shopping, with road type filters and speed controls over a network loaded live from Overpass."
    label: Fig. 3
  - src: ../../assets/work/parm-x/controls-live.png
    alt: "The live drawing panel showing shapes drawn over Nottingham city centre with per-shape effect controls."
    caption: "Live annotation during a session. Markers, lines, polygons and text are drawn on a bounded secondary map and replicated to the projection, with per-shape animation effects applied as CSS classes to the Leaflet SVG at runtime."
    label: Fig. 4
  - src: ../../assets/work/parm-x/presentation-automated.png
    alt: "The PARM-X Presentation screen showing the active layer list with source types alongside Nottingham imagery."
    caption: "The public-facing screen. Active layers are listed with source type and styling summary, and where a research project is running a QR code appears here, which is the entire onboarding path for a participant."
    label: Fig. 5
  - src: ../../assets/work/parm-x/homepage.png
    alt: "The PARM-X landing page, a Three.js particle scene introducing the Controls, Presentation and Map interfaces."
    caption: "The landing page. A Three.js particle scene introducing the three core interfaces, which run as independent, synchronised browser windows."
    label: Fig. 6

outcomes:
  - title: Live control of what the model shows
    body: "Datasets change while a session is running rather than being prepared in advance. An operator toggles a layer on the console and it lands on the physical terrain within milliseconds, which is what lets a session follow the question a room is actually asking."
  - title: A four-hour job became a four-minute one
    body: "Producing cartographic outputs and live 3D decision-support displays for executive planning sessions previously meant hours of manual preparation per session. Driving the projection from live services collapsed that to minutes, which is the difference between preparing for a meeting and responding during one."
  - title: Off-axis projection handled properly
    body: "Calibration solves a full perspective homography from four clicked corners rather than a simple scale and offset, so the projector does not have to hang directly above the model. That is what lets a setup go into a room that was not designed for it."
  - title: Three windows, no server
    body: "Running the console, the projection and the public screen as independent windows synchronised over BroadcastChannel means there is no relay to deploy and no socket to drop mid-session. A window can be closed and reopened and it rejoins the current state, which matters for something run by people who did not build it."
  - title: A route from watching to contributing
    body: "Visitors mark locations, vote or work through a spatial survey from their own phone via a QR code, and their responses appear on the projected surface in front of them. This is the part now going into the library engagement work."
  - title: Portable by design
    body: "The platform runs entirely on open-source components and open standards, including GeoJSON, Shapefile, OGC WMS, ArcGIS REST and OSM Overpass. Retargeting it to another city is a matter of changing the bounds constants and the default endpoint."

stack:
  - group: Application
    items: [TypeScript, React, Vite, MUI, Zustand]
  - group: Mapping
    items: [Leaflet, Esri Leaflet, "Turf.js", H3-js, shpjs, "Leaflet.heat"]
  - group: Graphics
    items: ["Three.js", Web Audio API, CSS matrix3d homography, canvas overlays]
  - group: Data
    items: [Supabase, PostgreSQL, PostGIS, Row Level Security, Supabase Realtime]
  - group: Sources
    items: [ArcGIS REST, ArcGIS Online, OSM Overpass, OGC WMS, GeoJSON, CSV, Shapefile]
  - group: Platform
    items: [Vercel, serverless token proxy, BroadcastChannel API, Web Speech Recognition]

sponsors:
  - name: University of Nottingham
    role: Host institution
    href: "https://www.nottingham.ac.uk/"
    logo: ../../assets/work/parm-x/uniOfNottingham.png
  - name: Nottingham City Council
    role: Partner and data provider
    href: "https://www.nottinghamcity.gov.uk/"
    logo: ../../assets/work/parm-x/NCC.png
  - name: Ministry of Housing, Communities and Local Government
    role: Funder, PropTech 4 programme
    href: "https://www.gov.uk/government/organisations/ministry-of-housing-communities-local-government"
    logo: ../../assets/work/parm-x/mhclg.png

funding: >-
  This project received funding from the Ministry of Housing, Communities and
  Local Government (PropTech 4 programme).

team:
  - name: Dr Gary Priestnall
    affiliation: University of Nottingham
  - name: Mick Dunn
    affiliation: Nottingham City Council

related:
  - label: "Projection Augmented Relief Model (PARM)"
    href: "https://www.nottingham.ac.uk/city-as-lab/digital-nottingham-assets/projection-augmented-relief-model-parm.aspx"
    note: Project page, City as Lab
  - label: "City as Lab collaboration wins award for innovation"
    href: "https://marketingnottingham.uk/city-as-lab-collaboration-wins-award-for-innovation-offering-digital-vision-of-nottingham/"
    note: Programme background
  - label: "Projection augmented relief models"
    href: "https://www.rgs.org/about-us/what-is-geography/impact-of-geography/projection-augmented-relief-models"
    note: Royal Geographical Society
  - label: "City as Lab"
    href: "https://www.greenmeadowsknowledgebank.uk/city-as-lab"
    note: Programme
  - label: "The Living Map on public display at Nottingham Central Library"
    href: "https://www.instagram.com/p/DaKuDjtAgcs/?img_index=2"
    note: Coverage
---

## The brief

A physical relief model of a city is one of the best public engagement tools
there is. People who will not read a planning document will lean over a model
of their own street and point at it. The problem is that a model says exactly
one thing forever. It is built, and then it is finished.

Projection is the obvious escape, and it usually fails on the boring details.
The projector cannot always be hung directly overhead, so the image arrives
skewed. Getting new data onto the surface means preparing it in advance, so a
session cannot follow the question a room is actually asking. And the audience
stays an audience, because there is no route from looking at the model to
putting something on it.

**PARM-X is the software that fixes those three.** Nottingham's model and the
City as Lab programme around it were already running. What was missing was a
way to drive the projection live from a browser, so a model can show anything
the city publishes, from any projector angle, while the people standing around
it add to what is on it.

The audience turned out to matter as much as the mechanism. The same platform
runs a public session in a library and an executive planning session, and in
the second case the four hours that used to go into preparing cartographic
outputs for a meeting now go into the meeting itself.

## The insight

The architectural decision that made the rest tractable was to treat the
installation as three independent browser windows rather than one application
driving multiple displays. The operator console, the projected map and the
public screen each run standalone and stay in step over BroadcastChannel.

That sounds like a small thing and it removes an entire class of problem.
There is no server to deploy, no socket connection to drop halfway through a
session in a building with awkward wifi, and no privileged display process to
crash and take the others with it. A window can be closed and reopened
mid-session and it rejoins the current state. For an installation that has to
survive being run by someone who did not build it, in a room nobody tested in,
that resilience matters more than elegance.

The second decision was to solve calibration properly. A scale-and-offset
transform is quick and only works from directly overhead. Solving a full
homography from four clicked corners means the projector can sit wherever the
room allows, which is what determines whether the system can be installed
somewhere that was not designed for it.

## What it does not do

Calibration state lives in the session store, so a fresh browser session needs
recalibrating. That is a deliberate trade for the moment, since a saved
calibration that silently no longer matches the projector position is worse
than one you know you have to redo, but it is friction at the start of every
session.

Agent simulation is illustrative rather than predictive. Agents follow a road
network and a set of origin and destination presets, and the flows are
plausible, but there is no calibrated behavioural model underneath and the
output should not be read as a forecast.

The platform is configured for one city. Retargeting is a matter of bounds
constants and endpoints rather than architecture, but the scenario presets,
the landmark sets and the curated media library are all specific to
Nottingham and would need rebuilding.
