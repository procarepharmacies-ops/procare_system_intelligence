import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getExpired } from './api';
import { AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Expired = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [expired, setExpired] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExpired = async (pageToFetch = 1) => {
    setLoading(true);
    try {
      const data = await getExpired('elsanta', { page: pageToFetch, per_page: 20 });
      setExpired(data.items || []);
      setTotalPages(data.pages || Math.ceil((data.total || 1) / 20));
      setPage(data.page || 1);
    } catch (error) {
      console.error('Error fetching expired products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpired(page);
  }, [page]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/20 text-red-500 rounded-xl shadow-inner">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">المنتهي الصلاحية</h1>
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-foreground/70 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold">كود المنتج</th>
                <th className="px-6 py-4 font-semibold">اسم المنتج</th>
                <th className="px-6 py-4 font-semibold">تاريخ الانتهاء</th>
                <th className="px-6 py-4 font-semibold text-right">الكمية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      جاري التحميل...
                    </div>
                  </td>
                </tr>
              ) : expired.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">لا يوجد منتجات منتهية الصلاحية</td>
                </tr>
              ) : (
                expired.map((e, index) => (
                  <tr key={index} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono">{e.product_code}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{e.product_name_ar}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{e.expire_date}</td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">{e.quantity}</td>
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

export default Expired;
