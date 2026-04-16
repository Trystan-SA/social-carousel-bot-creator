# Postkit project

This is a postkit workspace. Slides are HTML/CSS; the brand profile is in `brand.md`;
the visual system is in `theme.css`; posts live in `posts/<slug>/` and render to PNG.

**All user workflows run through skills, not CLI commands.** The skills are in
`.claude/skills/`:

- `/postkit-setup` — fill in / revise `brand.md`
- `/postkit-new` — draft a new post (or a series of posts)
- `/postkit-render` — render a post's slides to PNG
- `/postkit-review` — critique a draft for strategy, copy, and design

## How to help in this project

1. **Read `brand.md` first.** Every post must match the voice, audience, and
   goals documented there. If `brand.md` is still the default stub, run
   `/postkit-setup` before drafting anything.
2. **Respect the design system.** Reuse the tokens and component classes in
   `theme.css` (`.heading-*`, `.body-*`, `.card`, `.pill`, `.tip-number`,
   `.watermark`, …). Only add per-slide overrides inside a `<style>` block.
3. **Slides live at `posts/<slug>/slide-N.html`** and link to `../../theme.css`.
   Each post has a `post.json` with `{ "format": "9:16" }` (or 4:5, 1:1, 16:9, 3:4).
4. **Never hand-run CLI commands for the user.** Invoke the right skill. The
   skills shell out to `npx postkit render` when needed.

## Post anatomy (default pattern)

- **Slide 1 — Hook.** Scroll-stopping in <1s. Specific number, bold claim,
  personal failure, or hot take.
- **Middle slides.** Each builds on the previous. No filler, no repetition.
  Open loops at slide ends so viewers swipe.
- **Final slide — Close.** Clear CTA + handle watermark.

## Files you own vs. files postkit manages

- **You own:** `brand.md`, `theme.css`, this `CLAUDE.md`, `.gitignore`, everything in `posts/`, `assets/`.
- **Postkit manages** (overwritten when the user runs `npx postkit` again):
  `.claude/skills/*`.

Edit the managed files freely inside a project, but expect them to be refreshed
when the user upgrades postkit.
