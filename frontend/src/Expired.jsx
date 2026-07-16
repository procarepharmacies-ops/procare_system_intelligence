import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getExpiredProducts } from './api';
import { AlertTriangle, Download, RefreshCw, PackageX } from 'lucide-react';

export default function Expired() {
  const { t } = useTranslation();
  const [expired, setExpired] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('elsanta');

  useEffect(() => {
    fetchExpired();
  }, [source]);

  const fetchExpired = async () => {
    setLoading(true);
    try {
      const data = await getExpiredProducts(source);
      setExpired(data.items || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex justify-between items-center bg-card/50 backdrop-blur p-4 rounded-2xl border border-red-500/20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
              {t('menus.products_inactive')}
            </h1>
            <p className="text-sm text-red-500/70 mt-1">Review products that have passed their expiration date</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={source} 
            onChange={(e) => setSource(e.target.value)}
            className="input max-w-[150px] border-red-500/20 focus:border-red-500/50"
          >
            <option value="elsanta">{t('branches.elsanta')}</option>
            <option value="mashala">{t('branches.mashala')}</option>
          </select>
          <button className="btn bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 border-0">
            <Download size={18} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-card/30 backdrop-blur rounded-2xl border border-red-500/10 p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin text-red-500">
              <RefreshCw size={32} />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-red-500/5 text-red-500/70">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl font-semibold">Code</th>
                  <th className="px-6 py-4 font-semibold">Product Name</th>
                  <th className="px-6 py-4 font-semibold">Expired On</th>
                  <th className="px-6 py-4 font-semibold">Stock Left</th>
                  <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Est. Loss Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-500/10">
                {expired.length > 0 ? expired.map((e, idx) => {
                  const lossValue = (e.amount || 0) * (e.buy_price || 0);
                  return (
                    <tr key={idx} className="hover:bg-red-500/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{e.product_code}</td>
                      <td className="px-6 py-4 font-bold text-foreground">{e.product_name_ar}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full font-semibold">
                          {e.patch_expire_date ? new Date(e.patch_expire_date).toLocaleDateString() : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">{e.amount}</td>
                      <td className="px-6 py-4 text-right font-black text-red-500">
                        {lossValue.toLocaleString()} <span className="text-xs font-normal">EGP</span>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-muted-foreground">
                      <PackageX size={48} className="mx-auto mb-4 opacity-20" />
                      No expired products found! Stock is healthy.
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
