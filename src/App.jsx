import { useState } from 'react'

function ResetConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal reset-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Reset all data?</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <p className="reset-modal-body">
            All values will return to their defaults. <strong>This cannot be undone.</strong>
          </p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="modal-btn-danger" onClick={onConfirm}>Reset</button>
        </div>
      </div>
    </div>
  )
}

import IncomeStatement from './components/IncomeStatement'
import BalanceSheet from './components/BalanceSheet'
import Dashboard from './components/Dashboard'
import PDFExport from './components/PDFExport'
import Home from './components/Home'
import { IS_DEFAULTS, BS_DEFAULTS } from './defaults'
import './App.css'

const TABS = [
  { id: 'home',      label: 'Home' },
  { id: 'income',    label: 'Income Statement' },
  { id: 'balance',   label: 'Balance Sheet' },
  { id: 'dashboard', label: 'Dashboard' },
]
const TAB_ORDER = TABS.reduce((acc, t, i) => ({ ...acc, [t.id]: i }), {})

export default function App() {
  const [isState, setIsState] = useState(IS_DEFAULTS)
  const [bsState, setBsState] = useState(BS_DEFAULTS)
  const [activeTab, setActiveTab] = useState('home')
  const [dark, setDark] = useState(false)
  const [slideDir, setSlideDir] = useState('right')
  const [animKeys, setAnimKeys] = useState({ home: 0, income: 0, balance: 0, dashboard: 0 })
  const [showReset, setShowReset] = useState(false)

  const handleTabChange = (tabId) => {
    const dir = TAB_ORDER[tabId] > TAB_ORDER[activeTab] ? 'right' : 'left'
    setSlideDir(dir)
    setAnimKeys(k => ({ ...k, [tabId]: k[tabId] + 1 }))
    setActiveTab(tabId)
  }

  const confirmReset = () => {
    setIsState(IS_DEFAULTS)
    setBsState(BS_DEFAULTS)
    setShowReset(false)
  }

  return (
    <div className={`app${dark ? ' dark' : ''}`}>
      {showReset && <ResetConfirmModal onConfirm={confirmReset} onCancel={() => setShowReset(false)} />}
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo">📊</span>
          <h1>Personal Finance Dashboard</h1>
        </div>
        <div className="app-header-right">
          <a
            className="github-link"
            href="https://github.com/releroux/personal_finance_tool"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          <button className="dark-toggle" onClick={() => setDark(d => !d)}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      <div className="app-body">
        <div className="statement-panel">
          {activeTab !== 'home' && (
            <div className="tabs">
              <div className="tabs-left">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="tabs-right">
                <PDFExport isState={isState} bsState={bsState} />
                <button className="reset-btn" onClick={() => setShowReset(true)} title="Reset all data">
                  Reset
                </button>
              </div>
            </div>
          )}

          <div className="tab-content">
            {activeTab === 'home' && (
              <div key={`home-${animKeys.home}`} className={`tab-slide slide-from-${slideDir}`}>
                <Home onGetStarted={() => handleTabChange('income')} />
              </div>
            )}
            {/* Always mounted so committed edits persist across tab switches */}
            <div style={{ display: activeTab === 'income' ? '' : 'none' }}>
              <div key={`income-${animKeys.income}`} className={`tab-slide slide-from-${slideDir}`}>
                <IncomeStatement isState={isState} setIsState={setIsState} />
              </div>
            </div>
            <div style={{ display: activeTab === 'balance' ? '' : 'none' }}>
              <div key={`balance-${animKeys.balance}`} className={`tab-slide slide-from-${slideDir}`}>
                <BalanceSheet bsState={bsState} setBsState={setBsState} />
              </div>
            </div>
            {activeTab === 'dashboard' && (
              <div key={`dashboard-${animKeys.dashboard}`} className={`tab-slide slide-from-${slideDir}`}>
                <Dashboard isState={isState} bsState={bsState} />
              </div>
            )}
          </div>

          {activeTab !== 'home' && (
            <footer className="tool-disclaimer">
              <strong>Disclaimer:</strong> This tool is generated from self-reported personal financial
              data for personal reference only. It does not constitute financial advice. Consult a qualified
              financial adviser before making investment or financial decisions. All amounts are in South African Rand (ZAR).
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}
