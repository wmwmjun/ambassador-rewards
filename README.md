# Ambassador Design System

## Overview

**Product:** Ambassador Point Management & Redemption Dashboard
**Market:** India (approx. 1,500 brand ambassadors)
**Language:** Japanese PRD / English UI
**Primary Platform:** Mobile-first web app (Next.js + Tailwind CSS)

### What is this product?

A white-labeled internal dashboard that replaces a third-party point management service. Brand ambassadors log in to:
- Check their current, earned, and used points
- Redeem points via eGift cards (Amazon, Flipkart, via Xoxoday API) or bank transfer
- View full transaction history
- Manage their profile (including PAN/tax info and bank account details)

Account Team admins can award points individually or via CSV bulk upload, approve/reject redemptions, and run reports.

### Sources

- **PRD (Japanese):** Pasted text — _アンバサダー向け ポイント確認・交換ダッシュボード 要件定義書_
- **GitHub Repo:** `wmwmjun/ambassador` — empty placeholder as of April 2026 (only a README.md stub)
- No Figma file, no existing codebase, no brand assets provided

---

## Products / Surfaces

| Surface | Description |
|---|---|
| **Ambassador App** | Mobile-first PWA/web app; 4 screens: Dashboard, Redeem, Orders/History, Profile |
| **Admin Panel** | Desktop-priority internal tool; user management, point award, redemption approval, reports |

---

## CONTENT FUNDAMENTALS

### Tone & Voice
- **Professional but approachable.** Ambassadors are young (college-aged), in India, managing real earnings.
- **Clear and direct.** Never obscure how many points someone has or when they expire.
- **Encouraging.** CTAs like "Redeem Now", "Check your balance" — action-oriented.
- **No jargon.** Avoid finance-heavy terms where simpler language works.
- **English UI** with possible future Japanese/Hindi localization consideration.

### Casing
- **Sentence case** for body text and labels
- **Title Case** for navigation items and section headings (Dashboard, Redeem, History, Profile)
- **ALL CAPS** sparingly — status badges only (PENDING, APPROVED, REJECTED)

### Emoji
- **Not used.** This is a financial/rewards tool; emoji would undermine the premium/trustworthy feel.

### Key Copy Examples
- "Your balance" (not "Your Points")
- "Redeem points" (not "Exchange" or "Cash out")
- "Expires in 30 days" (not "30日以内失効予定")
- "Pending approval" / "Completed" / "Rejected"
- "Minimum transfer amount: ₹50,000"
- "Points expire 2 years from the date they were awarded"
- "1 point = ₹1"

### Numbers & Currency
- Always display INR as ₹ with no space: ₹50,000
- Points displayed without unit suffix unless disambiguation needed: 1,200 pts
- Large numbers use Indian comma system: 1,00,000 (lakh formatting)

---

## VISUAL FOUNDATIONS

### Color Palette
See `colors_and_type.css` for full token list.

**Background:** Warm off-white (#F5F4F0) — parchment feel, not stark white
**Surface:** White (#FFFFFF) cards on the warm bg
**Primary text:** Deep charcoal (#1C1C1E)
**Secondary text:** Medium gray (#6B6B80)
**Brand accent / Gold:** Warm amber-gold (#C9A847) — used for points, CTAs, highlights
**Success:** Soft green (#34C759)
**Warning:** Amber (#FF9F0A)
**Error/Rejected:** Muted red (#FF3B30)
**Navigation/Shell bg:** Near-black (#1A1A2E) for bottom nav and top header

### Typography
- **Display font:** `Plus Jakarta Sans` (Google Fonts) — modern, clean, slightly premium
- **Mono (for codes/PAN/amounts):** `JetBrains Mono` (Google Fonts) — for account numbers, gift codes, PAN
- **Scale:** Large point totals use 40–48px bold. Body 14–16px. Labels 11–12px.
- **Line height:** 1.4–1.5 for body; 1.1–1.2 for display numerals

### Backgrounds
- **App shell:** Warm parchment (#F5F4F0) — no full-bleed imagery; content-first
- **Card surfaces:** Pure white with subtle shadow
- **Admin panel:** Light gray (#F9F9F9)
- No gradients on backgrounds; gradients used only as subtle overlays on the bottom nav shell

### Cards
- **Rounding:** 16px (mobile cards), 12px (list items), 8px (tags/badges)
- **Shadow:** `0 2px 8px rgba(0,0,0,0.07)` — subtle lift, not heavy drop shadow
- **Border:** 1px solid #E8E6E1 on cards (optional, subtle)
- **Padding:** 20px on mobile cards; 24px on desktop

### Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

### Navigation
- **Mobile:** Fixed bottom nav bar (3 items: Dashboard, Redeem, Profile — History under Dashboard)
- **Bottom nav bg:** Near-black (#1A1A2E) with gold active indicator
- **Desktop:** Left sidebar (admin), top nav (user)

### Animation
- **Easing:** ease-out for entering elements; ease-in for exits
- **Duration:** 200ms for micro-interactions; 300ms for screen transitions
- **No bounces.** Subtle, professional fades and slides.
- **Hover states:** Slight opacity reduction (0.8) or subtle background tint (#F0EFE9)
- **Press states:** Scale down slightly (scale 0.97) + darker background

### Iconography
See ICONOGRAPHY section below.

### Corner Radii
- Small (tags, chips): 6px
- Medium (inputs, list items): 10px
- Large (cards): 16px
- Full pill (CTAs, badges): 999px

### Imagery
- No decorative photography in the app
- Abstract geometric shapes or subtle wave/line motifs acceptable as accent backgrounds
- Admin panel: purely functional, no imagery

### Transparency & Blur
- Backdrop blur used on modal overlays: `backdrop-filter: blur(8px)`
- Not used decoratively

---

## ICONOGRAPHY

### Approach
- **No custom icon font** — no icon assets exist in the provided codebase
- **Recommended CDN:** Lucide Icons (`https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`)
  - Stroke weight: 1.5px — matches the clean, modern, premium feel
  - Style: Line icons (not filled) — consistent with the minimal aesthetic
- **Substitution flag:** Lucide is the closest free match to the intended premium line-icon style. If the production team has a licensed icon set (e.g. Phosphor, Streamline), swap it out.

### Key Icons Used
| Usage | Lucide Icon |
|---|---|
| Dashboard | `layout-dashboard` |
| Redeem / Gift | `gift` |
| History | `clock` |
| Profile | `user` |
| Points / Wallet | `wallet` |
| Bank Transfer | `building-2` |
| eGift Card | `credit-card` |
| Copy | `copy` |
| Expiring | `alert-triangle` |
| Approved | `check-circle` |
| Rejected | `x-circle` |
| Pending | `clock` |

---

## File Index

```
/
├── README.md                    ← This file
├── SKILL.md                     ← Agent skill definition
├── colors_and_type.css          ← CSS custom properties (tokens)
├── assets/                      ← Logos, icons, visual assets
│   └── (no brand assets provided — see caveats)
├── preview/                     ← Design System tab cards
│   ├── colors-primary.html
│   ├── colors-semantic.html
│   ├── typography-display.html
│   ├── typography-body.html
│   ├── spacing-tokens.html
│   ├── components-buttons.html
│   ├── components-cards.html
│   ├── components-badges.html
│   ├── components-inputs.html
│   ├── components-nav.html
│   └── components-point-display.html
└── ui_kits/
    └── ambassador-app/
        ├── README.md
        ├── index.html           ← Interactive prototype (mobile)
        ├── Dashboard.jsx
        ├── Redeem.jsx
        ├── History.jsx
        └── Profile.jsx
```
