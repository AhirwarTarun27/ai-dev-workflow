---
name: setup
description: Get the project actually running on this machine — check every prerequisite against what is installed, close the gaps, start it, and prove it works end to end.
when_to_use: Run on day one after onboard, when the app will not start, after a long gap away from a project, or when a teammate is stuck setting up.
argument-hint: "[check|fix|run]"
---

# Setup

Documentation about how to run a project is not a running project. This closes
that gap: audit the machine, fix what is missing, start it, prove it works.

Read `.agent/project/running.md`. If it has no **Prerequisites** section, run
`/devflow:onboard refresh` first — you cannot check requirements nobody recorded.

## 1. Audit — what is required vs what is here

Check each requirement against this machine. Report the actual version found,
never assume it is fine because the tool exists — a wrong major version is the
most common day-one failure and the error it produces rarely says so.

Cover: language runtimes and their **exact required version**; package managers;
global CLI tools; databases and caches; container runtimes; and any version
manager the project expects (`.nvmrc`, `.tool-versions`, `global.json`,
`.python-version`, `rust-toolchain.toml`).

```
| Requirement | Required | Found | Status |
|---|---|---|---|
| Node        | 20.x (.nvmrc) | 18.17.0 | WRONG VERSION |
| PostgreSQL  | 14+           | absent  | MISSING |
```

Stop after this table if the argument was `check`.

## 2. Fix the gaps

**Never install anything silently.** Runtime and global tool installs change the
whole machine and can break the user's other projects. Propose the exact command,
say what it changes, and let them run it or approve it.

Prefer a version manager (`nvm`, `asdf`, `pyenv`, `rustup`) over a system-wide
install, so other projects on this machine keep working.

Some things you cannot do for them: VPN access, a database dump, real
credentials, an SSH key added to a server, a licence. List these separately and
plainly as **"you need to get these from a human"**, naming who probably has them.

## 3. Services and configuration

Check that required services are actually reachable, not merely installed — a
stopped database and an absent one produce very different errors.

For config: find the template (`.env.example`, `appsettings.Development.json`,
`config.sample.*`) and list every key that needs a real value. **Never print or
log a secret value**, and never write one into a file the guard hook protects —
tell the user which key to fill in and where.

## 4. Run it and prove it

Run `commands.install`, then `commands.run`. Then confirm it actually works:
reach the URL, hit the health endpoint, or run the CLI. A process that started
without crashing is not proof — many apps start fine and fail on first request.

Check the logs for errors it swallowed on boot. If the project has seed data or
a test login, use it and confirm you get past the front door.

## 5. Report, and improve the notes

```
## Status
<running at http://localhost:3000 | blocked on: ...>

## Fixed
<what was installed or configured, and how>

## You need from a human
<access, credentials, data — and who to ask>

## Proof
<what you did and what you observed — not "it should work">
```

Anything that went wrong and was not in `running.md` gets **added** to it, with
the symptom and the fix. The next person to run this — including future you on a
new laptop — should not rediscover it.

## Rules

- **Never invent a version number.** If the required version is not pinned
  anywhere, say it is unpinned and report what is installed.
- Do not modify system configuration, PATH, or global tool versions without
  explicit agreement.
- If setup is genuinely blocked on something only a human can provide, say so
  and stop. Do not fake progress around it.
