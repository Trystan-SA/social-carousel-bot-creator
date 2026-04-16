# CLAUDE.md — postkit (contributor guide)

This file tells Claude Code how to navigate and contribute to the postkit
codebase itself. If you're a **user** who scaffolded a project with
`npx postkit`, the `CLAUDE.md` in your own `postkit/` folder is a different
file (copied from `templates/project/CLAUDE.md`).

## What this repo is

A tiny CLI that scaffolds a **Claude-Code-native social-media post workspace**
into `./postkit/`. All end-user workflows run through four Claude skills:
`/postkit-setup`, `/postkit-new`, `/postkit-render`, `/postkit-review`.

The skills ship as plain Markdown files inside `templates/project/.claude/skills/`
and are refreshed every time the user re-runs `npx postkit`.

Rendering stays in the npm package (not copied into user projects), so users
get renderer improvements for free via `npx postkit@latest`.

## Repo map

```
bin/postkit.js                       CLI shebang; boots src/cli.js
src/
  cli.js                             Dispatches:  (no args) → scaffold,  `render` → renderPost
  scaffold.js                        The only command most users ever invoke
  render.js                          Puppeteer pipeline (called via `npx postkit render <post>`)
  formats.js                         Aspect-ratio → pixel dimensions
templates/project/                   Scaffolded verbatim into user's ./postkit/
  .claude/skills/
    postkit-setup/SKILL.md           Brand intake → saves brand_*.md to Claude memory + updates theme.css
    postkit-idea/SKILL.md            Creative brainstorm + sequence plan → saves post_ideas.md memory
    postkit-new/SKILL.md             Draft one post or a series
    postkit-render/SKILL.md          Shells out to `npx postkit render`
    postkit-review/SKILL.md          Strategy + copy + design critique
  theme.css                          Default design system
  CLAUDE.md                          Guide used by Claude inside user's workspace
  gitignore                          Renamed to .gitignore on copy
examples/
  quickstart/                        Committed reference post, smoke-test fixture
```

## Conventions

- **ESM only.** No CommonJS, no `require`.
- **No TypeScript** in v0.x — source should be readable without a build.
- **Two CLI code paths**: `scaffold` (default) and `render`. Nothing else.
  If you're tempted to add a third, consider whether it should be a **skill**
  instead.
- **Skills are the UX.** When a user behavior changes, the right answer is
  almost always a skill edit, not a CLI change.
- **Errors throw strings, CLI catches.** `src/cli.js` is the only place that
  calls `process.exit`.
- **No emojis in source output.**

## The scaffolder's update contract

When a user re-runs `npx postkit`:

- **Managed** (always overwritten): `.claude/skills/*`
- **User-owned** (kept if present, created if missing): `theme.css`, `CLAUDE.md`, `.gitignore`
- **Lives outside the project tree** (Claude Code manages it): the per-workspace
  memory directory where `/postkit-setup` persists the brand profile
- **Always ensured to exist**: `posts/`, `assets/` (with `.gitkeep`)

If you add a new template file, decide which bucket it belongs in and wire it
into `src/scaffold.js` accordingly. Never silently overwrite user content.

## Visual defaults live in `templates/project/theme.css`

When changing the default theme, always also render `examples/quickstart/` and
eyeball the PNGs — the example is the smoke test for layout regressions:

```bash
./bin/postkit.js render examples/quickstart
open examples/quickstart/output/slide-1.png
```

## When adding a new skill

1. Create `templates/project/.claude/skills/<name>/SKILL.md` with frontmatter
   (`name`, `description`) and concrete instructions.
2. Mention it in `templates/project/CLAUDE.md`.
3. Add a row to the skill table in `README.md`.
4. No CLI changes needed — the scaffolder picks it up automatically.

## When adding a new aspect ratio

Update `FORMATS` in `src/formats.js` only. Everything downstream reads from
that map.

## Running locally

```bash
npm install
./bin/postkit.js              # scaffolds ./postkit/ in the current dir
./bin/postkit.js render examples/quickstart
```

## What to ignore

- `posts/` and `assets/` at the repo root are gitignored — they exist for
  contributors' local experimentation and are never committed.
