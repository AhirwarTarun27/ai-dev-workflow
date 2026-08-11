---
name: kickoff
description: Start a ticket. Runs spec, research and plan end to end, then stops for your approval before any code is written.
when_to_use: The default entry point for any new piece of work — a ticket ID, a bug report, or a described feature. Use when you want the full gated front half in one command.
argument-hint: "<ticket-id or description of the work>"
---

# Kickoff

The one command to start work. It produces a plan you approve; it writes no
source code.

If `.agent/devloop.json` is missing, stop and say to run `/devflow:onboard`
first — planning against an unknown stack produces a plan nobody can execute.

## Sequence

**1. Spec** — invoke `/devflow:spec`. If the request is already unambiguous
(clear bug, obvious fix, well-specified ticket), skip it and say why. A
five-question interview about a one-line change wastes everyone's time.

**2. Research** — invoke `/devflow:research`. Required. Never plan from
assumption; the plan's exact file paths come from here.

**3. Plan** — invoke `/devflow:plan`. Produces the phased plan, opening with the
human-readable end-to-end walkthrough.

## Then stop

Present, in this order:

1. **The walkthrough** — the "How this works end-to-end" section, in full. This
   is the part worth reading; do not summarise it away.
2. **The phases** — one line each.
3. **Unresolved questions**, if the plan has any.
4. The plan file path, and that it can be edited directly with `Ctrl+G`.

Then stop and wait. Do not begin implementing, do not touch source files, do not
ask whether to proceed in a way that invites a reflexive yes. The approval gate
is the only one in this workflow — its whole value is that a human actually
reads the plan.

## Judgement

- **Scale to the work.** If the change is one line and you could describe the
  diff in a sentence, say so and offer to just do it rather than generating
  ceremony around it.
- **Split what is too big.** If research shows the ticket is really three
  tickets, say so before planning and propose the split.
- **Stop early on a blocker.** If research finds the ticket rests on something
  that does not exist or contradicts how the system works, report that instead
  of planning around it.
