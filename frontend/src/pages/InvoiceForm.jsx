"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../styles/InvoiceForm.css"

const BANKS = [
  { value: "SABB", label: "SABB", iban: "SA0645000000815396684001" },
  { value: "Al Rajhi", label: "Al Rajhi", iban: "SA8180000203608010324551" },
  { value: "Bank Al Jazira", label: "Bank AlJazira", iban: "SA1660100003481588002001" },
]

const translations = {
  en: {
    create_invoice: "Create Invoice",
    company_info: "Company Information | معلومات الشركة",
    client_info: "Client Information | معلومات العميل",
    project_info: "Project & Invoice Details | تفاصيل المشروع والفاتورة",
    invoice_items: "Invoice Items | بنود الفاتورة",
    invoice_summary: "Invoice Summary | ملخص الفاتورة",
    name: "Name",
    address: "Address",
    phone: "Phone",
    email: "Email",
    fax: "Fax",
    bank_name: "Bank Name",
    iban: "IBAN",
    tax_number: "VAT",
    project: "Project",
    no_project: "No Project",
    new_project: "New Project",
    project_name: "Project Name",
    invoice_number: "Invoice Number",
    invoice_date: "Invoice Date",
    customer_number: "Customer Number",
    approver_name: "Approver Name",
    approver_title: "Approver Title",
    description: "Description",
    quantity: "Qty",
    unit_price: "Unit Price",
    vat_rate: "VAT %",
    vat_amount: "VAT Amount",
    total_with_vat: "Total (with VAT)",
    add_item: "Add Item",
    subtotal: "Subtotal",
    total_vat: "Total VAT",
    grand_total: "Grand Total",
    preview_invoice: "Preview Invoice",
    generate_invoice: "Generate Invoice",
    saving: "Saving...",
    back_to_form: "Back to Form",
  },
  ar: {
    create_invoice: "إنشاء فاتورة",
    company_info: "معلومات الشركة | Company Information",
    client_info: "معلومات العميل | Client Information",
    project_info: "تفاصيل المشروع والفاتورة | Project & Invoice Details",
    invoice_items: "بنود الفاتورة | Invoice Items",
    invoice_summary: "ملخص الفاتورة | Invoice Summary",
    name: "الاسم",
    address: "العنوان",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    fax: "الفاكس",
    bank_name: "اسم البنك",
    iban: "رقم الآيبان",
    tax_number: "الرقم الضريبي",
    project: "المشروع",
    no_project: "بدون مشروع",
    new_project: "مشروع جديد",
    project_name: "اسم المشروع",
    invoice_number: "رقم الفاتورة",
    invoice_date: "تاريخ الفاتورة",
    customer_number: "رقم العميل",
    approver_name: "اسم المعتمد",
    approver_title: "الصفة",
    description: "البيان",
    quantity: "الكمية",
    unit_price: "سعر الوحدة",
    vat_rate: "نسبة الضريبة",
    vat_amount: "مبلغ الضريبة",
    total_with_vat: "الإجمالي مع الضريبة",
    add_item: "إضافة بند",
    subtotal: "المجموع الفرعي",
    total_vat: "إجمالي الضريبة",
    grand_total: "الإجمالي الكلي",
    preview_invoice: "معاينة الفاتورة",
    generate_invoice: "إنشاء الفاتورة",
    saving: "جاري الحفظ...",
    back_to_form: "العودة للنموذج",
  },
}

const initialForm = {
  company_name: "Abdulaziz Turki Abdullah Al-Otaishan",
  company_address: "Riyadh - Prince Sultan Bin Abdulaziz St.",
  company_phone: "966 11 465 2841",
  company_email: "oce@otaishan.com.sa",
  bank_name: "",
  iban: "",
  tax_number: "",
  client_name: "",
  client_address: "",
  client_phone: "",
  client_fax: "",
  client_email: "",
  invoice_number: "",
  invoice_date: "",
  customer_number: "",
  approver_name: "Dr. Abdul Aziz Turki Al-Otaishan",
  approver_title: "General Manager",
  items: [{ description: "", quantity: 1, unit_price: 0, vat_rate: 15 }],
}

