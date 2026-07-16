import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Users, ArrowRight, ArrowLeft, Plus, Edit, Trash2, X } from 'lucide-react';
import { getPartners, createPartner, updatePartner } from './api';

const Partners = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    partner_code: '',
    partner_name_ar: '',
    partner_name_en: '',
    mobile: '',
    share_percentage: 0,
    active: '1'
  });
  
  const fetchPartnersData = async (pageToFetch = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const data = await getPartners('elsanta', { page: pageToFetch, search: searchQuery });
      setPartners(data.items || []);
      setTotalPages(data.total_pages || 1);
      setPage(pageToFetch);
    } catch (error) {
      console.error("Error fetching partners:", error);
      alert("حدث خطأ أثناء جلب بيانات الشركاء");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnersData(page, search);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPartnersData(1, search);
  };

  const handleOpenAdd = () => {
    setEditingPartner(null);
    setFormData({
      partner_code: '', partner_name_ar: '', partner_name_en: '',
      mobile: '', share_percentage: 0, active: '1'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (partner) => {
    setEditingPartner(partner);
    setFormData({
      partner_code: partner.partner_code || '',
      partner_name_ar: partner.partner_name_ar || '',
      partner_name_en: partner.partner_name_en || '',
      mobile: partner.mobile || '',
      share_percentage: partner.share_percentage || 0,
      active: partner.active || '1'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الشريك؟')) {
      alert("API غير متوفر بعد للحذف");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingPartner) {
        await updatePartner('elsanta', editingPartner.partner_id, formData);
      } else {
        await createPartner('elsanta', formData);
      }
      setIsModalOpen(false);
      fetchPartnersData(page, search);
    } catch (error) {
      console.error("Error saving partner:", error);
      alert("حدث خطأ أثناء حفظ بيانات الشريك");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "0.00";
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('menus.partners_data') || 'بيانات الشركاء'}
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl border border-white/10">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="البحث باسم الشريك..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <button type="submit" className="hidden">Search</button>
        </form>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors w-full md:w-auto font-medium shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          إضافة شريك
        </button>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-foreground/70 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold">الكود</th>
                <th className="px-6 py-4 font-semibold">اسم الشريك</th>
                <th className="px-6 py-4 font-semibold">الموبايل</th>
                <th className="px-6 py-4 font-semibold text-center">النسبة (%)</th>
                <th className="px-6 py-4 font-semibold text-center">الحالة</th>
                <th className="px-6 py-4 font-semibold text-right">رصيد الشريك</th>
                <th className="px-6 py-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      جاري التحميل...
                    </div>
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-muted-foreground">
                    لا يوجد شركاء
                  </td>
                </tr>
              ) : (
                partners.map((p) => (
                  <tr key={p.partner_id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono">{p.partner_code}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{p.partner_name_ar}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{p.mobile || '-'}</td>
                    <td className="px-6 py-4 text-center font-bold text-purple-500">{p.share_percentage}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.active === '1' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {p.active === '1' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-foreground">{formatCurrency(p.balance)}</td>
                    <td className="px-6 py-4 text-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.partner_id)}
                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="حذف"
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
        
        {/* Pagination */}
        <div className="p-4 border-t border-border/50 flex items-center justify-between bg-black/5 dark:bg-white/5">
          <button 
            className="px-4 py-2 bg-background/50 border border-border rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            السابق
          </button>
          
          <span className="text-sm text-muted-foreground font-medium">
            صفحة {page} من {totalPages}
          </span>
          
          <button 
            className="px-4 py-2 bg-background/50 border border-border rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            التالي
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/50">
              <h2 className="text-xl font-bold text-foreground">
                {editingPartner ? 'تعديل بيانات الشريك' : 'إضافة شريك جديد'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">الكود</label>
                  <input required type="text" value={formData.partner_code} onChange={e => setFormData({...formData, partner_code: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">الاسم (عربي) *</label>
                  <input required type="text" value={formData.partner_name_ar} onChange={e => setFormData({...formData, partner_name_ar: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">الاسم (انجليزي)</label>
                  <input type="text" value={formData.partner_name_en} onChange={e => setFormData({...formData, partner_name_en: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">الموبايل</label>
                  <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">نسبة الشراكة (%)</label>
                  <input type="number" step="0.1" value={formData.share_percentage} onChange={e => setFormData({...formData, share_percentage: parseFloat(e.target.value) || 0})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
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

export default Partners;
