import { useState } from 'react'

function GuideModal({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">How to use this tool</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="guide-section">
            <h3>Editing values</h3>
            <p>Click any amount to edit it inline. Press <kbd>Enter</kbd> to save or <kbd>Esc</kbd> to cancel. All values update instantly across every tab.</p>
          </div>
          <div className="guide-section">
            <h3>Adding &amp; removing items</h3>
            <p>Use the <strong>+ Add item</strong> button below any category to add a custom line item. Hover over an existing item and click the <strong>×</strong> that appears to delete it.</p>
          </div>
          <div className="guide-section">
            <h3>The three tabs</h3>
            <ul className="guide-list">
              <li><strong>Income Statement</strong> — Enter your monthly income, taxes, and expenses. Your cash flow surplus or deficit is calculated automatically.</li>
              <li><strong>Balance Sheet</strong> — Record everything you own (assets) and everything you owe (liabilities). Net worth is calculated as Assets − Liabilities.</li>
              <li><strong>Dashboard</strong> — Financial health KPIs and charts derived from your IS and BS data — savings rate, debt ratios, liquidity, and more.</li>
            </ul>
          </div>
          <div className="guide-section">
            <h3>A few things to know</h3>
            <ul className="guide-list">
              <li>All data lives in memory — <strong>refreshing the page resets everything</strong> to the default values.</li>
              <li>All amounts are in <strong>South African Rand (ZAR)</strong>.</li>
              <li>This tool does not store or transmit any of your data.</li>
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn-primary" onClick={onConfirm}>Let's go →</button>
        </div>
      </div>
    </div>
  )
}

export default function Home({ onGetStarted }) {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <div className="home-page">
      {showGuide && (
        <GuideModal
          onClose={() => setShowGuide(false)}
          onConfirm={() => { setShowGuide(false); onGetStarted() }}
        />
      )}
      <div className="home-hero">
        <div className="home-logo">📊</div>
        <h2 className="home-title">Personal Finance Dashboard</h2>
        <p className="home-subtitle">Your finances, viewed like a business.</p>
      </div>

      <div className="home-sections">
        <div className="home-card">
          <h3>What is this?</h3>
          <p>
            A personal finance tool modelled after the financial statements used in business —
            an <strong>Income Statement</strong> to track monthly cash flow, a <strong>Balance Sheet</strong> to
            measure net worth, and <strong>KPI dashboards</strong> to surface the ratios that matter.
            All your numbers in one place, updated live as you edit.
          </p>
        </div>

        <div className="home-card">
          <h3>Why it was built</h3>
          <div className="home-motivation">
            <div className="home-motivation-item">
              <span className="home-motivation-number">1</span>
              <div>
                <strong>Logic over emotion.</strong> Personal financial decisions are often made on gut
                feel. Viewing your finances through the same lens a business uses — ratios, margins,
                equity — helps surface the facts and take the emotion out of the decision.
              </div>
            </div>
            <div className="home-motivation-item">
              <span className="home-motivation-number">2</span>
              <div>
                <strong>Wealth, not just income.</strong> Monthly income and expenses only tell half the
                story. The balance sheet view shows where you actually stand — total assets, liabilities,
                and the net worth that results. It's the difference between earning well and building
                wealth.
              </div>
            </div>
          </div>
        </div>

        {/* <div className="home-tabs-overview">
          <div className="home-tab-chip">
            <span>Income Statement</span>
            <p>Monthly income vs. expenses broken into categories. Tracks your cash flow surplus or deficit.</p>
          </div>
          <div className="home-tab-chip">
            <span>Balance Sheet</span>
            <p>Snapshot of everything you own and owe. Calculates your net worth at a point in time.</p>
          </div>
          <div className="home-tab-chip">
            <span>Dashboard</span>
            <p>View your financial position at a glance with key metrics and visualizations.</p>
          </div>
        </div> */}

        <button className="home-cta" onClick={() => setShowGuide(true)}>
          Get Started →
        </button>
      </div>

      {/* <div className="home-coffee">
        <p>If this has been useful to you, consider supporting the work.</p>
        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="coffee-btn"
        >
          ☕ Buy me a coffee
        </a>
        <p className="home-coffee-note">
          (Replace the link above with your own Buy Me a Coffee URL)
        </p>
      </div> */}
    </div>
  )
}
