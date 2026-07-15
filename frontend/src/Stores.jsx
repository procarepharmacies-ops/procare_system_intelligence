import React, { useState } from 'react';

const Stores = () => {
  const [activeTab, setActiveTab] = useState('locations');

  return (
    <div className="stores-page" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <div className="icon">🏢</div>
        <h1>المخازن والمستودعات</h1>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <button 
          onClick={() => setActiveTab('locations')}
          style={{ 
            background: 'transparent', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            color: activeTab === 'locations' ? 'var(--accent)' : 'var(--text-dim)',
            borderBottom: activeTab === 'locations' ? '2px solid var(--accent)' : 'none',
            paddingBottom: '8px'
          }}
        >
          أماكن الأصناف
        </button>
        <button 
          onClick={() => setActiveTab('transit')}
          style={{ 
            background: 'transparent', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            color: activeTab === 'transit' ? 'var(--accent)' : 'var(--text-dim)',
            borderBottom: activeTab === 'transit' ? '2px solid var(--accent)' : 'none',
            paddingBottom: '8px'
          }}
        >
          الأرصدة الانتقالية للمخزون
        </button>
        <button 
          onClick={() => setActiveTab('cost')}
          style={{ 
            background: 'transparent', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            color: activeTab === 'cost' ? 'var(--accent)' : 'var(--text-dim)',
            borderBottom: activeTab === 'cost' ? '2px solid var(--accent)' : 'none',
            paddingBottom: '8px'
          }}
        >
          تعديل تكلفة الأصناف
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'locations' && <ItemLocations />}
        {activeTab === 'transit' && <TransitBalances />}
        {activeTab === 'cost' && <ModifyCost />}
      </div>
    </div>
  );
};

const ItemLocations = () => {
  return (
    <div>
      <div className="kpi-card" style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Tree view mockup */}
        <div style={{ borderRight: '1px solid var(--border)', paddingRight: '16px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--accent)' }}>شجرة المخازن</h3>
          <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-dim)', lineHeight: '2' }}>
            <li>🏢 المخزن الرئيسي</li>
            <li style={{ marginRight: '20px' }}>📦 الأرفف
              <ul style={{ listStyle: 'none', paddingRight: '20px' }}>
                <li>🗄️ الرف أ</li>
                <li>🗄️ الرف ب</li>
              </ul>
            </li>
            <li style={{ marginRight: '20px' }}>🧊 الثلاجة
              <ul style={{ listStyle: 'none', paddingRight: '20px' }}>
                <li>🗄️ درج 1</li>
              </ul>
            </li>
          </ul>
        </div>
        
        {/* Form */}
        <div>
          <h3 style={{ marginBottom: '16px', color: 'var(--accent)' }}>بيانات الموقع</h3>
          <div className="input-group" style={{ marginBottom: '12px' }}>
            <label className="kpi-label">كود موقع الصنف</label>
            <input type="text" className="branch-select" disabled value="LOC-001" />
          </div>
          <div className="input-group" style={{ marginBottom: '12px' }}>
            <label className="kpi-label">اسم موقع الصنف</label>
            <input type="text" className="branch-select" defaultValue="الرف أ" />
          </div>
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label className="kpi-label">المكان الحالي (المسار)</label>
            <input type="text" className="branch-select" disabled value="المخزن الرئيسي > الأرفف > الرف أ" />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إضافة</button>
            <button style={{ background: 'var(--bg-input)', color: 'white', border: '1px solid var(--border)', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>تعديل</button>
            <button style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>حذف</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransitBalances = () => {
  return (
    <div>
      <div className="kpi-card" style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="input-group">
          <label className="kpi-label">المخزن المُصَدِّر (من)</label>
          <select className="branch-select"><option>المخزن الرئيسي</option></select>
        </div>
        <div className="input-group">
          <label className="kpi-label">المخزن المستهدف (إلى)</label>
          <select className="branch-select"><option>مخزن فرع مشلة</option></select>
        </div>
        <div className="input-group">
          <label className="kpi-label">الصفحة</label>
          <select className="branch-select"><option>الكل</option></select>
        </div>
      </div>

      <div className="data-table-wrapper" style={{ minHeight: '300px', marginBottom: '20px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>كود الصنف</th>
              <th>اسم الصنف</th>
              <th>المنصرف</th>
              <th>الرصيد</th>
              <th>تاريخ الصلاحية</th>
              <th>المخزن</th>
              <th>المورد</th>
              <th>الشركة</th>
              <th>النوع</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1001</td>
              <td>Panadol Advance</td>
              <td><input type="number" defaultValue={10} style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '4px', borderRadius: '4px' }} /></td>
              <td>45</td>
              <td>2025-10-01</td>
              <td>المخزن الرئيسي</td>
              <td>Glaxo</td>
              <td>GSK</td>
              <td>دواء</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>تأكيد التحويل</button>
      </div>
    </div>
  );
};

const ModifyCost = () => {
  return (
    <div>
      <div className="kpi-card" style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'end' }}>
        <div className="input-group">
          <label className="kpi-label">المخزن</label>
          <select className="branch-select"><option>المخزن الرئيسي</option></select>
        </div>
        <div className="input-group">
          <label className="kpi-label">كود الصنف</label>
          <input type="text" className="branch-select" placeholder="ابحث بالكود..." />
        </div>
        <div style={{ paddingBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} /> أصناف رصيدها أكثر من 0
          </label>
        </div>
      </div>

      <div className="data-table-wrapper" style={{ minHeight: '300px', marginBottom: '20px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>كود الصنف</th>
              <th>اسم الصنف</th>
              <th>الوحدة</th>
              <th>التكلفة</th>
              <th>سعر البيع</th>
              <th>ن.ص (هامش)</th>
              <th>سعر الشراء</th>
              <th>الضريبة</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1001</td>
              <td>Panadol Advance</td>
              <td>علبة</td>
              <td className="money"><input type="number" defaultValue={20} style={{ width: '80px', background: 'transparent', border: '1px solid var(--accent)', color: 'white', padding: '4px', borderRadius: '4px' }} /></td>
              <td className="money">25.5</td>
              <td>21%</td>
              <td className="money">20.0</td>
              <td>0%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ التعديلات</button>
      </div>
    </div>
  );
};

export default Stores;
