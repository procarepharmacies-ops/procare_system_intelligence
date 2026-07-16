import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getOrders } from './api';
import { Search, Plus, Filter, ShoppingCart, RefreshCw } from 'lucide-react';

export default function PurchaseRequest() {
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
      const data = await getOrders(source);
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
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {t('menus.purchase_request')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage all internal purchase requests</p>
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
          <button className="btn btn-primary shadow-lg shadow-primary/20">
            <Plus size={18} className="mr-2" />
            New Request
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-card/30 backdrop-blur rounded-2xl border border-border/50 p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin text-primary">
              <RefreshCw size={32} />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Class</th>
                  <th className="px-6 py-4 font-semibold">Vendor ID</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.length > 0 ? orders.map(o => (
                  <tr key={o.order_id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">#{o.order_id}</td>
                    <td className="px-6 py-4">{o.order_class}</td>
                    <td className="px-6 py-4">{o.vendor_id}</td>
                    <td className="px-6 py-4">{o.product_number}</td>
                    <td className="px-6 py-4">{new Date(o.insert_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-primary">
                      {o.buy_money?.toLocaleString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-muted-foreground">
                      No purchase requests found.
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
