import { useMemo, useState } from 'react'

type IconName =
  | 'arrow-down'
  | 'arrow-up'
  | 'bell'
  | 'bolt'
  | 'calendar'
  | 'chevron'
  | 'download'
  | 'grid'
  | 'menu'
  | 'plus'
  | 'receipt'
  | 'search'
  | 'settings'
  | 'sparkle'
  | 'wallet'

const paths: Record<IconName, React.ReactNode> = {
  'arrow-down': <><path d="M12 4v14M7 13l5 5 5-5"/><path d="M5 21h14"/></>,
  'arrow-up': <><path d="M12 20V6M7 11l5-5 5 5"/><path d="M5 3h14"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  chevron: <path d="m8 10 4 4 4-4"/>,
  download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 19h16"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.55 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.55a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.45 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.16.36.37.7.6 1 .3.28.7.42 1.1.4h.09v4h-.09a1.7 1.7 0 0 0-1.7.6Z"/></>,
  sparkle: <><path d="m12 3 1.1 3.3a7 7 0 0 0 4.6 4.6L21 12l-3.3 1.1a7 7 0 0 0-4.6 4.6L12 21l-1.1-3.3a7 7 0 0 0-4.6-4.6L3 12l3.3-1.1a7 7 0 0 0 4.6-4.6L12 3Z"/></>,
  wallet: <><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V6.5Z"/><path d="M4 8h16M15 13h6v4h-6a2 2 0 0 1 0-4Z"/></>,
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

type Transaction = {
  id: number
  date: string
  description: string
  category: string
  type: 'Income' | 'Expense'
  amount: number
  status: 'Verified' | 'Review'
}

const initialTransactions: Transaction[] = [
  { id: 1, date: 'Oct 28', description: 'Weekly class funds', category: 'Programs', type: 'Income', amount: 190, status: 'Verified' },
  { id: 2, date: 'Oct 24', description: 'Org fee surplus', category: 'Operations', type: 'Income', amount: 20, status: 'Verified' },
  { id: 3, date: 'Oct 24', description: 'Organization fee', category: 'Operations', type: 'Expense', amount: 2780, status: 'Review' },
  { id: 4, date: 'Oct 24', description: 'Organization fee', category: 'Programs', type: 'Income', amount: 2780, status: 'Review' },
]

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export default function App() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All' | 'Income' | 'Expense'>('All')
  const [notice, setNotice] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = useMemo(() => transactions.filter((item) => {
    const matchesFilter = filter === 'All' || item.type === filter
    const matchesQuery = `${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  }), [transactions, filter, query])

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions.filter((t) => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0)
    return { income, expenses, balance: income - expenses }
  }, [transactions])

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  const addTransaction = () => {
    const nextId = Math.max(...transactions.map((t) => t.id), 0) + 1
    setTransactions([{ id: nextId, date: 'Today', description: 'New transaction', category: 'Uncategorized', type: 'Expense', amount: 0, status: 'Review' }, ...transactions])
    showNotice('Draft transaction added')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Icon name="bolt" size={19} /></div>
          <span>Folio</span>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">×</button>
        </div>

        <div className="workspace-card">
          <div className="workspace-avatar">CQ</div>
          <div><strong>Class Quorum</strong><span>Finance workspace</span></div>
          <Icon name="chevron" size={16} />
        </div>

        <nav aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          <a className="nav-item active" href="#overview"><Icon name="grid" /><span>Overview</span></a>
          <a className="nav-item" href="#transactions"><Icon name="receipt" /><span>Transactions</span><b>12</b></a>
          <a className="nav-item" href="#funds"><Icon name="wallet" /><span>Funds</span></a>
          <a className="nav-item" href="#reports"><Icon name="sparkle" /><span>Audit reports</span><i>3</i></a>
          <p className="nav-label nav-label-spaced">Manage</p>
          <a className="nav-item" href="#settings"><Icon name="settings" /><span>Settings</span></a>
        </nav>

        <div className="audit-card">
          <div className="audit-icon"><Icon name="sparkle" /></div>
          <strong>Monthly audit</strong>
          <p>Your books are 92% ready for review.</p>
          <div className="progress-track"><span /></div>
          <button onClick={() => showNotice('Audit report opened')}>View report <span>↗</span></button>
        </div>

        <div className="profile">
          <div className="profile-avatar">JD</div>
          <div><strong>Jamie Diaz</strong><span>Treasurer</span></div>
          <button aria-label="Open account menu">•••</button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
          <div className="search">
            <Icon name="search" size={17} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." aria-label="Search transactions" />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <span className="synced"><i /> All changes saved</span>
            <button className="icon-button" aria-label="Notifications"><Icon name="bell" /><i /></button>
            <div className="mini-avatar">JD</div>
          </div>
        </header>

        <div className="content" id="overview">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">Tuesday, October 30</p>
              <h1>Good morning, Jamie.</h1>
              <p>Here’s how your class fund is moving today.</p>
            </div>
            <div className="welcome-actions">
              <button className="button secondary" onClick={() => showNotice('Report exported')}><Icon name="download" /> Export</button>
              <button className="button primary" onClick={addTransaction}><Icon name="plus" /> Add transaction</button>
            </div>
          </section>

          <section className="balance-hero">
            <div className="balance-main">
              <p>Available balance <span className="live-dot">Live</span></p>
              <h2>{formatMoney(totals.balance)}</h2>
              <div className="balance-trend"><span>↗ 7.5%</span> from last month</div>
            </div>
            <div className="balance-divider" />
            <div className="money-stat">
              <span className="stat-icon income"><Icon name="arrow-down" /></span>
              <div><p>Total income</p><strong>{formatMoney(totals.income)}</strong><small>+12.8% this month</small></div>
            </div>
            <div className="money-stat">
              <span className="stat-icon expense"><Icon name="arrow-up" /></span>
              <div><p>Total expenses</p><strong>{formatMoney(totals.expenses)}</strong><small>4 transactions</small></div>
            </div>
            <div className="balance-art" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>
          </section>

          <section className="insights-grid">
            <article className="panel spending-panel">
              <div className="panel-heading">
                <div><h3>Cash flow</h3><p>Income and expenses over time</p></div>
                <button>Last 6 months <Icon name="chevron" size={15} /></button>
              </div>
              <div className="chart">
                <div className="y-labels"><span>$6k</span><span>$4k</span><span>$2k</span><span>$0</span></div>
                <div className="chart-field">
                  <div className="grid-line line-1" /><div className="grid-line line-2" /><div className="grid-line line-3" /><div className="grid-line line-4" />
                  <svg viewBox="0 0 620 190" preserveAspectRatio="none" aria-label="Cash flow line chart">
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6c5ce7" stopOpacity=".24" />
                        <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path className="area" d="M0 142 C55 125,82 131,122 100 S190 127,244 87 S310 104,368 65 S450 92,500 40 S565 55,620 21 L620 190 L0 190Z" />
                    <path className="line income-line" d="M0 142 C55 125,82 131,122 100 S190 127,244 87 S310 104,368 65 S450 92,500 40 S565 55,620 21" />
                    <path className="line expense-line" d="M0 158 C66 145,95 151,140 139 S215 152,270 124 S345 143,400 108 S478 127,530 100 S580 111,620 86" />
                    <circle cx="500" cy="40" r="5" className="point" />
                  </svg>
                  <div className="x-labels"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
                </div>
              </div>
              <div className="chart-legend"><span><i className="purple" /> Income</span><span><i className="coral" /> Expenses</span></div>
            </article>

            <article className="panel category-panel">
              <div className="panel-heading">
                <div><h3>Expenses</h3><p>By category this month</p></div>
                <button className="more-button">•••</button>
              </div>
              <div className="donut-wrap">
                <div className="donut"><div><strong>{formatMoney(totals.expenses)}</strong><span>Total spent</span></div></div>
              </div>
              <div className="category-legend">
                <div><span><i className="cat-dot violet" /> Operations</span><strong>68%</strong></div>
                <div><span><i className="cat-dot peach" /> Programs</span><strong>22%</strong></div>
                <div><span><i className="cat-dot mint" /> Supplies</span><strong>10%</strong></div>
              </div>
            </article>
          </section>

          <section className="panel transactions-panel" id="transactions">
            <div className="transactions-header">
              <div><h3>Recent transactions</h3><p>{transactions.length} entries in this ledger</p></div>
              <div className="filter-tabs" role="group" aria-label="Transaction filter">
                {(['All', 'Income', 'Expense'] as const).map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
              </div>
              <button className="view-all" onClick={() => setFilter('All')}>View all <span>→</span></button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Description</th><th>Date</th><th>Category</th><th>Status</th><th>Amount</th><th /></tr></thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td><div className={`transaction-icon ${item.type.toLowerCase()}`}><Icon name={item.type === 'Income' ? 'arrow-down' : 'arrow-up'} size={16} /></div><strong>{item.description}</strong></td>
                      <td>{item.date}</td>
                      <td><span className="category-pill">{item.category}</span></td>
                      <td><span className={`status ${item.status.toLowerCase()}`}><i /> {item.status}</span></td>
                      <td className={item.type === 'Income' ? 'positive' : ''}>{item.type === 'Income' ? '+' : '−'}{formatMoney(item.amount)}</td>
                      <td><button aria-label={`More options for ${item.description}`}>•••</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="empty-state">No transactions match your search.</div>}
            </div>
          </section>
        </div>
      </main>

      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu overlay" />}
      {notice && <div className="toast"><span>✓</span>{notice}</div>}
    </div>
  )
}
