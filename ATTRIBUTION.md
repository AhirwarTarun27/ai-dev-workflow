# Attribution

This workflow is assembled from techniques published by people who have thought
hard about working with coding agents. **No text was copied verbatim from any
source** — every skill, agent and script here was written for this plugin. What
was taken is method: which steps matter, in what order, and why.

That distinction is deliberate. Techniques are not copyrightable; wording is.
Where a source carries no licence, only the idea was used and it was re-expressed
from scratch. Where a source is MIT-licensed, the same discipline was applied
anyway, so this repository bundles no third-party code and requires no
third-party licence notices.

If you are one of the people below and feel something here crosses that line,
open an issue and it will be changed.

## Sources

| Source | Licence | What was taken |
|---|---|---|
| [Anthropic — Claude Code best practices](https://code.claude.com/docs/en/best-practices) | none declared | Give the agent a way to verify its work; the escalation ladder from prompt to Stop hook; explore→plan→implement; guardrails belong in hooks, not prose; keep CLAUDE.md small or it gets ignored; the caution that a reviewer told to find problems will invent them |
| [Anthropic — Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | none declared | Context rot; structured note-taking to disk; sub-agent isolation for read-heavy work; just-in-time retrieval |
| [Anthropic — Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | none declared | Per-feature verification steps; the finding that agents miss broken features without browser automation; never edit tests to pass |
| [Anthropic — Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) | none declared | Progressive disclosure; capturing successful approaches back into a skill |
| [Anthropic — Multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) | none declared | Fan-out costs ~15× a chat; token use dominates quality; multi-agent is a poor fit for coordinated writing |
| [HumanLayer — Advanced Context Engineering for Coding Agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents) | none declared | Research → Plan → Implement as separate artifacts on disk; intentional compaction; the leverage argument for reviewing plans hardest |
| [Simon Willison — Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/) | website | Linear walkthroughs and interactive explanations for understanding code; red/green TDD with a confirmed failing test first |
| [Jesse Vincent — Superpowers](https://github.com/obra/superpowers) | MIT | Two-stage review (spec compliance, then quality); plans as small tasks with exact paths and verification steps |
| [Matt Pocock — skills](https://github.com/mattpocock/skills) | MIT | Dual-axis review (standards and spec); grilling the user to surface misalignment early |
| [Every Inc — Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | MIT | Each cycle should make the next cheaper; capturing learnings as a distinct phase |
| [Cognition — Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents) | article | Parallelise reading, keep writing single-threaded |
| [GitHub — spec-kit](https://github.com/github/spec-kit) | MIT | Spec as the source of truth ahead of planning |
| [Addy Osmani — AI-assisted engineering](https://addyosmani.com/blog/ai-coding-workflow/) | article | Commits as save points; never ship code you cannot explain |
| [Harper Reed — LLM codegen workflow](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/) | article | Interview to a spec before generating anything |
| [Armin Ronacher — Agentic coding recommendations](https://lucumr.pocoo.org/2025/6/12/agentic-coding/) | article | Prefer the simplest thing that works; make behaviour observable in logs the agent can read |

## Prior version

The `verifier` and `impact-mapper` agents generalise two ideas from an earlier,
project-specific setup the author wrote for a .NET/React codebase: a verifier
that diagnoses but never fixes, and a blast-radius analyser kept separate from
code review. Both were rewritten to read the project contract rather than
hardcode a toolchain.
