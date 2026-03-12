export default function Home({ onGetStarted }) {
  return (
    <div className="home-page">
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

        <button className="home-cta" onClick={onGetStarted}>
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
