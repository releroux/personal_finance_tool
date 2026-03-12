# Personal Finance Dashboard

A personal finance dashboard built with React and Vite. Track your income statement, balance sheet, and key financial KPIs — all in-browser with no backend or account required.

**Live site:** [https://releroux.github.io/personal_finance_tool/](https://releroux.github.io/personal_finance_tool/)

## Features

- **Income Statement** — Log salary, tax (PAYE/UIF), and expense categories with inline editing
- **Balance Sheet** — Track assets and liabilities across current/fixed/long-term categories
- **KPI Dashboard** — Automatically calculated metrics including:
  - Savings rate, expense-to-income, housing & vehicle cost ratios
  - Debt-to-asset, liquidity, solvency, home & vehicle equity
  - Emergency fund coverage, investment rate, retirement savings
- **Inline editing** — Click any value to edit; add or remove line items per category
- **ZAR currency** — Formatted for South African Rand (R)

## Tech Stack

- [React 19](https://react.dev) + [Vite 7](https://vite.dev)
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

1. **Income Statement tab** — Update your salary, PAYE, UIF, and monthly expenses. Click any amount to edit it inline. Use "+ Add item" to add custom line items to any category.
2. **Balance Sheet tab** — Enter your assets (cash, savings, investments, property, vehicle) and liabilities (credit cards, loans, mortgage).
3. **KPI Cards tab** — Review auto-calculated financial health metrics based on your IS and BS data.

> All data lives in React state — nothing is sent to a server. Refresh the page to reset to defaults.

## Project Structure

```
src/
├── App.jsx                  # Root state (IS_DEFAULTS, BS_DEFAULTS) + tab routing
├── App.css                  # All styles and design tokens
├── index.css                # Minimal reset
└── components/
    ├── IncomeStatement.jsx  # Inline-editable income statement
    ├── BalanceSheet.jsx     # Inline-editable balance sheet
    ├── KPICards.jsx         # Calculated KPI tables
    └── InputPanel.jsx       # Legacy sidebar (not rendered)
```
