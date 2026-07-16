import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from './components/theme-provider';
import { Moon, Sun, Globe } from 'lucide-react';

const Layout = () => {
  const [branch, setBranch] = useState('elsanta');
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const topMenus = [
    { 
      label: t('menus.general'), 
      path: '/general',
      items: [
        { label: t('menus.company'), path: '/general/company' },
        { label: t('menus.backup'), path: '/general/backup' },
      ]
    },
    { 
      label: t('menus.products'), 
      path: '/products-menu',
      items: [
        { label: t('menus.add_edit_product'), path: '/products' },
        { label: t('menus.doses') || 'الوحدات والجرعات', path: '/products/doses' },
        { label: 'المجموعات والأقسام', path: '/products/groups' },
        { 
          label: t('menus.product_reports'), 
          path: '#',
          subItems: [
            { label: t('menus.products_general'), path: '/reports/products-general' },
            { label: t('menus.products_inactive'), path: '/reports/products-inactive' }
          ]
        }
      ]
    },
    { 
      label: t('menus.stores'), 
      path: '/stores-menu',
      items: [
        { label: t('menus.start_stock'), path: '/stores/start-stock' },
        { label: t('menus.product_locations'), path: '/stores' },
        { label: t('menus.adjust_cost'), path: '/stores' },
        { label: t('menus.transfer_stock'), path: '/stores' },
        { label: t('menus.inventory'), path: '/stores/inventory' },
        { 
          label: t('menus.store_reports'), 
          path: '#',
          subItems: [
            { label: t('menus.stores_summary'), path: '/reports/stores-summary' },
            { label: t('menus.stores_overstock'), path: '/reports/stores-overstock' },
            { label: t('menus.stores_shortage'), path: '/reports/stores-shortage' }
          ]
        }
      ]
    },
    { 
      label: t('menus.vendors'), 
      path: '/vendors-menu',
      items: [
        { label: t('menus.vendor_data'), path: '/vendors' },
        { label: 'الشركات المصنعة', path: '/vendors/manufacturers' },
        { label: t('menus.vendor_opening'), path: '/vendors/opening-balances' },
        { 
          label: t('menus.vendor_reports'), 
          path: '#',
          subItems: [
            { label: t('menus.vendors_general'), path: '/reports/vendors-general' },
            { label: t('menus.vendors_history'), path: '/reports/vendors-history' }
          ]
        }
      ]
    },
    { 
      label: t('menus.purchases'), 
      path: '/purchases-menu',
      items: [
        { label: t('menus.purchase_request'), path: '/purchases/request' },
        { label: t('menus.branch_order'), path: '/purchases/branch-order' },
        { label: t('menus.purchase_bill'), path: '/purchases' },
        { label: t('menus.purchase_return'), path: '/purchases/return' },
        { 
          label: t('menus.purchase_reports'), 
          path: '#',
          subItems: [
            { label: t('menus.purchases_general'), path: '/reports/purchases-general' },
            { label: t('menus.purchases_orders'), path: '/reports/purchases-orders' }
          ]
        }
      ]
    },
    { 
      label: t('menus.customers'), 
      path: '/customers-menu',
      items: [
        { label: t('menus.customer_data'), path: '/customers' },
        { 
          label: t('menus.customer_reports'), 
          path: '#',
          subItems: [
            { label: t('menus.customer_sales'), path: '/reports/customer-sales' },
            { label: t('menus.customer_history'), path: '/reports/customer-history' }
          ]
        }
      ]
    },
    { 
      label: t('menus.sales'), 
      path: '/sales-menu',
      items: [
        { label: t('menus.sale_bill'), path: '/sales' },
        { label: t('menus.sale_return'), path: '/sales/return' },
        { label: t('menus.sale_pending'), path: '/sales/pending' },
        { 
          label: t('menus.sale_reports'), 
          path: '#',
          subItems: [
            { label: t('menus.sales_general'), path: '/reports/sales-general' },
            { label: t('menus.sales_profit'), path: '/reports/sales-profit' },
            { label: t('menus.sales_employee'), path: '/reports/sales-employee' }
          ]
        }
      ]
    },
    { 
      label: t('menus.accounts'), 
      path: '/accounts-menu',
      items: [
        { label: t('menus.treasury'), path: '/accounts/treasury' },
        { label: t('menus.banks'), path: '/accounts/banks' },
        { label: t('menus.tuning'), path: '/accounts/tuning' },
        { 
          label: t('menus.financial_reports'), 
          path: '#',
          subItems: [
            { label: t('menus.bank_statement'), path: '/reports/bank-statement' },
            { label: t('menus.cash_close'), path: '/reports/cash-close' }
          ]
        }
      ]
    },
    { 
      label: t('menus.employees'), 
      path: '/employees-menu',
      items: [
        { label: t('menus.employee_card'), path: '/employees/card' },
        { label: t('menus.salary'), path: '/employees/salary' },
        { 
          label: t('menus.employee_reports'), 
          path: '#',
          subItems: [
            { label: t('menus.employee_salary'), path: '/reports/employee-salary' },
            { label: t('menus.employee_commission'), path: '/reports/employee-commission' }
          ]
        }
      ]
    },
    { 
      label: t('menus.branch_menu'), 
      path: '/branches-menu',
      items: [
        { label: t('menus.money_convert'), path: '/branches/money-convert' },
        { label: t('reports.branches'), path: '/reports/branches' }
      ]
    },
    { 
      label: t('menus.settings'), 
      path: '/',
      items: [] 
    },
  ];

  const quickAccess = [
    { label: t('quick.shortages'), icon: '📝', path: '/shortages' },
    { label: t('quick.products'), icon: '💊', path: '/products' },
    { label: t('quick.purchases'), icon: '🛒', path: '/purchases' },
    { label: t('quick.sales'), icon: '💰', path: '/sales' },
    { label: t('quick.cash_inventory'), icon: '💵', path: '/cash-inventory' },
    { label: t('quick.customers'), icon: '👥', path: '/customers' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-background/60 dark:bg-background/80 backdrop-blur-3xl z-0"></div>

      {/* Modern Top Menu Bar with Dropdowns */}
      <header className="relative z-50 flex items-center h-[60px] px-4 glass border-b border-border shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 ltr:mr-6 rtl:ml-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold shadow-md">
            P
          </div>
          <span className="font-bold text-primary text-lg font-['Montserrat'] tracking-tight">ProCare</span>
        </div>

        <div className="flex gap-2 flex-1 h-full items-center">
          {topMenus.map(menu => (
            <div key={menu.label} className={`group relative h-full flex items-center px-3 cursor-pointer transition-colors hover:bg-primary/5 ${location.pathname.startsWith(menu.path) && menu.path !== '/' ? 'text-primary border-b-2 border-primary' : 'text-foreground'}`}>
              <Link to={menu.items.length === 0 ? menu.path : '#'} className="flex items-center text-sm font-semibold">
                {menu.label} {menu.items.length > 0 && <span className="text-[10px] ltr:ml-1 rtl:mr-1 opacity-60">▼</span>}
              </Link>
              
              {menu.items.length > 0 && (
                <div className="absolute ltr:left-0 rtl:right-0 top-[60px] w-48 py-2 glass rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 shadow-lg border-t-0">
                  {menu.items.map(item => (
                    item.subItems ? (
                      <div key={item.label} className="relative group/sub px-4 py-2 hover:bg-primary/10 cursor-pointer">
                        <div className="flex items-center justify-between text-sm font-medium">
                          {item.label} <span className="text-[10px] rtl:rotate-180">▶</span>
                        </div>
                        <div className="absolute ltr:left-48 rtl:right-48 top-0 w-48 py-2 glass rounded-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 shadow-lg">
                          {item.subItems.map(sub => (
                            <Link key={sub.label} to={sub.path} className="block px-4 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link key={item.label} to={item.path} className="block px-4 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold opacity-70">{t('branch')}</span>
            <select 
              value={branch} 
              onChange={(e) => setBranch(e.target.value)}
              className="bg-background/50 border border-border rounded-md px-2 py-1 text-sm font-semibold text-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="elsanta">{t('branches.elsanta')}</option>
              <option value="mashala">{t('branches.mashala')}</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-border ltr:pl-4 rtl:pr-4">
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-primary/10 text-foreground transition-colors"
              title="Toggle Language"
            >
              <Globe size={18} />
            </button>
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-primary/10 text-foreground transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Modern Right Quick Access Sidebar */}
        <aside className="w-[90px] glass border-l border-r border-border flex flex-col items-center py-6 gap-6 z-40">
          {quickAccess.map(item => (
            <Link 
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-2 group transition-all duration-300 ${location.pathname === item.path ? 'text-primary' : 'text-foreground/60 hover:text-primary'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border transition-all duration-300 ${
                location.pathname === item.path 
                  ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
                  : 'bg-background/50 border-border group-hover:border-primary/50 group-hover:bg-primary/5'
              }`}>
                {item.icon}
              </div>
              <span className="text-xs font-bold text-center leading-tight">
                {item.label}
              </span>
            </Link>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-y-auto p-6 scroll-smooth">
          <div className="glass rounded-3xl min-h-full p-6 shadow-xl border border-white/20 dark:border-white/5">
            <Outlet context={{ branch }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
