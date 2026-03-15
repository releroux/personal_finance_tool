import { useState, Fragment } from 'react'
import Tooltip from './Tooltip'

const num = v => parseFloat(v) || 0
const fmtR = v => 'R\u00a0' + Math.round(num(v)).toLocaleString('en-US')

function AmountCell({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState('')

  const commit = () => {
    onChange(parseFloat(draft) || 0)
    setEditing(false)
  }

  if (editing) return (
    <td className="is-amount">
      <input
        autoFocus
        type="number"
        className="is-cell-input"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
      />
    </td>
  )

  return (
    <td
      className="is-amount is-editable"
      title="Click to edit"
      onClick={() => { setDraft(String(Math.round(num(value)))); setEditing(true) }}
    >
      {fmtR(value)}
    </td>
  )
}

function EditableLabel({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState('')

  const commit = () => {
    if (draft.trim()) onChange(draft.trim())
    setEditing(false)
  }

  if (editing) return (
    <input
      autoFocus
      className="is-label-input"
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
    />
  )

  return (
    <span
      className="is-editable-label"
      title="Click to rename"
      onClick={() => { setDraft(value); setEditing(true) }}
    >
      {value}
    </span>
  )
}

const SEC_INCOME = '__income__'
const SEC_DED    = '__deductions__'

function AddRow({ section, placeholder, addingTo, newItem, setNewItem, commitAdd, startAdd, setAddingTo }) {
  return addingTo === section ? (
    <tr className="is-add-row">
      <td className="is-label-indent">
        <input
          autoFocus
          className="is-add-input"
          placeholder={placeholder}
          value={newItem.label}
          onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))}
          onKeyDown={e => { if (e.key === 'Enter') commitAdd(section); if (e.key === 'Escape') setAddingTo(null) }}
        />
      </td>
      <td className="is-add-actions">
        <input
          className="is-add-input is-add-num"
          type="number"
          placeholder="Amount"
          value={newItem.actual}
          onChange={e => setNewItem(p => ({ ...p, actual: e.target.value }))}
          onKeyDown={e => { if (e.key === 'Enter') commitAdd(section); if (e.key === 'Escape') setAddingTo(null) }}
        />
        <button className="is-btn-confirm" onClick={() => commitAdd(section)}>Add</button>
        <button className="is-btn-cancel"  onClick={() => setAddingTo(null)}>✕</button>
      </td>
    </tr>
  ) : (
    <tr className="is-add-trigger">
      <td colSpan={2}>
        <button className="is-add-btn" onClick={() => startAdd(section)}>+ Add item</button>
      </td>
    </tr>
  )
}

const HINTS = {
  income:     'All money flowing into your household each month — primary salary, freelance earnings, rental income, dividends, or any other income source.',
  deductions: 'Compulsory deductions South African law. PAYE is income tax calculated on your gross salary; UIF covers you if you lose your job.',
  expenses:   'All monthly outflows from your take-home pay, grouped by category.',
  insurance:  'Long-term wealth-building and protection products: retirement annuities (RA), medical aid, gap cover, life and risk cover, and investments like unit trusts. Monthly outflows that build future value or protect against financial loss.',
  accommodation: 'Fixed monthly costs for housing and transport: rent or bond repayment, vehicle finance instalment, car insurance, and tracking subscription.',
  household:  'Recurring costs to run your home: electricity, water, rates & taxes, internet, streaming services, etc.',
  controllable: 'Budgeted amounts for your discretionary monthly expenses — fuel, groceries, dining out, entertainment.',
  large:      'Monthly amounts set aside for known future costs Examples: annual car service, holidays, home repairs, etc.',
}

