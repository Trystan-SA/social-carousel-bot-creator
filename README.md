# Postkit

[![npm version](https://img.shields.io/npm/v/postkit.svg)](https://www.npmjs.com/package/postkit)
[![npm downloads](https://img.shields.io/npm/dm/postkit.svg)](https://www.npmjs.com/package/postkit)
[![license](https://img.shields.io/npm/l/postkit.svg)](https://github.com/Trystan-SA/postkit/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/postkit.svg)](https://www.npmjs.com/package/postkit)
[![GitHub stars](https://img.shields.io/github/stars/Trystan-SA/postkit?style=social)](https://github.com/Trystan-SA/postkit)

**Generate Social media images and carousel for TikTok, Instagram, X.com from HTML/CSS.** Themeable, scriptable, and designed to pair with [Claude Code](https://claude.com/claude-code) for AI-assisted content creation.

```bash
npx postkit init
npx postkit new intro-post --format 9:16
npx postkit render posts/intro-post
```

That's it — open `posts/intro-post/output/` and upload the PNGs.

> After a global install the command `postkit` is available too (`npm i -g postkit && postkit render posts/intro-post`).

## Why postkit?

Most social-media carousel tools are locked-in SaaS with rigid templates. If you care about design quality or want your post pipeline in version control, you're stuck.

postkit is the opposite:

- **HTML/CSS is the source of truth**, full control of every pixel.
- **Theme once, reuse everywhere**, your palette and type live in `theme.css`.
- **Native export dimensions** for every major platform (9:16, 4:5, 1:1, 16:9, 3:4).
- **Watch mode** for live reload while you design.
- **Claude-Code-friendly**, optional AI review pipeline (strategist, copywriter, designer).
- **Docker fallback** when you'd rather not install Chrome locally.

## Install

postkit needs **Node 20+** and a Chrome/Chromium binary (Puppeteer downloads one on first install; a system install works too).

```bash
npm install -g postkit
# or run ad-hoc with npx
npx postkit <command>
```

Once installed globally, the CLI binary is `postkit`. The rest of this README uses that form.

On minimal Linux systems you may also need native libs for Chromium:

```bash
sudo ./setup.sh   # apt-based
```

Don't want to touch your system? See [Docker](#docker).

## Quickstart

```bash
mkdir my-brand && cd my-brand
postkit init
```

This creates:

```
my-brand/
├── CLAUDE.md         # Your brand / voice guide for Claude Code
├── theme.css         # Your palette, fonts, radii — edit freely
├── agents/           # (optional) AI review agents for Claude Code
├── posts/            # Your posts go here
└── assets/           # Images, photos, backgrounds
```

Create your first post:

```bash
postkit new my-first-post
```

Edit the generated HTML in `posts/my-first-post/`, then render:

```bash
postkit render posts/my-first-post
# → posts/my-first-post/output/slide-1.png ... slide-N.png
```

Or iterate with hot-reload:

```bash
postkit watch posts/my-first-post
```

## Formats

Set the format per post in `post.json`:

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

Override on the fly:

```bash
postkit render posts/my-post --format 1:1
```

List them anytime:

```bash
postkit formats
```

## Theming

Everything visual is driven by CSS custom properties in `theme.css` at your project root:

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

Slides link to `../../theme.css` and can layer per-slide overrides in a `<style>` block. See [`examples/quickstart/`](examples/quickstart/) for a complete dark-mode theme.

## AI review (optional)

postkit ships three Claude Code sub-agents that review your drafts sequentially:

1. **social-media-strategist** — hook, angle, format fit, value arc, audience, goal alignment
2. **social-media-copywriter** — CTA, word economy, slide transitions, emotional triggers, tone
3. **social-media-designer** — layout, whitespace, rhythm, typography, text density, color

Each returns HIGH / MEDIUM / LOW findings. You apply HIGH impact items; the rest are logged. `postkit init` installs them into `agents/`, and the scaffolded `CLAUDE.md` explains how to trigger the pipeline in Claude Code.

Not a Claude Code user? The agents are plain Markdown specs — the review logic works as prompts with any LLM.

## Docker

Prefer not to install Chrome? The repo ships a `Dockerfile` that bakes in everything:

```bash
docker build -t postkit .
docker run --rm -v "$PWD":/work -w /work postkit render posts/my-post
```

## CLI reference

```
postkit init                          Scaffold a project in the current dir
postkit new <slug> [--format 9:16]    Create a new post folder
postkit render <post>  [--format …]   Render slides to PNG
postkit watch  <post>  [--format …]   Re-render on file change
postkit formats                       List supported aspect ratios
postkit version                       Print version
```

## Roadmap

- [ ] `postkit export` → MP4 / GIF for animated carousels
- [ ] Built-in asset optimizer
- [ ] Template gallery (community themes)
- [ ] Direct upload hooks (Buffer, Typefully, …)
- [ ] Figma import

Have an idea? Open an issue.

## Contributing

PRs welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

[MIT](LICENSE)
