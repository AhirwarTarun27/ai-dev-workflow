# devflow

A portable, tech-agnostic development workflow for Claude Code. Drop it into any
repository — any language, any stack — and get a gated loop from ticket to pull
request, plus a way to actually learn an unfamiliar codebase.

## Install

```bash
/plugin marketplace add AhirwarTarun27/ai-dev-workflow
/plugin install devflow@ai-dev-workflow
```

Then, in each new repository:

```
/devflow:onboard      # survey the repo, set up the workflow
/devflow:setup        # check prerequisites against your machine, fix gaps, get it running
/devflow:orient       # learn the project: business, architecture, flows, how it works
```

## The loop

```
/devflow:kickoff ABC-123     spec -> research -> plan
                             |
                        [ YOU APPROVE ]     <- the only gate
                             |
/devflow:implement           one phase at a time, committed per phase
/devflow:verify              build + lint + drive it in a real browser
/devflow:review              adversarial review + blast radius
/devflow:ship                branch, commit, PR — never merges
/devflow:compound            capture the one thing this cycle taught
```

`/devflow:explain` traces any existing feature, file or PR end to end, for when
there is no ticket.

`/devflow:handoff` writes a structured summary before you clear context.

## How it stays tech-agnostic

Nothing hardcodes `npm`, `dotnet` or `pytest`. `/devflow:onboard` writes a
contract to `.agent/devloop.json` and every skill, agent and hook reads its
commands from there:

```jsonc
{
  "commands": { "build": "...", "test": "...", "lint": "...", "format": "... {file}" },
  "verify":   ["build", "lint"],     // the gate
  "testMode": "tdd" | "evidence"     // adapts to whether real tests exist
}
```

`testMode` is decided by what the repo actually has. With real test
infrastructure you get red/green TDD. Without it, the gate becomes build + lint
+ observed behaviour in the running app — rather than pretending a test suite
exists.

## Guardrails

Three hooks, all deterministic code costing zero tokens. They no-op silently in
a repo that never ran onboard.

| Hook | Does |
|---|---|
| `PreToolUse` | Blocks edits to secrets, lockfiles, generated output and vendored code |
| `PostToolUse` | Runs the project's own formatter on the file just edited |
| `Stop` | Refuses to end the turn while the verify chain fails — armed only during `/devflow:implement` |

An instruction in `CLAUDE.md` is a request the model can ignore. A hook is not.

## Artifacts

Everything working lives in a gitignored `.agent/` directory, so nothing
AI-related enters the repository:

```
.agent/
  devloop.json       the contract
  project/           the dossier: business, architecture, flows, running, conventions,
                     and open-questions — what the codebase could NOT tell you
  specs/ research/ plans/
  learnings/         non-obvious gotchas worth keeping
```

## Design notes

- **Fan out to read, stay single-threaded to write.** Parallel agents are
  excellent at searching and bad at coordinated editing.
- **Cheap models for cheap work.** Locating code runs on Haiku; planning and
  reviewing run on Opus.
- **Survey once, read many.** The dossier is written once and read by everything
  downstream, so nothing re-explores.
- **Evidence, not assertion.** "Should work now" is not a result.
- **Small files.** Skills are capped at 100 lines and agents at 80, enforced by
  `node scripts/lint-budgets.mjs`, because a loaded skill stays in context for
  the rest of the session.

## Credits

Assembled from techniques published by Anthropic, HumanLayer, Simon Willison,
Jesse Vincent, Matt Pocock, Every Inc, Cognition, GitHub, Addy Osmani, Harper
Reed and Armin Ronacher. No text was copied — see [ATTRIBUTION.md](ATTRIBUTION.md).

MIT licensed.
