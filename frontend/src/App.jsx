import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Layout from './Layout';
import Home from './Home';
import Products from './Products';
import Stores from './Stores';
import SalesInvoice from './SalesInvoice';
import PurchaseInvoice from './PurchaseInvoice';
import HeroLanding from './components/HeroLanding';
import Customers from './Customers';
import Vendors from './Vendors';
import Employees from './Employees';
import Accounts from './Accounts';
import Partners from './Partners';
import Shortages from './Shortages';
import Expired from './Expired';
import CompanyInfo from './CompanyInfo';
import Branches from './Branches';
import CashInventory from './CashInventory';
import ProductUnits from './ProductUnits';
import Manufacturers from './Manufacturers';
import ProductGroups from './ProductGroups';

const Placeholder = ({ title }) => (
  <div style={{
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text)'
  }}>
    <h1 style={{ fontSize: '32px', marginBottom: '20px', color: 'var(--accent)' }}>{title}</h1>
    <p style={{ background: 'var(--bg-input)', padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)' }}>هذه الشاشة قيد التطوير...</p>
  </div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {showSplash ? (
        <HeroLanding onComplete={() => setShowSplash(false)} />
      ) : (
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          {/* General Data */}
          <Route path="general" element={<Placeholder title="البيانات العامة" />} />
          <Route path="general/company" element={<CompanyInfo />} />
          <Route path="general/backup" element={<Placeholder title="النسخ الاحتياطي" />} />
          
          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/doses" element={<ProductUnits />} />
          <Route path="products/groups" element={<ProductGroups />} />
          
          {/* Stores */}
          <Route path="stores" element={<Stores />} />
          <Route path="stores/start-stock" element={<Placeholder title="الأرصدة الافتتاحية للمخزون" />} />
          <Route path="stores/inventory" element={<Placeholder title="جرد مخزني" />} />
          
          {/* Vendors */}
          <Route path="vendors" element={<Vendors />} />
          <Route path="vendors/opening-balances" element={<Placeholder title="الأرصدة الافتتاحية للموردين" />} />
          <Route path="vendors/manufacturers" element={<Manufacturers />} />
          
          {/* Purchases */}
          <Route path="purchases" element={<PurchaseInvoice />} />
          <Route path="purchases/return" element={<Placeholder title="مرتجع مشتريات" />} />
          
          {/* Orders */}
          <Route path="orders/request" element={<Placeholder title="طلب شراء" />} />
          <Route path="orders/branch-order" element={<Placeholder title="إرسال طلبية للفرع" />} />

          {/* Partners */}
          <Route path="partners" element={<Partners />} />
          
          {/* Customers */}
          <Route path="customers" element={<Customers />} />
          
          {/* Sales */}
          <Route path="sales" element={<SalesInvoice />} />
          <Route path="sales/return" element={<Placeholder title="مرتبط مبيعات" />} />
          <Route path="sales/pending" element={<Placeholder title="مبيعات معلقة" />} />
          
          {/* Accounts */}
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/treasury" element={<Placeholder title="الخزينة" />} />
          <Route path="accounts/banks" element={<Placeholder title="حسابات البنوك" />} />
          <Route path="accounts/tuning" element={<Placeholder title="تسوية الحسابات" />} />
          
          {/* Private Accounts */}
          <Route path="private-accounts" element={<Placeholder title="الحسابات الخاصة" />} />

          {/* Public Accounts */}
          <Route path="public-accounts" element={<Placeholder title="الحسابات العامة" />} />
          
          {/* Employees */}
          <Route path="employees" element={<Employees />} />
          <Route path="employees/card" element={<Placeholder title="بطاقة موظف" />} />
          <Route path="employees/salary" element={<Placeholder title="الرواتب والسلف" />} />
          
          {/* Branches */}
          <Route path="branches" element={<Branches />} />
          <Route path="branches/money-convert" element={<Placeholder title="تحويل نقدي لفرع" />} />
          
          {/* Reports */}
          <Route path="reports/products-inactive" element={<Expired />} />
          <Route path="reports/*" element={<Placeholder title="تقرير (قيد التطوير)" />} />
          
          {/* Quick Access */}
          <Route path="shortages" element={<Shortages />} />
          <Route path="cash-inventory" element={<CashInventory />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
      )}
    </ThemeProvider>
  );
}

export default App;
