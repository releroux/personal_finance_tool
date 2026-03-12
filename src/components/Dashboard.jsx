import {
  ResponsiveContainer,
  PieChart, Pie,
  Tooltip,
} from 'recharts'

const num = v => parseFloat(v) || 0
const pct = v => `${(v * 100).toFixed(1)}%`
const fmtR = v => 'R\u00a0' + Math.round(num(v)).toLocaleString('en-US')

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#f97316', '#ec4899', '#6366f1', '#14b8a6']

// ── Interpretation functions ──────────────────────────────────────────────
function interpNetMargin(r) {
  if (r >= 0.20) return { text: 'Excellent — saving 20%+',        status: 'good'    }
  if (r >= 0.10) return { text: 'Good — aim for 20%',             status: 'warning' }
  if (r >  0)    return { text: 'Low — increase savings',          status: 'warning' }
  return               { text: 'Deficit — expenses exceed income', status: 'bad'     }
}
function interpDebtToAsset(r) {
  if (r <= 0.40) return { text: 'Conservative leverage',          status: 'good'    }
  if (r <= 0.65) return { text: 'Moderate — monitor debt',        status: 'warning' }
  return               { text: 'High leverage — reduce debt',      status: 'bad'     }
}
function interpEquityRatio(r) {
  if (r >= 0.50) return { text: 'Strong equity position',         status: 'good'    }
  if (r >= 0.25) return { text: 'Moderate — build equity',        status: 'warning' }
  return               { text: 'Weak — high leverage',            status: 'bad'     }
}
function interpDeductionsPct(r) {
  if (r <= 0.25) return { text: 'Low deductions from gross',      status: 'good'    }
  if (r <= 0.35) return { text: 'Moderate — typical range',       status: 'warning' }
  return               { text: 'High deductions from gross',      status: 'bad'     }
}

// ── Summary metric tile ───────────────────────────────────────────────────
function Metric({ label, value, color, sub }) {
  return (
    <div className="sum-metric">
      <div className="sum-label">{label}</div>
      <div className="sum-value" style={{ color }}>{value}</div>
      {/* {sub && <div className="sum-sub">{sub}</div>} */}
    </div>
  )
}

// ── Chart tooltip ─────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tip">
      <div className="chart-tip-label">{payload[0].name ?? label}</div>
      <div className="chart-tip-val">{fmtR(payload[0].value)}</div>
    </div>
  )
}

