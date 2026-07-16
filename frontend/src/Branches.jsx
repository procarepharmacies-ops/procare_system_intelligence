import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getBranches } from './api';
import { GitBranch, MapPin, Database } from 'lucide-react';

const Branches = () => {
  const { i18n } = useTranslation();
  const [branches, setBranches] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const data = await getBranches();
        setBranches(data.branches || {});
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const branchEntries = Object.entries(branches);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-500/20 text-indigo-500 rounded-xl shadow-inner">
          <GitBranch className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">الفروع</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : branchEntries.length === 0 ? (
          <div className="col-span-full p-12 text-center text-muted-foreground glass rounded-2xl border border-white/10">
            لا توجد فروع مسجلة
          </div>
        ) : (
          branchEntries.map(([key, info]) => (
            <div key={key} className="glass p-6 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground capitalize">{key}</h2>
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-xs font-bold rounded-full">
                    {info.type === 'remote' ? 'عن بعد' : 'محلي'}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">الخادم</p>
                      <p className="text-sm font-mono text-foreground break-all">{info.server}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">قاعدة البيانات</p>
                      <p className="text-sm font-mono text-foreground">{info.database}</p>
                    </div>
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

export default Branches;
