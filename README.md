# Allergy Travel Platform

> A free, open source, community-driven platform where people with food allergies share knowledge and experience to help each other travel safely and confidently.

[![CI](https://github.com/lippmantam/allergy-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/lippmantam/allergy-platform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## The problem

For families managing severe food allergies, travel introduces life-threatening risk at every meal. Current tools — Yelp, TripAdvisor — offer no allergen-specific filtering, no cross-contamination context, and no community of people who understand the stakes. The hard-won knowledge parents accumulate on every trip disappears when they get home.

## The solution

A community-owned platform where people share where they have safely eaten, what to watch out for, and how to communicate allergies in different cuisines and cultures. Built on real experience, not marketing claims.

## Status

🚧 **Early development.** Pilot city: Toronto, Ontario, Canada.

## Platform

Two modes, one data layer:

- **Planning mode** (web) — research destinations, browse reviews, build a trip itinerary before you leave
- **In-the-moment mode** (mobile) — find safe food near you right now, works offline

## Tech stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm workspaces |
| Web | Next.js 15 + Tailwind CSS → Vercel |
| Mobile | React Native + Expo → EAS Build |
| API | Fastify + TypeScript → Railway |
| ORM | Prisma |
| Validation | Zod (shared across all apps) |
| Database | PostgreSQL + PostGIS → Supabase |
| Auth | Supabase Auth (JWT + RLS) |
| Storage | Supabase Storage |
| CI/CD | GitHub Actions |

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- A Supabase project (free tier)

### Setup

```bash
# Clone the repository
git clone https://github.com/lippmantam/allergy-platform.git
cd allergy-platform

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Fill in your Supabase credentials in .env

# Build the shared package first
pnpm --filter @allergy-platform/shared build

# Start all apps in development mode
pnpm dev
```

### Apps

| App | URL | Description |
|-----|-----|-------------|
| Web | http://localhost:3000 | Next.js planning interface |
| API | http://localhost:3001 | Fastify REST API |
| Mobile | Expo Go app | Scan QR code from terminal |

## Contributing

We welcome contributions of all kinds — code, data, documentation, and local knowledge. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

This is a non-profit, community-governed project. No ads. No monetisation. People helping people.

## Allergen coverage

Anchored to Health Canada's priority allergen list. Covers 21 allergens across 8 families including all 9 tree nut sub-types, with canonical codes, hidden names, and cross-reactivity data.

## Licence

MIT — see [LICENSE](LICENSE)

## Community

- GitHub Discussions — questions, ideas, local knowledge
- Issues — bugs and feature requests

---

*Built with ❤️ for every family that has ever spent a holiday anxious about the next meal.*
