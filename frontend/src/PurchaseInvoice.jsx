import React, { useState } from 'react';

const PurchaseInvoice = () => {
  const [items, setItems] = useState([
    { id: 1, barcode: '112233445', name: 'Augmentin 1g', qty: 10, buyPrice: 80.0, expDate: '2025-10-01', total: 800.0 }
  ]);

  return (
    <div className="purchase-invoice-page">
      <div className="page-header">
        <div className="icon">🛒</div>
        <h1>فاتورة مشتريات (استلام بضاعة)</h1>
      </div>

      <div className="kpi-card" style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <div className="input-group">
          <label className="kpi-label">رقم الفاتورة</label>
          <input type="text" value="P-00045" disabled className="branch-select" />
        </div>
        <div className="input-group">
          <label className="kpi-label">المورد</label>
          <select className="branch-select">
            <option>الشركة المتحدة للصيادلة</option>
            <option>ابن سينا فارما</option>
          </select>
        </div>
        <div className="input-group">
          <label className="kpi-label">المخزن المستلم</label>
          <select className="branch-select">
            <option>المخزن الرئيسي</option>
            <option>مخزن الأدوية الثلاجة</option>
          </select>
        </div>
        <div className="input-group">
          <label className="kpi-label">تاريخ الفاتورة</label>
          <input type="date" value={new Date().toISOString().split('T')[0]} className="branch-select" />
        </div>
        <div className="input-group">
          <label className="kpi-label">نوع الدفع</label>
          <select className="branch-select">
            <option>آجل (كريدت)</option>
            <option>نقدي</option>
          </select>
        </div>
      </div>

      <div className="kpi-card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div className="search-box" style={{ maxWidth: '100%' }}>
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="البحث عن صنف لإضافته للفاتورة..." />
        </div>
      </div>

      <div className="data-table-wrapper" style={{ minHeight: '250px', marginBottom: '20px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>م</th>
              <th>الباركود</th>
              <th>اسم الصنف</th>
              <th>تاريخ الصلاحية</th>
              <th>الكمية</th>
              <th>سعر الشراء</th>
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
                  <input type="date" defaultValue={item.expDate} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '4px', borderRadius: '4px' }} />
                </td>
                <td>
                  <input type="number" defaultValue={item.qty} style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '4px', borderRadius: '4px' }} />
                </td>
                <td>
                  <input type="number" defaultValue={item.buyPrice} style={{ width: '80px', background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '4px', borderRadius: '4px' }} />
                </td>
                <td className="money">{item.total.toFixed(2)}</td>
                <td><button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>✖</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="kpi-card" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ وترحيل المخزون</button>
          <button style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>تفريغ الفاتورة</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div className="input-group">
            <label className="kpi-label">قيمة الفاتورة</label>
            <input type="text" value="800.00" disabled className="branch-select money" style={{ fontSize: '18px', textAlign: 'left' }} />
          </div>
          <div className="input-group">
            <label className="kpi-label">الخصم الإضافي</label>
            <input type="number" defaultValue="0" className="branch-select" style={{ textAlign: 'left' }} />
          </div>
          <div className="input-group">
            <label className="kpi-label">صافي القيمة</label>
            <input type="text" value="800.00" disabled className="branch-select money" style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', borderColor: 'var(--accent)' }} />
          </div>
          <div className="input-group" style={{ gridColumn: '2' }}>
            <label className="kpi-label">المبلغ المدفوع</label>
            <input type="number" defaultValue="0" className="branch-select" style={{ textAlign: 'left' }} />
          </div>
          <div className="input-group">
            <label className="kpi-label">المبلغ المتبقي</label>
            <input type="text" value="800.00" disabled className="branch-select" style={{ textAlign: 'left', color: 'var(--danger)', fontWeight: 'bold' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseInvoice;
