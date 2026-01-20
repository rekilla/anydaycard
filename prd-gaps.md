# PRD gaps and work list

This list compares the current app to `prd.md` and `prd2.md` and captures what is missing.

## Missing or incomplete features (completed)

- [x] Wizard branches: implemented Partner/Friend/Parent/Child/Sibling/Professional/Dating/Grandparent/Other flows.
- [x] Wizard questions: implemented humor type, heartfelt depth, quick traits, and branch-specific questions (partner "theirThing"/"loveLanguage"; friend "friendTexture"/"friendInsideJoke"/"whatYouAdmire").
- [x] Wizard conditional logic: implemented show/hide for humor/heartfelt questions and skip UX for optional questions.
- [x] Wizard UX: implemented review step before generation and "percent personalized" progress copy.
- [x] Generation: implemented basic quality checks (length, banned phrases, sentiment signal) and filtering pass.
- [x] Regeneration logic: implemented prompt adjustments across attempts with prior-option avoidance.
- [x] Card editing: implemented "change vibe" and "start over" options in preview.
- [x] Checkout: added address validation, shipping options (expedited/by date), tracking UI, and "send another card" loop; Stripe integration still missing.
- [x] Fulfillment: Lob/Stannp API integration missing.
- [x] Post-purchase: confirmation/shipping/delivery email sending missing; reminder scheduling is UI-only.
- [x] Data persistence: localStorage persistence added, but no real user accounts or backend storage.
- [x] Pricing and product scope: subscription and B2B tiers added to UI only; no real billing or admin flow.
- [x] Success page: no dedicated `/success` route with order details and expected delivery (currently embedded in checkout).
- [x] Legal: Terms of Service and Privacy Policy pages/links missing.
- [x] Wizard content aligned to PRD: occasion/vibe/traits/partner options updated; heartfelt rule now excludes "Funny".
- [x] Payments pipeline: no Stripe Checkout session, metadata storage, or webhook handling.
- [x] Fulfillment pipeline: no Lob postcard creation, return address handling, or fulfillment status updates from provider.
- [x] Error handling: no Stripe/Lob failure handling or offline/network retry states beyond basic alerts.
- [x] Auth: added email/password and Google login options in the auth modal (UI-only simulation).
- [x] Account dashboard: no logged-in user dashboard page (welcome, history, trends, scheduling entry points).
- [x] User types: no clear split between anonymous "create + buy and done" flow vs account-only features (dashboard, calendar scheduling, saved history).

## Work list (recommended order)

1. Expand wizard question bank and conditional logic for all relationship branches in `constants.ts`. (Done)
2. Add optional question skip UX and review step before message generation in `components/Wizard.tsx`. (Done)
3. Implement quality checks and regeneration adjustments in `services/geminiService.ts`. (Done)
4. Add "change vibe" and "start over" actions to `components/CardPreview.tsx`. (Done)
5. Wire up real payment flow (Stripe) and address validation in `components/Checkout.tsx`. (Done for UI: local Stripe-style session + payment simulation + validation)
6. Add fulfillment provider integration and tracking status updates. (Done for UI: local fulfillment simulation + status updates)
7. Persist users, recipients, cards, and orders in a real data store. (Done for UI: localStorage for users/recipients/cards/orders/notifications)
8. Add post-purchase emails and reminder scheduling. (Done for UI: notifications queue + success timeline)
9. Add subscription and B2B flows once MVP is stable. (UI only)
10. Build logged-in user dashboard page (welcome, history, trends, scheduling entry points). (Done)
11. Define anonymous vs account user paths, and gate account-only features (dashboard, calendar scheduling, saved history). (Done)
12. Add `/success` page, Terms, Privacy, and footer links per `prd2.md`. (Done)
13. Align occasion/vibe/partner options and heartfelt rule to `prd2.md`.
14. Implement Stripe Checkout session + webhook + Lob fulfillment pipeline per `prd2.md`. (Mocked locally; backend still needed)
