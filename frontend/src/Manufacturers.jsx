import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getManufacturers } from './api';
import { Factory, Search, Phone } from 'lucide-react';

const Manufacturers = () => {
  const { i18n } = useTranslation();
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchManufacturers = async (query = '') => {
    setLoading(true);
    try {
      const data = await getManufacturers('elsanta', query);
      setManufacturers(data.items || []);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchManufacturers(search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 text-rose-500 rounded-xl shadow-inner">
            <Factory className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">الشركات المصنعة</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="بحث بالاسم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : manufacturers.length === 0 ? (
          <div className="col-span-full p-12 text-center text-muted-foreground glass rounded-2xl border border-white/10">
            لا توجد شركات
          </div>
        ) : (
          manufacturers.map((c) => (
            <div key={c.company_id} className="glass p-6 rounded-3xl border border-white/10 hover:border-rose-500/30 transition-all group overflow-hidden relative">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded">
                    {c.company_code || c.company_id}
                  </span>
                  <Factory className="w-5 h-5 text-rose-500/50" />
                </div>
                
                <h3 className="font-bold text-foreground text-xl mb-1 truncate" title={c.co_name_ar}>{c.co_name_ar || '-'}</h3>
                <p className="text-sm text-muted-foreground mb-4 truncate" title={c.co_name_en}>{c.co_name_en || '-'}</p>
                
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{c.mobile || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Manufacturers;
