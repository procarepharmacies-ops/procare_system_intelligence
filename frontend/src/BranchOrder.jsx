import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getBranchOrders } from './api';
import { PackageOpen, Plus, RefreshCw, ArrowRightLeft } from 'lucide-react';

export default function BranchOrder() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('elsanta');

  useEffect(() => {
    fetchOrders();
  }, [source]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getBranchOrders(source);
      setOrders(data.items || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex justify-between items-center bg-card/50 backdrop-blur p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
            <PackageOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-secondary/60">
              {t('menus.branch_order')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Inter-branch order transfers</p>
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
          <button className="btn bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20 hover:bg-secondary/90">
            <Plus size={18} className="mr-2" />
            New Branch Order
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-card/30 backdrop-blur rounded-2xl border border-border/50 p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin text-secondary">
              <RefreshCw size={32} />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Route</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Total Sell Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.length > 0 ? orders.map(o => (
                  <tr key={o.branch_order_id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">#{o.branch_order_id}</td>
                    <td className="px-6 py-4 flex items-center gap-2 text-muted-foreground">
                      <span className="font-semibold text-foreground">B{o.from_branch_id}</span>
                      <ArrowRightLeft size={14} />
                      <span className="font-semibold text-foreground">B{o.to_branch_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      {o.is_open === '1' ? (
                        <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-semibold">Open</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold">Closed</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{new Date(o.insert_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-secondary">
                      {o.total_sell_price?.toLocaleString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-muted-foreground">
                      No branch orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
