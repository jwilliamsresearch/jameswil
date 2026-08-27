---
title: "The words for water: reading Canada's landscape vocabulary out of 365,395 place names"
date: 2026-08-27
tags: [Toponymy, Canada, Open data, A5]
draft: false
---

Natural Resources Canada publishes the whole Canadian Geographical Names
Database as a weekly CSV. It holds 365,395 officially approved names, and
224,924 of them, **61.6%**, are attached to water features. Before Canada is a
country of mountains or prairie or cities, it is, in its own naming records, a
country of lakes and brooks and coves.

Northrop Frye thought the Canadian imagination was less troubled by "Who am I?"
than by "Where is here?". The names file is one long, extremely literal attempt
at an answer. What interested me is that the answer is given in different words
depending on where you stand, and that the file is big enough to draw the
boundaries between those words.

## The field that looks like the vocabulary is not the vocabulary

The CSV has a `Generic Term` column, which looks like exactly what I wanted. It
is not. It is a translation of what I wanted.

Lac Saint-Jean is filed under generic term `Lake`. So are the other 64,000
lacs. The column normalises every name to a controlled English vocabulary, so
querying it tells you how many bodies of standing water Canada has and nothing
at all about what anybody calls them. The one column that appears to hold the
words is the one column with the words taken out.

The words are still there, in the name strings, so they have to be read back
out. That needs a rule about where a generic sits, and the rule is a property of
the language rather than of the word: English puts the generic last, in Otter
Brook, and French puts it first, in Ruisseau de la Loutre. So I scan the opening
tokens for a French generic, and fall back to the final token for an English
one. French wins the tie, which is what makes Baie du Grand Ruisseau read as a
bay rather than as a stream.

That rule classifies 222,549 names, 60.9% of the database, into 68 generic
words. It can be checked, because CGNDB's own `Generic Term` is an independent
opinion about the same feature. Agreement is 98.5% for `lake`, 98.8% for
`creek`, 98.2% for `brook`, 97.0% for `lac`. It is 71.8% for `pool` and 60.5%
for `barasway`, which are exactly the rare words this note is most interested
in, so those two should be read as indicative rather than as counts.

## There are more lacs than lakes

64,661 lacs against 58,923 lakes. The most Canadian noun in English is
outnumbered in Canada's own gazetteer by its French equivalent, by 5,738, and
almost the entire margin sits in one province: 99% of lacs are in Quebec.

The reason is not that Quebec has more lakes than the rest of the country. It is
that Quebec's lakes have been surveyed and formally named at a density the
Shield country of Ontario and Manitoba has not matched, and the effect is large
enough to flip a national total. This is worth holding onto, because it is the
standing objection to everything below: a word map made from a gazetteer is
always partly a map of who did the surveying.

## The brook line

Two words for a small watercourse, drawn from the same English:

| | brook | creek |
| --- | ---: | ---: |
| total | 7,795 | 23,020 |
| Atlantic provinces | **97.3%** | **0.0%** |
| British Columbia | 1% | 47% |

Not "mostly", not "predominantly". Of 23,020 creeks in Canada, the four Atlantic
provinces hold none. The two words divide the country between them and the
division is essentially total.

Use the head-to-head buttons to see it, and the filter to go looking for a
particular word.

<iframe
  src="/notes/words-for-water-map.html"
  style="width:100%;height:560px;border-radius:6px;border:1px solid var(--line);display:block;margin:2rem 0;"
  loading="lazy"
  title="Generic terms in Canadian place names, by A5 cell"
></iframe>

Cells are A5 pentagons at resolution 6, roughly 8,300 km² each, which is about
the coarsest grain that still separates Cape Breton from the mainland. I have
used H3 for this kind of aggregation before; A5's cells are equal-area by
construction, which matters more than usual over a country spanning 42 degrees
of latitude, where hexagon area quietly drifts as you go north. Colour runs by
decile, because the counts are heavily right-skewed and a linear ramp would
leave nine tenths of the range unused.

`pond` is the other half of the same story. 82% of Canada's 8,127 ponds are in
Newfoundland and Labrador, where a pond is not a small thing: Newfoundland uses
the word for bodies of water that Ontario would call lakes without hesitating.
The word is doing different work, not describing a different size.

## Words that belong to exactly one place

Sorting by how concentrated a word is, rather than how common, turns up the
short list of generics that never travelled:

| word | names | where |
| --- | ---: | --- |
| `steady` | 163 | Newfoundland, 100% |
| `barasway` | 61 | Newfoundland, 100% |
| `fosse` | 1,282 | Quebec, 100% |
| `sunker` | 40 | Newfoundland, 98% |
| `tickle` | 252 | Newfoundland, 96% |
| `pool` | 334 | Nova Scotia, 82% |
| `stream` | 164 | New Brunswick, 76% |
| `drain` | 472 | Ontario 61%, Manitoba 39% |

The federal glossary of generics defines a *steady* as "still water of a brook
or river, not apparently affected by stream flow", and gives its French
equivalent as *fosse*, "a part of a stream that is deeper and less fast-flowing
than the surrounding waters". Two words for the same stretch of quiet river.
163 of them in Newfoundland, 1,282 in Quebec, and no overlap whatsoever. The
`steady / fosse` button on the map is the whole bilingual question in one
picture: not a border, but two vocabularies that each stop dead where the other
begins.

`drain` is the flat opposite and my favourite entry in the table. It is not
folklore, it is drainage law: a ditched watercourse under Ontario's and
Manitoba's municipal drainage regimes, formal enough to be named and gazetted.
Two provinces have a legal category the others lack, and it shows up in the
national names file as a word.
