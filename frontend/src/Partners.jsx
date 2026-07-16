import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPartners } from './api';
import { Briefcase, Plus, RefreshCw, UserCheck } from 'lucide-react';

export default function Partners() {
  const { t } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('elsanta');

  useEffect(() => {
    fetchPartners();
  }, [source]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await getPartners(source);
      setPartners(data.items || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex justify-between items-center bg-card/50 backdrop-blur p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-500">
              {t('menus.partners')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage company shareholders and their accounts</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={source} 
            onChange={(e) => setSource(e.target.value)}
            className="input max-w-[150px]"
          >
            <option value="elsanta">{t('branches.elsanta')}</option>
            <option value="mashala">{t('branches.mashala')}</option>
          </select>
          <button className="btn bg-violet-500 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-600 border-0">
            <Plus size={18} className="mr-2" />
            Add Partner
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin text-violet-500">
              <RefreshCw size={32} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.length > 0 ? partners.map(p => (
              <div key={p.coow_id} className="glass p-6 rounded-2xl flex flex-col justify-between group hover:border-violet-500/30 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{p.coow_name_ar}</h3>
                    <p className="text-xs text-muted-foreground">Code: {p.coow_code}</p>
                  </div>
                  <div className="p-2 bg-violet-500/10 text-violet-500 rounded-lg group-hover:bg-violet-500 group-hover:text-white transition-colors">
                    <UserCheck size={20} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-border/50 pb-2">
                    <span className="text-sm text-muted-foreground">Initial Capital</span>
                    <span className="font-semibold text-foreground">
                      {p.coow_start_money?.toLocaleString() || 0} EGP
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                    <p className="text-3xl font-black text-violet-500">
                      {p.coow_current_money?.toLocaleString() || 0} <span className="text-sm font-normal text-muted-foreground">EGP</span>
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Briefcase size={48} className="mb-4 opacity-20" />
                <p>No partners found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
