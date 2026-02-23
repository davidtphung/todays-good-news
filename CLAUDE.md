# CLAUDE.md — Good News Dashboard

## Project Overview
**Good News** is a real-time dashboard that curates and displays the best things happening anywhere in the world, updated daily. It is the inverse of doomscrolling — a positive-signal OSINT board modeled after [Monitor the Situation](https://monitor-the-situation.com/) but focused exclusively on uplifting, constructive, and hopeful global events.

Design language follows [ndstudio.gov](https://ndstudio.gov/): near-black background (#0a0a0a), monochromatic palette, opacity-based hierarchy, restrained 150ms transitions, generous spacing, minimal decoration.

---

## Tech Stack
| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **SvelteKit** (Svelte 5 with runes) | SSR + client hydration, file-based routing |
| Styling | **Tailwind CSS v4** | Dark theme default, ndstudio design language |
| Language | **TypeScript** (strict mode) | All `.ts` and `.svelte` files |
| Backend/API | **SvelteKit API routes** (`+server.ts`) | Serverless functions for data aggregation |
| AI Curation | **Anthropic Claude API** (claude-sonnet-4-5-20250929) | Classify, score, and summarize positive news |
| Data Sources | NewsAPI, GDELT, RSS feeds, Reddit API | Multi-source ingestion pipeline |
| Database | **Supabase** (PostgreSQL + Realtime) | Story storage, dedup, daily snapshots |
| Caching | **Upstash Redis** | Rate limiting, API response caching |
| Deployment | **Vercel** | Edge functions, automatic preview deploys |
| Testing | **Vitest** (unit) + **Playwright** (e2e) | CI via GitHub Actions |
| Linting | **ESLint** + **Prettier** | Config in repo root |

---

## Commands
```bash
pnpm dev              # Start dev server (port 5173)
pnpm build            # Production build
pnpm preview          # Preview production build locally
pnpm test             # Run Vitest unit tests
pnpm test:e2e         # Run Playwright e2e tests
pnpm lint             # Lint with ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm format           # Format with Prettier
pnpm check            # TypeScript checking (svelte-check)
```

---

## Design System (ndstudio-inspired)
- **Background**: `#0a0a0a` (near-black)
- **Surface raised**: `#111111` (panels)
- **Text**: `text-gray-50` primary, `text-white/50` secondary, `text-white/30` tertiary
- **Dividers**: `bg-white/10` (1px lines)
- **Hover**: `bg-white/5` with 150ms transition
- **Positivity**: emerald (#10b981) for positive, amber (#f59e0b) for neutral, gold (#fbbf24) for featured
- **Typography**: System font stack (Inter preferred), 14px base, opacity for hierarchy
- **Spacing**: 4/8/12/16/20/24/32/48/64px scale

---

## Coding Conventions
- **Svelte 5 runes**: `$state()`, `$derived()`, `$effect()`, `$props()` — no legacy `$:` syntax
- **Snippets**: Use `{#snippet}` instead of slots
- **No `any` types** — use proper interfaces from `src/lib/types/`
- **Source links**: Every story card must hyperlink the source name to `source_url`
- **Error boundaries** — every panel catches its own errors
- **Deduplication** — fuzzy match on title + source URL uniqueness constraint

---

## Claude Code Usage Notes
- Always run `pnpm check` after modifying `.svelte` or `.ts` files
- When adding a new panel, update both `config.ts` PANELS array and panel types
- When modifying the AI pipeline, run: `pnpm test -- --grep dedup`
- The mock data in `+page.server.ts` is for development — swap to Supabase imports for production
- Supabase schema lives in `supabase/migrations/001_initial_schema.sql`
