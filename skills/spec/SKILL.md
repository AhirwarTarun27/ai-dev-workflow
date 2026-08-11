---
name: spec
description: Turn a vague request into a written spec by interviewing the user about the hard parts, then writing it to .agent/specs/.
when_to_use: Use when a ticket or feature request is ambiguous, underspecified, or has edge cases nobody has thought about. Skip it when the work is already unambiguous.
argument-hint: "<ticket-id or description>"
---

# Spec

Ambiguity resolved before planning costs one question. Resolved after
implementation costs a rewrite.

## First, decide whether to run at all

If the request is already clear — a reproducible bug, a small well-described
change, a ticket that states its acceptance criteria — say so and skip. Do not
manufacture questions to justify the step.

## Interview

Use **AskUserQuestion**. Ask about the hard parts, not the obvious ones.

Skip anything you can determine yourself: read the code, the dossier, and
existing patterns first, and only ask what genuinely requires a human decision.
Asking about something discoverable wastes their attention on the wrong things.

Dig into:

- **Behaviour at the edges** — empty, missing, very large, duplicated,
  concurrent, permission-denied, offline.
- **Who this is for and what changes for them** — which users see this, and what
  they can do afterwards that they could not before.
- **Existing behaviour it touches** — what must keep working exactly as it does.
- **Explicit non-goals** — what a reasonable reader would assume is included and
  is not.
- **Trade-offs with a real cost** — where two defensible options lead to
  materially different work. Recommend one and say why.

Keep going until the hard parts are covered. Two or three focused rounds usually
suffice; stop when the remaining unknowns would not change the implementation.

## Write it

To `.agent/specs/<ticket-or-slug>.md`:

```
# <Ticket> — <one line>

## Problem
<What is wrong or missing, and who it affects.>

## Outcome
<What is true when this is done. Observable, not internal.>

## Behaviour
- <Given … when … then …>  <- concrete enough to test against

## Edge cases
- <case> -> <decided behaviour>

## Out of scope
- <thing> — <why>

## Open questions
- <anything still unresolved, and who can answer it>

## Decisions
- <decision> — <the reason, so it is not relitigated later>
```

Record the reasoning behind each decision, not only the decision. The reason is
what future-you needs when the trade-off resurfaces.

Never invent an answer the user did not give. If something stayed unresolved,
it goes under **Open questions** — an assumption silently promoted to a
requirement is the most expensive kind of mistake here.
