import React from 'react';

const Home = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Background Logo */}
      <div style={{
        position: 'absolute',
        opacity: 0.03,
        fontSize: '180px',
        fontWeight: '900',
        color: 'var(--accent)',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0
      }}>
        ProCare
      </div>

      {/* Settings Popup Window Content */}
      <div className="kpi-card" style={{
        width: '550px',
        zIndex: 10,
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '16px'
        }}>
          <span className="icon" style={{ fontSize: '24px' }}>⚙️</span>
          <h2 style={{ fontSize: '20px', color: 'var(--text)' }}>إعدادات التشغيل</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <select className="branch-select" style={{ width: '60%' }}>
              <option>حساب بنك مصر</option>
            </select>
            <label className="kpi-label" style={{ marginBottom: 0 }}>حساب الشيكات الواردة</label>
          </div>

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <select className="branch-select" style={{ width: '60%' }}>
              <option>حساب بنك مصر</option>
            </select>
            <label className="kpi-label" style={{ marginBottom: 0 }}>حساب الشيكات الصادرة</label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text)' }}>إظهار قيمة الخزينة أو الدرج في الحركات المالية</label>
            <input type="checkbox" style={{ accentColor: 'var(--accent)', transform: 'scale(1.2)' }} />
          </div>

          {/* Warnings Section */}
          <div style={{ 
            border: '1px solid var(--border)', 
            borderRadius: '12px',
            padding: '20px 16px 16px', 
            marginTop: '10px', 
            position: 'relative',
            background: 'var(--bg-input)'
          }}>
            <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--bg-card)', padding: '0 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--accent)' }}>
                تشغيل شريط التحذيرات <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} />
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>شهر</span>
                <input type="number" defaultValue={4} className="branch-select" style={{ width: '60px', padding: '4px', textAlign: 'center' }} />
                <label style={{ fontSize: '14px' }}>إظهار الأدوية المنتهية قبل</label>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>يوم</span>
                <input type="number" defaultValue={2} className="branch-select" style={{ width: '60px', padding: '4px', textAlign: 'center' }} />
                <label style={{ fontSize: '14px' }}>تحذير الشيكات المستحقة قبل</label>
                <input type="checkbox" style={{ accentColor: 'var(--accent)' }} />
              </div>
            </div>
          </div>

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <select className="branch-select" style={{ width: '50%' }}>
              <option>الانجليزية</option>
              <option>العربية</option>
            </select>
            <label className="kpi-label" style={{ marginBottom: 0 }}>لغة البحث الافتراضية</label>
          </div>

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <select className="branch-select" style={{ width: '50%' }}>
              <option>العربية</option>
              <option>الانجليزية</option>
            </select>
            <label className="kpi-label" style={{ marginBottom: 0 }}>عرض الصنف في البرنامج باللغة</label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            <label style={{ fontSize: '14px' }}>التحذير لإضافة الصنف إلى كشكول النواقص</label>
            <input type="checkbox" style={{ accentColor: 'var(--accent)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            <label style={{ fontSize: '14px' }}>كشكول النواقص مع حد الطلب</label>
            <input type="checkbox" style={{ accentColor: 'var(--accent)' }} />
          </div>

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <select className="branch-select" style={{ width: '60%' }}>
              <option>Microsoft XPS Document Writer</option>
              <option>Send To OneNote 2010</option>
              <option>Fax</option>
            </select>
            <label className="kpi-label" style={{ marginBottom: 0 }}>طابعة التقارير</label>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
