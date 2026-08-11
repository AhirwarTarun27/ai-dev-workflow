#!/usr/bin/env node
/**
 * Stop hook.
 *
 * Refuses to end the turn while the project's own verification chain fails,
 * so "done" means the build actually passed rather than the model asserting it.
 *
 * Armed only when .agent/state/active-gate exists (written by /devflow:implement,
 * removed by /devflow:ship). Without that marker every casual question would
 * trigger a full build. Claude Code force-ends after 8 consecutive blocks, so a
 * genuinely broken build cannot trap the session.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readHookInput, projectRoot, loadContract, commandFor, agentDir } from "./_lib.mjs";

const input = readHookInput();
const root = projectRoot(input);

// Never re-enter: a Stop hook that fires on its own continuation would loop.
if (input?.stop_hook_active) process.exit(0);

const marker = join(agentDir(root), "state", "active-gate");
if (!existsSync(marker)) process.exit(0);

const contract = loadContract(root);
if (!contract) process.exit(0);

const chain = Array.isArray(contract.verify) ? contract.verify : [];
if (!chain.length) process.exit(0);

const tail = (s, n = 40) => (s || "").trim().split("\n").slice(-n).join("\n");

for (const step of chain) {
  const command = commandFor(contract, step);
  if (!command) continue; // null = this project has no such step; skip silently

  const res = spawnSync(command, {
    cwd: root,
    shell: true,
    encoding: "utf8",
    timeout: (contract.verifyTimeoutMs ?? 600_000),
  });

  if (res.error?.code === "ETIMEDOUT") {
    console.error(
      `Verification step "${step}" timed out.\nCommand: ${command}\n\n` +
        `Either the command hangs (a watch-mode build?) or it needs longer.\n` +
        `Fix the command in .agent/devloop.json, or raise verifyTimeoutMs.`
    );
    process.exit(2);
  }

  if (res.status !== 0) {
    console.error(
      [
        `Verification failed at step "${step}" (exit ${res.status}).`,
        `Command: ${command}`,
        "",
        "--- output (last 40 lines) ---",
        tail(res.stdout) || "(no stdout)",
        tail(res.stderr) ? `--- stderr ---\n${tail(res.stderr)}` : "",
        "",
        "Fix the root cause and try again. Do not weaken or delete tests, and do",
        "not disable the check to get past this gate. If the failure is unrelated",
        "to your change, say so explicitly and tell the user rather than working",
        "around it. To stop the gate entirely, remove .agent/state/active-gate.",
      ]
        .filter(Boolean)
        .join("\n")
    );
    process.exit(2);
  }
}

// Record the pass so /devflow:ship can cite real evidence.
try {
  const stamp = join(agentDir(root), "state", "last-verify.json");
  const payload = { at: new Date().toISOString(), chain, result: "pass" };
  mkdirSync(join(agentDir(root), "state"), { recursive: true });
  writeFileSync(stamp, JSON.stringify(payload, null, 2));
} catch {
  /* stamping is best-effort */
}

process.exit(0);
