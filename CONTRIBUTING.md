# Contributing to postkit

Thanks for considering a contribution! postkit is small and opinionated by design. Before you spend time on a large change, open an issue to discuss the shape — it's the quickest way to avoid wasted work.

## Dev setup

```bash
git clone https://github.com/Trystan-SA/postkit.git
cd postkit
npm install
./bin/postkit.js render examples/quickstart
```

The rendered PNGs land in `examples/quickstart/output/`.

## Project layout

```
bin/              CLI entry point (Node shebang)
src/
  cli.js          Command dispatcher + arg parsing
  render.js       Puppeteer rendering core
  formats.js      Aspect-ratio → dimensions map
  commands/       One file per CLI command
  themes/
    default.css   Neutral theme copied into new projects by `init`
templates/
  project/        What `init` scaffolds into a user's project
  post/           What `new` scaffolds into `posts/<slug>/`
examples/         Committed reference posts
docs/             Longform docs
```

## Principles

- **HTML/CSS is the user's surface.** Never generate layout code for them — give them composable primitives in `default.css`.
- **No framework lock-in.** Keep dependencies minimal; Puppeteer + chokidar is the line.
- **The CLI is the product.** Keep command names short, errors useful, and defaults sensible.
- **Themeability > opinionated defaults.** Every visual token lives in CSS vars.
- **Claude Code is a first-class consumer.** Agent specs stay in sync with the scaffolded `CLAUDE.md`.

## Pull requests

1. Fork, branch, commit.
2. Run `node bin/postkit.js render examples/quickstart` and confirm PNGs look correct.
3. If you added a command, update `README.md` and the `usage()` block in `src/cli.js`.
4. If you touched `default.css`, eyeball the example render for regressions.
5. Open the PR with a short "why" and a screenshot if the visual output changes.

## Bug reports

Please include:

- Node version (`node -v`)
- OS (e.g., macOS 14, Ubuntu 24.04, WSL2)
- Whether you're using a system Chrome or the bundled Puppeteer binary
- The minimal post folder that reproduces the issue (feel free to attach a `.zip`)

## Code style

- ESM (`import`/`export`), not CommonJS.
- No TypeScript in v0.x — we want the source readable by anyone.
- Prefer small, single-purpose files over clever abstractions.
- Two-space indent, double quotes, trailing newline.
