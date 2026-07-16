import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSalaries } from './api';
import { HandCoins, Plus, RefreshCw, ChevronDown } from 'lucide-react';

export default function Salary() {
  const { t } = useTranslation();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('elsanta');

  useEffect(() => {
    fetchSalaries();
  }, [source]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const data = await getSalaries(source);
      setSalaries(data.items || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex justify-between items-center bg-card/50 backdrop-blur p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
            <HandCoins size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-500">
              {t('menus.salary')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage employee payroll and deductions</p>
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
          <button className="btn bg-pink-500 text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 border-0">
            <Plus size={18} className="mr-2" />
            Process Payroll
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-card/30 backdrop-blur rounded-2xl border border-border/50 p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin text-pink-500">
              <RefreshCw size={32} />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl font-semibold">Employee</th>
                  <th className="px-6 py-4 font-semibold">Month</th>
                  <th className="px-6 py-4 font-semibold">Basic</th>
                  <th className="px-6 py-4 font-semibold text-emerald-500">Commissions (+)</th>
                  <th className="px-6 py-4 font-semibold text-red-500">Deductions (-)</th>
                  <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Net Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {salaries.length > 0 ? salaries.map(s => (
                  <tr key={s.salary_id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold text-xs">
                        {s.emp_name_ar?.substring(0, 1) || '?'}
                      </div>
                      {s.emp_name_ar}
                    </td>
                    <td className="px-6 py-4">
                      {s.month_salary ? new Date(s.month_salary).toLocaleDateString(undefined, {year: 'numeric', month: 'long'}) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">{s.basic_salary?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-emerald-500">+{s.emp_commission?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-red-500">-{s.emp_deduction?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-right font-black text-pink-500 text-base">
                      {s.total?.toLocaleString() || 0}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-muted-foreground">
                      No salary records found.
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
