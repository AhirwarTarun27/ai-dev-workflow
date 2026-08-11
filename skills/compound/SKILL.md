---
name: compound
description: Capture what this cycle taught, so the same mistake is not made twice — as a learning entry, a CLAUDE.md line, a new hook, or an improvement to the workflow itself.
when_to_use: Run after finishing a piece of work, after hitting a non-obvious bug or gotcha, or whenever something was learned that the code itself does not reveal.
argument-hint: "[the lesson, if you already know what it is]"
---

# Compound

Each cycle should make the next one cheaper. Capture **one** durable artifact —
not a summary of what happened, which nobody will read.

## What qualifies

Only things the code does not already reveal. A future reader will have the
repository; they will not have the two hours it took to work out why the build
passed locally and failed on the server.

Worth capturing: a non-obvious cause, a rule with a hidden reason, a
counter-intuitive constraint, a trap that will recur, a convention that only
exists in someone's head.

**Not worth capturing:** what the code plainly shows, a restatement of the
ticket, anything already in `CLAUDE.md` or the dossier, or a general
programming lesson. If it is not surprising, it is not a learning.

If nothing surprising happened, say so and write nothing. Not every cycle
teaches something, and manufacturing an entry devalues the ones that matter.

## Choose the destination

**Project-specific** → `.agent/learnings/<area>.md`. One file per feature area,
never one per incident. Append a dated section; never overwrite an existing one.

```
## YYYY-MM-DD — <topic, keyword-rich>
**Context:** <what was being done>
**Gotcha:** <what was surprising, and WHY it happens — the causal chain, not
just the symptom>
**Fix:** <what actually worked>
**Tell:** <the symptom that identifies this next time>
**See:** `path:line`, `path:line`
```

Update `.agent/learnings/INDEX.md` with a one-line hook per area. Push feature
names, symbols, library names and config keys into that line — at scale it is
the entire retrieval mechanism.

**A rule that must always hold** → propose a hook, not a sentence. An
instruction in `CLAUDE.md` is a request the model may ignore; a `PreToolUse`
hook is a guarantee. Add the path to `protectedPaths` in the contract, or
propose a new hook script.

**A convention the model got wrong twice** → one line in the project
`CLAUDE.md`. Keep it under 150 lines: if adding a line, consider what to cut.

**Portable across projects** → this belongs in the workflow itself. If the
lesson would apply on any codebase in any language, propose the edit to the
devflow plugin repo — a skill, an agent instruction, or a new guardrail. Tell
the user what you would change and where; do not edit the plugin without asking.

## Rules

- **One artifact per cycle.** Choosing which lesson mattered most is the work.
- Write for someone with no memory of this session. Name the symptom they will
  see, not the conclusion you reached.
- Explain the mechanism. "Do X" is worth little; "do X because Y, and the tell
  is Z" survives.
- Cite `file:line`. An uncitable learning is usually a vague one.
