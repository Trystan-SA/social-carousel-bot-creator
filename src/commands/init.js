import { mkdir, writeFile, readFile, access, copyFile } from "fs/promises";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, "..", "..");

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function copyTemplate(src, dest, { force = false } = {}) {
  if (!force && (await exists(dest))) {
    console.log(`  · skipped (exists): ${dest}`);
    return;
  }
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);
  console.log(`  ✓ ${dest}`);
}

export async function init({ cwd = process.cwd(), force = false } = {}) {
  const target = resolve(cwd);
  console.log(`postkit · initializing project in ${target}\n`);

  const templates = join(PKG_ROOT, "templates", "project");
  const defaultTheme = join(PKG_ROOT, "src", "themes", "default.css");

  // Note: we ship `gitignore` (no dot) because npm strips `.gitignore` from
  // published packages. `init` renames it on copy.
  const files = [
    [defaultTheme,                          join(target, "theme.css")],
    [join(templates, "CLAUDE.md"),          join(target, "CLAUDE.md")],
    [join(templates, "gitignore"),          join(target, ".gitignore")],
    [join(templates, "agents", "social-media-strategist.md"), join(target, "agents", "social-media-strategist.md")],
    [join(templates, "agents", "social-media-copywriter.md"), join(target, "agents", "social-media-copywriter.md")],
    [join(templates, "agents", "social-media-designer.md"),   join(target, "agents", "social-media-designer.md")],
  ];

  for (const [src, dest] of files) {
    await copyTemplate(src, dest, { force });
  }

  // Placeholder directories
  for (const dir of ["posts", "assets"]) {
    const p = join(target, dir);
    await mkdir(p, { recursive: true });
    const keep = join(p, ".gitkeep");
    if (!(await exists(keep))) await writeFile(keep, "");
  }

  console.log(`
Done! Next steps:
  1. Edit theme.css to match your brand (colors, fonts, watermark)
  2. Create your first post:   postkit new my-first-post
  3. Render it:                postkit render posts/my-first-post
`);
}