export default function IncomeStatement({ isState, setIsState }) {
  const {
    salary, paye, uif, ra, ma,
    additionalIncome     = [],
    additionalDeductions = [],
    categories,
  } = isState

  const labels = {
    salary: 'Gross Salary',
    paye:   'Tax Payable (PAYE)',
    uif:    'UIF',
    ra:     'Retirement Annuity (RA)',
    ma:     'Medical Aid',
    ...(isState.labels || {}),
  }

  const [addingTo, setAddingTo] = useState(null)
  const [newItem,  setNewItem]  = useState({ label: '', actual: '' })

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalAddIncome   = additionalIncome.reduce((s, i) => s + num(i.actual), 0)
  const totalGrossIncome = num(salary) + totalAddIncome

  const totalAddDed = additionalDeductions.reduce((s, i) => s + num(i.actual), 0)
  const totalDed    = num(paye) + num(uif) + num(ra) + num(ma) + totalAddDed

  const netIncome = totalGrossIncome - totalDed

  const catTotals = categories.map(cat => cat.items.reduce((s, i) => s + num(i.actual), 0))
  const totalExp  = catTotals.reduce((s, t) => s + t, 0)
  const totalOut  = totalDed + totalExp
  const surplus   = totalGrossIncome - totalOut

  // ── State writers ──────────────────────────────────────────────────────────
  const patch = obj => setIsState(prev => ({ ...prev, ...obj }))

  const patchLabel = (key, val) => patch({ labels: { ...labels, [key]: val } })

  const updateIncomeItemLabel = (id, label) =>
    setIsState(prev => ({
      ...prev,
      additionalIncome: (prev.additionalIncome || []).map(i => i.id !== id ? i : { ...i, label }),
    }))

  const updateDeductionItemLabel = (id, label) =>
    setIsState(prev => ({
      ...prev,
      additionalDeductions: (prev.additionalDeductions || []).map(i => i.id !== id ? i : { ...i, label }),
    }))

  const updateExpenseItemLabel = (catId, itemId, label) =>
    setIsState(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== catId ? cat : {
          ...cat,
          items: cat.items.map(item => item.id !== itemId ? item : { ...item, label }),
        }
      ),
    }))

  const updateIncomeItem = (id, value) =>
    setIsState(prev => ({
      ...prev,
      additionalIncome: (prev.additionalIncome || []).map(i => i.id !== id ? i : { ...i, actual: value }),
    }))

  const deleteIncomeItem = id =>
    setIsState(prev => ({
      ...prev,
      additionalIncome: (prev.additionalIncome || []).filter(i => i.id !== id),
    }))

  const updateDeductionItem = (id, value) =>
    setIsState(prev => ({
      ...prev,
      additionalDeductions: (prev.additionalDeductions || []).map(i => i.id !== id ? i : { ...i, actual: value }),
    }))

  const deleteDeductionItem = id =>
    setIsState(prev => ({
      ...prev,
      additionalDeductions: (prev.additionalDeductions || []).filter(i => i.id !== id),
    }))

  const updateExpenseItem = (catId, itemId, value) =>
    setIsState(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== catId ? cat : {
          ...cat,
          items: cat.items.map(item => item.id !== itemId ? item : { ...item, actual: value }),
        }
      ),
    }))

  const deleteExpenseItem = (catId, itemId) =>
    setIsState(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id !== catId ? cat : { ...cat, items: cat.items.filter(i => i.id !== itemId) }
      ),
    }))

  const startAdd = section => {
    setAddingTo(section)
    setNewItem({ label: '', actual: '' })
  }

  const addRowProps = { addingTo, newItem, setNewItem, startAdd, setAddingTo }

  const commitAdd = section => {
    if (!newItem.label.trim()) return
    const entry = { id: `${section}-${Date.now()}`, label: newItem.label.trim(), actual: parseFloat(newItem.actual) || 0 }

    if (section === SEC_INCOME) {
      setIsState(prev => ({ ...prev, additionalIncome: [...(prev.additionalIncome || []), entry] }))
    } else if (section === SEC_DED) {
      setIsState(prev => ({ ...prev, additionalDeductions: [...(prev.additionalDeductions || []), entry] }))
    } else {
      setIsState(prev => ({
        ...prev,
        categories: prev.categories.map(cat =>
          cat.id !== section ? cat : { ...cat, items: [...cat.items, entry] }
        ),
      }))
    }
    setAddingTo(null)
  }

  return (
    <div className="statement">
      <div className="statement-header">
        <div>
          <h2>Income Statement</h2>
          <p className="statement-period">Monthly</p>
        </div>
        <div className={`savings-badge ${surplus >= 0 ? 'positive' : 'negative'}`}>
          {surplus >= 0 ? 'Surplus' : 'Deficit'}: {fmtR(Math.abs(surplus))}
        </div>
      </div>

      <table className="is-table">
        <colgroup>
          <col style={{ width: '75%' }} />
          <col style={{ width: '25%' }} />
        </colgroup>
        <thead>
          <tr className="is-col-header">
            <th></th>
            <th className="is-amount">Amount (R)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="is-section-header"><td colSpan={2}><Tooltip label="INCOME" text={HINTS.income} /></td></tr>
          <tr className="is-item">
            <td className="is-label-indent"><EditableLabel value={labels.salary} onChange={v => patchLabel('salary', v)} /></td>
            <AmountCell value={salary} onChange={v => patch({ salary: v })} />
          </tr>

          {additionalIncome.map(item => (
            <tr key={item.id} className="is-item is-item-del">
              <td className="is-label-indent">
                <div className="is-label-wrap">
                  <EditableLabel value={item.label} onChange={v => updateIncomeItemLabel(item.id, v)} />
                  <button className="is-del-btn" onClick={() => deleteIncomeItem(item.id)} title="Remove">×</button>
                </div>
              </td>
              <AmountCell value={item.actual} onChange={v => updateIncomeItem(item.id, v)} />
            </tr>
          ))}

          <AddRow section={SEC_INCOME} placeholder="Income source (e.g. Bonus, Rental)" commitAdd={commitAdd} {...addRowProps} />

          {totalAddIncome > 0 && (
            <tr className="is-subtotal">
              <td>Total Gross Income</td>
              <td className="is-amount">{fmtR(totalGrossIncome)}</td>
            </tr>
          )}


          <tr className="is-spacer"><td colSpan={2} /></tr>
          <tr className="is-subsection"><td colSpan={2}><Tooltip label="Deductions" text={HINTS.deductions} /></td></tr>
          <tr className="is-item">
            <td className="is-label-indent"><EditableLabel value={labels.paye} onChange={v => patchLabel('paye', v)} /></td>
            <AmountCell value={paye} onChange={v => patch({ paye: v })} />
          </tr>
          <tr className="is-item">
            <td className="is-label-indent"><EditableLabel value={labels.uif} onChange={v => patchLabel('uif', v)} /></td>
            <AmountCell value={uif} onChange={v => patch({ uif: v })} />
          </tr>
          <tr className="is-item">
            <td className="is-label-indent"><EditableLabel value={labels.ra} onChange={v => patchLabel('ra', v)} /></td>
            <AmountCell value={ra} onChange={v => patch({ ra: v })} />
          </tr>
          <tr className="is-item">
            <td className="is-label-indent"><EditableLabel value={labels.ma} onChange={v => patchLabel('ma', v)} /></td>
            <AmountCell value={ma} onChange={v => patch({ ma: v })} />
          </tr>

          {additionalDeductions.map(item => (
            <tr key={item.id} className="is-item is-item-del">
              <td className="is-label-indent">
                <div className="is-label-wrap">
                  <EditableLabel value={item.label} onChange={v => updateDeductionItemLabel(item.id, v)} />
                  <button className="is-del-btn" onClick={() => deleteDeductionItem(item.id)} title="Remove">×</button>
                </div>
              </td>
              <AmountCell value={item.actual} onChange={v => updateDeductionItem(item.id, v)} />
            </tr>
          ))}

          <AddRow section={SEC_DED} placeholder="Deduction (e.g. Pension, SDL)" commitAdd={commitAdd} {...addRowProps} />

          <tr className="is-subtotal">
            <td>Total ductions</td>
            <td className="is-amount">{fmtR(totalDed)}</td>
          </tr>


          <tr className="is-spacer"><td colSpan={2} /></tr>
          <tr className={`is-net ${netIncome >= 0 ? 'is-net-pos' : 'is-net-neg'}`}>
            <td>NET INCOME (Take-Home Pay)</td>
            <td className="is-amount">{fmtR(netIncome)}</td>
          </tr>
          <tr className="is-spacer"><td colSpan={2} /></tr>
          <tr className="is-spacer"><td colSpan={2} /></tr>


          <tr className="is-section-header"><td colSpan={2}><Tooltip label="EXPENSES" text={HINTS.expenses} /></td></tr>

          {categories.map((cat, ci) => (
            <Fragment key={cat.id}>
              <tr className="is-cat-header">
                <td colSpan={2}>
                  {HINTS[cat.id] ? <Tooltip label={cat.label} text={HINTS[cat.id]} /> : cat.label}
                </td>
              </tr>

              {cat.items.map(item => (
                <tr key={item.id} className="is-item is-item-del">
                  <td className="is-label-indent">
                    <div className="is-label-wrap">
                      <EditableLabel value={item.label} onChange={v => updateExpenseItemLabel(cat.id, item.id, v)} />
                      <button
                        className="is-del-btn"
                        onClick={() => deleteExpenseItem(cat.id, item.id)}
                        title="Remove item"
                      >×</button>
                    </div>
                  </td>
                  <AmountCell value={item.actual} onChange={v => updateExpenseItem(cat.id, item.id, v)} />
                </tr>
              ))}

              <AddRow section={cat.id} placeholder="Expense name" commitAdd={commitAdd} {...addRowProps} />

              <tr className="is-subtotal">
                <td>Subtotal: {cat.label}</td>
                <td className="is-amount">{fmtR(catTotals[ci])}</td>
              </tr>
              <tr className="is-spacer"><td colSpan={2} /></tr>
            </Fragment>
          ))}


          <tr className="is-total">
            <td>TOTAL EXPENSES</td>
            <td className="is-amount">{fmtR(totalExp)}</td>
          </tr>
          <tr className="is-spacer"><td colSpan={2} /></tr>

          <tr className="is-total">
            <td>TOTAL ALL OUTFLOWS (Deductions + Expenses)</td>
            <td className="is-amount">{fmtR(totalOut)}</td>
          </tr>
          <tr className="is-spacer"><td colSpan={2} /></tr>

          <tr className={`is-surplus ${surplus >= 0 ? 'is-surplus-pos' : 'is-surplus-neg'}`}>
            <td>SURPLUS / (DEFICIT)</td>
            <td className="is-amount">
              {surplus < 0 ? `(${fmtR(Math.abs(surplus))})` : fmtR(surplus)}
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  )
}
