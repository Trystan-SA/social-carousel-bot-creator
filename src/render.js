import puppeteer from "puppeteer";
import { readdir, mkdir, readFile, access } from "fs/promises";
import { join, resolve } from "path";
import { resolveFormat } from "./formats.js";

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function loadConfig(postDir) {
  const configPath = join(postDir, "post.json");
  if (!(await exists(configPath))) return {};
  try {
    return JSON.parse(await readFile(configPath, "utf8"));
  } catch (err) {
    throw new Error(`Invalid post.json in ${postDir}: ${err.message}`);
  }
}

export async function renderPost(postDir, { formatOverride, verbose = true } = {}) {
  postDir = resolve(postDir);
  if (!(await exists(postDir))) {
    throw new Error(`Post folder not found: ${postDir}`);
  }

  const config = await loadConfig(postDir);
  const format = resolveFormat(formatOverride || config.format);
  const { width, height } = format;

  const outputDir = join(postDir, "output");
  await mkdir(outputDir, { recursive: true });

  const files = (await readdir(postDir))
    .filter((f) => f.endsWith(".html"))
    .sort();

  if (files.length === 0) {
    throw new Error(`No .html slide files found in ${postDir}`);
  }

  if (verbose) {
    console.log(`postkit · rendering ${files.length} slide(s) at ${width}×${height}`);
  }

  const launchOptions = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const browser = await puppeteer.launch(launchOptions);
  const rendered = [];

  try {
    for (const file of files) {
      const filePath = join(postDir, file);
      const outputName = file.replace(/\.html$/, ".png");
      const outputPath = join(outputDir, outputName);

      const page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: 1 });

      // Inject slide dimensions as CSS vars *before* the document evaluates,
      // so `.slide { width: var(--slide-width) }` in default.css resolves correctly.
      await page.evaluateOnNewDocument((w, h) => {
        const style = document.createElement("style");
        style.textContent = `:root { --slide-width: ${w}px; --slide-height: ${h}px; }`;
        const attach = () => document.head && document.head.appendChild(style);
        if (document.head) attach();
        else document.addEventListener("DOMContentLoaded", attach, { once: true });
      }, width, height);

      await page.goto(`file://${filePath}`, { waitUntil: "networkidle0" });

      // Give web fonts time to paint. The @import in default.css isn't tracked by networkidle.
      await new Promise((r) => setTimeout(r, 1500));

      await page.screenshot({ path: outputPath, type: "png" });
      await page.close();

      rendered.push(outputPath);
      if (verbose) console.log(`  ✓ ${outputName}`);
    }
  } finally {
    await browser.close();
  }

  if (verbose) console.log(`\nOutput: ${outputDir}/`);
  return rendered;
}
