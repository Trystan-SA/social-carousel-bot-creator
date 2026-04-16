import { mkdir, writeFile, readFile, access, readdir, copyFile } from "fs/promises";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { FORMATS, DEFAULT_FORMAT } from "../formats.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, "..", "..");

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

export async function newPost(slug, { format = DEFAULT_FORMAT, cwd = process.cwd() } = {}) {
  if (!slug) throw new Error("Usage: postkit new <slug> [--format 9:16]");
  if (!FORMATS[format]) {
    throw new Error(`Unknown format "${format}". Valid: ${Object.keys(FORMATS).join(", ")}`);
  }

  const root = resolve(cwd);
  const postsDir = join(root, "posts");
  const dest = join(postsDir, slug);

  if (await exists(dest)) {
    throw new Error(`Post folder already exists: ${dest}`);
  }

  const templateDir = join(PKG_ROOT, "templates", "post");
  if (!(await exists(templateDir))) {
    throw new Error(`Template dir missing: ${templateDir} (package install may be corrupt)`);
  }

  await mkdir(dest, { recursive: true });

  // Write post.json with the requested format
  await writeFile(
    join(dest, "post.json"),
    JSON.stringify({ format, slug }, null, 2) + "\n"
  );

  // Copy slide templates
  for (const file of await readdir(templateDir)) {
    if (file === "post.json") continue;
    await copyFile(join(templateDir, file), join(dest, file));
  }

  console.log(`postkit · created ${dest}`);
  console.log(`  format: ${format} (${FORMATS[format].width}×${FORMATS[format].height})`);
  console.log(`
Next:
  1. Edit the slide-*.html files
  2. Render:  postkit render posts/${slug}
`);
}