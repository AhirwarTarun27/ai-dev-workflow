---
name: onboard
description: Survey an unfamiliar repository in depth and set up the devflow workflow for it. Writes a project dossier, the devloop.json contract, and a project CLAUDE.md.
when_to_use: Run once when joining a new codebase, or with "refresh" when the project has drifted. Also run when devflow commands report no contract.
argument-hint: "[refresh]"
disallowed-tools: WebSearch, WebFetch
---

# Onboard a repository

One expensive survey, three cheap consumers: the dossier feeds `CLAUDE.md`,
`devloop.json`, and `/devflow:orient`. Do the reading once and do it properly.

**Repo and local sources only.** Code, README, `docs/`, manifests, CI config and
git history. Nothing leaves the machine. Links to trackers or wikis are recorded
as links, never fetched. Anything the repo cannot tell you becomes a question for
the team, not a guess.

## 1. Check state

If `.agent/devloop.json` exists and the argument is not `refresh`, report what is
already configured and stop. Do not silently redo the survey.

## 2. Survey — launch these scouts in parallel

Give each `scout` ONE narrow question. Run them in a single message so they go
concurrently. Adapt the questions to what the repo actually is.

1. **Architecture** — what are the top-level components, what runs as its own
   process or deployable, where are the boundaries, what data stores and external
   services are referenced in config?
2. **Domain model** — what are the core entities and the vocabulary used for
   them in code (types, tables, routes, folder names)? What do the names suggest
   this system is *for*?
3. **Flows** — find the 3–5 most significant user-facing entry points (routes,
   pages, commands, endpoints) and trace each one hop or two inward.
4. **Run and test story** — how is this installed, built, run, tested, linted
   and formatted? Read manifests, scripts, CI config, Dockerfiles, READMEs.
   What is the local setup — env files, seed data, credentials, ports?
5. **Conventions** — from the actual code, not from documentation: naming,
   file layout, error handling, state management, how new modules are
   registered. Find the most recently added feature and read it as the template.

Then read directly yourself: the README, any `docs/`, and git history —
`git log --oneline -n 200`, plus which directories change most. Churn is an
honest map of what the business actually cares about.

## 3. Write the dossier

To `.agent/project/`, each file under ~100 lines, every claim cited:

- `business.md` — the problem, the users, the domain vocabulary. **Every
  statement carries its evidence** (`src/x.ts:14`, `README.md:30`, a commit).
  Plain language, no code.
- `architecture.md` — components, boundaries, data stores, external services.
- `flows.md` — the main journeys, traced with `file:line`.
- `running.md` — install, run, log in, seed, logs, debug. Exact commands.
- `conventions.md` — patterns observed in real code, with an exemplar path.
- `open-questions.md` — **what the codebase could not answer.** Business rules
  with no visible source, unexplained config, dead-looking code, undocumented
  external dependencies. Phrase each as a question to ask a teammate.

Business claims are the dangerous ones: architecture is checkable by reading
code, but a wrong business claim is invisible to a newcomer. When evidence is
thin, it belongs in `open-questions.md`, not stated as fact.

## 4. Propose the contract

Derive the commands from what you found, then **confirm with AskUserQuestion
before writing** — offer your detected values as the recommended option. Never
assume silently.

Copy `${CLAUDE_PLUGIN_ROOT}/templates/devloop.json.tmpl` to
`.agent/devloop.json` and fill it. Set `testMode` to `tdd` only if the repo has
a real, runnable test setup; otherwise `evidence`. Set `vcs.host` from the
origin remote and which CLI is present (`gh`, `az`, `glab`).

## 5. Write CLAUDE.md

From `${CLAUDE_PLUGIN_ROOT}/templates/CLAUDE.md.tmpl`. **Under 150 lines, project
facts only.** This file is re-sent on every request forever, so every line must
earn its place: if removing it would not cause a mistake, cut it.

Do not document the devflow workflow in it — the plugin already carries that
everywhere. If a `CLAUDE.md` already exists, propose additions; never overwrite.

## 6. Finish

Append the contents of `${CLAUDE_PLUGIN_ROOT}/templates/gitignore-block.txt` to
`.gitignore` (or `.git/info/exclude` if the repo's ignore file is off-limits).

Report what you configured in five lines, then offer `/devflow:orient` to walk
through the project, and flag the count of open questions.
