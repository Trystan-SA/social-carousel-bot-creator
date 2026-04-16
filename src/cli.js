import { readFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { init } from "./commands/init.js";
import { newPost } from "./commands/new.js";
import { render } from "./commands/render.js";
import { watch } from "./commands/watch.js";
import { FORMATS } from "./formats.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, "..");

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) { flags[key] = next; i++; }
      else { flags[key] = true; }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

async function version() {
  const pkg = JSON.parse(await readFile(resolve(PKG_ROOT, "package.json"), "utf8"));
  return pkg.version;
}

function usage() {
  return `postkit — generate social-media carousels from HTML/CSS

Usage:
  postkit <command> [options]

Commands:
  init                          Scaffold a postkit project in the current directory
  new <slug> [--format 9:16]    Create a new post folder with starter slides
  render <post-folder>          Render slides in <post-folder> to PNG
  watch <post-folder>           Re-render automatically on file change
  formats                       List supported aspect ratios
  version                       Print the installed version

Examples:
  postkit init
  postkit new intro-post --format 9:16
  postkit render posts/intro-post
  postkit watch posts/intro-post
`;
}

export async function run(argv) {
  const { positional, flags } = parseArgs(argv);
  const [cmd, ...rest] = positional;

  if (!cmd || flags.help || cmd === "help") {
    console.log(usage());
    return;
  }

  try {
    switch (cmd) {
      case "init":
        return await init({ force: !!flags.force });
      case "new":
        return await newPost(rest[0], { format: flags.format });
      case "render":
        return await render(rest[0], { format: flags.format });
      case "watch":
        return await watch(rest[0], { format: flags.format });
      case "formats":
        for (const [k, v] of Object.entries(FORMATS)) {
          console.log(`  ${k.padEnd(6)} ${v.width}×${v.height}   ${v.label}`);
        }
        return;
      case "version":
      case "--version":
      case "-v":
        console.log(await version());
        return;
      default:
        console.error(`Unknown command: ${cmd}\n`);
        console.log(usage());
        process.exit(1);
    }
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(1);
  }
}
