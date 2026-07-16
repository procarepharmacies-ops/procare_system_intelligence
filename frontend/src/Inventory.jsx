import React, { useState, useEffect } from 'react';
import { getInventory } from './api';
import { Table } from 'lucide-react';

const Inventory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('elsanta'); // elsanta or mashala

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getInventory(source);
        setData(result.items || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [source]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Table className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">جرد مخزني</h1>
            <p className="text-muted-foreground mt-1">عرض السجلات والبيانات المسجلة</p>
          </div>
        </div>
        <select 
          className="bg-background border border-border rounded-xl px-4 py-2"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="elsanta">فرع السنطة (شراكة)</option>
          <option value="mashala">فرع مشلة (ملكي)</option>
        </select>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">رقم الجرد</th>\n                <th className="px-6 py-4 font-medium">التاريخ</th>\n                <th className="px-6 py-4 font-medium">المنتج</th>\n                <th className="px-6 py-4 font-medium">الكمية قبل</th>\n                <th className="px-6 py-4 font-medium">الكمية بعد</th>\n                <th className="px-6 py-4 font-medium">المخزن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">جاري التحميل...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-muted-foreground">لا توجد بيانات متاحة</td></tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">{item.change_id || "-"}</td>\n                    <td className="px-6 py-4">{item.change_date || "-"}</td>\n                    <td className="px-6 py-4">{item.product_id || "-"}</td>\n                    <td className="px-6 py-4">{item.amount_before || "-"}</td>\n                    <td className="px-6 py-4">{item.amount_after || "-"}</td>\n                    <td className="px-6 py-4">{item.store_id || "-"}</td>
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

export default Inventory;
