# Personal Finance Dashboard

A personal finance dashboard built with React and Vite. Track your income statement, balance sheet, and key financial KPIs — all in-browser with no backend or account required.

**Live site:** [https://releroux.github.io/personal_finance_tool/](https://releroux.github.io/personal_finance_tool/)

## Features

- **Home page** — Landing page with a "How to use this tool" guide modal to orient new users
- **Income Statement** — Log salary, PAYE/UIF/RA/medical aid deductions, and expense categories with inline editing
- **Balance Sheet** — Track assets and liabilities across current/fixed/long-term categories; net worth calculated automatically
- **Dashboard** — Automatically calculated KPIs and charts including:
  - Savings rate, expense-to-income, housing & vehicle cost ratios
  - Debt-to-asset, liquidity, solvency, home & vehicle equity
  - Emergency fund coverage, investment rate, retirement savings
  - Pie charts for expense breakdown and asset allocation (via Recharts)
- **Inline editing** — Click any value to edit; add or remove line items per category
- **PDF export** — Print a 3-page financial report (Dashboard + Income Statement + Balance Sheet) via the browser's print dialog
- **Dark / light mode** — Toggle in the header; defaults to dark
- **Responsive design** — Mobile and tablet friendly
- **ZAR currency** — Formatted for South African Rand (R)

## Tech Stack

- [React 19](https://react.dev) + [Vite 7](https://vite.dev)
- [Recharts](https://recharts.org) for Dashboard charts
- Plain CSS with design tokens — no UI library dependencies
- No backend, no auth, no database — runs entirely in the browser

## Getting Started

Visit the live site at [https://releroux.github.io/personal_finance_tool/](https://releroux.github.io/personal_finance_tool/).

To run locally:

```bash
cd personal_finance_tool
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deploying

```bash
npm run deploy
```

This builds the app and pushes it to the `gh-pages` branch, updating the live site.

## Usage

1. **Home tab** — Read the overview and click "Get Started" to open the guide modal, then proceed to the Income Statement.
2. **Income Statement tab** — Update your salary, PAYE, UIF, RA, medical aid, and monthly expenses. Click any amount to edit inline. Use "+ Add item" to add custom line items.
3. **Balance Sheet tab** — Enter your assets (cash, savings, investments, property, vehicle) and liabilities (credit cards, loans, mortgage).
4. **Dashboard tab** — Review auto-calculated financial health KPIs and charts based on your IS and BS data.
5. **Export PDF** — Click "Export PDF" in the tab bar to print a full financial report.

> All data lives in React state — nothing is sent to a server. Refresh the page to reset to defaults.

## Project Structure

```
src/
├── App.jsx                  # Root state (IS/BS), tab routing, dark mode
├── App.css                  # All styles and design tokens
├── index.css                # Minimal reset
├── defaults.js              # Default IS and BS data
└── components/
    ├── Home.jsx             # Landing page + "How to use" guide modal
    ├── IncomeStatement.jsx  # Inline-editable income statement
    ├── BalanceSheet.jsx     # Inline-editable balance sheet
    ├── Dashboard.jsx        # KPI tables and Recharts visualisations
    ├── PDFExport.jsx        # Print layout + Export PDF button
    └── Tooltip.jsx          # Reusable tooltip component
```
