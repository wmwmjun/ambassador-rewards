---
name: ambassador-design
description: Use this skill to generate well-branded interfaces and assets for the Ambassador point management dashboard — a mobile-first web app for brand ambassadors in India to track and redeem reward points. Contains essential design guidelines, colors, type, fonts, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key design notes to remember:
- Font: Plus Jakarta Sans (Google Fonts) + JetBrains Mono for codes/amounts
- Primary bg: #F5F4F0 (warm parchment), Shell/nav: #1A1A2E (deep navy), Accent: #C9A130 (warm gold)
- Mobile-first: 390px wide, bottom nav with 3 items max
- Point numbers are the hero — display at 40–48px, extrabold, tight tracking
- Status badges: COMPLETED (green), PENDING (blue), REJECTED (red), EXPIRING (amber)
- Indian locale: ₹ prefix, lakh number format (1,00,000), IFSC/PAN fields
- 1 point = ₹1; bank transfer minimum ₹50,000
- No emoji in UI (except greeting); no heavy gradients; line icons only (Lucide-style, 1.8px stroke)
- Card radius: 16–18px; shadow: 0 2px 10px rgba(0,0,0,0.07)
