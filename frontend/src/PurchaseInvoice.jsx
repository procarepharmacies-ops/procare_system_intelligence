import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPurchases } from './api';
import { Search, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';

const PurchaseInvoice = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  const fetchPurchasesData = async (pageToFetch = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const data = await getPurchases("elsanta", { page: pageToFetch, search: searchQuery, per_page: 20 });
      setPurchases(data.items || []);
      setTotalPages(data.pages || Math.ceil((data.total || 1) / 20));
      setPage(data.page || 1);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasesData(page, search);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPurchasesData(1, search);
  };

  const formatCurrency = (value) => {
    if (!value) return "0.00";
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl shadow-inner">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            فواتير المشتريات
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl border border-white/10">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="البحث برقم الفاتورة أو المورد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-foreground/70 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold">رقم الفاتورة</th>
                <th className="px-6 py-4 font-semibold">التاريخ</th>
                <th className="px-6 py-4 font-semibold">المورد</th>
                <th className="px-6 py-4 font-semibold">المخزن</th>
                <th className="px-6 py-4 font-semibold text-right">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      جاري التحميل...
                    </div>
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                    لا توجد فواتير مشتريات
                  </td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p.purchase_id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono">{p.purchase_code || p.purchase_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{p.insert_date?.split(' ')[0] || p.bill_date}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{p.vendor_name_ar || 'غير محدد'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{p.store_name_ar}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-purple-500">{formatCurrency(p.total_bill)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border/50 flex items-center justify-between bg-black/5 dark:bg-white/5">
          <button 
            className="px-4 py-2 bg-background/50 border border-border rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            السابق
          </button>
          
          <span className="text-sm text-muted-foreground font-medium">
            صفحة {page} من {totalPages}
          </span>
          
          <button 
            className="px-4 py-2 bg-background/50 border border-border rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            التالي
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseInvoice;
