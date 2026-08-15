#!/usr/bin/env node
/**
 * PostToolUse hook for Edit|Write.
 *
 * Runs the project's own formatter against the single file just edited.
 * Deliberately silent and non-blocking: a formatter failure must never
 * interrupt work, and a project with no formatter must cost nothing.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import {
  readHookInput,
  projectRoot,
  loadContract,
  commandFor,
  toRepoRelative,
} from "./_lib.mjs";

const input = readHookInput();
const root = projectRoot(input);
const contract = loadContract(root);
if (!contract) process.exit(0);

const template = commandFor(contract, "format");
if (!template) process.exit(0); // null format = this project has no formatter

const target = input?.tool_input?.file_path;
if (!target || !existsSync(target)) process.exit(0);

const rel = toRepoRelative(root, target);
if (!rel || rel.startsWith(".agent/")) process.exit(0);

// Only format what the project says it can format.
const exts = contract?.formatExtensions;
if (Array.isArray(exts) && exts.length) {
  const dot = rel.lastIndexOf(".");
  const ext = dot === -1 ? "" : rel.slice(dot);
  if (!exts.includes(ext)) process.exit(0);
}

const command = template.includes("{file}")
  ? template.replaceAll("{file}", JSON.stringify(rel))
  : `${template} ${JSON.stringify(rel)}`;

const res = spawnSync(command, {
  cwd: root,
  shell: true,
  encoding: "utf8",
  timeout: 30_000,
});

// Report only genuine formatter breakage, and even then do not block.
if (res.status !== 0 && res.status !== null) {
  const detail = (res.stderr || res.stdout || "").trim().split("\n").slice(-3).join("\n");
  if (detail) console.error(`devflow: formatter failed on ${rel}\n${detail}`);
}

process.exit(0);
