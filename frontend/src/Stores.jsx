import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getStores } from './api';
import { Building, Search } from 'lucide-react';

const Stores = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getStores('elsanta');
      setStores(data.items || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = stores.filter(
    (s) =>
      (s.store_name_ar && s.store_name_ar.includes(search)) ||
      (s.store_name_en && s.store_name_en.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl shadow-inner">
            <Building className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">المخازن والمستودعات</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="بحث عن مخزن..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-foreground/70 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold">رقم المخزن</th>
                <th className="px-6 py-4 font-semibold">اسم المخزن (عربي)</th>
                <th className="px-6 py-4 font-semibold">اسم المخزن (إنجليزي)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      جاري التحميل...
                    </div>
                  </td>
                </tr>
              ) : filteredStores.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-muted-foreground">لا توجد مخازن</td>
                </tr>
              ) : (
                filteredStores.map((s) => (
                  <tr key={s.store_id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono">{s.store_id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{s.store_name_ar || '-'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{s.store_name_en || '-'}</td>
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

export default Stores;
