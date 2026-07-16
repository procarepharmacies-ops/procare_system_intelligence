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
import PurchaseRequest from './PurchaseRequest';
import BranchOrder from './BranchOrder';
import Treasury from './Treasury';
import Banks from './Banks';
import EmployeeCard from './EmployeeCard';
import Salary from './Salary';
import Tuning from './Tuning';
import AccountsTree from './AccountsTree';
import PrivateAccounts from './PrivateAccounts';
import StartStock from './StartStock';
import Inventory from './Inventory';
import PurchaseReturn from './PurchaseReturn';
import SalesReturn from './SalesReturn';
import SalesPending from './SalesPending';
import VendorBalances from './VendorBalances';
import BranchTransfer from './BranchTransfer';
import SalesGeneral from './SalesGeneral';
import SalesProfit from './SalesProfit';
import SalesEmployee from './SalesEmployee';
import BankStatement from './BankStatement';
import CashClose from './CashClose';
import Backup from './Backup';


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
          
          {/* Partners */}
          <Route path="partners" element={<Partners />} />
          <Route path="general/company" element={<CompanyInfo />} />
          <Route path="general/backup" element={<Backup />} />
          
          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/doses" element={<ProductUnits />} />
          <Route path="products/groups" element={<ProductGroups />} />
          
          {/* Stores */}
          <Route path="stores" element={<Stores />} />
          <Route path="stores/start-stock" element={<StartStock />} />
          <Route path="stores/inventory" element={<Inventory />} />
          
          {/* Vendors */}
          <Route path="vendors" element={<Vendors />} />
          <Route path="vendors/opening-balances" element={<VendorBalances />} />
          <Route path="vendors/manufacturers" element={<Manufacturers />} />
          
          {/* Purchases */}
          <Route path="purchases" element={<PurchaseInvoice />} />
          <Route path="purchases/return" element={<PurchaseReturn />} />
          
          {/* Orders */}
          <Route path="orders/request" element={<PurchaseRequest />} />
          <Route path="orders/branch-order" element={<BranchOrder />} />


          {/* Customers */}
          <Route path="customers" element={<Customers />} />
          
          {/* Sales */}
          <Route path="sales" element={<SalesInvoice />} />
          <Route path="sales/return" element={<SalesReturn />} />
          <Route path="sales/pending" element={<SalesPending />} />
          
          {/* Accounts */}
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/treasury" element={<Treasury />} />
          <Route path="accounts/banks" element={<Banks />} />
          <Route path="accounts/tuning" element={<Tuning />} />
          
          {/* Private Accounts */}
          <Route path="private-accounts" element={<PrivateAccounts />} />

          {/* Public Accounts */}
          <Route path="public-accounts" element={<AccountsTree />} />
          
          {/* Employees */}
          <Route path="employees" element={<Employees />} />
          <Route path="employees/card" element={<EmployeeCard />} />
          <Route path="employees/salary" element={<Salary />} />
          
          {/* Branches */}
          <Route path="branches" element={<Branches />} />
          <Route path="branches/money-convert" element={<BranchTransfer />} />
          
          {/* Reports */}
          <Route path="reports/products-inactive" element={<Expired />} />
          
          <Route path="reports/sales-general" element={<SalesGeneral />} />
          <Route path="reports/sales-profit" element={<SalesProfit />} />
          <Route path="reports/sales-employee" element={<SalesEmployee />} />
          <Route path="reports/bank-statement" element={<BankStatement />} />
          <Route path="reports/cash-close" element={<CashClose />} />
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
