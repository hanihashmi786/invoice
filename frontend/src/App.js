"use client"

import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import InvoiceForm from "./pages/InvoiceForm"
import InvoicePage from "./pages/InvoicePage"
import InvoiceHistory from "./pages/InvoiceHistory"
import "./App.css"

function App() {
  // Login hataya gaya: seedha dashboard par le jao
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [invoiceData, setInvoiceData] = useState(null)

  // Handle logout (agar future mein chahiye ho)
  const handleLogout = () => {
    localStorage.removeItem("authToken")
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
