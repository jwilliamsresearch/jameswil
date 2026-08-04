---
title: "General capability barely predicts spatial reasoning"
date: 2026-08-04
tags: [Benchmarks, GeoAI, LLM]
draft: false
---

I took the eleven top models on the Vellum leaderboard and asked them 46
spatial questions with machine-computed answers: GeoJSON axis order, great
circle distance and bearing, UTM zones including the Norway and Svalbard
exceptions, RFC 7946 winding order, and point-in-polygon on a concave ring.
One run, temperature 0, through OpenRouter.

The correlation between general capability and spatial score is **r = 0.19**.

| Model | Score | Answered | Of answered | Mean tokens | Vellum |
|---|---:|---:|---:|---:|---:|
| GPT-5.6 Sol | 97.6 | 97.6 | 100.0 | 711 | 47.2 |
| Claude Opus 5 | 95.7 | 100.0 | 95.7 | 532 | 64.7 |
| Claude Fable 5 | 91.3 | 100.0 | 91.3 | 415 | — |
| Claude Sonnet 5 | 91.3 | 91.3 | 100.0 | 844 | 57.4 |
| Claude Opus 4.8 | 69.6 | 100.0 | 69.6 | 37 | 57.9 |
| DeepSeek V4 Flash | 69.6 | 100.0 | 69.6 | 166 | 51.6 |
| GLM 5.2 | 63.0 | 69.6 | 90.6 | 1530 | 54.7 |
| DeepSeek V4 Pro | 56.5 | 60.9 | 92.9 | 2104 | 48.2 |
| Kimi K3 | 45.7 | 67.4 | 67.7 | 1715 | 56.0 |
| Kimi K2.6 | 28.3 | 30.4 | 92.9 | 3128 | 54.0 |
| Gemini 3.1 Pro | 26.1 | 100.0 | 26.1 | 195 | — |

The lowest-ranked model on general capability came first. The highest-ranked
came second. Below that the ordering scrambles entirely.

Three columns matter more than the score. **Answered** is the share that
produced anything within a 4,000-token budget. **Of answered** is accuracy on
those. **Mean tokens** shows why they differ: Kimi K2.6 spends 3,128 tokens
per question and answers 30% of them, but is right 93% of the time when it
finishes. It is not bad at geodesy, it runs out of room.

Reporting those as one number is a trap I fell into first time round. Capped
at 200 tokens, ten of eleven models scored zero on distance. They had not
failed, they had been truncated, and an empty response was being scored as a
wrong answer. The resulting leaderboard ranked models by terseness and looked
entirely plausible.

Axis order is near-solved: nine of eleven score 100. Bearing is not: four
score zero. Nobody should be computing geodesy in a language model anyway, but
plenty of agent frameworks now do.

*46 tasks, one run, $5.20. Ground truth computed, not written. Single run, so
no variance estimate.*
