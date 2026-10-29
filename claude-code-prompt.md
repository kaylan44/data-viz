# MarketDeck: Claude Code project brief

(The name "MarketDeck" is a placeholder. Use it consistently until I rename it.)

## 1. Context and goal

Build a portfolio project: a dark, professional, trading-terminal-style data-visualization frontend in **Vue 3**. It has no real-world usage. All market data is **simulated**. The priorities, in order: visual quality, clean architecture, reusability of components, performance.

The app has these pages:

1. **Equities**: Magnificent 7 dashboard.
2. **Oil**: Brent, WTI, Dubai.
3. **Markets Overview**: global indices, rates, FX, commodities, crypto.
4. **World Map**: clickable countries with a side panel of country facts.

## 2. Working agreement

- Work **stage by stage** (section 9). Complete one stage only, run the checks, commit, then **stop** with a short report: what was built, how to verify it, open questions. Wait for my "go" before the next stage.
- Stay in scope. If something is ambiguous, apply the default stated in this brief and mention it in your report. Ask a question only when you are blocked.
- Everything is in **English**: UI strings, code comments, commit messages, README.
- No automated tests for now.
- Keep dependencies minimal. Justify in your report any package outside the list in section 3.
- Use conventional commits (`feat:`, `fix:`, `chore:`...). One commit per stage minimum.
- Never reproduce the logo, name, or branding of any real product. The reference screenshot is a style inspiration only.

## 3. Stack

- Vue 3 (Composition API, `<script setup lang="ts">`), TypeScript in strict mode, Vite
- Vue Router, Pinia
- Tailwind CSS v4 (`@tailwindcss/vite`), design tokens defined in the Tailwind theme (CSS variables)
- Charts: **ECharts** via `vue-echarts`, with tree-shaken imports (only the chart types and components used)
- Map: `d3-geo`, `d3-zoom`, `topojson-client`, `world-atlas` (`countries-110m`). D3 computes paths and zoom transforms only; Vue renders the SVG.
- Icons: `lucide-vue-next`
- Fonts (self-hosted via `@fontsource`): Inter for UI, JetBrains Mono for tickers and numbers
- Tooling: ESLint + Prettier, `vue-tsc` type-check script
- Deployment: Vercel (SPA, `vercel.json` with a rewrite to `index.html`)

## 4. Reference screenshot and visual identity

I will place the reference screenshot at `docs/reference/spark-intraday.png`. Treat it as inspiration for density and mood. Elements to take from it:

- Narrow icon-only sidebar on the left, with an active-state highlight
- Dense data table: small uppercase muted headers, right-aligned tabular numbers, thin row separators, selected-row highlight in deep blue, a sparkline cell, green/red change values, and a "last update" column
- Large chart panel with a compact segmented control (time ranges) at its top right
- Panels with a very subtle border on a near-black navy canvas
- Live feel: values flash briefly when they change, and a small "connected/live" status chip sits in the top bar

Design tokens (starting values, adjust for harmony):

- Canvas `#0A0E14`, panel `#0F1520`, elevated panel `#141B28`, border `#1E2736`
- Text primary `#E6EAF2`, secondary `#8B96A9`, muted `#5B667A`
- Single brand accent: amber `#F5B800`. Positive `#22C55E`. Negative `#EF4444`. Positive and negative colors are reserved for price changes.
- Chart series palette of 8 distinguishable colors that stay legible on dark backgrounds
- Radius 6px on panels, 4px on controls. No heavy shadows, no gradients except very subtle ones on chart areas.
- All numbers use `font-variant-numeric: tabular-nums`.

Desktop-first (target 1440px and wider, usable down to 1024px). No mobile layout.

## 5. Architecture and reusability rules

Every visual block must be a standalone component that works on any page with props only. No page-specific logic inside a shared component.

