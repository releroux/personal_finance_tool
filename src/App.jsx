import { useState } from 'react'
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
  const [dark, setDark] = useState(true)
  const [slideDir, setSlideDir] = useState('right')
  const [animKeys, setAnimKeys] = useState({ home: 0, income: 0, balance: 0, dashboard: 0 })

  const handleTabChange = (tabId) => {
    const dir = TAB_ORDER[tabId] > TAB_ORDER[activeTab] ? 'right' : 'left'
    setSlideDir(dir)
    setAnimKeys(k => ({ ...k, [tabId]: k[tabId] + 1 }))
    setActiveTab(tabId)
  }

  const resetData = () => {
    if (window.confirm('Reset all data to defaults? This cannot be undone.')) {
      setIsState(IS_DEFAULTS)
      setBsState(BS_DEFAULTS)
    }
  }

  return (
    <div className={`app${dark ? ' dark' : ''}`}>
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo">📊</span>
          <h1>Personal Finance Dashboard</h1>
        </div>
        <button className="dark-toggle" onClick={() => setDark(d => !d)}>
          {dark ? '☀️' : '🌙'}
        </button>
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
                <button className="reset-btn" onClick={resetData} title="Reset all data">
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
