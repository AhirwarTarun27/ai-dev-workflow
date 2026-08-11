#!/usr/bin/env node
/**
 * SessionStart hook.
 *
 * Injects a few lines of project state so the session starts oriented without
 * anyone re-deriving it. Kept deliberately tiny: this text is paid for at the
 * start of every single session.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { readHookInput, projectRoot, loadContract, agentDir } from "./_lib.mjs";

const input = readHookInput();
const root = projectRoot(input);
const contract = loadContract(root);

if (!contract) {
  // Only nudge in repos that look like real projects, not scratch directories.
  const looksLikeProject = [".git"].some((f) => existsSync(join(root, f)));
  if (!looksLikeProject) process.exit(0);
  emit("devflow: this repo has no .agent/devloop.json. Run /devflow:onboard to survey it and set up the workflow.");
}

const lines = [];
lines.push(
  `devflow: stack=${contract.stack || "unknown"} | verify=[${(contract.verify || []).join(", ") || "none"}] | testMode=${contract.testMode || "unset"}`
);

const dossier = join(agentDir(root), "project");
if (!existsSync(dossier)) {
  lines.push("No project dossier yet — run /devflow:onboard. To learn the project, /devflow:orient.");
}

// Surface the most recent plan so work resumes where it left off.
const plansDir = join(agentDir(root), "plans");
if (existsSync(plansDir)) {
  const newest = readdirSync(plansDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ f, m: statSync(join(plansDir, f)).mtimeMs }))
    .sort((a, b) => b.m - a.m)[0];
  if (newest) lines.push(`Active plan: .agent/plans/${newest.f}`);
}

if (existsSync(join(agentDir(root), "state", "active-gate"))) {
  lines.push("Verify gate is ARMED — the turn cannot end until the verify chain passes.");
}

emit(lines.join("\n"));

function emit(text) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: text,
      },
    })
  );
  process.exit(0);
}
