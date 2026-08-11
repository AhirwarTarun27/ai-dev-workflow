---
name: plan
description: Turn research into a phased implementation plan on disk, opening with a human-readable end-to-end walkthrough of how the change will work.
when_to_use: Run after research and before writing any code. The plan is the single approval gate in this workflow.
argument-hint: "<ticket-id>"
---

# Plan

Produce something a human can genuinely review. A wrong line here becomes
hundreds of wrong lines of code, which is why this is where the gate sits.

## Inputs

Read the spec (if any), the research document, and `.agent/devloop.json` for the
project's real commands. If research is missing, stop and run
`/devflow:research` — a plan built on assumption cannot name exact file paths.

## Produce it

Delegate to the **`architect`** agent, passing the research path, the spec path,
and the contract path. It writes `.agent/plans/<ticket>.md`.

The plan must open with **How this works end-to-end**: the to-be trace across
every layer the change touches, in order, each with a `file:line`, followed by a
diagram of the flow and a short note on why this approach over the obvious
alternative. Roughly one screen. This section exists so the person approving can
actually reason about what they are approving — it is not a summary, and it is
not optional.

Then numbered phases, each with exact file paths and its own verification step.

## Then present, and stop

Show the walkthrough in full, the phases one line each, and any unresolved
questions. Give the plan path and mention `Ctrl+G` opens it for direct editing.

**Do not implement.** Wait for approval.

## Quality bar

Before presenting, check the plan against these — they are the failures that
show up later as rework:

- **Every phase independently verifiable.** If a phase has no check of its own,
  it is two phases or it is missing one.
- **Exact paths throughout.** "The relevant component" means the research was
  incomplete; go back rather than hand-wave.
- **Verification matches the project.** In `testMode: tdd`, phases name the test
  to write first. In `evidence`, they name the build, the lint, and the
  observable behaviour in the running app.
- **Reuse is explicit.** Where research found an existing utility or component,
  the plan uses it by path. Every new abstraction gets a one-line justification.
- **The tree is never broken between phases.** Each ends committable.
- **Scope is honest.** What a reader would expect and will not get is listed
  under Out of scope.

If the plan is coming out with more than about six phases, the ticket is
probably two tickets. Say so rather than planning a marathon.
