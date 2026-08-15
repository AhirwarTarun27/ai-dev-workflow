/**
 * Tests for the PreToolUse guard.
 *
 * The whole plugin rests on one claim: a hook is a guarantee, not a request.
 * That claim is only worth making if the guard is actually tested, so this
 * asserts the two exit codes that matter — 2 blocks the tool call, 0 allows it.
 *
 * Hooks are pure functions of the JSON they read on stdin, which makes them
 * unusually cheap to test: spawn the script, write a payload, read the code.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";

const scripts = join(dirname(fileURLToPath(import.meta.url)), "..", "scripts");

/** Run a hook with a payload on stdin and return its exit code + stderr. */
function runHook(script, payload) {
  const res = spawnSync(process.execPath, [join(scripts, script)], {
    input: JSON.stringify(payload),
    encoding: "utf8",
  });
  return { code: res.status, stderr: res.stderr || "" };
}

/** A throwaway repo, optionally carrying a contract. */
function makeRepo(contract) {
  const root = mkdtempSync(join(tmpdir(), "devflow-test-"));
  if (contract) {
    mkdirSync(join(root, ".agent"), { recursive: true });
    writeFileSync(join(root, ".agent", "devloop.json"), JSON.stringify(contract));
  }
  return root;
}

const edit = (root, file) => ({
  cwd: root,
  tool_name: "Edit",
  tool_input: { file_path: join(root, file) },
});

test("blocks .env", () => {
  const root = makeRepo();
  const { code, stderr } = runHook("guard-paths.mjs", edit(root, ".env"));
  assert.equal(code, 2, "exit 2 is what actually blocks the tool call");
  assert.match(stderr, /protected path/);
});

test("blocks lockfiles and build output", () => {
  const root = makeRepo();
  for (const f of ["package-lock.json", "dist/app.js", "node_modules/x/index.js"]) {
    assert.equal(runHook("guard-paths.mjs", edit(root, f)).code, 2, f);
  }
});

test("allows ordinary source files", () => {
  const root = makeRepo();
  assert.equal(runHook("guard-paths.mjs", edit(root, "src/index.js")).code, 0);
});

test("never guards the agent's own workspace", () => {
  const root = makeRepo();
  assert.equal(runHook("guard-paths.mjs", edit(root, ".agent/plans/ABC-1.md")).code, 0);
});

test("allowPaths wins over the block list", () => {
  // The escape hatch is checked BEFORE the block list. If that order ever
  // flips, a project can no longer opt into editing a generated file.
  const root = makeRepo({ allowPaths: ["dist/**"] });
  assert.equal(runHook("guard-paths.mjs", edit(root, "dist/app.js")).code, 0);
});

test("contract protectedPaths extend the defaults", () => {
  const root = makeRepo({ protectedPaths: ["migrations/**"] });
  assert.equal(runHook("guard-paths.mjs", edit(root, "migrations/001.sql")).code, 2);
  assert.equal(runHook("guard-paths.mjs", edit(root, ".env")).code, 2, "defaults still apply");
});

test("no contract means no-op, never a crash", () => {
  // Installing the plugin must not break a repo that never ran onboard.
  const root = makeRepo();
  assert.equal(runHook("guard-paths.mjs", edit(root, "src/index.js")).code, 0);
});

test("a payload with no target path is not this hook's business", () => {
  const root = makeRepo();
  assert.equal(runHook("guard-paths.mjs", { cwd: root, tool_name: "Edit", tool_input: {} }).code, 0);
});
