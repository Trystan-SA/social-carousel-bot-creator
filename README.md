# Postkit

[![npm version](https://img.shields.io/npm/v/postkit.svg)](https://www.npmjs.com/package/postkit)
[![npm downloads](https://img.shields.io/npm/dm/postkit.svg)](https://www.npmjs.com/package/postkit)
[![license](https://img.shields.io/npm/l/postkit.svg)](https://github.com/Trystan-SA/postkit/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/postkit.svg)](https://www.npmjs.com/package/postkit)
[![GitHub stars](https://img.shields.io/github/stars/Trystan-SA/postkit?style=social)](https://github.com/Trystan-SA/postkit)

**A Claude-Code-native workspace for social-media posts.** Scaffold once, then
let Claude skills handle brand setup, drafting, critique, and rendering.

Slides are HTML/CSS. Rendering is Puppeteer. Exports are native dimensions for
TikTok, Instagram, X, and LinkedIn.

```bash
npx postkit            # scaffolds ./postkit/
cd postkit
claude                 # open Claude Code
/postkit-setup         # answer a few brand questions
/postkit-new           # draft a post (or a whole series)
/postkit-render        # export PNGs
```

That's it — no more `postkit new`, `postkit render`, `postkit watch`. The
workflow lives in Claude skills.

## What `npx postkit` gives you

```
postkit/
├── .claude/skills/
│   ├── postkit-setup/      brand/voice/visual intake → brand.md
│   ├── postkit-new/        draft a post or series (reads brand.md + theme.css)
│   ├── postkit-render/     shell out to `npx postkit render` for PNG export
│   └── postkit-review/     strategy + copy + design critique in one pass
├── brand.md                your brand profile (stub — fill via /postkit-setup)
├── theme.css               palette, fonts, component classes — edit freely
├── CLAUDE.md               guide Claude uses inside this workspace
├── posts/                  your posts
└── assets/                 images, photos, backgrounds
```

**Re-run `npx postkit` anytime to upgrade the skills.** Managed files
(`.claude/skills/*`) are refreshed. User files (`brand.md`, `theme.css`,
`CLAUDE.md`, `posts/`, `assets/`) are left alone.

## Why postkit?

- **HTML/CSS is the source of truth.** Full control of every pixel, version-controllable.
- **Brand-aware drafting.** `/postkit-new` reads `brand.md` so every post matches your voice, audience, and goals — no generic AI slop.
- **Theme once, reuse everywhere.** Palette and type live in `theme.css`; slides pull from it.
- **Native export dimensions** for every major platform (9:16, 4:5, 1:1, 16:9, 3:4).
- **Skills over commands.** The workflow is conversational, not a CLI cheat-sheet.
- **Docker fallback** when you'd rather not install Chrome locally.

## Install

Postkit needs **Node 20+** and a Chrome/Chromium binary (Puppeteer downloads one
on first install; a system install works too). You don't install postkit —
you run it via `npx` each time you scaffold or upgrade:

```bash
npx postkit            # scaffold or refresh ./postkit/
npx postkit@latest     # same, but pin to the newest version
```

On minimal Linux systems you may also need native libs for Chromium:

```bash
sudo ./setup.sh        # apt-based
```

Or see [Docker](#docker).

## Formats

Every post has a `post.json` with a `format`:

```json
{ "format": "9:16" }
```

| Key    | Dimensions  | Platforms                        |
| ------ | ----------- | -------------------------------- |
| `9:16` | 1080 × 1920 | TikTok, Instagram Reels, Stories |
| `4:5`  | 1080 × 1350 | Instagram feed (portrait)        |
| `1:1`  | 1080 × 1080 | Instagram feed, X posts          |
| `16:9` | 1920 × 1080 | X, YouTube thumbnails, LinkedIn  |
| `3:4`  | 1080 × 1440 | LinkedIn carousels               |

`/postkit-new` asks which format you want; `/postkit-render` uses what
`post.json` says (or override with `npx postkit render posts/<slug> --format 1:1`).

## Theming

All visual choices are CSS custom properties in `theme.css`:

```css
:root {
  --bg: #ffffff;
  --primary: #2563eb;
  --accent: #f59e0b;
  --text: #111827;
  --font-display: "Inter", system-ui, sans-serif;
  /* …etc */
}
```

Slides link to `../../theme.css` and can layer per-slide overrides in a
`<style>` block. See [`examples/quickstart/`](examples/quickstart/) for a
complete dark-mode theme.

## Docker

Prefer not to install Chrome? The repo ships a `Dockerfile` that bakes in everything:

```bash
docker build -t postkit .
docker run --rm -v "$PWD":/work -w /work postkit render posts/my-post
```

## The skills

| Skill              | Purpose                                                                       |
| ------------------ | ----------------------------------------------------------------------------- |
| `/postkit-setup`   | Interviews you about brand, audience, voice, visuals → writes `brand.md`      |
| `/postkit-new`     | Drafts a post (or a series) using `brand.md` + `theme.css`                    |
| `/postkit-render`  | Exports slides to PNG via Puppeteer                                           |
| `/postkit-review`  | Critiques a draft on strategy, copy, and design in one pass                   |

## CLI (used internally by skills)

Only two commands exist; you rarely type them yourself:

```
npx postkit                      Scaffold or refresh ./postkit/
npx postkit render <post>        Render slides to PNG  (called by /postkit-render)
```

## Roadmap

- [ ] `/postkit-schedule` — plan a posting calendar from brand.md
- [ ] Built-in asset optimizer
- [ ] Template gallery (community themes)
- [ ] Direct upload hooks (Buffer, Typefully, …)
- [ ] Figma import

Have an idea? Open an issue.

## Contributing

PRs welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

[MIT](LICENSE)
