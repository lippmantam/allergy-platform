# Allergy Platform — Roadmap

Full product specification: [`docs/spec.md`](docs/spec.md)

---

## Phase 1 — The Data Foundation ✅ Complete

**Goal:** Build and validate the core place database in Toronto.

- [x] Allergen vocabulary — 21 allergens, Health Canada anchored, cross-reactivity map
- [x] System architecture — Turborepo monorepo, Fastify API, Next.js web, Supabase, Prisma
- [x] Full Prisma schema — Place, PlaceAllergen, Contributor, StructuredReport, NarrativeReview, TrustSignal, Dispute
- [x] Shared package — TypeScript types, Zod schemas, allergen constants, utilities
- [x] API — `GET/POST/PATCH/DELETE /places`, allergen upsert/remove, `GET /allergens`
- [x] Web — Home, search (text + allergen filter), place detail, add-place form
- [x] Seed data — 25 fictional Toronto restaurants with allergen profiles

---

## Phase 2 — The Community Layer

**Goal:** Transform the directory into a living, community-driven platform.

### 2a — Reports & Reviews ✅ Complete

API routes and web UI for the two community content types already in the schema.

**API** (`apps/api/src/routes/`)
- [x] `POST /reports` — submit a structured report for a place
- [x] `GET /reports?placeId=` — list reports for a place (newest first, soft-delete filtered)
- [x] `DELETE /reports/:id` — soft delete (owner only)
- [x] `POST /reviews` — submit a narrative review
- [x] `GET /reviews?placeId=` — list reviews for a place
- [x] `DELETE /reviews/:id` — soft delete (owner only)

**Web** (`apps/web/app/`)
- [x] Report form on place detail page — allergens confirmed, reaction status, visit date, party type, severity, verification method
- [x] Review form on place detail page — experience text, safety rating (1–5), tips, would return
- [x] Report and review cards on place detail page
- [x] Staleness indicator — flag reports/reviews older than 12 months

### 2b — Authentication ✅ Complete

- [x] Supabase Auth — email/password + magic link
- [x] `handle_new_user()` DB trigger — auto-creates Contributor row on registration
- [x] Auth middleware in Fastify — verify Supabase JWT (ES256 via JWKS) with `jose`
- [x] Web sign-up / sign-in pages
- [x] Replace seed contributor ID with authenticated user's ID in all write routes

### 2c — Contributor Profiles & Trust ✅ Complete

- [x] `GET /contributors/:id` — public profile + contribution history
- [x] `PATCH /contributors/:id` — update display name and allergen profile (owner only)
- [x] Trust score recalculated in-process after each report/review/trust-signal write
- [x] Contributor profile page (`/contributors/:id`)
- [x] Profile edit page (`/profile`) with allergen profile selector
- [x] Trust badge (New / Active / Trusted / Highly trusted) on reports/reviews
- [x] Contributor name links to profile page

### 2d — Trust Signals & Disputes ✅ Complete

- [x] `POST /trust-signals` — helpful / confirm / outdated vote (one per user per item)
- [x] `POST /disputes` — raise a dispute with reason text
- [x] `GET /trust-signals?targetId=` — signal counts per item
- [x] Helpful vote count display on report/review cards
- [x] "Helpful" and "Outdated" buttons on cards for signed-in users (disabled after voting)

---

## Phase 3 — The Knowledge Base

**Goal:** Add contextual, evergreen travel intelligence alongside the place data.

- [ ] Destination guides — city-level allergy travel tips (Toronto as pilot)
- [ ] Cuisine guides — cultural context, common hidden allergens by cuisine type
- [x] Language cards — 9 allergens × 8 languages (Japanese, Thai, French, Spanish, Italian, Mandarin, Korean, Vietnamese). Print-friendly. At `/language-cards`.
- [ ] Cross-reactivity warnings surfaced in search results and place detail
- [ ] PostGIS geo search — "near me now" via `ST_DWithin` (architecture item D in spec §13)
- [ ] Offline cache for mobile — core place + allergen data (architecture item C in spec §13)

---

## Mobile (cross-phase)

The Expo app (`apps/mobile`) currently shows scaffold only. Mobile parity with web:

- [ ] Search screen — text + allergen filter, results list
- [ ] Place detail screen — allergen grid, reports, reviews, one-tap call/directions
- [ ] "Near me now" — location-aware search, requires PostGIS (Phase 3)
- [ ] Offline capability for core data (Phase 3)
- [ ] Auth flows (Phase 2b dependency)

---

## Open Architectural Decisions

From spec §13 — decisions still to be made before the relevant features are built:

| # | Decision | Needed for | Notes |
|---|----------|-----------|-------|
| C | Offline data strategy | Mobile (Phase 3) | Which data is cached, sync mechanism, conflict resolution |
| D | PostGIS geo query design | Near-me search (Phase 3) | Full `ST_DWithin` query with allergen join and completeness sort |
| E | Media upload flow | Photo attachments on reviews | Client-side resize, Supabase Storage bucket structure |
| F | Rate limiting | All contribution endpoints | Per-IP and per-user limits |
| G | Moderation model | Disputes (Phase 2d) | Community moderators, core team, or tiered |

---

## Non-Code Items

- [ ] Recruit 10–20 founding contributors from Toronto allergy community (Reddit, Facebook groups, Anaphylaxis Canada)
- [ ] Replace fictional seed data with real Toronto restaurants
- [ ] Restaurant outreach — engage allergy-aware restaurants in their listings
- [ ] Choose open source licence (MIT / Apache 2.0 / AGPL)
- [ ] Non-profit structure — formalise post-MVP
