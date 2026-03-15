# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code style

Use comments sparingly — only on complex or non-obvious code.

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run deploy     # build + push to gh-pages branch (updates live site)
```

There are no tests.

## Architecture

This is a fully client-side React app — no backend, no auth, no persistence. All state lives in `App.jsx` and resets on page refresh.

### State model

`App.jsx` owns two top-level state objects passed as props to every tab:

- **`isState`** — income statement data (salary, deductions, expense categories + items). Shape defined in `src/defaults.js` as `IS_DEFAULTS`.
- **`bsState`** — balance sheet data (asset categories + items, liability categories + items). Shape defined in `src/defaults.js` as `BS_DEFAULTS`.

Both follow the same nested pattern: `{ categories: [{ id, label, items: [{ id, label, actual/value }] }] }`. When a user edits a value or adds/removes a line item, the component calls its setter (`setIsState` / `setBsState`) with an immutable update, which propagates live to all other tabs via React re-renders.

### Tab routing

There are four tabs: `home`, `income`, `balance`, `dashboard`. Tab state is managed with a simple `activeTab` string in `App.jsx` — no router. The Income Statement and Balance Sheet are always mounted (display toggled with `style.display`) so edits persist across tab switches. Home and Dashboard are conditionally rendered.

### Component responsibilities

- **`Home.jsx`** — Landing page + `GuideModal` (how-to popup). Calls `onGetStarted` prop to navigate to the Income Statement.
- **`IncomeStatement.jsx`** — Reads/writes `isState`. Handles inline editing, adding/removing items per category.
- **`BalanceSheet.jsx`** — Reads/writes `bsState`. Same editing pattern as IncomeStatement.
- **`Dashboard.jsx`** — Read-only. Derives all KPIs from `isState` + `bsState`. Uses Recharts (`PieChart`) for expense and asset allocation charts. Each KPI has a colour-coded status (`good` / `warning` / `bad`).
- **`PDFExport.jsx`** — Renders a hidden `PrintLayout` into `document.body` via a React portal. Calling `window.print()` captures it as a 3-page PDF (Dashboard KPIs → Income Statement table → Balance Sheet table).
- **`Tooltip.jsx`** — Reusable hover tooltip.

### Styling

All styles are in `src/App.css` using CSS custom properties (design tokens) defined on `:root` and `.app.dark`. No CSS modules, no Tailwind, no UI library. Dark mode is toggled by adding the `dark` class to the root `<div class="app">`.

### Deployment

`npm run deploy` runs `gh-pages -d dist`, pushing the built output to the `gh-pages` branch of the GitHub repo. The live site is at `https://releroux.github.io/personal_finance_tool/`. Vite is configured with `base: '/personal_finance_tool/'` for correct asset paths on GitHub Pages.
