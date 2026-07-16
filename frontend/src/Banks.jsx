import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getBanks, getTreasury } from './api';
import { Landmark, Plus, RefreshCw, CreditCard } from 'lucide-react';

export default function Banks() {
  const { t } = useTranslation();
  const [banks, setBanks] = useState([]);
  const [bankBalances, setBankBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('elsanta');

  useEffect(() => {
    fetchBanks();
  }, [source]);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const [banksData, treasuryData] = await Promise.all([
        getBanks(source),
        getTreasury(source)
      ]);
      
      setBanks(banksData.items || []);
      
      // Calculate balances for each bank from Cash_depots
      const balances = {};
      (treasuryData.items || []).forEach(depot => {
        if (depot.bank_id) {
          balances[depot.bank_id] = (balances[depot.bank_id] || 0) + (depot.cash_depot_current_money || 0);
        }
      });
      setBankBalances(balances);
      
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex justify-between items-center bg-card/50 backdrop-blur p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Landmark size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              {t('menus.banks')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage bank accounts and checks</p>
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
          <button className="btn bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 border-0">
            <Plus size={18} className="mr-2" />
            Add Bank
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin text-blue-500">
              <RefreshCw size={32} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banks.length > 0 ? banks.map(b => (
              <div key={b.bank_id} className="glass p-6 rounded-2xl flex flex-col justify-between group hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{b.bank_name_ar}</h3>
                    <p className="text-xs text-muted-foreground">Code: {b.bank_code}</p>
                    {b.bank_address && <p className="text-xs text-muted-foreground mt-1">{b.bank_address}</p>}
                  </div>
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <CreditCard size={20} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                  <p className="text-3xl font-black text-blue-500">
                    {(bankBalances[b.bank_id] || 0).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">EGP</span>
                  </p>
                </div>
              </div>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Landmark size={48} className="mb-4 opacity-20" />
                <p>No banks found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
