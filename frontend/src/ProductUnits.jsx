import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUnits } from './api';
import { Scale, Search } from 'lucide-react';

const ProductUnits = () => {
  const { i18n } = useTranslation();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const data = await getUnits('elsanta');
        setUnits(data.items || []);
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const filteredUnits = units.filter(
    (u) =>
      (u.unit_name_ar && u.unit_name_ar.includes(search)) ||
      (u.unit_name_en && u.unit_name_en.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl shadow-inner">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">الوحدات والجرعات</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="بحث عن وحدة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="col-span-full p-12 text-center text-muted-foreground glass rounded-2xl border border-white/10">
            لا توجد وحدات
          </div>
        ) : (
          filteredUnits.map((u) => (
            <div key={u.unit_id} className="glass p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all hover:shadow-lg group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded">
                  {u.unit_id}
                </span>
                <span className="text-xs font-mono text-amber-500/70">
                  {u.unit_code}
                </span>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">{u.unit_name_ar || '-'}</h3>
              <p className="text-sm text-muted-foreground">{u.unit_name_en || '-'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductUnits;
