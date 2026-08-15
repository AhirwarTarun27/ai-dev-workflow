---
name: notes
description: Show what this repo has — past learnings, the project dossier, and which skills and agents are active — and open any note by name.
when_to_use: Use to find a learning you wrote earlier, to check what skills or agents are available here, or to see whether a project has been onboarded. Also exports learnings out of the repo.
argument-hint: "[topic | skills | export <path>]"
allowed-tools: Read, Glob, Grep, Bash(claude plugin list)
---

# Notes

Working artifacts live in a gitignored `.agent/` folder, so they are easy to
forget about. This is the index.

## No argument — show the overview

Read, do not guess. Everything below comes from the filesystem.

**Learnings** — `.agent/learnings/*.md`. For each: the topic, how many dated
entries it holds, and the newest date. Read the `##` headings to count entries;
do not print their contents.

**Dossier** — `.agent/project/*.md`. Report present or absent. If absent, say
`/devflow:onboard` has not run here.

**Work in flight** — the newest few files in `.agent/plans/` and `.agent/specs/`,
with dates. This is usually what someone actually wants when they return to a
project after a gap.

**Skills and agents** — separate by origin, because that is the thing people get
confused about:

- *This repo:* `.claude/skills/*/SKILL.md`, `.claude/commands/*.md`,
  `.claude/agents/*.md` — invoked as `/name`
- *Your machine:* `~/.claude/skills/`, `~/.claude/agents/`
- *Plugins:* run `claude plugin list` — invoked as `/plugin-name:skill`

Take each skill's one-line purpose from its `description` frontmatter.

Format it compactly:

```
LEARNINGS (3)                        .agent/learnings/
  checkout      2 entries, latest 2026-08-09
  deployment    1 entry,   2026-07-22

DOSSIER                              .agent/project/
  present — business, architecture, flows, running, conventions
  open questions: 4 unanswered

IN FLIGHT
  plans/ABC-123.md      2026-08-10
  specs/ABC-123.md      2026-08-10

SKILLS
  repo    /deploy-staging   deploy this service to staging
  plugin  devflow:*         15 skills
  plugin  mattpocock-skills:*  12 skills

AGENTS
  repo    db-migrator       writes and checks EF migrations
  plugin  devflow: scout, architect, critic, verifier, impact-mapper
```

End with the paths, so they can be opened directly in an editor.

## With a topic — open that note

Match loosely against learning filenames and headings (`checkout` should find
`checkout-flow.md`). Print the matching entries in full, newest first.

If several match, list them and ask which. If none match, say so and show the
available topics rather than inventing an answer.

## `skills` — just the skills and agents section

Same as above, skipping learnings and plans.

## `export <path>` — copy learnings out of the repo

Copy `.agent/learnings/` to the given path (default `~/devflow-notes/<repo>/`).

Worth knowing, and say it plainly when exporting: `.agent/` is gitignored, so
learnings do **not** survive a fresh clone or move to another machine. Export is
how you keep them. Do not nag about this anywhere else — it is a deliberate
choice, not a mistake.

## Rules

- Read the filesystem every time. Never answer from memory of an earlier run;
  files change between sessions.
- If `.agent/` does not exist, say the repo has not been onboarded and stop.
- Do not summarise or paraphrase a learning when asked to open it. Print it.
- Keep the overview scannable. It is an index, not a report.
