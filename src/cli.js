import { readFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { scaffold } from "./scaffold.js";
import { renderPost } from "./render.js";

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
  return `postkit — scaffold a Claude-Code-native social-media post workspace.

Usage:
  npx postkit                     Scaffold (or update) ./postkit/
  npx postkit render <post>       Render a post's slides to PNG (used by /postkit-render)
  npx postkit --version           Print the installed version

After scaffolding, open Claude Code inside ./postkit/ and run:
  /postkit-setup     brand intake
  /postkit-new       draft a post (or a series)
  /postkit-render    render slides
  /postkit-review    critique a draft
`;
}

export async function run(argv) {
  const { positional, flags } = parseArgs(argv);
  const [cmd, ...rest] = positional;

  if (flags.help || cmd === "help") {
    console.log(usage());
    return;
  }

  if (flags.version || cmd === "version" || cmd === "--version" || cmd === "-v") {
    console.log(await version());
    return;
  }

  try {
    if (!cmd || cmd === "init") {
      return await scaffold();
    }
    if (cmd === "render") {
      if (!rest[0]) throw new Error("Usage: postkit render <post-folder>");
      return await renderPost(rest[0], { formatOverride: flags.format });
    }
    console.error(`Unknown command: ${cmd}\n`);
    console.log(usage());
    process.exit(1);
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(1);
  }
}
