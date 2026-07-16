import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getStores, createStore, updateStore, deleteStore } from './api';
import { Building, Search, Plus, Edit, Trash2, X } from 'lucide-react';

const Stores = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    store_code: '',
    store_name_ar: '',
    store_name_en: '',
    active: '1'
  });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getStores('elsanta');
      setStores(data.items || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = stores.filter(
    (s) =>
      (s.store_name_ar && s.store_name_ar.includes(search)) ||
      (s.store_name_en && s.store_name_en.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingStore(null);
    setFormData({ store_code: '', store_name_ar: '', store_name_en: '', active: '1' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (store) => {
    setEditingStore(store);
    setFormData({
      store_code: store.store_code || '',
      store_name_ar: store.store_name_ar || '',
      store_name_en: store.store_name_en || '',
      active: store.active || '1'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من إيقاف هذا المخزن؟')) {
      try {
        await deleteStore('elsanta', id);
        fetchStores();
      } catch (error) {
        console.error('Delete error:', error);
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingStore) {
        await updateStore('elsanta', editingStore.store_id, formData);
      } else {
        await createStore('elsanta', formData);
      }
      setIsModalOpen(false);
      fetchStores();
    } catch (error) {
      console.error('Submit error:', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl shadow-inner">
            <Building className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">المخازن والمستودعات</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="بحث عن مخزن..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors w-full md:w-auto font-medium shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          إضافة مخزن
        </button>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-foreground/70 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold">رقم المخزن</th>
                <th className="px-6 py-4 font-semibold">اسم المخزن (عربي)</th>
                <th className="px-6 py-4 font-semibold">اسم المخزن (إنجليزي)</th>
                <th className="px-6 py-4 font-semibold text-center">الحالة</th>
                <th className="px-6 py-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      جاري التحميل...
                    </div>
                  </td>
                </tr>
              ) : filteredStores.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-muted-foreground">لا توجد مخازن</td>
                </tr>
              ) : (
                filteredStores.map((s) => (
                  <tr key={s.store_id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono">{s.store_id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{s.store_name_ar || '-'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{s.store_name_en || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        s.active === '1' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {s.active === '1' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => handleOpenEdit(s)}
                        className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.store_id)}
                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="حذف/إيقاف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/50">
              <h2 className="text-xl font-bold text-foreground">
                {editingStore ? 'تعديل بيانات المخزن' : 'إضافة مخزن جديد'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">الكود</label>
                  <input type="text" value={formData.store_code} onChange={e => setFormData({...formData, store_code: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">الاسم (عربي) *</label>
                  <input required type="text" value={formData.store_name_ar} onChange={e => setFormData({...formData, store_name_ar: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">الاسم (انجليزي)</label>
                  <input type="text" value={formData.store_name_en} onChange={e => setFormData({...formData, store_name_en: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">الحالة</label>
                  <select value={formData.active} onChange={e => setFormData({...formData, active: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none">
                    <option value="1">نشط</option>
                    <option value="0">غير نشط</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl bg-background/50 border border-border hover:bg-background transition-colors font-medium">إلغاء</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors font-medium shadow-lg shadow-purple-500/20 disabled:opacity-50">
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
