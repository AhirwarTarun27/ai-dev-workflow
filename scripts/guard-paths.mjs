#!/usr/bin/env node
/**
 * PreToolUse hook for Edit|Write|NotebookEdit.
 *
 * Blocks writes to secrets, generated output, lockfiles and vendored code.
 * Exit 2 blocks the tool call and hands stderr back to Claude as feedback.
 *
 * This is a guardrail, not a suggestion: an instruction in CLAUDE.md is a
 * request the model may ignore, whereas this cannot be talked around.
 */
import {
  readHookInput,
  projectRoot,
  loadContract,
  globToRegExp,
  toRepoRelative,
  DEFAULT_PROTECTED,
} from "./_lib.mjs";

const input = readHookInput();
const root = projectRoot(input);
const contract = loadContract(root);

const target =
  input?.tool_input?.file_path ||
  input?.tool_input?.notebook_path ||
  input?.tool_input?.path;

if (!target) process.exit(0);

const rel = toRepoRelative(root, target);
// Outside the repo entirely: not this hook's business.
if (!rel) process.exit(0);

// Never guard the agent's own workspace.
if (rel === ".agent" || rel.startsWith(".agent/")) process.exit(0);

const patterns = [
  ...DEFAULT_PROTECTED,
  ...(Array.isArray(contract?.protectedPaths) ? contract.protectedPaths : []),
];

const allow = Array.isArray(contract?.allowPaths) ? contract.allowPaths : [];
if (allow.some((p) => globToRegExp(p).test(rel))) process.exit(0);

const hit = patterns.find((p) => globToRegExp(p).test(rel));

if (hit) {
  console.error(
    [
      `Blocked: ${rel} is a protected path (matched "${hit}").`,
      "",
      "These files are secrets, generated output, lockfiles or vendored code.",
      "Editing them by hand causes drift, leaks or silent build breakage.",
      "",
      "Do one of these instead:",
      "  - change the SOURCE that generates this file, then regenerate it",
      "  - for dependencies, run the package manager rather than editing the lockfile",
      "  - if this file genuinely must be edited, ask the user to do it, or add the",
      "    pattern to allowPaths in .agent/devloop.json with their agreement.",
    ].join("\n")
  );
  process.exit(2);
}

process.exit(0);
