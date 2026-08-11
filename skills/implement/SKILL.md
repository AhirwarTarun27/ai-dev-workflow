---
name: implement
description: Execute an approved plan one phase at a time, verifying and committing each phase before moving on.
when_to_use: Run after a plan has been approved. Takes an optional phase number to resume or redo a single phase.
argument-hint: "[phase-number]"
---

# Implement

Execute the approved plan. Do not redesign it mid-flight: if the plan turns out
to be wrong, stop and say so rather than quietly building something else — the
user approved the plan, not your revision of it.

## Arm the gate

Create `.agent/state/active-gate` (an empty file) before starting. While it
exists the turn cannot end with a failing verify chain. `/devflow:ship` removes
it. If the user asks you to stop mid-way, remove it too.

## One phase at a time

For each phase, in order:

**1. Re-read the phase.** Its files, its change, its verification step.

**2. Build it.** Which loop depends on `testMode` in `.agent/devloop.json`:

- **`tdd`** — write the failing test first. **Run it and confirm it fails for
  the right reason** before writing any implementation; a test that passes
  before the code exists is testing nothing. Then implement until it passes.
  Do not touch the test to make it pass.
- **`evidence`** — implement, then prove it: the build passes, the lint is
  clean, and the behaviour is observable in the running app. In this mode
  `/devflow:verify` is not optional, it is the only real check.

**3. Verify the phase** using the phase's own verification step.

**4. Commit.** One commit per phase, message describing the outcome. These are
save points — a phase you can return to is worth more than a tidy history.

Then move to the next phase. Do not batch phases together; the point of the
split is that each is provable on its own.

## Rules

- **Single-threaded.** Never run parallel agents that write to the same tree —
  concurrent writers make conflicting implicit decisions. Parallel reading is
  fine.
- **Follow the codebase's existing patterns**, the ones research identified.
  New code should be indistinguishable from the code around it.
- **Reuse what exists.** Do not add a utility that is already there.
- **No placeholders, no TODOs, no stubbed returns** unless the plan explicitly
  says a phase is scaffolding. Half-built code that looks finished is worse than
  code that is obviously unfinished.
- **Never weaken a check to make it pass.** Not the test, not the lint rule, not
  the type. If a check is wrong, say so and stop.
- **Stay in scope.** Something worth fixing that is not in the plan gets noted
  for later, not fixed now.

## When something is wrong

Stop and report. Do not improvise around a broken assumption. Say which phase,
what the plan assumed, what is actually true, and the options. A plan that
turned out to be wrong is normal and cheap to fix at this point — silently
diverging from it is not.

## Finish

Report per phase: what changed, how it was verified, the commit. Then run
`/devflow:verify` for the full chain, and say what is left if anything.
