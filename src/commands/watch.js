import chokidar from "chokidar";
import { resolve } from "path";
import { renderPost } from "../render.js";

export async function watch(postDir, { format } = {}) {
  if (!postDir) throw new Error("Usage: postkit watch <post-folder>");
  const dir = resolve(postDir);

  console.log(`postkit · watching ${dir}  (Ctrl-C to stop)\n`);

  // Initial render
  try {
    await renderPost(dir, { formatOverride: format });
  } catch (err) {
    console.error(`  ✗ ${err.message}`);
  }

  let pending = false;
  let running = false;

  const trigger = async () => {
    if (running) { pending = true; return; }
    running = true;
    try {
      console.log("\n— change detected, re-rendering —");
      await renderPost(dir, { formatOverride: format });
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    } finally {
      running = false;
      if (pending) { pending = false; trigger(); }
    }
  };

  const watcher = chokidar.watch(dir, {
    ignored: (p) => p.includes("/output/") || p.endsWith(".png"),
    ignoreInitial: true,
  });

  watcher.on("add", trigger).on("change", trigger).on("unlink", trigger);

  process.on("SIGINT", () => { watcher.close(); process.exit(0); });
}