import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getEmployees } from './api';
import { Users, Plus, RefreshCw, UserCircle, Phone, Briefcase } from 'lucide-react';

export default function EmployeeCard() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('elsanta');

  useEffect(() => {
    fetchEmployees();
  }, [source]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees(source);
      setEmployees(data.items || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex justify-between items-center bg-card/50 backdrop-blur p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              {t('menus.employee_card')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage staff details and access rights</p>
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
          <button className="btn bg-purple-500 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-600 border-0">
            <Plus size={18} className="mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin text-purple-500">
              <RefreshCw size={32} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {employees.length > 0 ? employees.map(emp => (
              <div key={emp.emp_id} className="glass p-5 rounded-2xl flex flex-col gap-4 group hover:border-purple-500/30 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                      <UserCircle size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{emp.emp_name_ar}</h3>
                      <p className="text-xs text-muted-foreground">ID: {emp.emp_code}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${emp.active === '1' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {emp.active === '1' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone size={14} className="text-purple-500/70" />
                    <span>{emp.mobile || 'No mobile listed'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase size={14} className="text-purple-500/70" />
                    <span>{emp.hire_date ? new Date(emp.hire_date).toLocaleDateString() : 'Unknown hire date'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Basic Salary</span>
                  <span className="font-bold text-purple-500">{emp.basic_salary?.toLocaleString() || 0} EGP</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Users size={48} className="mb-4 opacity-20" />
                <p>No employees found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
