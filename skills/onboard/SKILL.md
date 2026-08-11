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
git history. Nothing leaves the machine; tracker and wiki links are recorded, not
fetched. What the repo cannot tell you becomes a question for the team, not a guess.

## 1. Check state

If `.agent/devloop.json` exists and the argument is not `refresh`, report what is
already configured and stop. Do not silently redo the survey.

## 2. Survey — launch these scouts in parallel

Give each `scout` ONE narrow question, all in a single message so they run
concurrently. Adapt the questions to what the repo actually is.

1. **Architecture** — what are the top-level components, what runs as its own
   process or deployable, where are the boundaries, what data stores and external
   services are referenced in config?
2. **Domain model** — what are the core entities and the vocabulary used for
   them in code (types, tables, routes, folder names)? What do the names suggest
   this system is *for*?
3. **Flows** — find the 3–5 most significant user-facing entry points (routes,
   pages, commands, endpoints) and trace each one hop or two inward.
4. **Prerequisites and run story** — the **exact versions** required and where
   each is pinned (`.nvmrc`, `.tool-versions`, `global.json`, engines fields,
   target frameworks, Dockerfile base images, and the CI matrix — CI is the most
   honest source, since it is what actually builds). Global CLI tools, databases,
   caches, container runtimes, ports. Then the install / build / run / test /
   lint / format commands, env-file templates, seed data, and anything a
   first-time setup needs that a returning developer would forget.
5. **Conventions** — from the actual code, not from documentation: naming,
   file layout, error handling, state management, how new modules are
   registered. Find the most recently added feature and read it as the template.

Then read directly yourself: the README, any `docs/`, and git history
(`git log --oneline -n 200`, plus which directories churn most — an honest map
of what the business cares about).

## 3. Write the dossier

To `.agent/project/`, each file under ~100 lines, every claim cited:

- `business.md` — the problem, the users, the domain vocabulary. **Every
  statement carries its evidence** (`src/x.ts:14`, `README.md:30`, a commit).
  Plain language, no code.
- `architecture.md` — components, boundaries, data stores, external services.
- `flows.md` — the main journeys, traced with `file:line`.
- `running.md` — **Prerequisites first**: every runtime, tool and service with
  its exact required version and where that version is pinned. Then install,
  run, log in, seed, logs, debug — exact commands. Flag separately anything only
  a human can supply: VPN, credentials, data dumps, licences.
- `conventions.md` — patterns observed in real code, with an exemplar path.
- `open-questions.md` — **what the codebase could not answer.** Business rules
  with no visible source, unexplained config, dead-looking code, undocumented
  external dependencies. Phrase each as a question to ask a teammate.

Business claims are the dangerous ones: architecture is checkable by reading
code, a wrong business claim is invisible to a newcomer. Thin evidence belongs
in `open-questions.md`, not stated as fact.

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

Report what you configured in five lines. Then offer `/devflow:setup` to get it
actually running on this machine, and `/devflow:orient` to learn the project.
Flag the count of open questions.
