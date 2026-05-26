# Allergy Travel Platform — Product Specification

**Version:** 0.6
**Date:** 2026-05-26
**Status:** Active development — Phases 1 and 2 complete, Phase 3 in progress
**Author:** Lippman
**License:** Open Source (TBD)

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2026-05-23 | Initial draft — problem statement, vision, modes, phases, place schema, community layer, ERD |
| 0.2 | 2026-05-23 | Added allergen vocabulary (Section 11), allergen reference table schema (Section 12), updated ERD, resolved open question #1 |
| 0.3 | 2026-05-23 | Added system architecture (Section 13) — full stack decisions, monorepo structure, Fastify API design, Supabase Auth and RLS model. Resolved open questions #2 and #4. |
| 0.4 | 2026-05-23 | Completed architecture detail — Turborepo scaffold (Section 13.1), root config files, pipeline, shared package layout, full RLS policy SQL with privileged DB functions (Section 13.2). Resolved architecture decisions A and B. |
| 0.5 | 2026-05-23 | GitHub repository scaffolded and ready to push. Setup instructions documented. Section 6 updated with repository reference. Next step #4 marked complete. |
| 0.6 | 2026-05-26 | Phases 1 and 2 fully built. Phase 3 language cards complete; cross-reactivity, geo search, and offline cache remaining. UI design system implemented (spec v1.1 in `allergynav-design-spec.md`). Section 6 and Section 17 updated to reflect current state. |

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Vision and Mission](#2-vision-and-mission)
3. [Platform Philosophy](#3-platform-philosophy)
4. [Target Users](#4-target-users)
5. [Platform Modes](#5-platform-modes)
6. [Build Phases](#6-build-phases)
7. [The Three Tenets](#7-the-three-tenets)
8. [Data Architecture — Place Record](#8-data-architecture--place-record)
9. [Data Architecture — Community Experience Layer](#9-data-architecture--community-experience-layer)
10. [Entity Relationship Model — Full Schema](#10-entity-relationship-model--full-schema)
11. [Allergen Vocabulary](#11-allergen-vocabulary)
12. [Data Architecture — Allergen Reference Tables](#12-data-architecture--allergen-reference-tables)
13. [System Architecture](#13-system-architecture)
14. [Trust and Safety Model](#14-trust-and-safety-model)
15. [Launch Strategy](#15-launch-strategy)
16. [Open Questions](#16-open-questions)
17. [Next Steps](#17-next-steps)

---

## 1. Problem Statement

Food allergies — particularly peanut, tree nut, and dairy — have become significantly more prevalent in children over the past four decades. For families managing severe allergies, travel introduces life-threatening risk at every meal. Finding safe food while travelling, especially internationally, is one of the most stressful aspects of any trip.

Current tools — general review platforms like Yelp or TripAdvisor — are not designed for this use case. They offer no allergen-specific filtering, no cross-contamination context, no recency signals tied to safety, and no community of people who understand the stakes.

Parents and individuals managing severe allergies accumulate hard-won, highly valuable knowledge through their travels. That knowledge currently disappears after the trip. There is no shared, community-owned repository where it can be preserved, enriched, and made available to others facing the same challenges.

---

## 2. Vision and Mission

**Vision:** A world where no family has to face the anxiety of finding safe food alone when travelling.

**Mission:** To build a free, open source, community-driven platform where people with food allergies share knowledge and experience to help each other travel safely and confidently.

**Model:** Non-profit. Open source. Community governed. No advertising. People helping people.

---

## 3. Platform Philosophy

- **Community first.** The platform exists to serve its contributors and users, not to generate revenue.
- **Safety over completeness.** An honest "unknown" is always better than a false positive.
- **Transparency.** Every data point carries its source, method, and age. Nothing is presented as authoritative without community verification.
- **Low barrier to contribute.** Adding a place at Layer 1 takes minutes. Depth accumulates over time.
- **No liability claims.** All content is community experience, not medical advice. The platform reinforces this clearly and consistently.

---

## 4. Target Users

### Primary Users
- Parents of children with severe food allergies planning or undertaking travel
- Adults managing their own severe food allergies while travelling

### Secondary Users
- Allergy-aware restaurants and vendors who want to be discoverable by this community
- Allergy advocacy organisations seeking to direct their communities to useful tools

### Pilot Community
- Toronto, Ontario, Canada
- English-speaking, initial launch
- Outreach via Toronto allergy communities, Reddit (r/FoodAllergies), and organisations such as Anaphylaxis Canada

---

## 5. Platform Modes

The platform is designed to serve users in two distinct contexts that share the same underlying data.

### Planning Mode
Used before a trip, typically on desktop or browser.

- Search by destination and allergen combination
- Browse curated destination guides
- Save and bookmark places to a trip itinerary
- Read community discussion threads by city or cuisine type
- Research cross-contamination risks by cuisine

### In-the-Moment Mode
Used while travelling, on mobile, location-aware.

- "Near me now" search filtered by allergen profile
- Quick-reference cards for each place — key info without scrolling
- Offline capability for core data (critical for international travel with unreliable data)
- One-tap to call or get directions

---

## 6. Build Phases

The platform is built in three sequential phases. Each phase delivers standalone value and enables the next.

### Phase 1 — The Data Foundation ✅ Complete
**Goal:** Build and validate the core place database in Toronto.

- Structured place records with allergen data (layered model — see Section 8)
- Allergen reference tables seeded with Health Canada vocabulary (see Sections 11–12)
- 25 seed Toronto restaurants with allergen profiles
- API: full Place CRUD, allergen upsert/remove, text + allergen search
- Web: homepage, search, place detail, add-place form
- Full Turborepo monorepo, Prisma schema, GitHub Actions CI, Supabase Auth + RLS

### Phase 2 — The Community Layer ✅ Complete
**Goal:** Transform the directory into a living, community-driven platform.

- Structured reports and narrative reviews attached to place records
- Contributor profiles and trust scoring (40% volume + 40% helpful votes + 20% account age)
- Helpful votes, outdated flags, dispute raising
- Staleness detection — reports/reviews older than 12 months flagged
- Auth: Supabase email/password + magic link, ES256 JWT verified via JWKS with `jose`
- Web: sign-up/sign-in, report form, review form, contributor profile page, profile edit

### Phase 3 — The Knowledge Base (in progress)
**Goal:** Add contextual, evergreen travel intelligence.

- ✅ Language cards — 9 allergens × 8 languages, print-friendly at `/language-cards`
- ⬜ Cross-reactivity warnings surfaced in search and place detail
- ⬜ Destination guides — city-level allergy travel tips (Toronto pilot)
- ⬜ Cuisine guides — cultural context, common hidden allergens by cuisine type
- ⬜ PostGIS geo search — "near me now" via `ST_DWithin` (architecture item D, §13)
- ⬜ Offline cache for mobile — core place + allergen data (architecture item C, §13)

---

## 7. The Three Tenets

The platform is built around three core data types, layered in order of priority:

| Tenet | Description | Phase |
|-------|-------------|-------|
| **Places** | Restaurants, vendors, markets with allergy-relevant information | Phase 1 |
| **Experiences** | Community reviews and reports tied to those places | Phase 2 |
| **Knowledge** | Destination guides, cuisine tips, language resources | Phase 3 |

---

## 8. Data Architecture — Place Record

Place records use a layered data model. Each layer builds on the previous. A record is valid at any layer — depth accumulates over time through community contribution.

### Layer 1 — Existence (Core)
*Minimal viable record. Fast to create.*

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `name` | string | Restaurant or vendor name |
| `address` | string | Full address |
| `latitude` | float | For geo search |
| `longitude` | float | For geo search |
| `cuisine_type` | string | e.g. Thai, Italian, bakery |
| `phone` | string | Contact |
| `website` | string | Contact |
| `hours` | string | Operating hours |
| `allergen_aware` | enum | `yes` / `no` / `unknown` |
| `date_added` | timestamp | Seed timestamp |
| `added_by_contributor_id` | UUID FK | Contributor reference |

### Layer 2 — Specificity
*Which allergens, which accommodations.*

Managed via the `PLACE_ALLERGEN` child table (one row per allergen per place):

| Field | Type | Notes |
|-------|------|-------|
| `allergen_id` | UUID FK | References `ALLERGEN` table (see Section 12) |
| `accommodation_level` | enum | `aware` / `menu_options` / `dedicated_section` |
| `dedicated_kitchen` | boolean | Full or partial separation |
| `shared_fryer_risk` | boolean | Cross-contact flag |
| `staff_training_level` | enum | `none` / `basic` / `trained` / `certified` |

### Layer 3 — Confidence
*Kitchen practices, cross-contamination specifics.*

Extended fields on `PLACE_ALLERGEN`:

| Field | Type | Notes |
|-------|------|-------|
| `notes` | text | Free-text kitchen practice notes |
| `confidence_level` | enum | `low` / `medium` / `high` |

### Layer 4 — Verification
*Who confirmed it, when, and how.*

| Field | Type | Notes |
|-------|------|-------|
| `last_verified` | timestamp | Most recent verification |
| `verification_method` | enum | `menu_review` / `staff_conversation` / `chef_conversation` |
| `verified_by_contributor_id` | UUID FK | Contributor reference |
| `community_confirmations` | int | Count of supporting reports |
| `completeness_score` | float | Derived: proportion of layers populated |

---

## 9. Data Architecture — Community Experience Layer

Two parallel record types attach to each place. Both are authored by contributors.

### Structured Report
*Factual, field-based. Machine-readable. Powers search and safety scoring.*

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `place_id` | UUID FK | Place reference |
| `contributor_id` | UUID FK | Author reference |
| `allergens_confirmed` | UUID[] | FK array referencing `ALLERGEN` table |
| `reaction_status` | enum | `none` / `near_miss` / `reaction_occurred` |
| `verification_method` | enum | `menu_review` / `staff_conversation` / `chef_conversation` |
| `visit_date` | date | Recency signal |
| `party_type` | enum | `child` / `adult` / `mixed` |
| `severity_level` | enum | `intolerance` / `allergy` / `anaphylactic` |
| `language_used` | string | How the allergy was communicated |
| `created_at` | timestamp | Submission timestamp |

### Narrative Review
*Human voice, free text. Builds trust and community.*

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `place_id` | UUID FK | Place reference |
| `contributor_id` | UUID FK | Author reference |
| `experience_text` | text | Free-form account of the visit |
| `safety_rating` | int | 1–5, allergy-specific (not general food quality) |
| `tips` | text | What to ask, what to avoid, what to order |
| `photo_urls` | string[] | Menu photos, ingredient labels, dishes |
| `cuisine_context` | text | Cultural allergy notes relevant to this cuisine |
| `would_return` | enum | `yes` / `no` / `unsure` |
| `created_at` | timestamp | Submission timestamp |

### Contributor Profile
*Attached to every entry. Pseudonymous by default.*

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `display_name` | string | Pseudonymous handle |
| `allergen_profile` | UUID[] | FK array referencing `ALLERGEN` table |
| `contribution_count` | int | Total entries submitted |
| `trust_score` | float | Derived — never directly editable |
| `verified_parent` | boolean | Optional community badge |
| `member_since` | timestamp | Account age signal |

---

## 10. Entity Relationship Model — Full Schema

```
ALLERGEN_FAMILY   ||--o{ ALLERGEN                  : "groups"
ALLERGEN          ||--o{ ALLERGEN                  : "parent of"
ALLERGEN          ||--o{ ALLERGEN_SYNONYM           : "has"
ALLERGEN          ||--o{ ALLERGEN_CROSS_REACTIVITY  : "involved in"
ALLERGEN          ||--o{ PLACE_ALLERGEN             : "referenced by"
PLACE             ||--o{ PLACE_ALLERGEN             : "has"
PLACE             ||--o{ STRUCTURED_REPORT          : "receives"
PLACE             ||--o{ NARRATIVE_REVIEW           : "receives"
CONTRIBUTOR       ||--o{ STRUCTURED_REPORT          : "authors"
CONTRIBUTOR       ||--o{ NARRATIVE_REVIEW           : "authors"
CONTRIBUTOR       ||--o{ TRUST_SIGNAL               : "casts"
CONTRIBUTOR       ||--o{ DISPUTE                    : "raises"
STRUCTURED_REPORT ||--o{ TRUST_SIGNAL               : "receives"
NARRATIVE_REVIEW  ||--o{ TRUST_SIGNAL               : "receives"
STRUCTURED_REPORT ||--o{ DISPUTE                    : "subject of"
NARRATIVE_REVIEW  ||--o{ DISPUTE                    : "subject of"
```

### Trust Signal
*Polymorphic — attaches to either report or review.*

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `target_id` | UUID FK | Report or review ID |
| `target_type` | enum | `structured_report` / `narrative_review` |
| `contributor_id` | UUID FK | Who cast the signal |
| `signal_type` | enum | `helpful` / `confirm` / `outdated` |
| `created_at` | timestamp | |

### Dispute
*Polymorphic — attaches to either report or review.*

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `target_id` | UUID FK | Report or review ID |
| `target_type` | enum | `structured_report` / `narrative_review` |
| `raised_by` | UUID FK | Contributor who raised it |
| `reason` | text | Description of dispute |
| `status` | enum | `open` / `resolved` / `dismissed` |
| `created_at` | timestamp | |

---

## 11. Allergen Vocabulary

The allergen vocabulary is anchored to Health Canada's priority allergen list, which covers the substances responsible for more than 90% of severe allergic reactions in Canada. It is extended with gluten sources, which Health Canada requires to be declared alongside priority allergens.

### Severity Profiles

| Profile | Code | Description |
|---------|------|-------------|
| Anaphylactic risk | `ana` | IgE-mediated, potentially life-threatening. Strongest warnings. |
| Variable severity | `var` | Can range from mild to severe. Context-dependent warnings. |
| Sensitivity / additive | `add` | Not IgE-mediated but requires declaration. Distinct UI treatment. |

### Allergen Family Groups

| Family | Code | Members |
|--------|------|---------|
| Legume | `legume` | Peanut, Soy |
| Tree nut | `nut` | Almond, Brazil nut, Cashew, Hazelnut, Macadamia, Pecan, Pine nut, Pistachio, Walnut |
| Dairy | `dairy` | Milk |
| Egg | `egg` | Egg |
| Seafood | `seafood` | Fish, Crustaceans, Molluscs |
| Grain | `grain` | Wheat/Triticale, Gluten sources |
| Seed | `seed` | Sesame, Mustard |
| Additive | `additive` | Sulphites |

### Canonical Allergen Codes and Hidden Names

#### PNUT — Peanut
*Family: Legume | Severity: Anaphylactic risk*

Hidden names: Arachis oil, Arachis hypogaea, Groundnut, Groundnut oil, Mixed nuts, Monkey nuts, Beer nuts, Mandelonas, Artificial nuts.

> Peanuts are legumes, not tree nuts. Cross-reactivity with tree nuts is common but not universal. Prevalent in: satay sauce, mole sauce, pad thai, many Asian cuisines.

---

#### MILK — Milk
*Family: Dairy | Severity: Anaphylactic risk*

Hidden names: Casein, Caseinate, Whey, Lactalbumin, Lactoglobulin, Lactose, Lactulose, Butter, Ghee, Cream, Curds, Rennet, Lactoferrin, Hydrolysed casein, Milk solids, Milk powder, Nougat, Caramel.

> Casein and whey are the two main milk proteins. Ghee is clarified butter — still contains milk protein. Lactose-free products may still contain milk protein.

---

#### EGG — Egg
*Family: Egg | Severity: Anaphylactic risk*

Hidden names: Albumin, Globulin, Lysozyme, Mayonnaise, Meringue, Ovalbumin, Ovomucin, Ovomucoid, Ovovitellin, Silici albuminate, Livetin, Lecithin (if egg-derived), Egg solids.

> Egg white proteins are more allergenic than yolk. Lecithin can be egg or soy derived — always check source. Found in: glazed pastries, pasta, ice cream, marshmallows.

---

#### WHEAT — Wheat / Triticale
*Family: Grain | Severity: Variable severity*

Hidden names: Semolina, Spelt, Kamut, Einkorn, Emmer, Farro, Durum, Triticale, Bulgur, Farina, Graham flour, Gluten, Seitan, Modified food starch (if wheat-derived), Hydrolysed vegetable protein (if wheat-derived).

> Wheat allergy is distinct from celiac disease. Triticale is a wheat-rye hybrid. Spelt and kamut are ancient wheat varieties — not safe for wheat allergy.

---

#### SOY — Soy
*Family: Legume | Severity: Variable severity*

Hidden names: Edamame, Miso, Natto, Tempeh, Tofu, Soya, Soy protein isolate, Textured vegetable protein (TVP), Hydrolysed soy protein, Soy sauce, Tamari, Shoyu, Soy lecithin, Soy flour, Kinako, Yuba.

> Highly refined soy oil may be tolerated by some. Cross-reactivity with peanut possible but not guaranteed. Found extensively in processed foods.

---

#### SES — Sesame
*Family: Seed | Severity: Anaphylactic risk*

Hidden names: Tahini, Tahina, Tehina, Til / Teel, Gingelly oil, Benne seed, Sesame oil, Sesame flour, Simsin, Sesame paste, Gomashio, Hummus (contains tahini).

> Sesame oil is highly allergenic — even small amounts can trigger reactions. Pervasive in Middle Eastern, Asian, and increasingly Western cuisine. Often hidden in spice mixes.

---

#### MUST — Mustard
*Family: Seed | Severity: Anaphylactic risk*

Hidden names: Mustard seed, Mustard flour, Mustard oil, Mustard powder, Mustard leaves / greens, Prepared mustard, Mustard sprouts, Sinapis, Canola proteins (cross-reactive).

> Often found in: salad dressings, marinades, spice blends, deli meats, pickles. Health Canada notes possible cross-reactivity with canola proteins.

---

#### FISH — Fish (Finfish)
*Family: Seafood | Severity: Anaphylactic risk*

Hidden names: Anchovies, Worcestershire sauce, Caesar dressing, Fish sauce, Nam pla, Nuoc mam, Bouillabaisse, Surimi (imitation crab), Omega-3 supplements (fish-derived), Gelatine (fish-derived), Isinglass.

> Isinglass is a fish-derived fining agent used in some beers and wines. Fish sauce is a base ingredient in many Southeast and East Asian cuisines.

---

#### CRUST — Crustaceans
*Family: Seafood | Severity: Anaphylactic risk*

Hidden names: Shrimp paste, Belacan, Kapi, Terasi, Prawn crackers, Shrimp chips, Seafood flavouring, Surimi, Tom yum paste, Laksa paste.

> Shrimp paste is a base ingredient in many Southeast Asian curry pastes — often invisible in the final dish. Cross-contamination risk is extremely high in seafood restaurants.

---

#### MOLL — Molluscs
*Family: Seafood | Severity: Anaphylactic risk*

Hidden names: Clams, Mussels, Oysters, Scallops, Squid / Calamari, Octopus, Abalone, Oyster sauce, Squid ink, Escargot.

> Molluscs and crustaceans are different allergen groups. Oyster sauce is common in Chinese cooking and often not declared prominently.

---

#### TN-ALM — Almond
*Family: Tree nut | Severity: Anaphylactic risk | Parent: TREE_NUT*

Hidden names: Almond oil, Almond flour, Almond paste, Marzipan, Frangipane, Amaretto, Orgeat syrup, Persipan.

> Marzipan and frangipane are almond paste-based — common in European pastries. Amaretto and orgeat (cocktail syrup) are almond-derived.

---

#### TN-CSH — Cashew
*Family: Tree nut | Severity: Anaphylactic risk | Parent: TREE_NUT*

Hidden names: Cashew butter, Cashew cheese (vegan products), Kaju, Anacardium.

> Strong cross-reactivity with pistachios (same botanical family). Possible cross-reactivity with mango and poison ivy proteins in rare cases.

---

#### TN-WAL — Walnut
*Family: Tree nut | Severity: Anaphylactic risk | Parent: TREE_NUT*

Hidden names: Walnut oil, English walnut, Persian walnut, Black walnut, White walnut / Butternut, Juglans.

> Strong cross-reactivity with pecans (same Juglandaceae family). Walnut oil can trigger reactions even in refined form.

---

#### TN-HAZ — Hazelnut
*Family: Tree nut | Severity: Anaphylactic risk | Parent: TREE_NUT*

Hidden names: Filbert, Cobnut, Praline, Nutella and similar spreads, Gianduja chocolate, Frangelico liqueur, Corylus.

> Cross-reactivity with birch pollen (oral allergy syndrome) is common. Gianduja is a chocolate-hazelnut blend used in premium chocolates.

---

#### TN-PEC — Pecan
*Family: Tree nut | Severity: Anaphylactic risk | Parent: TREE_NUT*

Hidden names: Pecan oil, Hickory nut (related species), Carya.

> Strong cross-reactivity with walnuts (same family). Often found in baked goods, pralines, and pie fillings.

---

#### TN-PST — Pistachio
*Family: Tree nut | Severity: Anaphylactic risk | Parent: TREE_NUT*

Hidden names: Pistachio oil, Pistachio butter, Pistachio paste, Green nut, Pistacia.

> Strong cross-reactivity with cashews (same Anacardiaceae family). Found in baklava, Middle Eastern sweets, ice cream, and spice mixes.

---

#### TN-BRZ — Brazil nut
*Family: Tree nut | Severity: Anaphylactic risk | Parent: TREE_NUT*

Hidden names: Para nut, Cream nut, Castanha-do-Pará, Bertholletia.

> One of the most potent nut allergens by protein concentration. Often found in mixed nut products.

---

#### TN-MAC — Macadamia nut
*Family: Tree nut | Severity: Anaphylactic risk | Parent: TREE_NUT*

Hidden names: Queensland nut, Bush nut, Maroochi nut, Hawaii nut, Macadamia oil.

> Found in cookies, chocolate confections, and tropical cuisine. Less common allergy but can cause severe reactions.

---

#### TN-PIN — Pine nut
*Family: Tree nut | Severity: Variable severity | Parent: TREE_NUT*

Hidden names: Pignolia, Pinon nut, Indian nut, Cedar nut, Pinus. Found in: traditional pesto.

> Note: Pine nut syndrome (temporary bitter/metallic taste for days after consumption) is not an allergic reaction. True pine nut allergy is less common than other tree nuts.

---

#### SULF — Sulphites
*Family: Additive | Severity: Sensitivity (not IgE-mediated)*

Hidden names: Sulphur dioxide (SO₂), Sodium sulphite (E221), Sodium bisulphite (E222), Sodium metabisulphite (E223), Potassium metabisulphite (E224), Potassium sulphite (E225), Potassium bisulphite (E228), Sulphurous acid.

> Found in: wine, beer, dried fruit, deli meats, pickled foods, some medications. Not a true allergy — reactions can still include severe asthma and anaphylaxis-like symptoms.

---

#### GLUT — Gluten sources
*Family: Grain | Severity: Celiac / sensitivity*

Hidden names: Barley malt, Malt extract, Malt vinegar, Rye flour, Oats (cross-contamination risk), Triticale, Spelt, Kamut, Einkorn, Emmer, Beer (barley-based), Ale, Lager, Communion wafers.

> Not classified as an allergen by Health Canada but requires identical mandatory declaration. Relevant for celiac disease and non-celiac gluten sensitivity. Oats are inherently gluten-free but frequently cross-contaminated.

---

### Cross-Reactivity Map

| Allergen A | Allergen B | Confidence | Notes |
|------------|------------|------------|-------|
| TN-CSH (Cashew) | TN-PST (Pistachio) | Established | Same Anacardiaceae family |
| TN-WAL (Walnut) | TN-PEC (Pecan) | Established | Same Juglandaceae family |
| PNUT (Peanut) | SOY (Soy) | Probable | Both legumes |
| TN-HAZ (Hazelnut) | Birch pollen | Established | Oral allergy syndrome |
| MUST (Mustard) | Canola protein | Probable | Health Canada noted |
| FISH (Fish) | CRUST (Crustaceans) | Possible | Species-dependent |

---

## 12. Data Architecture — Allergen Reference Tables

### ALLERGEN_FAMILY

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `code` | string | e.g. `legume`, `nut`, `dairy` |
| `label` | string | Display name e.g. "Tree nut" |
| `description` | text | Brief description for UI tooltips |

### ALLERGEN

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `code` | string | Canonical code e.g. `PNUT`, `TN-ALM` |
| `canonical_name` | string | Official name e.g. "Peanut" |
| `common_name` | string | Plain language name for UI display |
| `family_id` | UUID FK | References `ALLERGEN_FAMILY` |
| `severity_profile` | enum | `ana` / `var` / `add` |
| `is_health_canada_priority` | boolean | Whether on Health Canada priority list |
| `is_sub_allergen` | boolean | True for tree nut sub-types (TN-*) |
| `parent_allergen_id` | UUID FK | Self-reference — e.g. TN-ALM → TREE_NUT |
| `cuisine_risk_notes` | text | Where this allergen is commonly hidden by cuisine |
| `active` | boolean | Soft delete / disable without data loss |

> The `parent_allergen_id` self-reference enables hierarchy: a user selecting "tree nut allergy" automatically inherits all nine `TN-*` sub-allergens. A user with cashew allergy only sets `TN-CSH`. Query logic handles the traversal.

### ALLERGEN_SYNONYM

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `allergen_id` | UUID FK | References `ALLERGEN` |
| `synonym` | string | The alternate name e.g. "Arachis oil" |
| `synonym_type` | enum | `scientific_name` / `common_name` / `ingredient_label` / `regional_name` / `brand_name` / `e_number` |
| `language_code` | string | ISO 639-1 e.g. `en`, `fr`, `th` |
| `region_note` | string | Optional — e.g. "used in Southeast Asia" |

> The `synonym_type` enum is critical for UI treatment. An `ingredient_label` synonym like "Arachis oil" warrants a warning when scanning a menu photo. A `scientific_name` like "Arachis hypogaea" is useful for advanced search. A `regional_name` like "Kaju" is valuable when travelling and reading menus in other languages.

### ALLERGEN_CROSS_REACTIVITY

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `allergen_id_a` | UUID FK | First allergen |
| `allergen_id_b` | UUID FK | Second allergen |
| `confidence_level` | enum | `established` / `probable` / `possible` |
| `clinical_notes` | text | Source and context for the cross-reactivity |

> This table powers the UI warning: "You marked cashew allergy — note that pistachios are in the same botanical family." Confidence levels map directly to warning prominence.

---

## 13. System Architecture

### Status
**Complete.** Stack selected, monorepo scaffold defined, config files documented, full RLS policy SQL written with privileged DB functions. Five architecture decisions remain open — see updated status table at end of this section. Foundation is locked; MVP build can begin.

---

### Guiding constraints

All architecture decisions were made against these constraints:

- **Open source and contributor-friendly** — no proprietary or exotic technology that raises the barrier to contribution
- **Non-profit budget** — free tiers at launch, minimal operational cost until community-funded
- **Solo founder initially** — the architecture must be buildable and maintainable by one developer
- **Vibe coding first** — the entire stack is a first-class target for Cursor and Claude Code
- **Mobile is first-class** — the in-the-moment use case cannot be an afterthought

---

### Selected stack

| Layer | Technology | Hosting | Rationale |
|-------|-----------|---------|-----------|
| Monorepo | Turborepo | — | One repo for web, mobile, API, shared types |
| Web frontend | Next.js + Tailwind CSS | Vercel | SSR for SEO, App Router, best-supported by AI tools |
| Mobile | React Native + Expo | EAS Build | iOS + Android from one codebase, OTA updates |
| API | Fastify + TypeScript | Railway | 3-4× Express performance, schema-first, plugin architecture |
| ORM | Prisma | — | Type-safe queries generated from schema |
| Validation | Zod | — | Shared schemas across frontend, API, and mobile |
| Database | PostgreSQL + PostGIS | Supabase | Relational, UUID-native, geo search via PostGIS |
| Auth | Supabase Auth | Supabase | JWT, email, magic link, social login, RLS integration |
| Media storage | Supabase Storage | Supabase | Menu photos and ingredient label images |
| CI/CD | GitHub Actions | — | Automated test and deploy on push to main |

Total hosting cost at launch: effectively zero across all free tiers.

---

### Monorepo structure (Turborepo)

**Package manager:** pnpm. In a monorepo with three apps importing shared code, pnpm's workspace hard-linking is significantly faster than npm and more reliable than yarn. All workspace references use `workspace:*`.

**Approach:** Lean shared package. Only TypeScript types, Zod schemas, allergen vocabulary constants, and minimal utilities. Business logic stays inside each app. Apps never import from each other — only from `packages/shared`.

```
/ (repo root)
├── turbo.json                  # pipeline config — see below
├── package.json                # workspace declarations, pnpm
├── .github/
│   └── workflows/
│       └── ci.yml              # lint, type-check, test on every push
├── apps/
│   ├── web/                    # Next.js + Tailwind — planning mode
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── places/
│   │   │   │   └── [id]/page.tsx
│   │   │   └── search/
│   │   │       └── page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── api-client.ts   # generated from OpenAPI spec
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── mobile/                 # React Native + Expo — in-the-moment mode
│   │   ├── app/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── place/
│   │   │   │   └── [id].tsx
│   │   │   └── search.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── api-client.ts   # generated from OpenAPI spec
│   │   │   └── offline-cache.ts
│   │   ├── app.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/                    # Fastify REST API
│       ├── src/
│       │   ├── server.ts
│       │   ├── plugins/
│       │   │   ├── auth.ts
│       │   │   └── prisma.ts
│       │   └── routes/
│       │       ├── places.ts
│       │       ├── allergens.ts
│       │       ├── reports.ts
│       │       ├── reviews.ts
│       │       └── contributors.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── package.json
│       └── tsconfig.json
└── packages/
    └── shared/                 # imported by all three apps
        ├── src/
        │   ├── index.ts        # barrel export
        │   ├── types/
        │   │   ├── place.ts
        │   │   ├── allergen.ts
        │   │   ├── review.ts
        │   │   └── contributor.ts
        │   ├── schemas/        # Zod schemas — mirror types/
        │   │   ├── place.ts
        │   │   ├── allergen.ts
        │   │   ├── review.ts
        │   │   └── contributor.ts
        │   ├── allergens/
        │   │   ├── vocabulary.ts       # all 21 allergen records
        │   │   └── cross-reactivity.ts # cross-reactivity pairs
        │   ├── constants/
        │   │   └── allergen-codes.ts   # PNUT, MILK, TN-ALM etc.
        │   └── utils/
        │       ├── formatting.ts
        │       └── date-helpers.ts
        ├── package.json
        └── tsconfig.json
```

---

### Root configuration files

**`/package.json`** — workspace declarations and root scripts:

```json
{
  "name": "allergy-platform",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev":    "turbo run dev",
    "build":  "turbo run build",
    "lint":   "turbo run lint",
    "test":   "turbo run test",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "turbo":      "latest",
    "typescript": "^5",
    "prettier":   "latest",
    "eslint":     "latest"
  },
  "packageManager": "pnpm@9"
}
```

**`/turbo.json`** — task pipeline and caching rules:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": [
    "DATABASE_URL", "SUPABASE_URL", "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY", "NODE_ENV"
  ],
  "tasks": {
    "build":      { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"], "cache": true },
    "dev":        { "dependsOn": ["^build"], "cache": false, "persistent": true },
    "lint":       { "dependsOn": ["^build"], "cache": true },
    "test":       { "dependsOn": ["^build"], "cache": true, "outputs": ["coverage/**"] },
    "type-check": { "dependsOn": ["^build"], "cache": true }
  }
}
```

Key points:
- `"^build"` means build all dependencies first — `shared` always builds before any app
- `globalEnv` declares environment variables that affect output — Turbo invalidates cache when they change
- `dev` is `persistent: true` — a long-running watch process, never cached
- Mobile is excluded from server-side build — Expo EAS Build handles it separately

**`/packages/shared/package.json`** — the shared package:

```json
{
  "name":    "@allergy-platform/shared",
  "version": "0.0.1",
  "private": true,
  "main":    "./dist/index.js",
  "types":   "./dist/index.d.ts",
  "exports": { ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" } },
  "scripts": { "build": "tsc", "dev": "tsc --watch" },
  "dependencies":    { "zod": "^3" },
  "devDependencies": { "typescript": "^5" }
}
```

Zod is the only runtime dependency in shared — keeps the package lean and importable by all three apps without version conflicts.

**Referencing shared from an app** — `apps/api/package.json`:

```json
{
  "name": "@allergy-platform/api",
  "dependencies": {
    "@allergy-platform/shared": "workspace:*",
    "fastify":          "^5",
    "@fastify/jwt":     "latest",
    "@fastify/cors":    "latest",
    "@fastify/swagger": "latest",
    "@prisma/client":   "latest",
    "zod":              "^3"
  },
  "devDependencies": {
    "prisma":     "latest",
    "tsx":        "latest",
    "typescript": "^5"
  }
}
```

The `workspace:*` reference resolves to the live local source during development. Change a type in shared, rebuild shared, and all three apps see the change immediately.

---

### Row Level Security (RLS) policies

RLS is enabled on every table. The authenticated user's JWT is available inside policies as `auth.uid()` — Supabase wires this automatically. All policies are defined before any application code is written and tested in the Supabase dashboard by impersonating users.

**Enable RLS on all tables:**

```sql
ALTER TABLE place              ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_allergen     ENABLE ROW LEVEL SECURITY;
ALTER TABLE structured_report  ENABLE ROW LEVEL SECURITY;
ALTER TABLE narrative_review   ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributor        ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_signal       ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute            ENABLE ROW LEVEL SECURITY;
```

#### place

```sql
-- Anyone can read place listings
CREATE POLICY place_public_read ON place
  FOR SELECT USING (true);

-- Must be authenticated; contributor_id must match session user
CREATE POLICY place_authenticated_insert ON place
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND added_by_contributor_id = auth.uid()
  );

-- Original contributor, or trust score ≥ 0.7
CREATE POLICY place_core_fields_update ON place
  FOR UPDATE USING (
    added_by_contributor_id = auth.uid()
    OR (SELECT trust_score FROM contributor WHERE id = auth.uid()) >= 0.7
  );
-- Note: verification fields (last_verified etc.) are updated
-- via a privileged DB function, never by direct UPDATE.
```

#### place_allergen

```sql
CREATE POLICY place_allergen_public_read ON place_allergen
  FOR SELECT USING (true);

-- Allergen data is sensitive — require minimal trust before adding
CREATE POLICY place_allergen_trusted_insert ON place_allergen
  FOR INSERT WITH CHECK (
    (SELECT trust_score FROM contributor WHERE id = auth.uid()) >= 0.4
  );
```

#### structured_report

```sql
-- Soft-deleted reports are invisible to the public
CREATE POLICY report_public_read ON structured_report
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY report_authenticated_insert ON structured_report
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND contributor_id = auth.uid()
  );

-- Owner may only set deleted_at — hard DELETE is blocked
-- API route handler enforces deleted_at-only constraint before this runs
CREATE POLICY report_owner_soft_delete ON structured_report
  FOR UPDATE USING  (contributor_id = auth.uid())
  WITH CHECK        (contributor_id = auth.uid());
```

#### narrative_review

```sql
CREATE POLICY review_public_read ON narrative_review
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY review_authenticated_insert ON narrative_review
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND contributor_id = auth.uid()
  );

CREATE POLICY review_owner_soft_delete ON narrative_review
  FOR UPDATE USING  (contributor_id = auth.uid())
  WITH CHECK        (contributor_id = auth.uid());
```

#### contributor

```sql
CREATE POLICY contributor_public_read ON contributor
  FOR SELECT USING (true);

-- Owner may update display_name and allergen_profile only
-- API route handler restricts which columns can be SET
-- trust_score and contribution_count are updated by privileged DB functions only
CREATE POLICY contributor_owner_update ON contributor
  FOR UPDATE USING  (id = auth.uid())
  WITH CHECK        (id = auth.uid());
```

#### trust_signal and dispute

```sql
-- Public read, authenticated insert, no UPDATE or DELETE
-- Records are immutable once cast — preserves audit trail
CREATE POLICY trust_signal_public_read ON trust_signal
  FOR SELECT USING (true);

CREATE POLICY trust_signal_authenticated ON trust_signal
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND contributor_id = auth.uid()
  );

CREATE POLICY dispute_public_read ON dispute
  FOR SELECT USING (true);

CREATE POLICY dispute_authenticated ON dispute
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND raised_by = auth.uid()
  );
-- Dispute status is updated by service role only (moderation tooling)
```

#### Privileged DB functions (SECURITY DEFINER)

These functions run as the database owner and bypass RLS. They are called by triggers, never directly by the API.

**`handle_new_user()` — auto-creates contributor row on registration:**

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO contributor (id, display_name, member_since)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name',
             'contributor_' || LEFT(NEW.id::text, 8)),
    NOW()
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
-- Fires on every registration: email, magic link, social, anonymous
```

**`update_contributor_trust_score()` — recalculates trust score:**

```sql
CREATE OR REPLACE FUNCTION update_contributor_trust_score(
  p_contributor_id UUID
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_score FLOAT;
BEGIN
  SELECT LEAST(1.0,
    (contribution_count::float / 20) * 0.4   -- 40% weight, caps at 20
    + (helpful_votes::float  / 50) * 0.4      -- 40% weight, caps at 50
    + (EXTRACT(EPOCH FROM (NOW() - member_since))
       / 31536000) * 0.2                       -- 20% weight, caps at 1 year
  )
  INTO v_score
  FROM contributor WHERE id = p_contributor_id;

  UPDATE contributor SET trust_score = v_score WHERE id = p_contributor_id;
END;
$$;
-- Called by trigger after every INSERT on structured_report,
-- narrative_review, and trust_signal
```

**Trust score formula:** 40% contribution volume (caps at 20 contributions) + 40% helpful votes received (caps at 50) + 20% account age (caps at 1 year). Maximum score 1.0. Resistant to gaming — a new account flooding reports cannot achieve high trust without the age and vote components.

---

### Architecture decisions — updated status

| # | Decision | Status | Notes |
|---|----------|--------|-------|
| A | Monorepo scaffold detail | ✅ Complete | Full folder structure, config files, pipeline above |
| B | Full RLS policy definitions | ✅ Complete | All tables, SQL above, privileged functions defined |
| C | Offline data strategy | Open | Mobile cache strategy, sync mechanism, conflict resolution |
| D | PostGIS geo query design | Open | Full `ST_DWithin` query with allergen join and completeness sort |
| E | Media upload flow | Open | Client-side resize, Supabase Storage bucket structure, URL strategy |
| F | Rate limiting strategy | Open | Per-IP and per-user limits on contribution endpoints |
| G | Moderation model | Open | Community moderators, core team, or tiered |



**Why Fastify over Express:** Schema-first design, TypeScript support from the ground up, plugin architecture for clean separation of concerns, and roughly 3-4× the request throughput of Express on the same compute.

**API structure:** Feature-based layout, not layer-based. Each feature owns its routes, business logic, and database queries in one place — maps naturally to how Claude Code navigates a codebase.

**Route groups:**

| Route group | Purpose |
|-------------|---------|
| `GET /places` | Geo search by location + allergen. Core endpoint. Uses PostGIS `ST_DWithin`. |
| `GET /places/:id` | Single place record with all layers and recent reports |
| `POST /places` | Create a new place record (authenticated) |
| `PATCH /places/:id` | Update place record fields (authenticated, trust-gated) |
| `GET /allergens` | Full allergen reference vocabulary — mostly read-only |
| `GET /allergens/:code/synonyms` | Synonym lookup for a specific allergen |
| `POST /reports` | Submit a structured report for a place (authenticated) |
| `POST /reviews` | Submit a narrative review for a place (authenticated) |
| `POST /trust-signals` | Cast a helpful vote or outdated flag (authenticated) |
| `POST /disputes` | Raise a dispute on a report or review (authenticated) |
| `GET /contributors/:id` | Contributor profile and contribution history |
| `POST /auth/register` | Thin wrapper around Supabase Auth registration |
| `POST /auth/login` | Thin wrapper around Supabase Auth login |

**Request lifecycle (every request):**

1. JWT auth hook — validates Supabase-issued JWT, extracts `user_id`
2. Zod validation hook — validates request body and query params against shared schema
3. Route handler — builds Prisma query, applies business logic
4. PostgreSQL + PostGIS — executes query, RLS policies enforce row-level access
5. Response serialisation hook — strips internal fields, attaches `disclaimer_required` flag
6. Response returned to client

**OpenAPI spec:** Every route is decorated with a schema. Fastify auto-generates an OpenAPI specification that serves as the contract between the API and its clients, and auto-generates TypeScript client SDKs for the web and mobile apps.

**The `disclaimer_required` flag:** Every response containing place or review data includes `disclaimer_required: true`. The frontend is contractually obligated via the OpenAPI spec to display the safety disclaimer. Safety framing is enforced at the API layer, not left to UI discretion.

---

### Supabase Auth

**Auth flows supported:**

| Flow | Notes |
|------|-------|
| Email + password | Baseline. Confirmation email required. |
| Magic link | Passwordless. Lower friction for casual contributors. |
| Google OAuth | Covers Android, reduces sign-up friction. |
| Apple OAuth | Mandatory for iOS if any social login is offered. |
| Anonymous auth | Temporary account, upgradeable. Enables low-friction contribution with lower trust weight. |

**JWT flow:** Supabase Auth issues a signed JWT on login. The JWT is stored on the client (secure storage on mobile, httpOnly cookie on web) and sent as a `Bearer` token with every API request. The Fastify auth hook verifies the signature using Supabase's public key — no round-trip to Supabase on every request.

**Contributor profile auto-creation:** A `on_auth_user_created` database trigger fires when any new account is created. It automatically inserts a `CONTRIBUTOR` row linked to the new user's ID. No application code is needed to handle the "first login" case.

**Row Level Security (RLS):** PostgreSQL RLS policies wire the authenticated user's JWT directly into database-level access control. Access rules live in the database, not scattered across API handlers. Full policy SQL is documented in the RLS policies subsection above.

| Table | Policy | Rule |
|-------|--------|------|
| `PLACE` | Read | Public — anyone |
| `PLACE` | Write | Authenticated users only |
| `PLACE` | Update | Original contributor or trust score ≥ 0.7 |
| `PLACE_ALLERGEN` | Write | Trust score ≥ 0.4 |
| `STRUCTURED_REPORT` | Read | Public — non-deleted rows only |
| `STRUCTURED_REPORT` | Write | Authenticated users |
| `STRUCTURED_REPORT` | Edit | Owner only — soft delete via `deleted_at` |
| `NARRATIVE_REVIEW` | Read | Public — non-deleted rows only |
| `NARRATIVE_REVIEW` | Edit | Owner only — soft delete via `deleted_at` |
| `CONTRIBUTOR` trust_score | Update | Privileged DB function only — never via API |
| `TRUST_SIGNAL` / `DISPUTE` | Write | Authenticated insert only — immutable once cast |

---

---

## 14. Trust and Safety Model

### Safety Framing
Every place listing, report, and review carries a persistent disclaimer:

> *"This information is shared by community members from personal experience. Always verify directly with the restaurant. Carry your epinephrine auto-injector at all times."*

This disclaimer is non-negotiable and must be visually present — not buried in terms of service.

### Staleness Detection
- Structured reports and narrative reviews older than 12 months are automatically flagged as potentially stale
- Users are shown the age of the most recent verified entry prominently
- Stale listings remain visible but with a clear recency warning

### Reaction Records
The `reaction_status` field (`none` / `near_miss` / `reaction_occurred`) is treated with particular care:
- Reactions and near misses surface as a warning flag on the place record — not as a numeric penalty to the rating
- Multiple reaction reports trigger a prominent safety alert on the listing
- Dispute mechanism is available if a report is believed to be inaccurate

### Contributor Trust Score
Derived from:
- Account age (`member_since`)
- Contribution volume (`contribution_count`)
- Helpful votes received on entries
- Dispute history (entries disputed vs upheld)
- Never directly editable

---

## 15. Launch Strategy

### Pilot City
**Toronto, Ontario, Canada**

Rationale:
- Highly diverse food scene across many cuisine types
- Large, multicultural population
- Home of Anaphylaxis Canada (potential future partner)
- Founder's home city — local knowledge available for seed data

### Seed Strategy
The platform requires minimum viable data before community launch. Approach:
1. **Manual seed:** Research and enter 20–30 Toronto allergy-friendly restaurants directly, using menus, websites, and direct restaurant contact
2. **Founding contributors:** Recruit 10–20 early contributors from Toronto allergy communities (Facebook groups, Reddit, local networks) before public launch
3. **Restaurant outreach:** Identify and contact restaurants already marketing allergy awareness — get them invested in their listing early

### Community Channels
- Reddit: r/FoodAllergies, r/toronto, r/Anaphylaxis
- Facebook: Toronto allergy parent groups
- Anaphylaxis Canada community

---

## 16. Open Questions

| # | Question | Status | Notes |
|---|----------|--------|-------|
| 1 | What is the canonical allergen vocabulary? | ✅ Resolved | Sections 11–12 — Health Canada anchored, 21 allergens, 4 reference tables |
| 2 | What tech stack? | ✅ Resolved | Section 13 — Turborepo, Next.js, React Native/Expo, Fastify, PostgreSQL/PostGIS, Supabase, Railway, Vercel |
| 3 | What is the moderation model? | Open | Who reviews disputes — community moderators, core team, or tiered? |
| 4 | How are accounts created? | ✅ Resolved | Section 13 — email/password, magic link, Google, Apple, anonymous auth via Supabase |
| 5 | What is the offline data strategy? | Open | Which data is cached locally on mobile, sync mechanism, conflict resolution |
| 6 | What is the open source licence? | Open | MIT, Apache 2.0, AGPL? Depends on non-profit structure |
| 7 | Non-profit structure | Open | When and how to formalise — likely post-MVP |
| 8 | Multilingual support | Open | Not in MVP — `language_code` field in `ALLERGEN_SYNONYM` future-proofs the schema |

---

## 17. Next Steps

### Completed
1. ~~Define the allergen vocabulary~~ ✅ — Sections 11–12
2. ~~Design the system architecture~~ ✅ — Section 13
3. ~~Complete architecture detail~~ ✅ — monorepo scaffold, config files, RLS policies
4. ~~Set up GitHub repository~~ ✅
5. ~~Build Phase 1 MVP~~ ✅ — place CRUD, search, seed data
6. ~~Build Phase 2 community layer~~ ✅ — reports, reviews, auth, trust scores, signals, disputes
7. ~~UI design system~~ ✅ — `allergynav-design-spec.md` v1.1, homepage implemented

### Immediate next build priorities

| Priority | Item | What it unlocks |
|----------|------|----------------|
| 1 | Apply design system to remaining web pages | Consistent UI across search, place detail, auth, profile |
| 2 | Cross-reactivity warnings — Phase 3 | Surfaces cashew/pistachio, walnut/pecan warnings in place detail |
| 3 | PostGIS geo query — architecture item D | Core "near me now" mobile search |
| 4 | Offline data strategy — architecture item C | Required before mobile build begins in earnest |
| 5 | Replace fictional seed data with real Toronto restaurants | Required before any community launch |
| 6 | Recruit founding contributors | Toronto allergy community outreach (Reddit, Facebook, Anaphylaxis Canada) |

### Remaining architecture decisions

| # | Decision | Priority | Notes |
|---|----------|----------|-------|
| C | Offline data strategy | High — needed before mobile build | Which data cached, sync mechanism, conflict resolution |
| D | PostGIS geo query design | High — needed for core search | Full `ST_DWithin` with allergen join and completeness sort |
| E | Media upload flow | Medium | Client-side resize, Supabase Storage buckets, URL strategy |
| F | Rate limiting strategy | Medium | Per-IP and per-user limits on contribution endpoints |
| G | Moderation model | Lower — post-launch | Community mods, core team, or tiered approach |

---

*This document was produced across multiple planning sessions and reflects decisions made as of version 0.5. It should be treated as a living document and updated as decisions are refined. The canonical home for this document is `/docs/spec.md` in the GitHub repository.*
