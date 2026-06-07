# VoiceCloser Landing Page — Layout Reference

> **Purpose:** AI-readable map of the marketing site's main page so changes (e.g. adding a pricing section) can be made with full context. Keep this updated when sections are added, removed, or reordered.
>
> **Last reviewed:** 2026-06-07
> **Stack:** Astro (static site)
> **Source file:** `src/pages/index.astro`
> **Shared chrome (nav + footer):** `src/layouts/Layout.astro`
> **Global styles:** `src/styles/global.css`

## Table of Contents

- [Page Chrome (every page)](#page-chrome-every-page)
- [Main Page Sections (`index.astro`)](#main-page-sections-indexastro)
  - [1. Hero — Demo First](#1-hero--demo-first)
  - [2. Problem Section](#2-problem-section)
  - [3. Three Pillars](#3-three-pillars)
  - [3.5 See It In Action (Demo Video)](#35-see-it-in-action-demo-video)
  - [4. How It Works — 3 Steps](#4-how-it-works--3-steps)
  - [5. Try It Yourself (Demo Band)](#5-try-it-yourself-demo-band)
  - [6. Who It's For](#6-who-its-for)
  - [6.5 Pricing](#65-pricing)
  - [7. Social Proof (hidden)](#7-social-proof-hidden)
  - [8. CTA — Book A Strategy Call](#8-cta--book-a-strategy-call)
  - [9. FAQ](#9-faq)
  - [Exit-Intent Modal](#exit-intent-modal)
- [Inline Scripts](#inline-scripts)
- [Anchor / Nav Map](#anchor--nav-map)
- [Notes For Adding A Pricing Section](#notes-for-adding-a-pricing-section)

---

## Page Chrome (every page)

Defined in `src/layouts/Layout.astro`, wraps all pages via `<slot />`.

- **`<head>`** — SEO meta, Open Graph + Twitter cards (default OG image is the demo video thumbnail), Google Fonts (Inter + Playfair Display), Google Analytics (`G-H4EYMY1M8F`), PostHog (`xlt.voicecloser.io`), Affonso affiliate pixel.
- **Navbar** (`.navbar`) — logo, mobile hamburger toggle, links: **How It Works** (`#how-it-works`), **Who It's For** (`#who-its-for`), **Pricing** (`#pricing`), **FAQ** (`#faq`), **Book A Fit Call** (`/book`), plus a light/dark theme toggle.
- **Footer** (`.footer`) — brand blurb, **Navigate** column (same anchors as nav), **Legal** column (`/privacy`, `/terms`, `/opt-out`, `/delete`), **Get Started** CTA (`/book`), copyright line (`RECO QA LLC d/b/a VoiceCloser`).
- **Theme + mobile-menu scripts** at the bottom of the layout.

---

## Main Page Sections (`index.astro`)

Sections appear top-to-bottom in this order. Each heading notes its CSS class and `id` anchor (if any).

### 1. Hero — Demo First
`<section class="hero">` — no id (top of page)
Two-column hero (message left, form right). **Left (`.hero-text`):** H1 headline ("AI Receptionist & Call Assistant That Answers Every Call"), subhead, a 3-item feature bullet list (`.hero-bullets`, gold checks), then a secondary links row (`.hero-links-row`) — **"See it handle a real call"** (`.hero-watch-link`, scrolls to `#demo-video`) and a muted **"Book your 15-minute fit call"** (`.hero-book-link`, → `/book`) — and a one-line trust badge (`.hero-trust-badge`, "Built by a 14-year real estate operator"). **Right (`.hero-form-col`, a boxed card):** a single-purpose action panel — eyecatch (pulsing phone), the **demo call form** (`#heroDemoForm`, `.demo-form`, phone input that progressively reveals name + TCPA consent), the submit button ("Call me right now"), and a "US & Canada only" helper. Nothing else lives in the card (one job: phone in, call out). The hero **does not embed the demo video** — it lives only in the "See It In Action" section (`#demo-video`).

> ⚠️ **Shared CSS warning:** `.hero`, `.hero-inner`, `.hero-text`, `.hero-sub`, `.hero-visual`, `.phone-mockup`, `.chat-bubble`, `.hero-badge`, and `.hero-video` are **also used by `[slug].astro`** (the per-industry landing pages, which render a phone-mockup on the right instead of a form). Do **not** delete them as "unused," and remember that editing shared hero CSS changes those pages too. The index-only classes (safe to change without affecting slug pages) are `.hero-bullets`, `.hero-form-col`, `.hero-links-row`, `.hero-watch-link`, `.hero-book-link`, `.hero-trust-badge`.

### 2. Problem Section
`<section class="problem-section">` — no id
Two-column. **Left:** "Every Missed Call..." copy + a 3-item pain-point list, plus an outline CTA linking to `#how-it-works`. **Right:** a before/after **comparison card** (Current Reality vs. With VoiceCloser).

### 3. Three Pillars
`<section class="pillars-section">` — no id
Centered title + gold accent line, then a 3-card grid (`.pillars-grid`): **Answer Every Call Live**, **Qualify & Route Serious Leads**, **Summarize Every Call Into CRM Tasks**. Outline CTA below links to `#demo-video`.

### 3.5 See It In Action (Demo Video)
`<section class="demo-video-section" id="demo-video">`
Centered title + a second embedded Cloudflare Stream player (`#section-stream`) — same video as the hero.

### 4. How It Works — 3 Steps
`<section class="steps-section" id="how-it-works">`
Centered title, then a numbered 3-step grid (`.steps-grid`): **Quick Setup Call**, **We Train Your Voice Agent**, **Forward Your Phones & Plug In Your Leads**. Below it a horizontal **flow diagram** (`.steps-flow`): Caller / Lead List → VoiceCloser → Calendar / Inbox / CRM. Gold CTA to `/book`.

### 5. Try It Yourself (Demo Band)
`<section class="demo-band" id="demo">`
Full-width band with H2 and a **second demo call form** (`#demoBandForm`) — identical behavior to the hero form (phone → name + consent → `/api/test-call-homepage`).

### 6. Who It's For
`<section class="audience-section" id="who-its-for">`
Two-column. **Left:** "Built For Call-Heavy Businesses" copy. **Right:** audience pill list (agencies, home services, real estate, clinics, any high-call-volume / big-lead-list business).

### 6.5 Pricing
`<section class="pricing-section" id="pricing">` (background `--bg-secondary`)
Centered title + subtitle, then a 2-card grid (`.pricing-grid`, reuses `.pillar-card`-style cards): **AI Receptionist & Lead Handler** (core) and **AI Call Ops Assistant** (featured, with an `Advanced` badge). Each card has a name, ideal-for line, gold-check `includes` list, and an `investment_copy` block with `<strong>` price bands. Centered `.pricing-footer-note` below. Sits between Who It's For and the (hidden) Social Proof block.

### 7. Social Proof (hidden)
`<section class="proof-section">` — **commented out**
Testimonial card + metrics card. Hidden until real testimonials exist; restore by uncommenting the block.

### 8. CTA — Book A Strategy Call
`<section class="cta-band" id="book">`
Full-width closing CTA band. H2, subhead, gold "Book Your 15-Minute Strategy Call" button (`/book`), and a secondary link back to `#demo`.

### 9. FAQ
`<section class="faq-section" id="faq">`
Centered title + accordion (`.faq-list` / `.faq-item`). Six Q&As: inbound + new-lead follow-up, keeping your number, setup time, CRM/calendar integrations, accuracy/script control, and **cost** (now publishes the price bands that match the Pricing section). Accordion behavior is JS-driven.

### Exit-Intent Modal
`<dialog id="exitModal" class="exit-modal">` + backdrop `#exitModalBackdrop`
Non-modal dialog with a lazy-loaded demo video and an unmute button. **Desktop trigger:** mouse exits viewport top, after 15s + at least one scroll. **Mobile trigger:** FAQ section ≥60% visible. Shows once per session; suppressed if the user already played a video, submitted a form, or is typing.

---

## Inline Scripts

All `is:inline` at the bottom of `index.astro`:

1. **Cloudflare Stream → PostHog** — tracks play/pause/ended + 25/50/75% progress for `#section-stream` (the "See It In Action" player; the hero player was removed).
2. **FAQ accordion** + **demo call forms** — phone auto-formatting `(xxx) xxx-xxxx`, progressive field reveal, inline (non-native) validation, fetch to `/api/test-call-homepage`, success/error button states. (Note: per project rule, no native `alert`/`confirm` — uses inline `.demo-error` elements.)
3. **Exit-intent modal** — trigger gating, lazy iframe load, unmute (SDK + iframe-reload fallback), session suppression.

---

## Anchor / Nav Map

| Anchor | Section |
| --- | --- |
| `#how-it-works` | How It Works — 3 Steps |
| `#who-its-for` | Who It's For |
| `#pricing` | Pricing |
| `#faq` | FAQ |
| `#demo-video` | See It In Action |
| `#demo` | Try It Yourself (Demo Band) |
| `#book` | CTA — Book A Strategy Call |
| `/book` | Booking page (`src/pages/book.astro`) |

Nav and footer both link to `#how-it-works`, `#who-its-for`, `#pricing`, `#faq`, and `/book`.

---

## Changelog

**2026-06-07 — Pricing section + offer repositioning.**
- Added the `#pricing` section (Core + Advanced tiers) between Who It's For and the hidden Social Proof block, with `#pricing` links added to the navbar and footer Navigate column.
- Repositioned the page around **inbound + instant new-lead follow-up + call-ops** (auto-summaries → CRM tasks) and **de-emphasized outbound database reactivation**. Updated: hero headline/sub/bullets, Problem section copy + comparison card, Pillar 3 (was "Call Through Your Existing Database" → now "Summarize Every Call Into CRM Tasks"), and FAQ #1.
- Published price bands in the FAQ "cost" answer (matching the Pricing section).
- Rewrote the final CTA band copy and added a `.cta-reassure` trust row.
- Added a first-person founder credibility line in the hero (`.hero-credibility`).
- Renamed the nav/footer CTA from "Book A Strategy Call" → "Book A Fit Call." (The GoHighLevel booking widget's internal title is managed in GHL, not this repo, and should be aligned there separately.)
- New CSS in `src/styles/global.css`: `.hero-bullets`, `.hero-book-link`, `.hero-credibility`, the `PRICING` block, and `.cta-reassure`.

**2026-06-07 — Hero declutter (video out, form into a card).**
- Removed the demo video from the hero; restructured to two columns: message left (`.hero-text`), boxed demo form right (`.hero-form-col`). Grid is now top-aligned with a wider gap.
- Replaced the founder credibility paragraph (`.hero-credibility`, removed) with a one-line trust badge (`.hero-trust-badge`, "Built by a 14-year real estate operator").
- Added a `.hero-watch-link` ("See it handle a real call") that scrolls to `#demo-video`; demoted the `/book` link to muted/tertiary.
- Removed the `#hero-stream` references in the PostHog tracking and exit-modal pause logic (the video now lives only in `#demo-video`).

**2026-06-07 — Hero card simplified to one action (Hick's Law).**
- Moved the secondary links and trust badge OUT of the form card into the left column: new `.hero-links-row` (watch + book links) plus `.hero-trust-badge` now sit under the bullets. The right card (`.hero-form-col`) is form-only.
- Dropped the badge's in-card top-border divider; centered the bullets block, links row, and badge on mobile (≤768px).
- Confirmed `.hero-visual` / `.phone-mockup` / `.chat-bubble` / `.hero-badge` / `.hero-video` are shared with `[slug].astro` and left them intact (NOT dead code).
