---
title: "Teaching web development when writing the code is the cheap part"
date: 2026-07-14
tags: [Teaching, Web development, LLM]
draft: false
---

A first-year student can now produce a working CRUD app in an afternoon.
Assessing the artefact stopped being informative the moment that became true,
because the artefact no longer evidences anything about the student.

What has not become cheap is diagnosis. Generated code fails in ordinary ways:
a fetch that never handles the rejected promise, an auth check enforced in the
client and nowhere else, an N+1 query that is invisible at 20 rows and fatal at
20,000. A student who cannot read the code cannot see any of it, and the model
will not volunteer it. It is the same failure I measure elsewhere: [confident
output, no signal about whether it is
right](/notes/general-capability-does-not-predict-spatial).

So the marks moved. On [CMU422](/teaching/cmu422) and
[CMU529](/teaching/cmu529) the submission is still an
application, but it arrives as a repository: commit history, a README that
justifies the dependencies and the architecture, and a short written reflection
on what broke, what the student changed their mind about, and what they still
do not understand. A repo you cannot explain is a repo you did not build.

This is not a restriction on tool use, and policing that would fail anyway. It
is a change in what counts as the work. Reading code critically was always the
harder skill and we could previously get away with assuming it followed from
writing enough of it. It does not follow any more, so it has to be taught
directly.
