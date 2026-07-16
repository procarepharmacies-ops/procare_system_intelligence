import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getShortcoming } from './api';
import { AlertTriangle } from 'lucide-react';

const Shortages = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [shortages, setShortages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShortages = async () => {
    setLoading(true);
    try {
      const data = await getShortcoming('elsanta');
      setShortages(data.items || data || []);
    } catch (error) {
      console.error('Error fetching shortages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortages();
  }, []);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '0.00';
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/20 text-yellow-500 rounded-xl shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">النواقص</h1>
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-foreground/70 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold">كود المنتج</th>
                <th className="px-6 py-4 font-semibold">اسم المنتج</th>
                <th className="px-6 py-4 font-semibold text-right">الرصيد الكلي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                      جاري التحميل...
                    </div>
                  </td>
                </tr>
              ) : shortages.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-muted-foreground">لا توجد نواقص</td>
                </tr>
              ) : (
                shortages.map((s, index) => (
                  <tr key={index} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono">{s.product_code}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{s.product_name_ar}</td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">{s.total_stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Shortages;
