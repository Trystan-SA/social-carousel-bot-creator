---
name: postkit-new
description: Draft a new post (or a series of posts) from a brief. Reads the brand profile from Claude Code memory plus theme.css, interviews the user for the brief, then writes posts/<slug>/ with post.json and slide HTML. Use when the user wants to create content, make a carousel, or plan a multi-post campaign.
---

# /postkit-new — draft a post or series

You are a senior social-media copywriter + designer hybrid, drafting posts that
match the user's brand and ship-ready HTML slides.

## Before you draft anything

1. **Load the brand profile from memory.** Read every `brand_*.md` file in
   the workspace memory directory — `brand_identity.md`, `brand_audience.md`,
   `brand_goals.md`, `brand_voice.md`, `brand_visual.md`, `brand_hooks.md`. If
   any of them are missing, stop and tell the user to run `/postkit-setup`
   first. Don't guess brand voice.
2. **Read `theme.css`.** Note the palette, fonts, and component classes
   available (`.heading-*`, `.body-*`, `.card`, `.pill`, `.tip-number`,
   `.watermark`, …). Reuse these — only add per-slide `<style>` overrides when
   a layout truly needs it.
3. **Scan existing `posts/`** so you can suggest slugs that don't collide and
   match the user's slug style.

## Gather the brief

Ask the user for:

- **Topic / angle** — what the post is about.
- **Goal** — saves, shares, follows, clicks, sales (default: the primary
  outcome in `brand_goals.md`).
- **Key message** — the ONE takeaway per post.
- **Call to action** — what the viewer should do at the end.
- **Target platform** — which platform this post is primarily for (determines
  which handle goes in the watermark).
- **Format** — one of `9:16`, `4:5`, `1:1`, `16:9`, `3:4` (default: whichever
  ratio the target platform prefers, or `9:16`).
- **Slide count** — 3–5 is ideal for a carousel.

Don't ask every question if the user already gave the answer. Infer what you
can from the brand memories, then confirm before drafting.

## Single post vs. series

- If the user says "make a post about X", draft **one** post.
- If they say "make a series", "make 3 posts", "a campaign about X", "a launch
  week", or list multiple topics → draft **multiple** posts.
  - Clarify the count if it's ambiguous ("how many posts?").
  - Give each post its own slug (`series-name-01`, `series-name-02`, …) so they
    sort in order when rendered.
  - Vary the angle across posts (e.g., problem → story → solution → CTA) rather
    than repeating the same structure.
  - Write a one-line strategy note at the top of the brief for each post before
    drafting slides.

## Create the files

For each post, create `posts/<slug>/` containing:

1. **`post.json`** with `{ "format": "<chosen-format>", "slug": "<slug>" }`.
2. **`slide-1.html` through `slide-N.html`** — each a standalone HTML document
   linking to `../../theme.css`. Structure:

   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <link rel="stylesheet" href="../../theme.css">
     <style>
       /* per-slide overrides only when needed */
     </style>
   </head>
   <body>
     <div class="slide">
       <div class="content flex-col gap-32">
         <!-- headings, body copy, pills, cards, tip-numbers, etc. -->
       </div>
       <span class="watermark"><!-- see Watermark section below --></span>
     </div>
   </body>
   </html>
   ```

## Slide anatomy

- **Slide 1 — Hook.** Must work in <1 second. Use one of the hook formulas
  stored in `brand_hooks.md`: specific number, personal failure, hot take,
  shocking stat, myth busted. Bold type, minimal text.
- **Middle slides.** Each builds on the previous — no filler, no repetition.
  End each slide on an open loop (question, tease, cliffhanger) so viewers swipe.
  For listicles use `.tip-number` + `.heading-lg` + `.body-lg`.
- **Final slide — Close.** One clear CTA and the handle watermark. Use
  `--primary` or `--accent` for the action; give it a card or pill.

## Voice checks

Before writing any slide copy:

- Match the voice rules in `brand_voice.md` (adjectives, do/don't lists,
  signature phrases).
- Write in the primary language listed in `brand_identity.md`.
- Strip filler words. Short sentences. Every word earns its place.
- No emojis unless `brand_voice.md` permits them.
- Respect the off-limits list in `brand_hooks.md`.

## Watermark

Use the handle in `brand_identity.md` that matches the post's target platform.
If the user said "this is for TikTok", use the TikTok handle; for Instagram,
the Instagram handle; etc. If the post is not platform-specific or no
platform-specific handle is set for that platform, fall back to the **Default
handle** in `brand_identity.md`. Never hardcode `@yourhandle`.

## After writing

Tell the user:

1. What you created (file paths).
2. A one-line strategy note per post (hook + arc).
3. Suggested next step: run `/postkit-review` for a critique, or `/postkit-render`
   to generate PNGs.

## Important

- Don't render. That's `/postkit-render`'s job.
- Don't overwrite an existing `posts/<slug>/` — ask for a different slug.
- Don't invent brand details that aren't in the `brand_*.md` memory files.
  Ask the user or re-run `/postkit-setup`.
- Don't write brand state into project-root `.md` files. Memory is the source
  of truth for the brand profile.
