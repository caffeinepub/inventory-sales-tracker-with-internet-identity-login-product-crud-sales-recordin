# Specification

## Summary
**Goal:** Build an authenticated inventory and sales tracking app with product CRUD, sales recording with profit calculation, and a dashboard with daily metrics and low-stock alerts.

**Planned changes:**
- Add Internet Identity sign-in/sign-out and require an authenticated session for all product/sales/profile access.
- Create a first-time onboarding/profile flow to capture and persist a display name and a default low-stock threshold, with later edit capability.
- Implement product management (create/list/edit/delete) with fields: name, cost price, sale price, current stock quantity, and optional low-stock threshold override; include validation and English error messages.
- Implement sales recording: form to log sales (date/time, product, quantity, optional unit sale price override, notes), compute/store profit, and decrement stock with checks to prevent selling more than available.
- Build a dashboard showing today’s daily summary by default (sales count, revenue, cost, profit), allow selecting previous days, and display low-stock alerts based on per-product or default thresholds.
- Add a Notifications/Integrations settings area with a clearly labeled, disabled placeholder for WhatsApp (not enabled in v1).
- Apply a cohesive, distinctive visual theme across all screens with responsive layout; avoid blue/purple as primary colors.

**User-visible outcome:** Users can sign in with Internet Identity, complete onboarding, manage products and inventory, record sales with automatic profit and stock updates, view daily performance metrics and low-stock alerts on a dashboard, and see a notifications page with a WhatsApp placeholder (no real messaging).
