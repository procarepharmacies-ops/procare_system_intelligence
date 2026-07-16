import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getGedoFinancial } from './api';
import { FileText, Plus, RefreshCw } from 'lucide-react';

export default function PrivateAccounts() {
  const { t } = useTranslation();
  const [gedo, setGedo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('elsanta');

  useEffect(() => {
    fetchGedo();
  }, [source]);

  const fetchGedo = async () => {
    setLoading(true);
    try {
      const data = await getGedoFinancial(source);
      setGedo(data.items || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex justify-between items-center bg-card/50 backdrop-blur p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-500">
              {t('menus.private_accounts')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Gedo financial entries and partner accounts</p>
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
          <button className="btn bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 border-0">
            <Plus size={18} className="mr-2" />
            New Entry
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-card/30 backdrop-blur rounded-2xl border border-border/50 p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin text-rose-500">
              <RefreshCw size={32} />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl font-semibold">Code</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Notes</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {gedo.length > 0 ? gedo.map(g => (
                  <tr key={g.gf_id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{g.gf_code}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-muted rounded text-xs">Type {g.gf_gedo_type}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                      {g.gf_notes || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {g.insert_date ? new Date(g.insert_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-rose-500">
                      {g.gf_value?.toLocaleString() || 0}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-muted-foreground">
                      No financial entries found.
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
