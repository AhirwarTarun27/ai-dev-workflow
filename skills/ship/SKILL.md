---
name: ship
description: Commit, push and open a pull request with a description built from the spec, plan and diff. Detects the git host at runtime and never merges.
when_to_use: Run when a change is implemented, verified and reviewed, and is ready to go up for review.
argument-hint: "[target branch]"
---

# Ship

Get reviewed work in front of humans. **Never merge**, and never push without
saying what is about to be pushed.

## 1. Preconditions

Confirm the verify chain passed — `.agent/state/last-verify.json` records the
last pass. If it did not pass or the record is stale, run `/devflow:verify`
first. Do not ship on an unproven build.

Show `git status` and the diffstat before doing anything, so what is about to be
committed is visible rather than assumed.

## 2. Branch and commit

If on the main branch, create a feature branch first — never commit directly to
it. Name it from the ticket, following whatever convention the repo's existing
branches use.

Commit messages: imperative mood, the ticket ID where the repo's history uses
one, subject under ~72 characters. Match the repo's existing style — read
`git log --oneline -n 20` rather than imposing a convention on it.

## 3. Push and open the PR

Detect the host from `vcs.host` in the contract and which CLI is actually
present. Use `gh` for GitHub, `az repos` for Azure DevOps, `glab` for GitLab.
If none is available, prepare the title and body and hand them over for the user
to paste — do not fail the step over a missing CLI.

**Use the repository's own PR template if one exists** (`.github/`,
`.azuredevops/`, `.gitlab/`). Read it and fill it in; do not substitute a
template of your own. Leave checkboxes for the human to tick.

Build the description from real artifacts:

```
## Summary
<what changed and why, from the spec — 2-4 lines>

## Changes
<the phases from the plan, one line each>

## Verification
<what was actually run and observed, from /devflow:verify>

## Retest
<the checklist from review, if a review ran>

## Notes
<anything a reviewer should know: deliberate trade-offs, follow-ups deferred>
```

## 4. Finish

Remove `.agent/state/active-gate` — the work is out of the build loop.

Report the branch, the PR URL, and what remains. Then suggest
`/devflow:compound` to capture what this cycle taught.

## Rules

- Never merge, never force-push a shared branch, never skip hooks or bypass
  signing unless explicitly asked.
- Never invent verification you did not run. If something was not checked, the
  PR body says so.
- Confirm before the first push to a remote. Pushing is outward-facing and hard
  to take back.
