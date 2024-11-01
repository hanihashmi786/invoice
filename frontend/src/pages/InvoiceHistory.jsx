"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../styles/InvoiceHistory.css"

// Saudi Riyal Icon Component
const SaudiRiyalIcon = ({ size = 14, color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1124.14 1256.39"
    width={size}
    height={size}
    style={{ display: "inline-block", verticalAlign: "middle", marginRight: "2px" }}
  >
    <path
      fill={color}
      d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
    />
    <path
      fill={color}
      d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
    />
  </svg>
)

// Format currency with Saudi Riyal icon
const formatCurrency = (amount) => {
  const num = Number(amount) || 0
  return num.toLocaleString("en-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

export default function InvoiceHistory({ onViewInvoice, onBack }) {
  const [projects, setProjects] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState("all")
  const [expandedProjects, setExpandedProjects] = useState({})
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [projectsRes, invoicesRes] = await Promise.all([
        axios.get("http://localhost:8000/api/projects/"),
        axios.get("http://localhost:8000/api/invoices/"),
      ])
      setProjects(projectsRes.data)
      setInvoices(invoicesRes.data)

      // Auto-expand first project
      if (projectsRes.data.length > 0) {
        setExpandedProjects({ [projectsRes.data[0].id]: true })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setLoading(false)
  }

  // Group invoices by project
  const getInvoicesByProject = () => {
    const grouped = {}

    // Initialize with all projects
    projects.forEach((project) => {
      grouped[project.id] = {
        project,
        invoices: [],
        totalAmount: 0,
        invoiceCount: 0,
      }
    })

    // Add "Unassigned" group for invoices without project
    grouped["unassigned"] = {
      project: { id: "unassigned", name: "Unassigned Invoices", name_ar: "فواتير غير مصنفة" },
      invoices: [],
      totalAmount: 0,
      invoiceCount: 0,
    }

    // Group invoices
    invoices.forEach((invoice) => {
      const projectId = invoice.project || "unassigned"
      if (grouped[projectId]) {
        grouped[projectId].invoices.push(invoice)
        grouped[projectId].totalAmount += Number(invoice.grand_total) || 0
        grouped[projectId].invoiceCount += 1
      }
    })

    return grouped
  }

  // Filter and sort invoices
  const getFilteredInvoices = (projectInvoices) => {
    let filtered = [...projectInvoices]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (inv) =>
          inv.invoice_number?.toString().toLowerCase().includes(term) ||
          inv.client?.name?.toLowerCase().includes(term) ||
          inv.grand_total?.toString().includes(term),
      )
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter((inv) => new Date(inv.invoice_date) >= new Date(dateRange.from))
    }
    if (dateRange.to) {
      filtered = filtered.filter((inv) => new Date(inv.invoice_date) <= new Date(dateRange.to))
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === "date") {
        comparison = new Date(a.invoice_date) - new Date(b.invoice_date)
      } else if (sortBy === "amount") {
        comparison = (Number(a.grand_total) || 0) - (Number(b.grand_total) || 0)
      } else if (sortBy === "number") {
        comparison = (a.invoice_number || "").localeCompare(b.invoice_number || "", undefined, { numeric: true })
      }
      return sortOrder === "desc" ? -comparison : comparison
    })

    return filtered
  }

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }))
  }

  const handleViewInvoice = (invoice) => {
    if (onViewInvoice) {
      onViewInvoice(invoice)
    }
  }

  const groupedInvoices = getInvoicesByProject()

  // Calculate totals
  const totalInvoices = invoices.length
  const totalAmount = invoices.reduce((sum, inv) => sum + (Number(inv.grand_total) || 0), 0)
  const totalProjects = projects.length

  // Filter projects based on selection
  const displayGroups =
    selectedProject === "all"
      ? Object.values(groupedInvoices).filter((g) => g.invoiceCount > 0)
      : Object.values(groupedInvoices).filter((g) => g.project.id.toString() === selectedProject)

  if (loading) {
    return (
      <div className="invoice-history-loading">
        <div className="loading-spinner"></div>
        <p>Loading invoice history...</p>
        <p className="arabic-text">جاري تحميل سجل الفواتير...</p>
      </div>
    )
  }

  return (
    <div className="invoice-history-container">
      {/* Header */}
      <div className="history-header">
        <div className="header-left">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="header-titles">
            <h1>Invoice History</h1>
            <p className="arabic-text">سجل الفواتير</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchData}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon projects-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalProjects}</span>
            <span className="stat-label">
              Projects • <span className="arabic-text">المشاريع</span>
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon invoices-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalInvoices}</span>
            <span className="stat-label">
              Total Invoices • <span className="arabic-text">إجمالي الفواتير</span>
            </span>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon amount-icon">
            <SaudiRiyalIcon size={24} color="#2563eb" />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              <SaudiRiyalIcon size={18} /> {formatCurrency(totalAmount)}
            </span>
            <span className="stat-label">
              Total Revenue • <span className="arabic-text">إجمالي الإيرادات</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search invoices... • البحث في الفواتير"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Projects • كل المشاريع</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id.toString()}>
                {project.name}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
            <option value="date">Sort by Date • حسب التاريخ</option>
            <option value="amount">Sort by Amount • حسب المبلغ</option>
            <option value="number">Sort by Number • حسب الرقم</option>
          </select>

          <button className="sort-order-btn" onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}>
            {sortOrder === "desc" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>

        <div className="date-filters">
          <div className="date-input-group">
            <label>From • من</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
          </div>
          <div className="date-input-group">
            <label>To • إلى</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </div>
          {(dateRange.from || dateRange.to) && (
            <button className="clear-dates-btn" onClick={() => setDateRange({ from: "", to: "" })}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Projects List */}
      <div className="projects-list">
        {displayGroups.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            <h3>No invoices found</h3>
            <p className="arabic-text">لم يتم العثور على فواتير</p>
          </div>
        ) : (
          displayGroups.map((group) => (
            <div key={group.project.id} className="project-card">
              <div className="project-header" onClick={() => toggleProject(group.project.id)}>
                <div className="project-info">
                  <div className="project-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <div className="project-details">
                    <h3>{group.project.name}</h3>
                    {group.project.name_ar && (
                      <span className="arabic-text project-name-ar">{group.project.name_ar}</span>
                    )}
                  </div>
                </div>
                <div className="project-stats">
                  <div className="project-stat">
                    <span className="stat-num">{group.invoiceCount}</span>
                    <span className="stat-text">Invoices</span>
                  </div>
                  <div className="project-stat total">
                    <span className="stat-num">
                      <SaudiRiyalIcon size={14} /> {formatCurrency(group.totalAmount)}
                    </span>
                    <span className="stat-text">Total</span>
                  </div>
                  <div className={`expand-icon ${expandedProjects[group.project.id] ? "expanded" : ""}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              {expandedProjects[group.project.id] && (
                <div className="project-invoices">
                  <div className="invoices-table-header">
                    <span className="col-number">Invoice # • رقم الفاتورة</span>
                    <span className="col-client">Client • العميل</span>
                    <span className="col-date">Date • التاريخ</span>
                    <span className="col-amount">Amount • المبلغ</span>
                    <span className="col-actions">Actions</span>
                  </div>
                  {getFilteredInvoices(group.invoices).map((invoice) => (
                    <div key={invoice.id} className="invoice-row">
                      <span className="col-number">
                        <span className="invoice-number">#{invoice.invoice_number}</span>
                      </span>
                      <span className="col-client">
                        <span className="client-name">{invoice.client?.name || "-"}</span>
                      </span>
                      <span className="col-date">{formatDate(invoice.invoice_date)}</span>
                      <span className="col-amount">
                        <SaudiRiyalIcon size={12} /> {formatCurrency(invoice.grand_total)}
                      </span>
                      <span className="col-actions">
                        <button className="view-btn" onClick={() => handleViewInvoice(invoice)} title="View Invoice">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View
                        </button>
                      </span>
                    </div>
                  ))}
                  {getFilteredInvoices(group.invoices).length === 0 && (
                    <div className="no-results">
                      <p>No invoices match your search criteria</p>
                      <p className="arabic-text">لا توجد فواتير تطابق معايير البحث</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
