"use client"

import { useState } from "react"
import html2pdf from "html2pdf.js"
import "../styles/InvoicePage.css"

// Saudi Riyal Icon Component
const SaudiRiyalIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1124.14 1256.39"
    className={`saudi-riyal-icon ${className}`}
    style={{ width: "0.85em", height: "0.85em", display: "inline-block", verticalAlign: "middle", marginRight: "2px" }}
  >
    <path
      fill="currentColor"
      d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
    />
    <path
      fill="currentColor"
      d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
    />
  </svg>
)

// ArabicText Component for Sakkal Majalla font
const ArabicText = ({ children, className = "" }) => <span className={`arabic-font ${className}`}>{children}</span>

const CurrencyDisplay = ({ amount, formatCurrency }) => (
  <span className="currency-display">
    <SaudiRiyalIcon />
    {formatCurrency(amount)}
  </span>
)

export default function InvoicePage({ invoiceData, language = "en" }) {
  const [currentLang, setCurrentLang] = useState(language)
  const isRTL = currentLang === "ar"

  // Show a message if no data is available (important for debugging!)
  if (!invoiceData) {
    return (
      <div className="no-data-container">
        <div className="no-data-card">
          <h2 className="no-data-title">No Invoice Data Available</h2>
          <p className="no-data-message">Please submit an invoice to view its details.</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-SA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (isRTL) {
      return date.toLocaleDateString("ar-SA")
    }
    return date.toLocaleDateString("en-GB")
  }

  const downloadPDF = () => {
    const element = document.querySelector(".invoice-page")
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `invoice-${invoiceData.invoice_number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        height: element.scrollHeight,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
      pagebreak: { mode: "avoid-all" },
    }

    // Hide the PDF button during generation
    const pdfButton = document.querySelector(".pdf-download-btn")
    if (pdfButton) pdfButton.style.display = "none"

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Show the PDF button again after generation
        if (pdfButton) pdfButton.style.display = "block"
      })
  }

  return (
    <div className="invoice-container">
      {/* Language Toggle - Hidden in Print */}
      <div className="language-toggle">
        <div className="language-toggle-buttons">
          <button
            onClick={() => setCurrentLang("en")}
            className={`language-btn ${currentLang === "en" ? "language-btn-active" : ""}`}
          >
            EN
          </button>
          <button
            onClick={() => setCurrentLang("ar")}
            className={`language-btn ${currentLang === "ar" ? "language-btn-active" : ""}`}
          >
            AR
          </button>
        </div>
      </div>

      {/* PDF Download Button */}
      <div className="pdf-download-container">
        <button onClick={downloadPDF} className="pdf-download-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* A4 Container */}
      <div className={`invoice-page ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="invoice-content">
          {/* Header Section */}
          <header className="invoice-header">
            <div className="header-grid">
              {/* Left Column - English Company Details */}
              <div className="company-details-left">
                <h1 className="company-name">{invoiceData.company.name}</h1>
                <p className="company-subtitle">Engineering Consulting Co.</p>
                <div className="company-info">
                  <p>Riyadh, Saudi Arabia</p>
                  <p>P.O. Box 12345</p>
                  <p>{invoiceData.company.phone}</p>
                  <p>{invoiceData.company.email}</p>
                </div>
                <div className="company-registration">
                  <p>CR: {invoiceData.company.cr_number || "1010691625"}</p>
                  <p>License: {invoiceData.company.license_number || "5100001331"}</p>
                  <p>CC: 625262</p>
                </div>
              </div>

              {/* Center Column - Company Logo */}
              <div className="logo-container">
                <div className="logo-wrapper">
                  <img src="../../assets/images/OCE.jpg" alt="Company Logo" className="company-logo" />
                </div>
              </div>

              {/* Right Column - Arabic Company Details */}
              <div className="company-details-right">
                <h1 className="company-name">
                  <ArabicText>{invoiceData.company.name_ar || "عبدالعزيز تركي عبدالله العطيشان"}</ArabicText>
                </h1>
                <p className="company-subtitle">
                  <ArabicText>للاستشارات الهندسية</ArabicText>
                </p>
                <div className="company-info">
                  <p>
                    <ArabicText>الرياض، المملكة العربية السعودية</ArabicText>
                  </p>
                  <p>
                    <ArabicText>ص.ب 62696</ArabicText>
                  </p>
                  <p>{invoiceData.company.phone}</p>
                  <p>{invoiceData.company.email}</p>
                </div>
                <div className="company-registration">
                  <p>
                    <ArabicText>س.ت: {invoiceData.company.cr_number || "1010691625"}</ArabicText>
                  </p>
                  <p>
                    <ArabicText>ترخيص: {invoiceData.company.license_number || "5100001331"}</ArabicText>
                  </p>
                  <p>
                    <ArabicText>غرفة: 625262</ArabicText>
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice Title */}
            <div className="invoice-title-container">
              <h2 className="invoice-title">
                {isRTL ? (
                  <>
                    <ArabicText>فاتورة ضريبية</ArabicText> • TAX INVOICE
                  </>
                ) : (
                  <>
                    TAX INVOICE • <ArabicText>فاتورة ضريبية</ArabicText>
                  </>
                )}
              </h2>
            </div>
          </header>

          {/* Client and Invoice Information */}
          <div className="info-grid">
            {/* Client Information */}
            <div className="info-card">
              <div className="info-card-header client-header">
                <h3 className="info-card-title">
                  {isRTL ? (
                    <>
                      <ArabicText>معلومات العميل</ArabicText> • Client Information
                    </>
                  ) : (
                    <>
                      Client Information • <ArabicText>معلومات العميل</ArabicText>
                    </>
                  )}
                </h3>
              </div>
              <div className="info-card-content">
                <div className="info-row">
                  <span className="info-label">{isRTL ? <ArabicText>اسم العميل:</ArabicText> : "Client Name:"}</span>
                  <span className="info-value">{invoiceData.client.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{isRTL ? <ArabicText>العنوان:</ArabicText> : "Address:"}</span>
                  <span className="info-value address-value">{invoiceData.client.address}</span>
                </div>
                {invoiceData.client.phone && (
                  <div className="info-row">
                    <span className="info-label">{isRTL ? <ArabicText>الهاتف:</ArabicText> : "Phone:"}</span>
                    <span className="info-value">{invoiceData.client.phone}</span>
                  </div>
                )}
                {invoiceData.client.email && (
                  <div className="info-row">
                    <span className="info-label">{isRTL ? <ArabicText>البريد الإلكتروني:</ArabicText> : "Email:"}</span>
                    <span className="info-value">{invoiceData.client.email}</span>
                  </div>
                )}
                {invoiceData.client.fax && (
                  <div className="info-row">
                    <span className="info-label">{isRTL ? <ArabicText>الفاكس:</ArabicText> : "Fax:"}</span>
                    <span className="info-value">{invoiceData.client.fax}</span>
                  </div>
                )}
                {invoiceData.client.vat_registration && (
                  <div className="info-row">
                    <span className="info-label">
                      {isRTL ? <ArabicText>تسجيل ضريبة القيمة المضافة:</ArabicText> : "VAT"}
                    </span>
                    <span className="info-value">{invoiceData.client.vat_registration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Information */}
            <div className="info-card">
              <div className="info-card-header invoice-header-info">
                <h3 className="info-card-title">
                  {isRTL ? (
                    <>
                      <ArabicText>معلومات الفاتورة</ArabicText> • Invoice Information
                    </>
                  ) : (
                    <>
                      Invoice Information • <ArabicText>معلومات الفاتورة</ArabicText>
                    </>
                  )}
                </h3>
              </div>
              <div className="info-card-content">
                <div className="info-row">
                  <span className="info-label">
                    {isRTL ? <ArabicText>رقم الفاتورة:</ArabicText> : "Invoice Number:"}
                  </span>
                  <span className="info-value invoice-number">{invoiceData.invoice_number}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    {isRTL ? <ArabicText>تاريخ الفاتورة:</ArabicText> : "Invoice Date:"}
                  </span>
                  <span className="info-value">{formatDate(invoiceData.invoice_date)}</span>
                </div>

                {invoiceData.customer_number && (
                  <div className="info-row">
                    <span className="info-label">
                      {isRTL ? <ArabicText>رقم العميل:</ArabicText> : "Customer Number:"}
                    </span>
                    <span className="info-value">{invoiceData.customer_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="items-section">
            <div className="items-header">
              <h3 className="items-title">
                {isRTL ? (
                  <>
                    <ArabicText>بنود الفاتورة</ArabicText> • Invoice Items
                  </>
                ) : (
                  <>
                    Invoice Items • <ArabicText>بنود الفاتورة</ArabicText>
                  </>
                )}
              </h3>
            </div>
            <div className="table-container">
              <table className="items-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell table-header-cell text-center">
                      {isRTL ? <ArabicText>م</ArabicText> : "No."}
                    </th>
                    <th className="table-cell table-header-cell text-left">
                      {isRTL ? <ArabicText>الوصف</ArabicText> : "Description"}
                    </th>
                    <th className="table-cell table-header-cell text-center">
                      {isRTL ? <ArabicText>الكمية</ArabicText> : "Qty"}
                    </th>
                    <th className="table-cell table-header-cell text-right">
                      {isRTL ? (
                        <ArabicText>
                          سعر
                          <br />
                          الوحدة
                        </ArabicText>
                      ) : (
                        <>
                          Unit
                          <br />
                          Price
                        </>
                      )}
                    </th>
                    <th className="table-cell table-header-cell text-right">
                      {isRTL ? (
                        <ArabicText>
                          المجموع
                          <br />
                          الفرعي
                        </ArabicText>
                      ) : (
                        <>Subtotal</>
                      )}
                    </th>
                    <th className="table-cell table-header-cell text-center" style={{ color: "#e53e3e" }}>
                      {isRTL ? (
                        <ArabicText>
                          نسبة
                          <br />
                          الضريبة
                        </ArabicText>
                      ) : (
                        <>
                          VAT
                          <br />
                          Rate
                        </>
                      )}
                    </th>
                    <th className="table-cell table-header-cell text-right">
                      {isRTL ? (
                        <ArabicText>
                          مبلغ
                          <br />
                          الضريبة
                        </ArabicText>
                      ) : (
                        <>
                          VAT
                          <br />
                          Amount
                        </>
                      )}
                    </th>
                    <th className="table-cell table-header-cell text-right no-border-right">
                      {isRTL ? (
                        <ArabicText>
                          الإجمالي
                          <br />
                          شامل الضريبة
                        </ArabicText>
                      ) : (
                        <>
                          Total Incl.
                          <br />
                          VAT
                        </>
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className={`table-row ${index % 2 === 0 ? "table-row-even" : "table-row-odd"}`}>
                      <td className="table-cell text-center">{index + 1}</td>
                      <td className="table-cell">
                        <div className="description-container">
                          <div className="description-primary">{item.description}</div>
                        </div>
                      </td>
                      <td className="table-cell text-center">{item.quantity}</td>
                      <td className="table-cell text-right mono-font">
                        <CurrencyDisplay amount={item.unit_price} formatCurrency={formatCurrency} />
                      </td>
                      <td className="table-cell text-right mono-font">
                        <CurrencyDisplay amount={item.total_excl_vat} formatCurrency={formatCurrency} />
                      </td>
                      <td className="table-cell text-center vat-rate">{item.vat_rate}%</td>
                      <td className="table-cell text-right mono-font">
                        <CurrencyDisplay amount={item.vat_amount} formatCurrency={formatCurrency} />
                      </td>
                      <td className="table-cell text-right mono-font total-cell no-border-right">
                        <CurrencyDisplay amount={item.total_incl_vat} formatCurrency={formatCurrency} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary and Bank Information */}
          <div className="summary-grid">
            {/* Empty space */}
            <div></div>
            {/* Totals Summary */}
            <div className="info-card">
              <div className="info-card-header summary-header">
                <h3 className="info-card-title">
                  {isRTL ? (
                    <>
                      <ArabicText>ملخص المبالغ</ArabicText> • Amount Summary
                    </>
                  ) : (
                    <>
                      Amount Summary • <ArabicText>ملخص المبالغ</ArabicText>
                    </>
                  )}
                </h3>
              </div>
              <div className="info-card-content">
                <div className="summary-row">
                  <span className="info-label">{isRTL ? <ArabicText>المجموع الفرعي:</ArabicText> : "Subtotal:"}</span>
                  <span className="info-value mono-font">
                    <CurrencyDisplay amount={invoiceData.subtotal} formatCurrency={formatCurrency} />
                  </span>
                </div>
                <div className="summary-row">
                  <span className="info-label">
                    {isRTL ? <ArabicText>إجمالي ضريبة القيمة المضافة (15%):</ArabicText> : "Total VAT (15%):"}
                  </span>
                  <span className="info-value mono-font">
                    <CurrencyDisplay amount={invoiceData.total_vat} formatCurrency={formatCurrency} />
                  </span>
                </div>
                <div className="grand-total-row">
                  <span className="grand-total-label">
                    {isRTL ? <ArabicText>الإجمالي النهائي:</ArabicText> : "Grand Total:"}
                  </span>
                  <span className="grand-total-value">
                    <CurrencyDisplay amount={invoiceData.grand_total} formatCurrency={formatCurrency} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Transfer Information */}
          <div className="bank-section">
            <div className="info-card bank-card">
              <div className="info-card-header bank-header">
                <h3 className="info-card-title">
                  {isRTL ? (
                    <>
                      <ArabicText>معلومات التحويل البنكي</ArabicText> • Bank Transfer Information
                    </>
                  ) : (
                    <>
                      Bank Transfer Information • <ArabicText>معلومات التحويل البنكي</ArabicText>
                    </>
                  )}
                </h3>
              </div>
              <div className="info-card-content">
                <div className="bank-info-grid">
                  <div className="info-row">
                    <span className="info-label">{isRTL ? <ArabicText>اسم البنك:</ArabicText> : "Bank Name:"}</span>
                    <span className="info-value bank-name">
                      {invoiceData.company.bank_name || "Saudi National Bank"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">{isRTL ? <ArabicText>رقم الآيبان:</ArabicText> : "IBAN:"}</span>
                    <span className="iban-value">{invoiceData.company.iban || "SA1234567890123456789012"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="signature-grid">
            {/* General Manager Signature */}
            <div className="signature-section">
              <div className="signature-line"></div>
              <div className="signature-info">
                <div className="signature-name">{invoiceData.approver_name}</div>
                <div className="signature-title">
                  {isRTL ? <ArabicText>المدير العام</ArabicText> : invoiceData.approver_title}
                </div>
                <div className="signature-label">
                  {isRTL ? (
                    <ArabicText>التوقيع • Signature</ArabicText>
                  ) : (
                    <>
                      Signature • <ArabicText>التوقيع</ArabicText>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Company Stamp */}
            <div className="signature-section">
              <div className="stamp-container">
                <div className="stamp-placeholder">
                  <span className="stamp-text">{isRTL ? <ArabicText>ختم الشركة</ArabicText> : "Company Stamp"}</span>
                </div>
              </div>
              <div className="signature-info">
                <div className="signature-title">
                  {isRTL ? <ArabicText>ختم الشركة الرسمي</ArabicText> : "Official Company Stamp"}
                </div>
                <div className="signature-label">
                  {isRTL ? (
                    <ArabicText>الختم • Stamp</ArabicText>
                  ) : (
                    <>
                      Stamp • <ArabicText>الختم</ArabicText>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="invoice-footer">
            <p className="footer-text">
              {isRTL ? (
                <ArabicText>هذه فاتورة ضريبية صادرة إلكترونيًا وفقًا للوائح شركة العطيشان للاستشارات الهندسية</ArabicText>
              ) : (
                "This is an electronically issued tax invoice in accordance with Al Otaishan Consulting Engeering regulations"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
