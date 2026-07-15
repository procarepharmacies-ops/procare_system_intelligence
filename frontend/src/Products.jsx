import React, { useState } from 'react';

const Products = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const mockProducts = [
    { id: 1, code: '1001', barcode: '123456789', name: 'Panadol Advance 500mg', stock: 45, sellPrice: 25.5, buyPrice: 20.0, category: 'مسكنات' },
    { id: 2, code: '1002', barcode: '987654321', name: 'Brufen 400mg', stock: 12, sellPrice: 35.0, buyPrice: 28.0, category: 'مسكنات' },
    { id: 3, code: '1003', barcode: '112233445', name: 'Augmentin 1g', stock: 0, sellPrice: 90.0, buyPrice: 80.0, category: 'مضادات حيوية' },
  ];

  if (showAddForm) {
    return (
      <div className="products-page">
        <div className="page-header">
          <div className="icon">💊</div>
          <h1>إضافة / تعديل بيانات صنف</h1>
          <button 
            style={{ marginRight: 'auto', background: 'var(--bg-input)', color: 'white', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => setShowAddForm(false)}
          >
            رجوع للقائمة
          </button>
        </div>

        <div className="kpi-card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--accent)' }}>البيانات الأساسية</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="input-group">
              <label className="kpi-label">اسم الصنف عربي *</label>
              <input type="text" className="branch-select" />
            </div>
            <div className="input-group">
              <label className="kpi-label">اسم الصنف إنجليزي</label>
              <input type="text" className="branch-select" />
            </div>
            <div className="input-group">
              <label className="kpi-label">الباركود</label>
              <input type="text" className="branch-select" />
            </div>
            <div className="input-group">
              <label className="kpi-label">الشركة المنتجة *</label>
              <select className="branch-select"><option>GlaxoSmithKline</option></select>
            </div>
            <div className="input-group">
              <label className="kpi-label">الوصف الطبي (المجموعة) *</label>
              <select className="branch-select"><option>مسكنات</option></select>
            </div>
            <div className="input-group">
              <label className="kpi-label">مكان تخزين الصنف *</label>
              <select className="branch-select"><option>الرف A1</option></select>
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>
              <input type="checkbox" /> دواء (له صلاحية)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>
              <input type="checkbox" /> صنف يباع بدون رصيد
            </label>
          </div>
        </div>

        <div className="kpi-card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--accent)' }}>الوحدات والأسعار</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="input-group">
              <label className="kpi-label">الوحدة الأساسية (الكبرى)</label>
              <select className="branch-select"><option>علبة</option></select>
            </div>
            <div className="input-group">
              <label className="kpi-label">سعر البيع</label>
              <input type="number" className="branch-select" />
            </div>
            <div className="input-group">
              <label className="kpi-label">سعر الشراء</label>
              <input type="number" className="branch-select" />
            </div>
            <div className="input-group">
              <label className="kpi-label">الضريبة</label>
              <input type="number" defaultValue={0} className="branch-select" />
            </div>
            
            <div className="input-group">
              <label className="kpi-label">الوحدة الفرعية (الصغرى)</label>
              <select className="branch-select"><option>شريط</option></select>
            </div>
            <div className="input-group">
              <label className="kpi-label">عدد الوحدات الصغرى بالوحدة الكبرى</label>
              <input type="number" className="branch-select" />
            </div>
            <div className="input-group">
              <label className="kpi-label">سعر بيع الوحدة الصغرى</label>
              <input type="number" className="branch-select" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ (Ctrl+S)</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="icon">💊</div>
        <h1>الأصناف والأدوية</h1>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="البحث بالاسم أو الكود أو الباركود..." />
        </div>
        <button 
          style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => setShowAddForm(true)}
        >
          + إضافة صنف جديد (F2)
        </button>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>الكود</th>
              <th>الباركود</th>
              <th>الاسم التجاري</th>
              <th>المجموعة</th>
              <th>الرصيد بالمخزن</th>
              <th>سعر الشراء</th>
              <th>سعر البيع</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map(p => (
              <tr key={p.id}>
                <td>{p.code}</td>
                <td>{p.barcode}</td>
                <td style={{ fontWeight: '500', color: 'white' }}>{p.name}</td>
                <td>{p.category}</td>
                <td className={p.stock === 0 ? 'stock-zero' : (p.stock < 20 ? 'stock-low' : 'stock-ok')}>{p.stock}</td>
                <td className="money">{p.buyPrice.toFixed(2)}</td>
                <td className="money">{p.sellPrice.toFixed(2)}</td>
                <td>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--cyan)', cursor: 'pointer', marginLeft: '12px' }} onClick={() => setShowAddForm(true)}>✏️ تعديل</button>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>✖ حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="pagination">
          <button disabled>السابق</button>
          <span className="page-info">صفحة 1 من 12</span>
          <button>التالي</button>
        </div>
      </div>
    </div>
  );
};

export default Products;
