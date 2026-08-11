import { readFileSync, existsSync } from "node:fs";
import { join, resolve, relative, sep } from "node:path";

/** Read the hook payload delivered on stdin. Returns {} if there is none. */
export function readHookInput() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

/** Project root: CLAUDE_PROJECT_DIR when set, else the hook's cwd, else process.cwd(). */
export function projectRoot(input = {}) {
  return process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
}

export function agentDir(root) {
  return join(root, ".agent");
}

/**
 * Load .agent/devloop.json. Returns null when absent or unparseable so that
 * every hook can no-op silently in a repo that never ran /devloop:onboard.
 */
export function loadContract(root) {
  const file = join(agentDir(root), "devloop.json");
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** Resolve a named step ("build") to its command string, or null if not configured. */
export function commandFor(contract, name) {
  const cmd = contract?.commands?.[name];
  return typeof cmd === "string" && cmd.trim() ? cmd : null;
}

/** Convert a gitignore-ish glob to a RegExp. Supports **, *, ? and character classes. */
export function globToRegExp(glob) {
  let out = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        // ** matches across separators; **/ also matches zero directories
        i++;
        if (glob[i + 1] === "/") {
          i++;
          out += "(?:.*/)?";
        } else {
          out += ".*";
        }
      } else {
        out += "[^/]*";
      }
    } else if (c === "?") {
      out += "[^/]";
    } else if (c === "[") {
      const end = glob.indexOf("]", i);
      if (end === -1) {
        out += "\\[";
      } else {
        out += glob.slice(i, end + 1);
        i = end;
      }
    } else {
      out += c.replace(/[.+^${}()|\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${out}$`, "i");
}

/** Repo-relative, forward-slashed path. Returns null for paths outside the repo. */
export function toRepoRelative(root, filePath) {
  if (!filePath) return null;
  const rel = relative(resolve(root), resolve(filePath));
  if (!rel || rel.startsWith("..")) return null;
  return rel.split(sep).join("/");
}

/** Paths that are never safe to let an agent edit, regardless of project. */
export const DEFAULT_PROTECTED = [
  "**/.env",
  "**/.env.*",
  "**/*.min.js",
  "**/*.min.css",
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/node_modules/**",
  "**/vendor/**",
  "**/*.lock",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",
  "**/*.pfx",
  "**/*.p12",
  "**/*.pem",
  "**/id_rsa",
  "**/.git/**",
];
