---
name: orient
description: Teach the user this project — the business, the architecture, the main flows, and how to run it — in short progressive tiers with drill-down on request.
when_to_use: Run after /devflow:onboard when joining an unfamiliar codebase, or any time later to revisit a specific area. Takes an optional topic to jump straight to one tier.
argument-hint: "[business|architecture|flows|running|area|questions]"
disallowed-tools: WebSearch, WebFetch
---

# Orient — learn this project

Audience is the **human**, not an agent. The goal is being productive on day
one, not comprehensive knowledge.

Read `.agent/project/` and answer from it. **Do not re-survey** — this must stay
cheap enough to re-run on day 30. If the dossier is missing, say so and point to
`/devflow:onboard` rather than improvising a survey here.

## Delivery

One tier at a time. **Stop after each and ask whether to continue, drill down,
or skip on.** Never deliver all five at once — a wall of text does not teach.

Budget per tier: **roughly one screen.** Anything longer becomes a drill-down
offered at the end, not prose delivered up front. The whole curriculum should be
readable in about fifteen minutes.

If a topic argument was given, jump to that tier and skip the rest.

## The tiers

**1. Business** — what problem this solves, for whom, and the vocabulary. The
core nouns (the things) and verbs (what happens to them). Plain language, no
code, no file paths. If someone outside engineering could not follow it, rewrite
it. End with the two or three domain terms that will otherwise confuse them when
reading the code.

**2. Architecture** — the big boxes and how they talk. Lead with a diagram in a
fenced block; keep prose to what the diagram cannot show. Name each component's
job in one line, plus where the data lives and which external services matter.

**3. Flows** — the 3–5 most important journeys, each traced end-to-end through
every layer with `file:line`. This is the tier that converts into productivity:
after it they should be able to guess where a given change goes.

**4. Running it** — prerequisites with their exact pinned versions, then the
commands to install, run and reach a working app. Credentials or seed data, the
URL, where logs go, how to debug. Anything known to go wrong on first setup.
This is what actually blocks day one, so be concrete and complete here even if
it costs a few extra lines. If they are not yet running it, point at
`/devflow:setup`, which checks these against their machine and fixes the gaps.

**5. Your patch of ground** — the part of the codebase they will actually touch:
its conventions, the pattern to copy for new work, and the landmines. If they
have named a feature area or ticket, scope this tier to it.

## Close

End the run with **Questions to ask your team** from `open-questions.md`,
ordered by how much each would unblock. Knowing precisely what the codebase
cannot tell you is one of the most useful things to walk in with.

## Rules

- Every technical claim carries a `file:line`. Business claims carry their
  evidence from the dossier.
- **Say "not present" rather than guessing.** If asked about a layer this
  project does not have, say it does not have one. Never invent a plausible
  answer — on an unfamiliar codebase the user cannot tell the difference, which
  makes a confident invention worse than an admitted gap.
- Distinguish what the dossier verified from what it inferred.
- Answer follow-up questions from the dossier first; only read source when the
  dossier is genuinely silent, and say when you did.
- No hedging filler, no restating the question, no summary of what you are about
  to say. Teach the thing.