export default function InvoiceForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [newProjectName, setNewProjectName] = useState("")
  const [isNewProject, setIsNewProject] = useState(false)
  const [lang, setLang] = useState("en")
  const [showPreview, setShowPreview] = useState(false)
  const [invoiceData, setInvoiceData] = useState(null)
  const t = translations[lang]

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get("http://localhost:8000/api/projects/")
        setProjects(res.data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedProjectId && selectedProjectId !== "NEW") {
      fetchNextInvoiceNumber(selectedProjectId)
    } else if (!selectedProjectId) {
      fetchNextInvoiceNumber(null)
    }
  }, [selectedProjectId])

  async function fetchNextInvoiceNumber(projectId) {
    try {
      const res = await axios.get("http://localhost:8000/api/next_invoice_number_for_project/", {
        params: { project_id: projectId },
      })
      setForm((prev) => ({
        ...prev,
        invoice_number: res.data.next_invoice_number,
      }))
    } catch {
      setForm((prev) => ({ ...prev, invoice_number: "1" }))
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "bank_name") {
      const selectedBank = BANKS.find((b) => b.value === value)
      setForm({ ...form, bank_name: value, iban: selectedBank?.iban || "" })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleItemChange = (idx, e) => {
    const items = [...form.items]
    items[idx][e.target.name] =
      e.target.name === "quantity" || e.target.name === "unit_price" || e.target.name === "vat_rate"
        ? Number(e.target.value)
        : e.target.value
    setForm({ ...form, items })
  }

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", quantity: 1, unit_price: 0, vat_rate: 15 }],
    })
  }

  const removeItem = (idx) => {
    const items = [...form.items]
    items.splice(idx, 1)
    setForm({ ...form, items })
  }

  const handleProjectSelect = (e) => {
    const value = e.target.value
    setSelectedProjectId(value)
    setIsNewProject(value === "NEW")
    if (value === "NEW") {
      setForm((prev) => ({ ...prev, invoice_number: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let projectIdToUse = selectedProjectId
    if (isNewProject && newProjectName) {
      const existing = projects.find((p) => p.name.trim().toLowerCase() === newProjectName.trim().toLowerCase())
      if (existing) {
        projectIdToUse = existing.id
      } else {
        try {
          const projectRes = await axios.post("http://localhost:8000/api/projects/", { name: newProjectName })
          projectIdToUse = projectRes.data.id
        } catch (err) {
          alert(err?.response?.data?.name?.[0] || err?.response?.data?.detail || "Failed to create project.")
          setLoading(false)
          return
        }
      }
    }

    const items = form.items.map((item) => {
      const toTwoDecimals = (num) => Number(Number(num).toFixed(2))
      const total_excl_vat = toTwoDecimals(item.unit_price * item.quantity)
      const vat_amount = toTwoDecimals(total_excl_vat * (item.vat_rate / 100))
      const total_incl_vat = toTwoDecimals(total_excl_vat + vat_amount)
      return { ...item, total_excl_vat, vat_amount, total_incl_vat }
    })

    const subtotal = items.reduce((sum, item) => sum + item.total_excl_vat, 0)
    const total_vat = items.reduce((sum, item) => sum + item.vat_amount, 0)
    const grand_total = subtotal + total_vat

    const payload = {
      invoice_number: form.invoice_number,
      invoice_date: form.invoice_date,
      customer_number: form.customer_number,
      approver_name: "Dr. Abdul Aziz Turki Al-Otaishan",
      approver_title: "General Manager",
      subtotal,
      total_vat,
      grand_total,
      company: {
        name: form.company_name,
        address: form.company_address,
        phone: form.company_phone,
        email: form.company_email,
        bank_name: form.bank_name,
        iban: form.iban,
        tax_number: form.tax_number,
      },
      client: {
        name: form.client_name,
        address: form.client_address,
        phone: form.client_phone,
        fax: form.client_fax,
        email: form.client_email,
        vat_registration: form.client_vat_registration,
      },
      project: projectIdToUse ? projectIdToUse : null,
      items,
    }

    try {
      const res = await axios.post("http://localhost:8000/api/invoices/", payload)
      setLoading(false)
      setInvoiceData(res.data)
      setShowPreview(true)
      onSubmit(res.data)
    } catch (err) {
      setLoading(false)
      alert("Failed to save invoice.")
    }
  }

  const calculateTotals = () => {
    const subtotal = form.items.reduce((sum, item) => {
      const total_excl_vat = item.unit_price * item.quantity
      return sum + total_excl_vat
    }, 0)

    const total_vat = form.items.reduce((sum, item) => {
      const total_excl_vat = item.unit_price * item.quantity
      const vat_amount = total_excl_vat * (item.vat_rate / 100)
      return sum + vat_amount
    }, 0)

    const grand_total = subtotal + total_vat
    return { subtotal, total_vat, grand_total }
  }

  const totals = calculateTotals()

  return (
    <div className={`invoice-form-container ${lang === "ar" ? "rtl" : "ltr"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <form onSubmit={handleSubmit} className="invoice-form">
        {/* Header */}
        <div className="form-header">
          <div className="header-content">
            <h1 className="form-title">{t.create_invoice}</h1>
            <div className="language-switcher">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`lang-btn ${lang === "en" ? "active" : ""}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("ar")}
                className={`lang-btn ${lang === "ar" ? "active" : ""}`}
              >
                العربية
              </button>
            </div>
          </div>
        </div>

        {/* Project & Invoice Information Row */}
        <div className="form-row">
          {/* Project Section */}
          <div className="form-card project-card">
            <div className="card-header">
              <h3 className="card-title project-title">{t.project_info}</h3>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label className="form-label">{t.project}</label>
                <select value={selectedProjectId} onChange={handleProjectSelect} className="form-select">
                  <option value="">{t.no_project}</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id.toString()}>
                      {project.name}
                    </option>
                  ))}
                  <option value="NEW">{t.new_project}</option>
                </select>
              </div>
              {isNewProject && (
                <div className="form-group">
                  <label className="form-label">{t.project_name}</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder={t.project_name}
                    className="form-input"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="form-card invoice-details-card">
            <div className="card-header">
              <h3 className="card-title invoice-title">Invoice Details | تفاصيل الفاتورة</h3>
            </div>
            <div className="card-content">
              <div className="form-grid grid-3">
                <div className="form-group">
                  <label className="form-label">
                    {t.invoice_number} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="invoice_number"
                    value={form.invoice_number}
                    onChange={handleChange}
                    placeholder={t.invoice_number}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {t.invoice_date} <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="invoice_date"
                    value={form.invoice_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.customer_number}</label>
                  <input
                    type="text"
                    name="customer_number"
                    value={form.customer_number}
                    onChange={handleChange}
                    placeholder={t.customer_number}
                    className="form-input"
                  />
                </div>
                {/* Hidden approver fields - completely removed from display */}
              </div>
            </div>
          </div>
        </div>

        {/* Company & Client Information Row */}
        <div className="form-row">
          {/* Company Information */}
          <div className="form-card company-card">
            <div className="card-header">
              <h3 className="card-title company-title">{t.company_info}</h3>
            </div>
            <div className="card-content">
              <div className="form-grid grid-2">
                <div className="form-group">
                  <label className="form-label">
                    {t.name} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    placeholder="Abdulaziz Turki Abdullah Al-Otaishan Engineering Consulting Co."
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {t.phone} <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="company_phone"
                    value={form.company_phone}
                    onChange={handleChange}
                    placeholder={t.phone}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">
                    {t.address} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_address"
                    value={form.company_address}
                    onChange={handleChange}
                    placeholder={t.address}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {t.email} <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="company_email"
                    value={form.company_email}
                    onChange={handleChange}
                    placeholder={t.email}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.bank_name}</label>
                  <select name="bank_name" value={form.bank_name} onChange={handleChange} className="form-select">
                    <option value="">Select Bank</option>
                    {BANKS.map((bank) => (
                      <option key={bank.value} value={bank.value}>
                        {bank.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t.iban}</label>
                  <input type="text" name="iban" value={form.iban} readOnly className="form-input readonly" />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">{t.tax_number}</label>
                  <input
                    type="text"
                    name="tax_number"
                    value={form.tax_number}
                    onChange={handleChange}
                    placeholder={t.tax_number}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="form-card client-card">
            <div className="card-header">
              <h3 className="card-title client-title">{t.client_info}</h3>
            </div>
            <div className="card-content">
              <div className="form-grid grid-2">
                <div className="form-group">
                  <label className="form-label">
                    {t.name} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    value={form.client_name}
                    onChange={handleChange}
                    placeholder={t.name}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.phone}</label>
                  <input
                    type="tel"
                    name="client_phone"
                    value={form.client_phone}
                    onChange={handleChange}
                    placeholder={t.phone}
                    className="form-input"
                  />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">
                    {t.address} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="client_address"
                    value={form.client_address}
                    onChange={handleChange}
                    placeholder={t.address}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.email}</label>
                  <input
                    type="email"
                    name="client_email"
                    value={form.client_email}
                    onChange={handleChange}
                    placeholder={t.email}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.fax}</label>
                  <input
                    type="text"
                    name="client_fax"
                    value={form.client_fax}
                    onChange={handleChange}
                    placeholder={t.fax}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">VAT</label>
                  <input
                    type="text"
                    name="client_vat_registration"
                    value={form.client_vat_registration}
                    onChange={handleChange}
                    placeholder="VAT Number"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items Section */}
        <div className="form-card items-card">
          <div className="card-header">
            <h3 className="card-title items-title">{t.invoice_items}</h3>
          </div>
          <div className="card-content">
            <div className="table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>{t.description}</th>
                    <th>{t.quantity}</th>
                    <th>{t.unit_price}</th>
                    <th>{t.vat_rate}</th>
                    <th>{t.vat_amount}</th>
                    <th>{t.total_with_vat}</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, idx) => {
                    const total_excl_vat = Number((item.unit_price * item.quantity).toFixed(2))
                    const vat_amount = Number((total_excl_vat * (item.vat_rate / 100)).toFixed(2))
                    const total_incl_vat = Number((total_excl_vat + vat_amount).toFixed(2))
                    return (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            name="description"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, e)}
                            placeholder={t.description}
                            className="table-input"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="quantity"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, e)}
                            className="table-input number-input"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="unit_price"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(idx, e)}
                            className="table-input number-input"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="vat_rate"
                            min="0"
                            value={item.vat_rate}
                            onChange={(e) => handleItemChange(idx, e)}
                            className="table-input number-input"
                            required
                          />
                        </td>
                        <td className="total-cell">{vat_amount.toFixed(2)}</td>
                        <td className="total-cell">{total_incl_vat.toFixed(2)}</td>
                        <td className="action-cell">
                          {form.items.length > 1 && (
                            <button type="button" onClick={() => removeItem(idx)} className="btn btn-danger btn-small">
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="add-item-container">
              <button type="button" onClick={addItem} className="btn btn-outline">
                + {t.add_item}
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="form-card summary-card">
          <div className="card-header">
            <h3 className="card-title summary-title">{t.invoice_summary}</h3>
          </div>
          <div className="card-content">
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">{t.subtotal}:</span>
                <span className="summary-value">{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t.total_vat}:</span>
                <span className="summary-value">{totals.total_vat.toFixed(2)}</span>
              </div>
              <div className="summary-item grand-total">
                <span className="summary-label">{t.grand_total}:</span>
                <span className="summary-value">{totals.grand_total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-card actions-card">
          <div className="card-content">
            <div className="actions-container">
              <button type="submit" disabled={loading} className="btn btn-primary btn-large">
                {loading ? `⏳ ${t.saving}` : `✓ ${t.generate_invoice}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
