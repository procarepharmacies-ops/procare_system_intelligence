import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getEmployees } from './api';
import { Users, ArrowRight, ArrowLeft } from 'lucide-react';

const Employees = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees('elsanta');
      setEmployees(data.items || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '0.00';
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">الموظفين</h1>
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-foreground/70 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold">الرمز</th>
                <th className="px-6 py-4 font-semibold">الاسم</th>
                <th className="px-6 py-4 font-semibold">الموبايل</th>
                <th className="px-6 py-4 font-semibold text-center">الحالة</th>
                <th className="px-6 py-4 font-semibold text-right">الراتب الأساسي</th>
                <th className="px-6 py-4 font-semibold text-right">الراتب الإضافي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      جاري التحميل...
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">لا توجد موظفين</td>
                </tr>
              ) : (
                employees.map((e) => (
                  <tr key={e.emp_id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono">{e.emp_code}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{e.emp_name_ar}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{e.mobile || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${e.active === '1' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {e.active === '1' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">{formatCurrency(e.basic_salary)}</td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">{formatCurrency(e.more_salary)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
