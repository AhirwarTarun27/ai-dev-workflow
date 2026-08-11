---
name: verify
description: Prove the change actually works — run the project's verification chain and, for user-facing changes, drive the running app in a browser and check the console.
when_to_use: Run after implementing, before review or shipping, or whenever you need evidence rather than an assertion that something works.
argument-hint: "[what to check in the running app]"
---

# Verify

The gap between "the model says it works" and "it works" is where most agent
failures live. Close it with evidence.

## 1. Run the chain

Delegate to the **`verifier`** agent. It reads the `verify` array in
`.agent/devloop.json`, runs each step in order, and reports pass, warn or fail
with the root cause located to a file and line.

Do not paste raw build output into the conversation. That is exactly what the
agent exists to prevent.

Distinguish warnings from failures. Lint warnings and deprecations on a zero
exit are not a broken build; report them separately rather than as blockers.

## 2. Exercise it for real

If `browser.enabled` is true in the contract and the change is user-facing, this
step is required — a passing build says nothing about whether the feature works.

Start the app using `commands.run`, then with Playwright:

1. Navigate to the affected screen.
2. **Exercise the actual change** — click it, submit it, filter by it. Not just
   load the page.
3. Take a screenshot.
4. **Read the browser console and network activity.** A clean-looking screen
   with a failed request behind it is the most common false pass there is.
5. Check the obvious edge: empty state, or an error path if the change has one.

For non-browser projects, use the equivalent: run the CLI, hit the endpoint,
call the function with real input. The principle is the same — observe the
behaviour, do not infer it.

## 3. Report evidence

State what was run and what was observed, not that things are fine:

```
## Chain
- build: pass (12s)
- lint: pass — 3 warnings (pre-existing)

## Behaviour observed
<what you did, and what actually happened>
Screenshot: <path>
Console: clean | <the errors>

## Not verified
<what this run did not cover, and why>
```

**Never report success you did not observe.** "Should work now" is not a
result. If something could not be checked — no local environment, a service that
is unavailable, a flow needing credentials — say so explicitly under **Not
verified**. An honest gap lets the user decide; a silent one becomes a bug.

If a step fails, hand the root cause back for fixing and do not attempt to work
around the check itself.
