---
name: explain
description: Trace an existing feature, file, or pull request end to end and explain how it actually works, layer by layer, with a diagram and file:line citations.
when_to_use: Use to understand unfamiliar code when there is no ticket — before modifying a feature, when reviewing someone else's change, or when the user asks how something works.
argument-hint: "<feature, file path, symbol, or PR>"
---

# Explain

Build an accurate mental model of code that already exists. Audience is the
human.

This is the as-is counterpart to the plan's walkthrough. Same discipline,
different subject: that one describes what will be built, this one what is
there.

## Method

Start from the entry point — the route, page, command, event or endpoint that
begins the flow — and follow it inward, hop by hop, to where it ends: a data
store, an external call, a rendered view, a queued message.

For a small target, read it directly. For anything spanning several layers,
launch 2–3 `scout` agents in parallel on separate segments of the path.

Check the dossier at `.agent/project/flows.md` first — the flow may already be
traced there, and re-tracing it is waste.

## Deliver progressively

**One screen first**, then offer to go deeper. Do not open with a wall of text.

The first screen:

1. **What it does** — two or three sentences in plain language, no code.
2. **The path** — each layer in order, one line each, with `file:line`.
3. **A diagram** — the flow, in a fenced block. For anything crossing more than
   two layers a diagram carries the shape better than paragraphs do.

Then offer specific drill-downs: a particular layer in detail, the error and
edge-case paths, what else consumes this, or where a given change would go.

## Rules

- **Every claim carries a `file:line`.** No citation, no claim.
- **"Not present" beats a plausible guess.** If a layer you expected does not
  exist, say it does not exist and name what you searched for. The user is
  asking because they do not know — they cannot catch an invention.
- **Separate what you traced from what you inferred**, and label inference.
- **Follow the real path, not the intended one.** If the code contradicts a
  comment or a doc, the code wins; note the contradiction, it is often the most
  useful thing you will find.
- **Name the seams** — where this would change if the feature changed, and what
  would break with it.
- Do not lecture on general concepts. Explain *this* code.

## When asked about a pull request or diff

Explain what changed and why it matters before how it works: the behaviour
before, the behaviour after, and which layers moved. Then trace as above,
scoped to the touched path.
