# Portside Service Landing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the simplified ad landings with the approved Portside visual system and ship three intent-specific Atlanta cleaning pages for House Cleaning, Deep Cleaning, and Move-In / Move-Out Cleaning.

**Architecture:** Keep the site static for Cloudflare Pages. Share one CSS file and one JS file across three service pages so navigation, form behavior, tracking, and visual treatment stay consistent. Serve the new experience from the root by making `index.html` the House Cleaning entry page while retaining dedicated ad URLs for all three services.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Google Ads gtag, BotConversa webhook, Cloudflare Pages.

**Spec:** Approved in chat from the supplied screenshot on 2026-09-09.

## Global Constraints

- Visual direction: navy hero, off-white navigation, cyan accent, 50/50 hero image split, Portside wordmark treatment.
- Navigation tabs: House Cleaning, Deep Cleaning, Move Cleaning.
- Three dedicated ad URLs: `/house-cleaning-services-atlanta-ga`, `/deep-cleaning-services-atlanta-ga`, `/move-in-move-out-cleaning-atlanta-ga`.
- All minimum pricing starts at `$115`.
- `Get my estimate` and primary CTA links scroll to the on-page estimate form.
- Preserve phone `(404) 641-0139`, email `portsidecleanusa@gmail.com`, BotConversa webhook, and Google Ads conversion tracking in USD.
- Keep pages mobile responsive and SEO-indexable with distinct title, description, canonical, H1, and Service schema.

---

### Task 1: Contract tests

**Files:**
- Create: `tests/test_service_landings.py`

- [ ] Assert all three landing files exist.
- [ ] Assert shared navigation links point to the three approved URLs.
- [ ] Assert every landing has `$115`, `#estimate`, the booking form fields, webhook, phone, email, and USD conversion tracking.
- [ ] Assert unique canonical URLs and service-specific H1/title content.

### Task 2: Shared visual system and form behavior

**Files:**
- Create: `service-landing.css`
- Create: `service-landing.js`

- [ ] Recreate the approved header/hero/nav look.
- [ ] Add responsive layout and form styling.
- [ ] Centralize estimate form submission, validation, BotConversa payload, and Google Ads conversion event.

### Task 3: Three campaign landing pages

**Files:**
- Create: `house-cleaning-services-atlanta-ga.html`
- Create: `deep-cleaning-services-atlanta-ga.html`
- Create: `move-in-move-out-cleaning-atlanta-ga.html`

- [ ] Build service-specific hero copy and sections.
- [ ] Use `images/hero-kitchen.jpg.png` as the hero visual.
- [ ] Include shared estimate form and contact CTAs.

### Task 4: Production entry and discovery

**Files:**
- Modify: `index.html`
- Modify: `sitemap.xml`

- [ ] Make the root use the new House Cleaning experience.
- [ ] Update sitemap to the three new campaign URLs plus root.
- [ ] Preserve robots sitemap declaration.

### Task 5: Verification and release

- [ ] Run `python tests/test_service_landings.py` and confirm all tests pass.
- [ ] Review final diff for only intended files.
- [ ] Open PR, verify mergeability, and merge to `main` so Cloudflare Pages deploys production.
