# Carousel project — Claude Code guide

This project uses [carousel-kit](https://github.com/Trystan-SA/carousel-kit) to render social-media carousels from HTML/CSS. This file tells Claude Code how to help you create posts.

> **Customize this file.** Replace the placeholder sections below with your real brand, audience, and goals. The richer this doc, the better Claude can draft posts that sound like you.

---

## Brand

- **Brand / handle:** `@yourhandle`
- **Niche:** _(e.g., personal finance, indie SaaS, food, fitness)_
- **Audience:** _(who you're talking to — age, stage of life, pain point)_
- **Primary platform:** _(TikTok / Instagram / X)_
- **Secondary platforms:** _(which formats also get reused)_
- **Posting frequency:** _(e.g., 1/day, 3/week)_
- **Language:** _(English, French, …)_

## Voice

- Adjectives that describe the voice: _warm, direct, empowering_ (edit these)
- Avoid: _jargon, cutesy superlatives, corporate tone_ (edit these)
- OK: _direct questions, relatable scenarios, light humor_ (edit these)

## Visual identity

Defined in `theme.css` at the project root. Tokens worth knowing:

- `--primary`, `--accent`, `--bg`, `--text` — core palette
- `--font-display`, `--font-body`, `--font-handwritten` — type
- `--slide-width`, `--slide-height` — set by the renderer from `carousel.json`

Edit `theme.css` to change brand colors / fonts / radii globally. Per-slide overrides go in a `<style>` block inside the slide HTML.

## Content formats

Not every post should be a carousel. Use this as a decision guide:

| Content type                                 | Best format                  |
| -------------------------------------------- | ---------------------------- |
| Educational reference (tips, rules, how-tos) | Carousel                     |
| Personal story / vulnerable moment           | Selfie video or photo        |
| "Look at my screen" / product demo           | Screen recording             |
| Myth-busting, hot take                       | Carousel or selfie video     |
| Product reveal / walkthrough                 | Screen recording or carousel |

Ask the user to film a video or provide a photo when the format decision guide points away from a carousel.

## Post creation workflow

### 1. Ask before drafting

Always gather context first:

- **Subject & angle** — what's the post about?
- **Goal** — views, saves, follows, conversions?
- **Audience segment** for this specific post
- **Key message** — the ONE takeaway
- **Call to action** — what should the viewer do?
- **Tone for this post** — educational, relatable, hot take, …
- **Format** — carousel or something else (see table above)
- **Number of slides** — 3–5 is ideal for carousels

### 2. Scaffold the post

```bash
carousel-kit new <slug> --format 9:16
```

This creates `posts/<slug>/` with `carousel.json` and starter slides.

### 3. Write the slides

Each `slide-*.html` links to `../../theme.css` and can use inline `<style>` for per-slide tweaks. Use `.heading`, `.body`, `.card`, `.pill`, `.tip-number`, `.product-img`, etc. from the theme.

Slide anatomy:

- **Hook (slide 1)** — bold statement, specific number, personal failure, or hot take. Must work in <1 second.
- **Middle slides** — each builds on the previous. No filler, no repetition.
- **Close (last slide)** — clear CTA + handle watermark.

### 4. (Optional) Run the expert review pipeline

If you have `agents/` populated (from `carousel-kit init`), run the three-expert sequential review on your first draft:

1. **Strategist** — hook, angle, format fit, value arc, audience, goal alignment
2. **Copywriter** — CTA, word economy, slide transitions, emotional triggers, tone
3. **Designer** — layout, whitespace, rhythm, typography, text density, color, consistency

Each expert returns HIGH / MEDIUM / LOW findings. Apply HIGH impact items; log the rest. Run once per draft — not on every minor edit.

### 5. Render and iterate

```bash
carousel-kit render posts/<slug>
# or, for live reload while editing:
carousel-kit watch posts/<slug>
```

Output PNGs land in `posts/<slug>/output/`.

## Hook formulas that work

- Specific number: "155,000 generated in 12 months"
- Personal failure: "I spent 4 years saving my first dollar"
- Urgency / pain: "You're losing money every month without knowing it"
- Hot take: "The 50/30/20 rule is wrong for most people"
- Shocking stat: "40% of X do Y — here's why it's a mistake"

## Engagement triggers

Every post should have at least one:

- **Save trigger** — reference content ("save this for later")
- **Comment trigger** — a question to the audience
- **Share trigger** — "send this to someone who…"
