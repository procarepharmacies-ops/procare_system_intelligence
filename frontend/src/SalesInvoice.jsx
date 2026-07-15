import React, { useState } from 'react';

const SalesInvoice = () => {
  const [items, setItems] = useState([
    { id: 1, barcode: '123456789', name: 'Panadol Advance 500mg', qty: 2, price: 25.5, discount: 0, tax: 0, total: 51.0 },
    { id: 2, barcode: '987654321', name: 'Brufen 400mg', qty: 1, price: 35.0, discount: 0, tax: 0, total: 35.0 }
  ]);

  return (
    <div className="sales-invoice-page">
      <div className="page-header">
        <div className="icon">🧾</div>
        <h1>فاتورة مبيعات</h1>
      </div>

      <div className="kpi-card" style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="input-group">
          <label className="kpi-label">رقم الفاتورة</label>
          <input type="text" value="S-00001" disabled className="branch-select" />
        </div>
        <div className="input-group">
          <label className="kpi-label">نوع الفاتورة</label>
          <select className="branch-select">
            <option>نقدي</option>
            <option>آجل</option>
          </select>
        </div>
        <div className="input-group">
          <label className="kpi-label">العميل</label>
          <select className="branch-select">
            <option>عميل نقدي (كاش)</option>
            <option>أحمد محمد</option>
          </select>
        </div>
        <div className="input-group">
          <label className="kpi-label">التاريخ</label>
          <input type="date" value={new Date().toISOString().split('T')[0]} className="branch-select" />
        </div>
      </div>

      <div className="kpi-card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div className="search-box" style={{ maxWidth: '100%' }}>
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="البحث بالباركود أو اسم الصنف (F10)" autoFocus />
        </div>
      </div>

      <div className="data-table-wrapper" style={{ minHeight: '300px', marginBottom: '20px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>م</th>
              <th>الباركود</th>
              <th>اسم الصنف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الخصم</th>
              <th>الضريبة</th>
              <th>الإجمالي</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.barcode}</td>
                <td>{item.name}</td>
                <td>
                  <input type="number" defaultValue={item.qty} style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '4px', borderRadius: '4px' }} />
                </td>
                <td className="money">{item.price.toFixed(2)}</td>
                <td>{item.discount}</td>
                <td>{item.tax}</td>
                <td className="money">{item.total.toFixed(2)}</td>
                <td><button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>✖</button></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>لا توجد أصناف في الفاتورة</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="kpi-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ وطباعة (F12)</button>
          <button style={{ background: 'var(--bg-input)', color: 'white', border: '1px solid var(--border)', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>تجهيز / حفظ فقط</button>
          <button style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>إلغاء الفاتورة</button>
        </div>
        
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '4px' }}>الإجمالي قبل الخصم: 86.00 EGP</div>
          <div style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '4px' }}>إجمالي الخصم: 0.00 EGP</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>الصافي: 86.00 EGP</div>
        </div>
      </div>
    </div>
  );
};

export default SalesInvoice;
