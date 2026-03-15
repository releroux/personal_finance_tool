// ── Income Statement defaults ────────────────────────────────────────────────
// Benchmarked against StatsSA Household Income & Expenditure Survey 2023:
//   Avg annual household income R204 359 → ~R17 000/month (68.8% from employment)
//   Avg annual consumption expenditure R143 691 → ~R11 974/month
//   https://www.statssa.gov.za/?p=17995
export const IS_DEFAULTS = {
  salary: 17000,
  paye:   1600,
  uif:    177,
  ra:     200,
  labels: {
    salary: 'Gross Salary',
    paye:   'Tax Payable (PAYE)',
    uif:    'UIF',
    ra:     'Retirement Annuity (RA)',
    ma:     'Medical Aid',
  },
  additionalIncome:     [],
  additionalDeductions: [],
  categories: [
    {
      id: 'insurance',
      label: 'Insurance, Retirement & Investments',
      items: [
        { id: 'home_insur', label: 'Home Content Insurance',  actual: 200 },
        { id: 'ut',         label: 'Unit Trust Investments',  actual: 0   },
      ],
    },
    {
      id: 'accommodation',
      label: 'Accommodation & Vehicle',
      items: [
        { id: 'accom',   label: 'Accommodation', actual: 3500 },
        { id: 'carPrem', label: 'Car Premium',    actual: 700  },
        { id: 'carIns',  label: 'Car Insurance',  actual: 280  },
      ],
    },
    {
      id: 'household',
      label: 'Household & Utilities',
      items: [
        { id: 'bank',   label: 'Bank Costs',         actual: 150 },
        { id: 'levies', label: 'Levies',              actual: 350 },
        { id: 'rates',  label: 'Rates',               actual: 250 },
        { id: 'water',  label: 'Water & Electricity', actual: 700 },
        { id: 'fibre',  label: 'Internet',            actual: 500 },
      ],
    },
    {
      id: 'living_exp',
      label: 'Living Expenses',
      items: [
        { id: 'fuel',     label: 'Fuel',                actual: 750  },
        { id: 'food',     label: 'Food',                actual: 2000 },
        { id: 'entertai', label: 'Entertainment',       actual: 1000 },
        { id: 'stream',   label: 'Streaming Services',  actual: 200  },
      ],
    },
    {
      id: 'large',
      label: 'Future Large Expense Provisioning',
      items: [
        { id: 'holiday',     label: 'December Holiday',    actual: 500 },
        { id: 'maintenance', label: 'Vehicle Maintenance', actual: 200 },
      ],
    },
  ],
}

// ── Balance Sheet defaults ───────────────────────────────────────────────────
export const BS_DEFAULTS = {
  assetCategories: [
    {
      id: 'current',
      label: 'Current Assets (Liquid)',
      items: [
        { id: 'cash',        label: 'Cash & Checking Accounts',                value: 5000  },
        { id: 'savings',     label: 'Savings Accounts',                        value: 20000 },
        { id: 'emergency',   label: 'Emergency Fund',                          value: 15000 },
        { id: 'investments', label: 'Investment Portfolio (Stocks/Bonds/ETFs)', value: 45000 },
        { id: 'pension',     label: 'Pension Fund',                            value: 85000 },
        { id: 'otherLiquid', label: 'Other Liquid Assets',                     value: 0     },
      ],
    },
    {
      id: 'fixed',
      label: 'Fixed Assets (Non-Liquid)',
      items: [
        { id: 'house',      label: 'Primary Residence (House)',           value: 850000 },
        { id: 'vehicle',    label: 'Vehicle(s)',                          value: 200000 },
        { id: 'otherProp',  label: 'Other Property / Real Estate',        value: 0      },
        { id: 'jewelry',    label: 'Jewelry / Collectibles / Valuables',  value: 0      },
        { id: 'otherFixed', label: 'Other Fixed Assets',                  value: 0      },
      ],
    },
  ],
  liabilityCategories: [
    {
      id: 'current',
      label: 'Current Liabilities (Short-Term)',
      items: [
        { id: 'creditCard',   label: 'Credit Card Balances',         value: 5000 },
        { id: 'personalLoan', label: 'Personal Loans (Short-Term)',  value: 0    },
        { id: 'otherShort',   label: 'Other Short-Term Liabilities', value: 0    },
      ],
    },
    {
      id: 'longTerm',
      label: 'Long-Term Liabilities',
      items: [
        { id: 'mortgage',     label: 'Mortgage (House)',          value: 710000 },
        { id: 'vehicleLoan',  label: 'Vehicle Loan',              value: 165000 },
        { id: 'studentLoans', label: 'Student Loans',             value: 0      },
        { id: 'otherLtDebt',  label: 'Other Long-Term Debt',      value: 0      },
        { id: 'otherLtLiab',  label: 'Other Long-Term Liabilities', value: 0    },
      ],
    },
  ],
}
