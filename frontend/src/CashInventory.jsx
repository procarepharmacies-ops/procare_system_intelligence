import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCashDisk } from './api';
import { Wallet, Search, ArrowRight, ArrowLeft } from 'lucide-react';

const CashInventory = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [cashClose, setCashClose] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCashDisk = async (pageToFetch = 1) => {
    setLoading(true);
    try {
      const data = await getCashDisk('elsanta', { page: pageToFetch, per_page: 20 });
      setCashClose(data.items || []);
      setTotalPages(data.pages || Math.ceil((data.total || 1) / 20));
      setPage(data.page || 1);
    } catch (error) {
      console.error('Error fetching cash disk data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashDisk(page);
  }, [page]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '0.00';
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl shadow-inner">
          <Wallet className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">جرد نقدية (إغلاق الكاشير)</h1>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-foreground/70 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold">تاريخ الإغلاق</th>
                <th className="px-6 py-4 font-semibold">الموظف</th>
                <th className="px-6 py-4 font-semibold text-right">رصيد البداية</th>
                <th className="px-6 py-4 font-semibold text-right">رصيد النظام</th>
                <th className="px-6 py-4 font-semibold text-right">الرصيد الفعلي</th>
                <th className="px-6 py-4 font-semibold text-right">قيمة التحويل</th>
                <th className="px-6 py-4 font-semibold">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      جاري التحميل...
                    </div>
                  </td>
                </tr>
              ) : cashClose.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-muted-foreground">لا توجد حركات إغلاق نقدية</td>
                </tr>
              ) : (
                cashClose.map((item) => (
                  <tr key={item.cdc_id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{item.insert_date}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{item.emp_name_ar || '-'}</td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">{formatCurrency(item.cdc_start_cash)}</td>
                    <td className="px-6 py-4 text-right font-mono text-emerald-500/80 font-medium">{formatCurrency(item.cdc_curr_cash)}</td>
                    <td className="px-6 py-4 text-right font-mono text-emerald-500 font-bold">{formatCurrency(item.cdc_act_cash)}</td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">{formatCurrency(item.cdc_trans_value)}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{item.cdc_notice || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
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

export default CashInventory;
