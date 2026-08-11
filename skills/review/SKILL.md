---
name: review
description: Adversarial review of a completed change in fresh context — spec compliance, correctness and security — plus a blast-radius map and retest checklist.
when_to_use: Run when implementation is complete and verified, before shipping. Also use to review someone else's branch or pull request.
argument-hint: "[diff range or file list]"
---

# Review

The agent that wrote the code is not the one who should grade it. This runs in
fresh context, against the plan.

## Scope the diff

Default to the branch against its base (`git diff <main>...HEAD`). Use the
contract's `vcs.mainBranch` if set. Accept an explicit range or file list.

## Run two agents in parallel

In a single message:

1. **`critic`** — spec compliance plus correctness and security. Pass the diff
   range and the plan or spec path.
2. **`impact-mapper`** — what else consumes the changed code, and what to
   retest. Pass the diff range and one line on what changed.

They answer different questions: one asks "is this right?", the other asks "what
else breaks if it is not?". Neither replaces the other.

Skip `impact-mapper` only when the change is genuinely self-contained — no
shared code, no contract, no styles or strings consumed elsewhere.

## The bar for reporting a finding

A reviewer told to find problems will find some even in sound work, and chasing
invented findings produces over-engineering. So report only what affects
**correctness, security, data integrity, or a stated requirement**.

Style preferences, alternative naming, and refactors you would have done
differently are out of scope. **If the change is sound, say so and report
nothing** — that is a real result, not a failure to look hard enough.

Every finding needs a concrete failure: specific inputs or state leading to a
specific wrong outcome. If that sentence cannot be written concretely, the
finding is speculation and does not ship.

## Report

```
## Verdict
<sound | defects found> — <one line>

## Spec compliance
<met, or the specific gap>

## Findings
<ranked most severe first, each with path:line, the failure, and the fix
direction — not the patch>

## Retest before merge
<the checklist from impact-mapper: where to go, what to do, what to expect>

## Checked and clean
<what was examined and found sound, so coverage is visible>
```

Present findings for a decision. Do not fix them in this step — if the user
wants them applied, that is a separate pass, and mixing review with repair
removes the independence that makes the review worth running.
