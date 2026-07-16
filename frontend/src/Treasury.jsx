import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getTreasury } from './api';
import { Banknote, Plus, RefreshCw, Wallet } from 'lucide-react';

export default function Treasury() {
  const { t } = useTranslation();
  const [depots, setDepots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('elsanta');

  useEffect(() => {
    fetchTreasury();
  }, [source]);

  const fetchTreasury = async () => {
    setLoading(true);
    try {
      const data = await getTreasury(source);
      // Filter out those with bank_id (which go to Banks screen)
      const cashOnly = (data.items || []).filter(d => !d.bank_id);
      setDepots(cashOnly);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex justify-between items-center bg-card/50 backdrop-blur p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
              {t('menus.treasury')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage physical cash registers and safe</p>
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
          <button className="btn bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 border-0">
            <Plus size={18} className="mr-2" />
            Add Treasury
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin text-emerald-500">
              <RefreshCw size={32} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {depots.length > 0 ? depots.map(d => (
              <div key={d.cash_depot_id} className="glass p-6 rounded-2xl flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{d.cash_depot_name_ar}</h3>
                    <p className="text-xs text-muted-foreground">Code: {d.cash_depot_code}</p>
                  </div>
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Banknote size={20} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                  <p className="text-3xl font-black text-emerald-500">
                    {d.cash_depot_current_money?.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">EGP</span>
                  </p>
                </div>
              </div>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Wallet size={48} className="mb-4 opacity-20" />
                <p>No treasury accounts found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
