# Ambassador App — UI Kit

## Overview
Mobile-first web app for brand ambassadors to manage their reward points.

## Screens
1. **Dashboard** — Balance overview, expiry alerts, recent transactions
2. **Redeem** — eGift card and bank transfer redemption flows
3. **History** — Redemption and point history with tabs
4. **Profile** — Personal info and bank account management

## Design System
- Colors & Type: `../../colors_and_type.css`
- Font: Plus Jakarta Sans (Google Fonts)
- Icons: Inline SVG (Lucide-style line icons, 1.5px stroke)

## Usage
Open `index.html` for the interactive click-through prototype.
Each JSX component file contains one screen.

## Notes
- Designed at 390px wide (iPhone 14 viewport)
- Bottom nav is fixed; content scrolls above it
- No real backend — all state is mocked in React
