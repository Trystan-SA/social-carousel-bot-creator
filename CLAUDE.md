# CLAUDE.md — postkit (contributor guide)

This file tells Claude Code how to navigate and contribute to the postkit codebase itself. If you're a **user** who scaffolded a project with `postkit init`, the CLAUDE.md in your own project is a different file (copied from `templates/project/CLAUDE.md`).

## What this repo is

A CLI + Puppeteer pipeline that renders HTML/CSS slide decks to PNG at native social-media export dimensions (9:16, 4:5, 1:1, 16:9, 3:4). Users scaffold a project with `postkit init`, create posts with `postkit new`, and render with `postkit render`.

## Repo map

```
bin/postkit.js        CLI shebang; boots src/cli.js
src/
  cli.js              Arg parsing + command dispatch
  render.js           Puppeteer rendering core (the hot path)
  formats.js          Aspect-ratio → pixel dimensions
  commands/           One file per CLI command (init, new, render, watch)
  themes/default.css  Neutral theme copied into user projects by `init`
templates/
  project/            What `init` scaffolds into a user's project
  post/               What `new` scaffolds into posts/<slug>/
examples/             Committed reference posts used for smoke tests
.github/              Issue + PR templates
```

## Conventions

- **ESM only.** No CommonJS, no `require`.
- **No TypeScript** in v0.x — source should be readable without a build.
- **One-file-one-command.** Each CLI subcommand lives in `src/commands/<name>.js` and exports a single function.
- **Errors throw strings, CLI catches.** `src/cli.js` is the only place that calls `process.exit`.
- **No emojis in source output**, except when the user opted in via slide content.

## Visual defaults live in `src/themes/default.css`

When changing the default theme, always also render `examples/quickstart/` and eyeball the PNGs — the example is the smoke test for layout regressions.

## Running locally

```bash
npm install
./bin/postkit.js render examples/quickstart
open examples/quickstart/output/slide-1.png
```

## When adding a new command

1. Create `src/commands/<name>.js` exporting one async function.
2. Wire it into the `switch` in `src/cli.js`.
3. Add a line to the `usage()` string in `src/cli.js`.
4. Document it in `README.md` under the CLI reference.

## When adding a new aspect ratio

Update `FORMATS` in `src/formats.js` only. Everything downstream reads from that map — renderer, `new` scaffold, and `formats` command.

## What to ignore

- `posts/` and `assets/` at the repo root are gitignored — they exist for contributors' local experimentation and are never committed.
- `docs/superpowers/` (if you find it again) was legacy internal planning and should be removed.
