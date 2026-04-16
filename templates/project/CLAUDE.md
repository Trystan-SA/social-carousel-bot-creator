# Postkit project

This is a postkit workspace. Slides are HTML/CSS; the visual system is in
`theme.css`; posts live in `posts/<slug>/` and render to PNG. The **brand
profile** (voice, audience, handles, goals, hook formulas, …) lives in the
Claude Code **memory system**, not in a file at the project root — read it
there, write it there.

**All user workflows run through skills, not CLI commands.** The skills are in
`.claude/skills/`:

- `/postkit-setup` — interview the user and persist the brand profile to
  memory (`brand_identity.md`, `brand_audience.md`, `brand_goals.md`,
  `brand_voice.md`, `brand_visual.md`, `brand_hooks.md`)
- `/postkit-idea` — brand-aware creative brainstorm + sequence planning,
  saves chosen sequences to `post_ideas.md` memory
- `/postkit-new` — draft a new post (or a series of posts)
- `/postkit-render` — render a post's slides to PNG
- `/postkit-review` — critique a draft for strategy, copy, and design

## How to help in this project

1. **Check memory first.** Before drafting or critiquing, read every
   `brand_*.md` in memory. If any are missing, run `/postkit-setup` before
   anything else. Never guess voice, audience, or handles.
2. **Respect the design system.** Reuse the tokens and component classes in
   `theme.css` (`.heading-*`, `.body-*`, `.card`, `.pill`, `.tip-number`,
   `.watermark`, …). Only add per-slide overrides inside a `<style>` block.
3. **Slides live at `posts/<slug>/slide-N.html`** and link to `../../theme.css`.
   Each post has a `post.json` with `{ "format": "9:16" }` (or 4:5, 1:1, 16:9, 3:4).
4. **Never hand-run CLI commands for the user.** Invoke the right skill. The
   skills shell out to `npx postkit render` when needed.
5. **Never persist brand state to a project-root `.md` file.** The memory
   system is the source of truth for anything the skills collect or reuse.

## Post anatomy (default pattern)

- **Slide 1 — Hook.** Scroll-stopping in <1s. Specific number, bold claim,
  personal failure, or hot take.
- **Middle slides.** Each builds on the previous. No filler, no repetition.
  Open loops at slide ends so viewers swipe.
- **Final slide — Close.** Clear CTA + handle watermark. Watermark handle
  depends on the post's target platform — see `brand_identity.md` in memory.

## Files you own vs. files postkit manages

- **You own:** `theme.css`, this `CLAUDE.md`, `.gitignore`, everything in
  `posts/`, `assets/`.
- **Postkit manages** (overwritten when the user runs `npx postkit` again):
  `.claude/skills/*`.
- **Claude Code manages:** the memory directory (lives outside the project
  tree, under `~/.claude/`). Brand profile files live there.

Edit the managed files freely inside a project, but expect them to be refreshed
when the user upgrades postkit.