```
src/
  app/            router, layout (AppShell, SidebarNav, TopBar)
  components/
    ui/           Panel, PanelHeader, SegmentedControl, Badge, LiveBadge, Skeleton, StateMessage (empty/error), IconButton
    data/         DataTable, Sparkline, PriceChange, FlashValue, TickLog
    charts/       LineChartPanel, TimeRangeSelector
    map/          WorldMap, CountryPanel, MapControls
  composables/    useLiveQuotes, useHistory, useFlashOnChange, useCountries, useElementSize
  data/
    providers/    MarketDataProvider interface, MockProvider
    catalog/      instrument definitions (one file per group)
    engine/       seeded PRNG, series generators, live tick engine
    countries/    REST Countries client + cache, GDP snapshot
  stores/         Pinia stores
  pages/          thin pages that compose components
  types/
```

Rules:

- **Config-driven dashboards**: build one generic `MarketDashboard` component that receives a config (title, instrument ids, table columns, chart mode `absolute | normalized100`, default range). The Equities, Oil, and Overview pages are only configs plus a title.
- `DataTable` is generic and typed: column definitions (key, label, align, formatter, optional cell slot), sticky header, no knowledge of finance.
- Components take data via props and emit events. Only pages and `MarketDashboard` talk to stores.
- No component file over ~200 lines. Extract composables early.
- Lazy-load route components. Load map data lazily on the map route.

## 6. Data layer (simulated)

Types: `Instrument { id, symbol, name, group, currency, unit?, decimals, basePrice, annualVol, drift }`, `Quote { id, last, prevClose, change, changePct, dayLow, dayHigh, ts }`, `Point { t: number; v: number }`.

- `MarketDataProvider` interface: `getInstruments()`, `getHistory(id, range)`, `subscribe(ids, onTick) → unsubscribe`. Implement `MockProvider` only. Swapping in a real provider later must require changing a single line.
- **Determinism**: history comes from a seeded PRNG (mulberry32 seeded from the instrument id) with geometric Brownian motion, plus mean reversion for FX, rates, and VIX. A page reload shows the same history, and only live ticks vary.
- Ranges: `1D` (5-min bars), `5D` (30-min), `1M` (4-hour), `3M` (daily), `1Y` (daily). Cap at ~500 points per series.
- Related instruments need correlated moves (Brent, WTI, and Dubai move together, as do the Mag 7 stocks via a shared market factor).
- **Live engine**: a single scheduler emits ticks at randomized 800 to 2500 ms intervals per instrument. It appends to or updates the last point so charts and sparklines stay in sync. It pauses when the tab is hidden (`visibilitychange`) and resumes cleanly.
- Starting levels are plausible round figures, not accurate real prices. The footer and README state: "Simulated data for demonstration purposes only."

## 7. Dashboard content

**Layout of a dashboard page** (inside `MarketDashboard`): left column holds the table panel (Symbol, Name, Last 24h sparkline, Last, Chg, Chg %, Low, High, Last update). The right area holds the main chart panel with the time-range selector and inside zoom (mouse wheel and drag) plus a "Reset" button. A compact `TickLog` panel below the chart shows the latest ticks across the page's instruments, newest first.

Interactions are limited to: hover tooltips on charts, chart zoom with reset, time-range selection. There is no row selection that drives the chart, no custom series toggles, no export.

**Equities**: AAPL, MSFT, GOOGL, AMZN, META, NVDA, TSLA. The chart uses `normalized100` mode so all seven compare on one axis.

**Oil**: Brent, WTI, Dubai in $/bbl. The chart uses `absolute` mode. Nice-to-have if it stays under ~30 lines: a derived "Brent–WTI spread" instrument shown as an extra table row.

**Markets Overview** (grouped table sections with group headers):

- Equity indices: S&P 500, Nasdaq-100, Dow Jones, Euro Stoxx 50, CAC 40, DAX, FTSE 100, Nikkei 225, Hang Seng, IDX Composite, Straits Times
- Risk and rates: VIX, US 10Y Yield, DXY
- FX: EUR/USD, USD/JPY, USD/IDR
- Commodities and crypto: Gold, Copper, Natural Gas, Bitcoin
- The chart uses `normalized100` over the instruments of the currently visible group (group switch uses `SegmentedControl`).

## 8. World Map page

