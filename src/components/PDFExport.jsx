import { createPortal } from 'react-dom'
import KPICards from './Dashboard'

const num = v => parseFloat(v) || 0
const fmtR = v => 'R ' + Math.round(num(v)).toLocaleString('en-US')

const DISCLAIMER =
  'This report is generated from self-reported personal financial data for personal reference only. ' +
  'It does not constitute financial advice, and the figures have not been audited or verified by any third party. ' +
  'Consult a qualified financial adviser before making investment or financial decisions. ' +
  'All amounts are in South African Rand (ZAR).'

function PrintLayout({ isState, bsState }) {
  const today = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })

  // ── IS calculations (for the IS table only) ─────────────────────────────
  const { salary, paye, uif, ra, ma, additionalIncome = [], additionalDeductions = [], categories } = isState
  const totalAddIncome  = additionalIncome.reduce((s, i) => s + num(i.actual), 0)
  const totalGrossIncome = num(salary) + totalAddIncome
  const totalAddDed     = additionalDeductions.reduce((s, i) => s + num(i.actual), 0)
  const totalDed        = num(paye) + num(uif) + num(ra) + num(ma) + totalAddDed
  const netIncome       = totalGrossIncome - totalDed
  const totalExp        = categories.reduce((s, cat) => s + cat.items.reduce((ss, i) => ss + num(i.actual), 0), 0)
  const surplus         = netIncome - totalExp
  const surplusPos      = surplus >= 0

  // ── BS calculations (for the BS table only) ─────────────────────────────
  const { assetCategories, liabilityCategories } = bsState
  const totalAssets = assetCategories.reduce((s, cat) => s + cat.items.reduce((ss, i) => ss + num(i.value), 0), 0)
  const totalLiab   = liabilityCategories.reduce((s, cat) => s + cat.items.reduce((ss, i) => ss + num(i.value), 0), 0)
  const netWorth    = totalAssets - totalLiab

  return (
    <div className="pdf-print-root">

      {/* Fixed footer — repeats on every printed page */}
      <div className="pdf-page-footer">
        <strong>Disclaimer:</strong> {DISCLAIMER}
      </div>

      {/* ── PAGE 1: Dashboard ─────────────────────────────────────────── */}
      <div className="pdf-page">
        <div className="pdf-page-header">
          <p className="pdf-report-title">Personal Finance Dashboard — Financial Report</p>
          <p className="pdf-report-subtitle">Generated on {today}</p>
        </div>
        <KPICards isState={isState} bsState={bsState} />
      </div>

      {/* ── PAGE 2: Income Statement ──────────────────────────────────── */}
      <div className="pdf-page pdf-page-break">
        <div className="pdf-page-header">
          <p className="pdf-section-heading">Income Statement</p>
        </div>
        <table className="pdf-table">
          <colgroup>
            <col style={{ width: '75%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr><th>Description</th><th style={{ textAlign: 'right' }}>Amount</th></tr>
          </thead>
          <tbody>
            <tr className="pdf-section-header"><td colSpan={2}>INCOME</td></tr>
            <tr><td style={{ paddingLeft: 20 }}>Salary</td><td style={{ textAlign: 'right' }}>{fmtR(salary)}</td></tr>
            {additionalIncome.map(i => (
              <tr key={i.id}><td style={{ paddingLeft: 20 }}>{i.label || 'Additional Income'}</td><td style={{ textAlign: 'right' }}>{fmtR(i.actual)}</td></tr>
            ))}
            {additionalIncome.length > 0 && (
              <tr className="pdf-total-row"><td>Total Gross Income</td><td style={{ textAlign: 'right' }}>{fmtR(totalGrossIncome)}</td></tr>
            )}

            <tr className="pdf-section-header"><td colSpan={2}>DEDUCTIONS</td></tr>
            <tr><td style={{ paddingLeft: 20 }}>PAYE</td><td style={{ textAlign: 'right' }}>({fmtR(paye)})</td></tr>
            <tr><td style={{ paddingLeft: 20 }}>UIF</td><td style={{ textAlign: 'right' }}>({fmtR(uif)})</td></tr>
            {num(ra) > 0 && <tr><td style={{ paddingLeft: 20 }}>Retirement Annuity (RA)</td><td style={{ textAlign: 'right' }}>({fmtR(ra)})</td></tr>}
            {num(ma) > 0 && <tr><td style={{ paddingLeft: 20 }}>Medical Aid</td><td style={{ textAlign: 'right' }}>({fmtR(ma)})</td></tr>}
            {additionalDeductions.map(i => (
              <tr key={i.id}><td style={{ paddingLeft: 20 }}>{i.label || 'Additional Deduction'}</td><td style={{ textAlign: 'right' }}>({fmtR(i.actual)})</td></tr>
            ))}
            <tr className="pdf-total-row"><td>Total Deductions</td><td style={{ textAlign: 'right' }}>({fmtR(totalDed)})</td></tr>
            <tr className="pdf-net-row"><td>NET INCOME (Take-Home Pay)</td><td style={{ textAlign: 'right' }}>{fmtR(netIncome)}</td></tr>

            <tr className="pdf-section-header"><td colSpan={2}>EXPENSES</td></tr>
            {categories.map(cat => (
              <>
                <tr key={cat.id} className="pdf-cat-header"><td colSpan={2}>{cat.label}</td></tr>
                {cat.items.map(item => (
                  <tr key={item.id}><td style={{ paddingLeft: 20 }}>{item.label}</td><td style={{ textAlign: 'right' }}>{fmtR(item.actual)}</td></tr>
                ))}
                <tr className="pdf-total-row">
                  <td style={{ paddingLeft: 10 }}>Subtotal — {cat.label}</td>
                  <td style={{ textAlign: 'right' }}>{fmtR(cat.items.reduce((s, i) => s + num(i.actual), 0))}</td>
                </tr>
              </>
            ))}
            <tr className="pdf-total-row"><td>TOTAL EXPENSES</td><td style={{ textAlign: 'right' }}>({fmtR(totalExp)})</td></tr>
            <tr className={surplusPos ? 'pdf-surplus-row' : 'pdf-deficit-row'}>
              <td>{surplusPos ? 'SURPLUS' : 'DEFICIT'}</td>
              <td style={{ textAlign: 'right' }}>{surplusPos ? fmtR(surplus) : `(${fmtR(Math.abs(surplus))})`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── PAGE 3: Balance Sheet ─────────────────────────────────────── */}
      <div className="pdf-page pdf-page-break">
        <div className="pdf-page-header">
          <p className="pdf-section-heading">Balance Sheet</p>
        </div>
        <table className="pdf-table">
          <colgroup>
            <col style={{ width: '75%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr><th>Description</th><th style={{ textAlign: 'right' }}>Value</th></tr>
          </thead>
          <tbody>
            <tr className="pdf-section-header"><td colSpan={2}>ASSETS</td></tr>
            {assetCategories.map(cat => {
              const catTotal = cat.items.reduce((s, i) => s + num(i.value), 0)
              return (
                <>
                  <tr key={cat.id} className="pdf-cat-header"><td colSpan={2}>{cat.label}</td></tr>
                  {cat.items.map(item => (
                    <tr key={item.id}><td style={{ paddingLeft: 20 }}>{item.label}</td><td style={{ textAlign: 'right' }}>{fmtR(item.value)}</td></tr>
                  ))}
                  <tr className="pdf-total-row">
                    <td style={{ paddingLeft: 10 }}>Subtotal — {cat.label}</td>
                    <td style={{ textAlign: 'right' }}>{fmtR(catTotal)}</td>
                  </tr>
                </>
              )
            })}
            <tr className="pdf-total-row"><td>TOTAL ASSETS</td><td style={{ textAlign: 'right' }}>{fmtR(totalAssets)}</td></tr>

            <tr className="pdf-section-header"><td colSpan={2}>LIABILITIES</td></tr>
            {liabilityCategories.map(cat => {
              const catTotal = cat.items.reduce((s, i) => s + num(i.value), 0)
              return (
                <>
                  <tr key={cat.id} className="pdf-cat-header"><td colSpan={2}>{cat.label}</td></tr>
                  {cat.items.map(item => (
                    <tr key={item.id}><td style={{ paddingLeft: 20 }}>{item.label}</td><td style={{ textAlign: 'right' }}>{fmtR(item.value)}</td></tr>
                  ))}
                  <tr className="pdf-total-row">
                    <td style={{ paddingLeft: 10 }}>Subtotal — {cat.label}</td>
                    <td style={{ textAlign: 'right' }}>({fmtR(catTotal)})</td>
                  </tr>
                </>
              )
            })}
            <tr className="pdf-total-row"><td>TOTAL LIABILITIES</td><td style={{ textAlign: 'right' }}>({fmtR(totalLiab)})</td></tr>
            <tr className={netWorth >= 0 ? 'pdf-net-worth-row' : 'pdf-deficit-row'}>
              <td>NET WORTH</td>
              <td style={{ textAlign: 'right' }}>{netWorth >= 0 ? fmtR(netWorth) : `(${fmtR(Math.abs(netWorth))})`}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default function PDFExport({ isState, bsState }) {
  return (
    <>
      <button className="export-btn" onClick={() => window.print()}>
        Export PDF
      </button>
      {createPortal(
        <PrintLayout isState={isState} bsState={bsState} />,
        document.body
      )}
    </>
  )
}
