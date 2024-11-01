"use client"

import { useState, useEffect } from "react"
import Dashboard from "./pages/Dashboard"
import InvoiceForm from "./pages/InvoiceForm"
import InvoicePage from "./pages/InvoicePage"
import InvoiceHistory from "./pages/InvoiceHistory"
import Login from "./pages/Login"
import "./App.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [invoiceData, setInvoiceData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    // Check if user is authenticated (you can check localStorage or make an API call)
    const token = localStorage.getItem("authToken")
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentPage("dashboard")
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setIsAuthenticated(false)
    setCurrentPage("dashboard")
  }

  // Handle navigation between pages
  const handleNavigate = (page) => {
    setCurrentPage(page)
    if (page !== "preview") {
      setInvoiceData(null)
    }
  }

  // Handle form submission - go to preview
  const handleFormSubmit = (data) => {
    setInvoiceData(data)
    setCurrentPage("preview")
  }

  // Handle back from preview
  const handleBackFromPreview = () => {
    setCurrentPage("form")
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  // Render current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      case "form":
        return <InvoiceForm onSubmit={handleFormSubmit} onBack={() => handleNavigate("dashboard")} />
      case "preview":
        return <InvoicePage invoiceData={invoiceData} onBack={handleBackFromPreview} />
      case "history":
        return <InvoiceHistory onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />
      default:
        return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />
    }
  }

  return <div className="min-h-screen bg-gray-100">{renderPage()}</div>
}

export default App
