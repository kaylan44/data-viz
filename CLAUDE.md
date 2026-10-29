# MarketDeck — Claude Code conventions

## Project overview

A dark, trading-terminal-style data-visualization SPA in **Vue 3**. Four pages: Equities (Mag 7), Oil (Brent/WTI/Dubai), Markets Overview (global indices/FX/rates/commodities/crypto), World Map. All market data is **simulated**. No real-world usage.

## Working agreement

- Complete **one stage at a time** (see `claude-code-prompt.md` § 9). Run checks, commit, stop, report. Wait for a "go" before the next stage.
- Everything in **English**: UI, comments, commit messages.
- No automated tests.
- Keep dependencies minimal; justify any package not in the approved list.
- Use **conventional commits** (`feat:`, `fix:`, `chore:`, `style:`, `refactor:`, `docs:`).
- **Feature branches only** — never commit directly to `main`. Every feature lands via a PR.

## Stack

| Layer | Package |
|-------|---------|
| Framework | Vue 3 + Composition API + `<script setup lang="ts">` |
| Build | Vite 5, TypeScript strict mode |
| Router | vue-router 4 (lazy routes) |
| State | Pinia |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), design tokens in CSS theme |
| Charts | ECharts + vue-echarts (tree-shaken) |
| Map | d3-geo, d3-zoom, topojson-client, world-atlas |
| Icons | @lucide/vue |
| Fonts | @fontsource/inter, @fontsource/jetbrains-mono (self-hosted) |
| Tooling | ESLint, Prettier, vue-tsc |
| Deploy | Vercel (SPA rewrite in `vercel.json`) |

## Design tokens (src/style.css @theme)

| Token | Value |
|-------|-------|
| Canvas | `#0A0E14` |
| Panel | `#0F1520` |
| Panel elevated | `#141B28` |
| Border | `#1E2736` |
| Text primary | `#E6EAF2` |
| Text secondary | `#8B96A9` |
| Text muted | `#5B667A` |
| Accent (amber) | `#F5B800` |
| Positive | `#22C55E` |
| Negative | `#EF4444` |
| Panel radius | 6px |
| Control radius | 4px |

Chart series palette: 8 colors defined as `--color-series-1` … `--color-series-8`.

Positive and negative colors are **reserved** for price changes only.

All numbers use `font-variant-numeric: tabular-nums` and JetBrains Mono.

## Folder structure

```
src/
  app/            router.ts, layout components (AppShell, SidebarNav, TopBar)
  components/
    ui/           Panel, PanelHeader, SegmentedControl, Badge, LiveBadge,
                  Skeleton, StateMessage, IconButton
    data/         DataTable, Sparkline, PriceChange, FlashValue, TickLog
    charts/       LineChartPanel, TimeRangeSelector
    map/          WorldMap, CountryPanel, MapControls
  composables/    useLiveQuotes, useHistory, useFlashOnChange,
                  useCountries, useElementSize
  data/
    providers/    MarketDataProvider interface, MockProvider
    catalog/      instrument definitions (one file per group)
    engine/       seeded PRNG, series generators, live tick engine
    countries/    REST Countries client + cache, gdp-snapshot.json
  stores/         Pinia stores
  pages/          thin pages that compose components
  types/          index.ts (Instrument, Quote, Point, TimeRange, ChartMode)
scripts/          snapshot-gdp.mjs (run once, commits output)
docs/reference/   ← git-ignored (screenshots, reference images)
```

## Architecture rules

1. **Config-driven dashboards**: `MarketDashboard` receives a config object. Equities, Oil, and Overview pages are only configs.
2. `DataTable` is **generic**: typed column definitions, no finance knowledge.
3. Components take data via **props**, emit events. Only pages and `MarketDashboard` talk to stores.
4. No component file over **~200 lines**. Extract composables early.
5. Lazy-load all route components. Load map data lazily on the map route.
6. `MarketDataProvider` interface: swapping mock → real provider is **one line**.

## Data layer

- History: seeded PRNG (mulberry32, seeded from instrument id) + geometric Brownian motion.
- Ranges: `1D` (5-min), `5D` (30-min), `1M` (4-hour), `3M` (daily), `1Y` (daily). Cap ~500 pts.
- Live engine: ticks at 800–2500 ms, pauses on `visibilitychange`, resumes cleanly.
- Related instruments have correlated moves (Mag 7 share a market factor; Brent/WTI/Dubai move together).

## Git workflow

- `main` is protected — PRs only, no direct pushes.
- Branch naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`.
- One commit per stage minimum; use conventional commits.
- Merge only after `npm run type-check` and `npm run build` pass with zero errors.

## Checks before merge

```bash
npm run type-check   # must pass with 0 errors
npm run build        # must pass with 0 errors
npm run lint         # must be clean
```

## Simulated data notice

The footer and README must state: **"Simulated data for demonstration purposes only."**
Never use the real logo, name, or branding of any real product or data provider.

## Stages (brief reference)

| # | Name | Done when |
|---|------|-----------|
| 0 | Scaffold | `dev` serves, `build` + `type-check` pass, lint clean |
| 1 | Design system & shell | Shell at 1440/1024px, `/styleguide` renders all primitives |
| 2 | Data layer | History deterministic, ticks pause/resume, one-line swap |
| 3 | Data viz components | 25 rows ticking, no jank, props-only components |
| 4 | Dashboards | Three pages share one component, config-driven |
| 5 | World Map | All countries work, zoom/pan smooth, GDP script documented |
| 6 | Polish & deploy | Lighthouse desktop ≥ 90, production preview with deep links |
