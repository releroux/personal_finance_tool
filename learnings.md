# Learnings — Personal Finance Dashboard

A reference for anyone new to React, Vite, or financial statements who wants to understand how this project is built and why.

---

## 1. React — Core Concepts Used Here

> **React** is a JavaScript library for building user interfaces out of small, reusable pieces called *components*.

### Components
Every file in `src/components/` is a React component — a plain JavaScript function that returns HTML-like markup (JSX). For example, `IncomeStatement.jsx` is responsible for rendering the income table and nothing else.

### Props
Props are how a parent component passes data *down* to a child. In this project, `App.jsx` owns all the financial data and hands it to each tab:

```jsx
<IncomeStatement isState={isState} setIsState={setIsState} />
```

`isState` (the data) and `setIsState` (the function to update it) flow in as props.

### State (`useState`)
State is data that can change over time and, when it does, causes the component to re-render. Two kinds are used here:

- **App-level state** — `isState` and `bsState` in `App.jsx` hold all the financial figures. They sit at the top so every tab can read from the same source of truth.
- **Local state** — smaller things like whether a cell is currently being edited (`editing` inside `AmountCell`) or which add-item form is open (`addingTo`).

### Controlled inputs
Form inputs in React are *controlled* — their displayed value comes from state, not the browser. When you type in a cell, `onChange` fires, state updates, React re-renders, and the input shows the new value. This keeps the UI and the data always in sync.

### Lifting state up
`isState` and `bsState` live in `App.jsx` — not inside `IncomeStatement` or `BalanceSheet` — because the Dashboard needs to read those same values. When state needs to be shared between siblings, you move it up to their common parent.

### Why components must be defined outside render functions
If you define a component *inside* another component's function body, React sees a brand-new component type on every render, unmounts the old one, and mounts a fresh copy — resetting all its internal state and re-firing `autoFocus`. This project had a bug where defining `AddRow` inside `IncomeStatement` caused focus to jump back to the label input after every keystroke in the amount field. Moving `AddRow` to module level fixed it.

---

## 2. Vite — The Build Tool

> **Vite** is a development server and build tool. It makes working with React fast by only processing the files you actually change.

| Command | What it does |
|---|---|
| `npm run dev` | Starts a local server with instant hot-reload at `http://localhost:5173` |
| `npm run build` | Bundles everything into a production-ready `dist/` folder |
| `npm run preview` | Serves the `dist/` folder locally so you can check the build |
| `npm run deploy` | Builds and pushes `dist/` to GitHub Pages (the live site) |

---

## 3. Financial Statements — The Three Views

### Income Statement (IS)
> Answers: *How much money came in and went out this month?*

The IS tracks cash flow over a period (monthly here). It follows this structure:

```
Gross Income
  − Deductions (PAYE, UIF, RA, Medical Aid)
= Net Income (take-home pay)
  − Expenses (accommodation, food, fuel, etc.)
= Surplus or Deficit
```

**Key South African terms:**
- **PAYE** — Pay As You Earn, the income tax deducted from your salary by your employer
- **UIF** — Unemployment Insurance Fund, a small statutory deduction that covers you if you lose your job
- **RA** — Retirement Annuity, a tax-deductible monthly contribution to a retirement fund
- **Medical Aid** — private health insurance contribution

### Balance Sheet (BS)
> Answers: *What am I actually worth right now?*

Where the IS measures flow, the BS is a *snapshot* of everything you own minus everything you owe:

```
Assets (current + fixed)
  − Liabilities (short-term + long-term)
= Net Worth
```

- **Current assets** — cash, savings, investments you can access within 12 months
- **Fixed assets** — property, vehicles — valuable but not quickly liquid
- **Current liabilities** — credit card balances, short-term loans
- **Long-term liabilities** — mortgage, vehicle finance

You can earn a high income (good IS) while having a low or negative net worth (bad BS). The two views together tell the full story.

### KPI Dashboard
> Answers: *How healthy are my finances, by the numbers?*

KPIs (Key Performance Indicators) are ratios calculated from the IS and BS data. They are colour-coded for at-a-glance reading:

- 🟢 **Green** — within a healthy range
- 🟡 **Amber** — worth monitoring
- 🔴 **Red** — needs attention

Examples:
- **Savings rate** — what percentage of gross income is left after all outflows
- **Debt-to-asset ratio** — how much of your total assets are funded by debt
- **Liquidity ratio** — how many months of expenses your liquid assets could cover
- **Emergency fund coverage** — how many months your emergency fund lasts at current spending

---

## 4. How the Project Wires It All Together

| File | Role |
|---|---|
| `defaults.js` | Seed data based on StatsSA average household figures |
| `App.jsx` | Owns `isState` + `bsState`; handles tab switching without a router |
| `IncomeStatement.jsx` | Reads and writes `isState`; always mounted so edits aren't lost on tab switch |
| `BalanceSheet.jsx` | Reads and writes `bsState`; same always-mounted pattern |
| `Dashboard.jsx` | Read-only; derives every KPI and chart from the current IS + BS state |
| `PDFExport.jsx` | Renders a hidden print layout off-screen (so charts can paint) and reveals it on `window.print()` |
| `Home.jsx` | Landing page with a guide modal that walks new users through the tool |
