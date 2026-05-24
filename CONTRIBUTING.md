# Contributing to Allergy Travel Platform

Thank you for contributing. This platform exists because people with lived experience of food allergies share what they know. Every contribution — code, data, or documentation — helps a family travel safely.

## Ways to contribute

- **Code** — fix bugs, build features, improve performance
- **Place data** — add or verify allergy-friendly restaurants in your city
- **Documentation** — improve guides, fix typos, translate content
- **Local knowledge** — share cuisine-specific tips, hidden allergen names, how to communicate allergies in different languages
- **Testing** — report bugs, test on different devices

## Before you start

1. Check [open issues](../../issues) — someone may already be working on it
2. For significant changes, open an issue first to discuss the approach
3. Read the product spec in `/docs/spec.md` to understand the data model and architecture

## Development setup

```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/allergy-platform.git
cd allergy-platform

# Install dependencies
pnpm install

# Build the shared package
pnpm --filter @allergy-platform/shared build

# Start development
pnpm dev
```

## Pull request process

1. Create a branch from `main`: `git checkout -b feat/your-feature-name`
2. Make your changes
3. Run `pnpm lint` and `pnpm type-check` — both must pass
4. Run `pnpm test` — all tests must pass
5. Write a clear PR description explaining what changed and why
6. Reference any related issues: `Closes #123`

## Commit style

We use conventional commits:

```
feat: add peanut allergy filter to place search
fix: correct hazelnut cross-reactivity entry
docs: update allergen vocabulary section
chore: upgrade Fastify to v5
```

## Safety standards for data contributions

This platform has real safety implications. When contributing allergen data or place reviews:

- Never assert a place is "safe" — only describe what you experienced and how you verified it
- Include the date of your experience
- Note how you communicated the allergy (menu, staff, chef)
- Flag cross-contamination risks explicitly
- If in doubt, leave it out

## Code of conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). We are committed to a welcoming, respectful community.

## Questions

Open a [GitHub Discussion](../../discussions) — we're happy to help.
