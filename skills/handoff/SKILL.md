---
name: handoff
description: Produce a structured end-of-session summary so a fresh session can pick the work up without re-deriving anything.
when_to_use: Use before clearing context, at the end of a working session, or when handing work to another session or person. Also useful when context is filling up mid-task.
---

# Handoff

The audience is a future session with **no memory of this one**. Write what it
needs to continue, not a narrative of what happened.

Context degrades as it fills. A clean restart from a good handoff beats
struggling on in a saturated window — so this is a routine move, not a defeat.

## Output — in chat, not to a file

```
## Goal
<what the work is trying to achieve, in two lines>

## Decisions locked
<decisions already made and their reasons, so they are not relitigated>

## Done
<what actually shipped — files changed, commits made, verified how>

## Key files
<absolute paths, with one line each on why they matter>

## Running state
<background processes, dev servers, watch tasks, their ports and IDs.
Branch name, whether it is pushed, uncommitted changes.>

## Verification
<what has been proven to work, and how. What has NOT been checked.>

## Deferred
<consciously postponed, with the reason — distinct from forgotten>

## Open questions
<unresolved, and who or what can resolve them>

## Pick up here
<the exact next action, concrete enough to start on without re-reading
this session>
```

## Rules

- **Absolute paths**, always. A relative path is ambiguous in a new session.
- **Name the plan and spec files first** if they exist — they carry the detail
  this summary should not duplicate.
- **Never invent state.** If you do not know whether something was pushed,
  verified, or left running, say it is unknown. A confident wrong claim here is
  worse than a gap, because the next session will act on it.
- **Record background process IDs and ports.** They are load-bearing and
  impossible to recover later.
- Distinguish verified from assumed, and deferred from forgotten.
- No emojis, no motivational framing, no recap of the conversation.

## Anti-patterns

- A chronological story of the session. Nobody needs the order things happened.
- Restating what is already in the plan file. Point at it instead.
- "Everything is working" without saying what was actually run.
- Omitting a failed attempt — knowing what did not work saves the next session
  from repeating it. Say what was tried and why it failed.
