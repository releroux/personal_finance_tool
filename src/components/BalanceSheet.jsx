import { useState, Fragment } from 'react'
import Tooltip from './Tooltip'

const HINTS = {
  assets:    'Everything you own that has monetary value. Split into current assets (liquid, accessible within 12 months) and fixed assets (long-term, less liquid). Total Assets = Current + Fixed.',
  liabilities: 'All money you owe to others. Split into current liabilities (due within 12 months) and long-term liabilities (due after 12 months). Net Worth = Assets − Liabilities.',
  assetCurrent: 'Assets you can convert to cash within 12 months: cheque and savings accounts, emergency fund, money market investments, and liquid unit trusts or ETFs.',
  assetFixed:   'Long-term assets not easily converted to cash. Property typically appreciates over time; vehicles depreciate. These form the backbone of long-term wealth.',
  liabCurrent:  'Debts due within the next 12 months: credit card balances, short-term personal loans, and any taxes owing. These require active cash flow management.',
  liabLongTerm: 'Debts repayable over periods longer than 12 months: your home bond (mortgage) and vehicle finance. Usually secured against the underlying asset.',
}

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

export default function BalanceSheet({ bsState, setBsState }) {
  const { assetCategories, liabilityCategories } = bsState

  const [addingTo, setAddingTo] = useState(null) // { arrayKey, catId }
  const [newItem,  setNewItem]  = useState({ label: '', value: '' })

  // ── Derived ────────────────────────────────────────────────────────────────
  const assetTotals   = assetCategories.map(cat => cat.items.reduce((s, i) => s + num(i.value), 0))
  const totalAssets   = assetTotals.reduce((s, t) => s + t, 0)
  const liabTotals    = liabilityCategories.map(cat => cat.items.reduce((s, i) => s + num(i.value), 0))
  const totalLiab     = liabTotals.reduce((s, t) => s + t, 0)
  const netWorth      = totalAssets - totalLiab

  // ── State writers ──────────────────────────────────────────────────────────
  const updateItem = (arrayKey, catId, itemId, value) =>
    setBsState(prev => ({
      ...prev,
      [arrayKey]: prev[arrayKey].map(cat =>
        cat.id !== catId ? cat : {
          ...cat,
          items: cat.items.map(item => item.id !== itemId ? item : { ...item, value }),
        }
      ),
    }))

  const deleteItem = (arrayKey, catId, itemId) =>
    setBsState(prev => ({
      ...prev,
      [arrayKey]: prev[arrayKey].map(cat =>
        cat.id !== catId ? cat : { ...cat, items: cat.items.filter(i => i.id !== itemId) }
      ),
    }))

  const startAdd = (arrayKey, catId) => {
    setAddingTo({ arrayKey, catId })
    setNewItem({ label: '', value: '' })
  }

  const commitAdd = () => {
    if (!newItem.label.trim() || !addingTo) return
    const { arrayKey, catId } = addingTo
    setBsState(prev => ({
      ...prev,
      [arrayKey]: prev[arrayKey].map(cat =>
        cat.id !== catId ? cat : {
          ...cat,
          items: [...cat.items, {
            id: `new-${Date.now()}`,
            label: newItem.label.trim(),
            value: parseFloat(newItem.value) || 0,
          }],
        }
      ),
    }))
    setAddingTo(null)
  }

  const isAdding = (arrayKey, catId) =>
    addingTo?.arrayKey === arrayKey && addingTo?.catId === catId

  const catHint = (arrayKey, catId) => {
    if (arrayKey === 'assetCategories') return catId === 'current' ? HINTS.assetCurrent : HINTS.assetFixed
    return catId === 'current' ? HINTS.liabCurrent : HINTS.liabLongTerm
  }

  const CategoryRows = ({ arrayKey, categories, totals }) =>
    categories.map((cat, ci) => (
      <Fragment key={cat.id}>
        <tr className="is-cat-header">
          <td colSpan={2}><Tooltip label={cat.label} text={catHint(arrayKey, cat.id)} /></td>
        </tr>

        {cat.items.map(item => (
          <tr key={item.id} className="is-item is-item-del">
            <td className="is-label-indent">
              <div className="is-label-wrap">
                <span>{item.label}</span>
                <button
                  className="is-del-btn"
                  onClick={() => deleteItem(arrayKey, cat.id, item.id)}
                  title="Remove item"
                >×</button>
              </div>
            </td>
            <AmountCell
              value={item.value}
              onChange={v => updateItem(arrayKey, cat.id, item.id, v)}
            />
          </tr>
        ))}

        {isAdding(arrayKey, cat.id) ? (
          <tr className="is-add-row">
            <td className="is-label-indent">
              <input
                autoFocus
                className="is-add-input"
                placeholder="Line item name"
                value={newItem.label}
                onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') setAddingTo(null) }}
              />
            </td>
            <td className="is-add-actions">
              <input
                className="is-add-input is-add-num"
                type="number"
                placeholder="Amount"
                value={newItem.value}
                onChange={e => setNewItem(p => ({ ...p, value: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') setAddingTo(null) }}
              />
              <button className="is-btn-confirm" onClick={commitAdd}>Add</button>
              <button className="is-btn-cancel"  onClick={() => setAddingTo(null)}>✕</button>
            </td>
          </tr>
        ) : (
          <tr className="is-add-trigger">
            <td colSpan={2}>
              <button className="is-add-btn" onClick={() => startAdd(arrayKey, cat.id)}>+ Add item</button>
            </td>
          </tr>
        )}

        <tr className="is-subtotal">
          <td>Total {cat.label}</td>
          <td className="is-amount">{fmtR(totals[ci])}</td>
        </tr>
        <tr className="is-spacer"><td colSpan={2} /></tr>
      </Fragment>
    ))

  const today = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="statement">
      <div className="statement-header">
        <div>
          <h2>Balance Sheet</h2>
          <p className="statement-period">As of {today}</p>
        </div>
        <div className={`savings-badge ${netWorth >= 0 ? 'positive' : 'negative'}`}>
          Net Worth: {fmtR(netWorth)}
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

          {/* ── ASSETS ──────────────────────────────────────────────────── */}
          <tr className="is-section-header"><td colSpan={2}><Tooltip label="ASSETS" text={HINTS.assets} /></td></tr>
          <CategoryRows
            arrayKey="assetCategories"
            categories={assetCategories}
            totals={assetTotals}
          />
          <tr className="is-total">
            <td>TOTAL ASSETS</td>
            <td className="is-amount">{fmtR(totalAssets)}</td>
          </tr>

          <tr className="is-spacer"><td colSpan={2} /></tr>
          <tr className="is-spacer"><td colSpan={2} /></tr>

          {/* ── LIABILITIES ─────────────────────────────────────────────── */}
          <tr className="is-section-header"><td colSpan={2}><Tooltip label="LIABILITIES" text={HINTS.liabilities} /></td></tr>
          <CategoryRows
            arrayKey="liabilityCategories"
            categories={liabilityCategories}
            totals={liabTotals}
          />
          <tr className="is-total">
            <td>TOTAL LIABILITIES</td>
            <td className="is-amount">{fmtR(totalLiab)}</td>
          </tr>

          <tr className="is-spacer"><td colSpan={2} /></tr>
          <tr className="is-spacer"><td colSpan={2} /></tr>

          {/* ── NET WORTH ───────────────────────────────────────────────── */}
          <tr className={`is-surplus ${netWorth >= 0 ? 'is-surplus-pos' : 'is-surplus-neg'}`}>
            <td>NET WORTH (Assets − Liabilities)</td>
            <td className="is-amount">
              {netWorth < 0 ? `(${fmtR(Math.abs(netWorth))})` : fmtR(netWorth)}
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  )
}
