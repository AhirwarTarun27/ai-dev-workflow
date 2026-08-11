---
name: research
description: Investigate the codebase before planning — where the change goes, what pattern to copy, what already exists, and what does not. Writes a research document with file:line citations.
when_to_use: Run before planning any non-trivial change. Also useful on its own to answer "where does X live" or "how does this codebase do Y".
argument-hint: "<ticket-id or question>"
---

# Research

Find out how this codebase actually works before deciding what to change. One
investigation feeds both the plan and the human walkthrough — so be thorough
here and nothing downstream needs to re-explore.

**Never propose a solution.** This step establishes facts. Deciding what to do
is the plan's job, and mixing them produces plans that justify a decision made
before the evidence was in.

## Method

Read the spec, and `.agent/project/` if a dossier exists — it may already answer
half of this.

Then launch **2–4 `scout` agents in parallel**, in a single message. Each gets
ONE narrow question. Typical split:

1. **Where the change goes** — the files, functions and layers that will need to
   change for this specific ticket.
2. **The pattern to copy** — the closest existing implementation of this kind of
   thing, so new code looks like the code around it.
3. **Consumers and contracts** — what else touches the code being changed, and
   what shapes cross a boundary.
4. **Tests and verification** — what covers this area today, and what does not.

Scale to the work: a small fix may need one scout, not four. Fan-out is
expensive, so use it where the reading is genuinely broad.

Follow up yourself on anything decisive — read the key file, do not take a
summary of it on trust for the code you are about to change.

## Write it

To `.agent/research/<YYYY-MM-DD>-<slug>.md`:

```
# Research — <ticket or question>

## Question
<what this set out to establish>

## How it works today
<The current end-to-end path, layer by layer, each with file:line. This is the
section the plan's walkthrough is built from — make it complete and ordered.>

## Where the change goes
- `path:line` — <what lives here and why it is affected>

## Pattern to copy
`path:line` — <the closest existing implementation, with a short snippet>

## Consumers and contracts
- <what else depends on the code being changed>

## Test coverage
Covered: … | Not covered: …

## Not present
<What was searched for and does not exist. Name the search.>

## Constraints and surprises
<Anything that will make the obvious approach wrong.>

## Open questions
<What is still unknown, and what would settle it.>
```

Every claim carries a `file:line`. Where nothing was found, write **not
present** and name what was searched for — a gap you have proven is a finding;
a gap you have papered over is a future bug.
