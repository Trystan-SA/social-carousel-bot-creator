import { mkdir, writeFile, access, copyFile, readdir, rm, stat } from "fs/promises";
import { join, dirname, resolve, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, "..");
const TEMPLATE_ROOT = join(PKG_ROOT, "templates", "project");

// Files postkit owns outright. Always overwritten on re-run so skill
// improvements shipped in newer postkit versions land in existing projects.
const MANAGED = new Set([".claude"]);

// Files postkit writes on first run only. Never touched on re-run, because
// the user customizes them.
const USER_OWNED = new Set([
  "theme.css",
  "CLAUDE.md",
  ".gitignore",
]);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function copyTree(src, dest) {
  const entries = await readdir(src, { withFileTypes: true });
  await mkdir(dest, { recursive: true });
  for (const entry of entries) {
    const s = join(src, entry.name);
    const d = join(dest, entry.name);
    if (entry.isDirectory()) await copyTree(s, d);
    else await copyFile(s, d);
  }
}

async function copyFresh(src, dest, root) {
  if (await exists(dest)) await rm(dest, { recursive: true, force: true });
  await copyTree(src, dest);
  console.log(`  ↻ ${relative(root, dest)}/  (refreshed)`);
}

async function copyIfMissing(src, dest, root) {
  if (await exists(dest)) {
    console.log(`  · ${relative(root, dest)}  (kept)`);
    return;
  }
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);
  console.log(`  + ${relative(root, dest)}`);
}

async function ensureDir(p, root) {
  if (await exists(p)) return;
  await mkdir(p, { recursive: true });
  const keep = join(p, ".gitkeep");
  if (!(await exists(keep))) await writeFile(keep, "");
  console.log(`  + ${relative(root, p)}/`);
}

export async function scaffold({ cwd = process.cwd() } = {}) {
  const parent = resolve(cwd);
  const target = join(parent, "postkit");
  const fresh = !(await exists(target));

  console.log(`postkit · ${fresh ? "scaffolding" : "updating"} ${relative(parent, target) || "postkit"}/\n`);

  await mkdir(target, { recursive: true });

  // Managed: always refresh
  await copyFresh(
    join(TEMPLATE_ROOT, ".claude"),
    join(target, ".claude"),
    target
  );

  // User-owned: create on first run, keep otherwise
  for (const name of USER_OWNED) {
    const srcName = name === ".gitignore" ? "gitignore" : name;
    await copyIfMissing(
      join(TEMPLATE_ROOT, srcName),
      join(target, name),
      target
    );
  }

  // Empty dirs the skills expect
  for (const dir of ["posts", "assets"]) {
    await ensureDir(join(target, dir), target);
  }

  if (fresh) {
    console.log(`
Done. Next:
  cd postkit
  claude                # open Claude Code
  /postkit-setup        # answer a few brand questions
  /postkit-idea         # brainstorm post ideas + plan a sequence
  /postkit-new          # draft a post from an idea
`);
  } else {
    console.log(`
Skills refreshed. Your theme.css, CLAUDE.md, and posts were left alone.
Brand profile stays in Claude Code memory.
`);
  }
}
