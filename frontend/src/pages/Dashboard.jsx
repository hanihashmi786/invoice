"use client"

import { useState, useEffect } from "react"
import API_BASE_URL from "../config"
import "../styles/Dashboard.css"

// Saudi Riyal Icon Component
const SaudiRiyalIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1124.14 1256.39"
    width={size}
    height={size}
    style={{ fill: color, display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
    <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
  </svg>
)

// Arabic Text Component
const ArabicText = ({ children, className = "" }) => <span className={`arabic-text ${className}`}>{children}</span>

const Dashboard = ({ onNavigate, onLogout }) => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch projects and invoices
      const [projectsRes, invoicesRes] = await Promise.all([fetch(`${API_BASE_URL}/api/projects/`), fetch(`${API_BASE_URL}/api/invoices/`)])

      const projects = await projectsRes.json()
      const invoices = await invoicesRes.json()

      // Calculate stats
      const totalRevenue = invoices.reduce((sum, inv) => sum + Number.parseFloat(inv.grand_total || 0), 0)
      const pendingInvoices = invoices.filter((inv) => inv.status === "pending" || !inv.status).length

      setStats({
        totalProjects: projects.length,
        totalInvoices: invoices.length,
        totalRevenue,
        pendingInvoices,
      })

      // Get recent invoices (last 5)
      const sortedInvoices = invoices
        .sort((a, b) => new Date(b.created_at || b.invoice_date) - new Date(a.created_at || a.invoice_date))
        .slice(0, 5)
      setRecentInvoices(sortedInvoices)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-SA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <SaudiRiyalIcon size={32} color="#1a5276" />
            </div>
            <div className="logo-text">
              <h1>Invoice Manager</h1>
              <p>
                <ArabicText>نظام إدارة الفواتير</ArabicText>
              </p>
            </div>
          </div>
          <nav className="header-nav">
            <button className="nav-link active" onClick={() => onNavigate("dashboard")}>
              Dashboard
              <span className="nav-link-ar">
                <ArabicText>لوحة التحكم</ArabicText>
              </span>
            </button>
            {onLogout && (
              <button className="nav-link logout-btn" onClick={onLogout}>
                Logout
                <span className="nav-link-ar">
                  <ArabicText>تسجيل الخروج</ArabicText>
                </span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h2>Welcome to Invoice Manager</h2>
            <p>
              <ArabicText>مرحباً بك في نظام إدارة الفواتير</ArabicText>
            </p>
            <p className="welcome-subtitle">Manage your invoices efficiently and professionally</p>
          </div>
        </section>
        

        {/* Action Cards */}
        <section className="action-section">
          <h3 className="section-title">
            Quick Actions
            <span className="section-title-ar">
              <ArabicText>الإجراءات السريعة</ArabicText>
            </span>
          </h3>
          <div className="action-grid">
            <div className="action-card create-invoice" onClick={() => onNavigate("form")}>
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5V19" />
                  <path d="M5 12H19" />
                </svg>
              </div>
              <div className="action-content">
                <h4>Create New Invoice</h4>
                <p>
                  <ArabicText>إنشاء فاتورة جديدة</ArabicText>
                </p>
                <span className="action-description">Generate professional tax invoices with ease</span>
              </div>
              <div className="action-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12H19" />
                  <path d="M12 5L19 12L12 19" />
                </svg>
              </div>
            </div>

            <div className="action-card view-history" onClick={() => onNavigate("history")}>
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8V12L15 15" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <div className="action-content">
                <h4>Invoice History</h4>
                <p>
                  <ArabicText>سجل الفواتير</ArabicText>
                </p>
                <span className="action-description">View and manage all your invoices by project</span>
              </div>
              <div className="action-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12H19" />
                  <path d="M12 5L19 12L12 19" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Invoices */}
        <section className="recent-section">
          <div className="section-header">
            <h3 className="section-title">
              Recent Invoices
              <span className="section-title-ar">
                <ArabicText>أحدث الفواتير</ArabicText>
              </span>
            </h3>
            <button className="view-all-btn" onClick={() => onNavigate("history")}>
              View All
              <ArabicText>عرض الكل</ArabicText>
            </button>
          </div>

          <div className="recent-invoices-table">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading invoices...</p>
              </div>
            ) : recentInvoices.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
                  <path d="M14 2V8H20" />
                </svg>
                <p>No invoices yet</p>
                <span>
                  <ArabicText>لا توجد فواتير حتى الآن</ArabicText>
                </span>
                <button className="create-first-btn" onClick={() => onNavigate("form")}>
                  Create Your First Invoice
                </button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>
                      Invoice # <ArabicText>رقم الفاتورة</ArabicText>
                    </th>
                    <th>
                      Client <ArabicText>العميل</ArabicText>
                    </th>
                    <th>
                      Date <ArabicText>التاريخ</ArabicText>
                    </th>
                    <th>
                      Amount <ArabicText>المبلغ</ArabicText>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice, index) => (
                    <tr key={invoice.id || index}>
                      <td className="invoice-number">{invoice.invoice_number || "-"}</td>
                      <td>{invoice.client_name || "-"}</td>
                      <td>{formatDate(invoice.invoice_date)}</td>
                      <td className="amount">
                        <SaudiRiyalIcon size={14} color="#1a5276" /> {formatCurrency(invoice.grand_total || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>
          Al Otaishan Consulting Engineering
          <span className="footer-separator">•</span>
          <ArabicText>العتيشان للاستشارات الهندسية</ArabicText>
        </p>
      </footer>
    </div>
  )
}

export default Dashboard