// ── Ratio item ────────────────────────────────────────────────────────────
function RatioCard({ name, value, interp, formula }) {
  return (
    <div className="ratio-item">
      <div className="ratio-item-label">
        <span>{name}</span>
        <span className="ratio-tooltip-wrap">
          <span className="ratio-q">?</span>
          <span className="ratio-tooltip">{formula}</span>
        </span>
      </div>
      <div className={`sum-value ratio-item-val-${interp.status}`}>{value}</div>
      <div className={`sum-sub ratio-item-interp-${interp.status}`}>{interp.text}</div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function KPICards({ isState, bsState }) {
  const { salary, paye, uif, ra, ma, additionalIncome = [], additionalDeductions = [], categories } = isState

  const catSum = catId => {
    const cat = categories.find(c => c.id === catId)
    return cat ? cat.items.reduce((s, i) => s + num(i.actual), 0) : 0
  }

  const totalAddIncome = additionalIncome.reduce((s, i) => s + num(i.actual), 0)
  const grossIncome    = num(salary) + totalAddIncome
  const totalAddDed    = additionalDeductions.reduce((s, i) => s + num(i.actual), 0)
  const totalDed       = num(paye) + num(uif) + num(ra) + num(ma) + totalAddDed
  const netIncome      = grossIncome - totalDed
  const totalExp       = categories.reduce((s, cat) => s + cat.items.reduce((ss, i) => ss + num(i.actual), 0), 0)
  const surplus        = netIncome - totalExp

  const netMargin     = netIncome > 0 ? surplus / netIncome : 0
  const deductionsPct = grossIncome > 0 ? totalDed / grossIncome : 0

  // BS figures
  const { assetCategories, liabilityCategories } = bsState
  const bsAssetCatSum = catId => {
    const cat = assetCategories.find(c => c.id === catId)
    return cat ? cat.items.reduce((s, i) => s + num(i.value), 0) : 0
  }
  const bsLiabCatSum = catId => {
    const cat = liabilityCategories.find(c => c.id === catId)
    return cat ? cat.items.reduce((s, i) => s + num(i.value), 0) : 0
  }

  const totalCurrentAssets = bsAssetCatSum('current')
  const totalAssets        = totalCurrentAssets + bsAssetCatSum('fixed')
  const totalCurrentLiab   = bsLiabCatSum('current')
  const totalLiab          = totalCurrentLiab + bsLiabCatSum('longTerm')
  const netWorth           = totalAssets - totalLiab

  const debtToAsset = totalAssets > 0 ? totalLiab / totalAssets : 0
  const equityRatio = totalAssets > 0 ? netWorth / totalAssets : 0

  // Pie data
  const pieData = categories
    .map((cat, i) => ({ name: cat.label, value: catSum(cat.id), fill: COLORS[i % COLORS.length] }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)

  return (
    <div className="statement">
      <div className="statement-header">
        <h2>My Financial State</h2>
        <p className="statement-period">Based on current month actuals</p>
      </div>

      {/* ── 1. Summary metrics ──────────────────────────────────────────── */}
      <div className="sum-grid">
        <div className="sum-group">
          <div className="sum-group-label">Income Statement</div>
          <div className="sum-metrics">
            <Metric label="Gross Income"    value={fmtR(grossIncome)} color="#6f6e6e" />
            <Metric label="Net Income"      value={fmtR(netIncome)}   color="#6f6e6e"
              sub={`after ${fmtR(totalDed)} deductions`} />
            <Metric label="Total Expenses"  value={fmtR(totalExp)}    color="#6f6e6e" />
            <Metric
              label={surplus >= 0 ? 'Monthly Surplus' : 'Monthly Deficit'}
              value={surplus >= 0 ? fmtR(surplus) : `(${fmtR(Math.abs(surplus))})`}
              color={surplus >= 0 ? '#16a34a' : '#dc2626'}
              sub={`${pct(Math.abs(netMargin))} of net income`}
            />
          </div>
        </div>

        <div className="sum-divider" />

        <div className="sum-group">
          <div className="sum-group-label">Balance Sheet</div>
          <div className="sum-metrics">
            <Metric label="Total Assets"      value={fmtR(totalAssets)} color="#6f6e6e" />
            <Metric label="Total Liabilities" value={fmtR(totalLiab)}   color="#6f6e6e" />
            <Metric
              label="Net Worth"
              value={netWorth >= 0 ? fmtR(netWorth) : `(${fmtR(Math.abs(netWorth))})`}
              color={netWorth >= 0 ? '#16a34a' : '#dc2626'}
              sub={`${pct(equityRatio)} equity`}
            />
          </div>
        </div>
      </div>

      {/* ── 2. Charts + Ratio cards ──────────────────────────────────────── */}
      <div className="charts-grid">
        <div className="chart-box">
          <div className="chart-heading">Expense Category Breakdown</div>
          <div className="pie-recharts-wrap">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={82} dataKey="value" stroke="#fff" strokeWidth={1.5} />
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="pie-legend">
              {pieData.map((d, i) => (
                <li key={i} className="pie-legend-item">
                  <span className="legend-dot" style={{ background: d.fill }} />
                  <span className="legend-name">{d.name}</span>
                  <span className="legend-val">
                    {((d.value / pieData.reduce((s, x) => s + x.value, 0)) * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="chart-box">
          <div className="chart-heading">Key Ratios</div>
          <div className="ratio-items">
            <RatioCard
              name="Net Profit Margin"
              value={pct(netMargin)}
              interp={interpNetMargin(netMargin)}
              formula="Surplus ÷ Net Income"
            />
            <RatioCard
              name="Deductions"
              value={pct(deductionsPct)}
              interp={interpDeductionsPct(deductionsPct)}
              formula="Total Deductions ÷ Gross Salary"
            />
            <RatioCard
              name="Debt-to-Asset"
              value={pct(debtToAsset)}
              interp={interpDebtToAsset(debtToAsset)}
              formula="Total Liabilities ÷ Total Assets"
            />
            <RatioCard
              name="Equity Ratio"
              value={pct(equityRatio)}
              interp={interpEquityRatio(equityRatio)}
              formula="Net Worth ÷ Total Assets"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
