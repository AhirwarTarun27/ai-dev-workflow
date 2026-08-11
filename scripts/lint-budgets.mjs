#!/usr/bin/env node
/**
 * Token-budget linter for this plugin. Run in CI and pre-commit.
 *
 * A loaded skill stays in context for the rest of the session, and an agent
 * prompt is paid on every delegation, so length here is a recurring cost rather
 * than a one-off. These caps exist because the setup this replaced had drifted
 * to roughly 40% pasted boilerplate.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

const BUDGETS = [
  { dir: "skills", pattern: /SKILL\.md$/, max: 100, label: "skill" },
  { dir: "agents", pattern: /\.md$/, max: 80, label: "agent" },
  { dir: "templates", pattern: /\.(md|tmpl)$/, max: 100, label: "template" },
];

const violations = [];
let checked = 0;

for (const { dir, pattern, max, label } of BUDGETS) {
  const base = join(rootDir, dir);
  if (!existsSync(base)) continue;
  for (const file of walk(base)) {
    if (!pattern.test(file)) continue;
    checked++;
    // A trailing newline terminates the last line rather than starting a new
    // one, so do not let it count against the budget.
    const lines = readFileSync(file, "utf8").replace(/\r?\n$/, "").split("\n").length;
    if (lines > max) {
      violations.push(
        `${relative(rootDir, file).replace(/\\/g, "/")}: ${lines} lines (${label} budget ${max})`
      );
    }
  }
}

if (violations.length) {
  console.error("Token budget exceeded:\n");
  for (const v of violations) console.error(`  ${v}`);
  console.error(
    "\nMove the detail into a supporting file in the same directory and reference it,",
    "\nso it is read only when actually needed rather than loaded every session."
  );
  process.exit(1);
}

console.log(`Token budgets OK (${checked} files checked).`);

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}
