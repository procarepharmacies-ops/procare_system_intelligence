import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getGroups } from './api';
import { Tags, Search } from 'lucide-react';

const ProductGroups = () => {
  const { i18n } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const data = await getGroups('elsanta');
        setGroups(data.items || []);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter(
    (g) =>
      (g.group_name_ar && g.group_name_ar.includes(search)) ||
      (g.group_name_en && g.group_name_en.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/20 text-teal-500 rounded-xl shadow-inner">
            <Tags className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">المجموعات والأقسام</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="بحث عن مجموعة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="col-span-full p-12 text-center text-muted-foreground glass rounded-2xl border border-white/10">
            لا توجد مجموعات
          </div>
        ) : (
          filteredGroups.map((g) => (
            <div key={g.group_id} className="glass p-4 rounded-xl border border-white/10 hover:border-teal-500/30 transition-all hover:shadow-lg group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded">
                  {g.group_id}
                </span>
                <span className="text-xs font-mono text-teal-500/70">
                  {g.group_code}
                </span>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">{g.group_name_ar || '-'}</h3>
              <p className="text-sm text-muted-foreground">{g.group_name_en || '-'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGroups;