- 2D choropleth-style map without any data coloring: uniform fill, hover highlight, selected-country accent outline. Natural Earth or Equal Earth projection, wheel zoom, drag pan, a "Reset view" button, and +/- buttons.
- Click a country: a right-side panel slides in (closing via X button, Escape key, or click on the sea). Hover shows a lightweight tooltip with the country name.
- Join `world-atlas` features (ISO numeric id) to REST Countries via `ccn3`.
- Country data from `https://restcountries.com/v3.1/all?fields=name,cca2,cca3,ccn3,capital,population,area,currencies,languages,flags,region,subregion,timezones` (the `fields` parameter is mandatory). Cache the response in `localStorage` with a 7-day TTL. Show a skeleton while loading and an error state with a retry button on failure.
- **GDP**: REST Countries has no GDP. Write `scripts/snapshot-gdp.mjs` that fetches World Bank indicators `NY.GDP.MKTP.CD` and `NY.GDP.PCAP.CD` (most recent non-empty value, no API key) and writes `src/data/countries/gdp-snapshot.json` keyed by `cca3`, with `year` and `source` fields. Run it once and commit the output. The app reads the snapshot only, with no runtime World Bank call. The panel shows the data year and source.
- Country panel contents: flag, common and official name, capital, region and subregion, population, area, GDP, GDP per capita, currencies (name, code, symbol), languages, ISO codes, timezones. Territories without data (for example some disputed regions) show a "Limited data available" state.

## 9. Stages

**Stage 0: Scaffold.** Vite + Vue + TS + Router + Pinia + Tailwind + ESLint/Prettier, path alias `@`, the folder structure above, `vercel.json`, a `CLAUDE.md` at the repo root that records the conventions, rules, and architecture from this brief (future sessions rely on it). Placeholder routes.
Done when: `npm run dev` serves, `npm run build` and `npm run type-check` pass with zero errors, lint is clean.

**Stage 1: Design system and shell.** Tokens, fonts, `AppShell`, `SidebarNav` (4 pages with icons, active state, tooltips on hover), `TopBar` (page title, `LiveBadge`, UTC clock), and the `ui/` primitives. Add a hidden `/styleguide` route showing every primitive in all states.
Done when: the shell looks coherent at 1440px and 1024px, and `/styleguide` renders all primitives.

**Stage 2: Data layer.** Types, seeded PRNG, generators, `MockProvider`, live engine, instrument catalogs, Pinia store, composables. Add a temporary debug view showing quotes ticking.
Done when: history is identical across reloads, ticks stop in a hidden tab and resume on return, the provider swap point is one line, and no store logic leaks into components.

**Stage 3: Data visualization components.** `Sparkline` (pure SVG, color by trend, no library), `PriceChange`, `FlashValue` and `useFlashOnChange` (green/red flash ~600 ms, disabled under `prefers-reduced-motion`), generic `DataTable`, `TimeRangeSelector`, `LineChartPanel` (ECharts, zoom, reset, both chart modes), `TickLog`. Showcase all of them with live data in `/styleguide`.
Done when: 25 rows ticking live stay smooth (no visible jank, no memory growth over 5 minutes), and each component works with props only.

**Stage 4: Dashboards.** `MarketDashboard` plus the Equities, Oil, and Markets Overview configs.
Done when: the three pages share one component, adding a new dashboard needs only a config file, and the layout matches the density of the reference.

**Stage 5: World Map.** Everything in section 8.
Done when: all countries with data open a correct panel, zoom and pan feel smooth, Escape and sea-click close the panel, and the GDP snapshot script is documented in the README.

**Stage 6: Polish and deploy.** Loading, empty, and error states everywhere. Keyboard focus styles. Document titles per route and a favicon. English README (overview, architecture summary, stack, simulated-data notice, run instructions, deploy notes, screenshots placeholder). Bundle check: route-level code splitting, tree-shaken ECharts, map data lazy-loaded. Vercel deployment config verified.
Done when: `npm run build` passes, the production preview works with direct deep links (SPA rewrite), and Lighthouse desktop performance is 90 or above. Report the actual scores.

## 10. Start now

Do **Stage 0 only**. Read this whole brief first, then create `CLAUDE.md`, then scaffold. Stop after the report and wait for my go.
