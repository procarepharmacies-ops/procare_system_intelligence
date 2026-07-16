import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getProducts } from './api';
import { Search, Plus, Edit, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

const Products = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  const fetchProductsData = async (pageToFetch = 1, searchQuery = search) => {
    setLoading(true);
    try {
      // Using 'elsanta' as the primary source of truth for inventory
      const data = await getProducts("elsanta", { page: pageToFetch, search: searchQuery, per_page: 20 });
      setProducts(data.items || []);
      setTotalPages(data.pages || 1);
      setPage(data.page || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData(page, search);
  }, [page]); // Re-fetch on page change

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProductsData(1, search);
  };

  if (showAddForm) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/20 text-accent rounded-xl">
              <Plus className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('products_screen.add_title')}
            </h1>
          </div>
          <button 
            className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-xl hover:bg-secondary/80 transition-colors"
            onClick={() => setShowAddForm(false)}
          >
            {t('products_screen.back_to_list')}
          </button>
        </div>

        {/* Form sections using glassmorphism */}
        <div className="glass rounded-2xl p-6 border border-white/10 dark:border-white/5">
          <h3 className="text-xl font-semibold text-accent mb-6">{t('products_screen.basic_info')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.name_ar')}</label>
              <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.name_en')}</label>
              <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.barcode')}</label>
              <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.company')}</label>
              <select className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                <option>GlaxoSmithKline</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.group_desc')}</label>
              <select className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                <option>مسكنات</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.location')}</label>
              <select className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                <option>الرف A1</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-foreground/80 cursor-pointer hover:text-foreground">
              <input type="checkbox" className="rounded text-accent focus:ring-accent" /> 
              {t('products_screen.is_drug')}
            </label>
            <label className="flex items-center gap-2 text-foreground/80 cursor-pointer hover:text-foreground">
              <input type="checkbox" className="rounded text-accent focus:ring-accent" /> 
              {t('products_screen.allow_zero')}
            </label>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/10 dark:border-white/5">
          <h3 className="text-xl font-semibold text-accent mb-6">{t('products_screen.units_prices')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.major_unit')}</label>
              <select className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                <option>علبة</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.sell_price')}</label>
              <input type="number" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.buy_price')}</label>
              <input type="number" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.tax')}</label>
              <input type="number" defaultValue={0} className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.minor_unit')}</label>
              <select className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                <option>شريط</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.minor_count')}</label>
              <input type="number" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">{t('products_screen.minor_sell')}</label>
              <input type="number" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
            {t('products_screen.save')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/20 text-accent rounded-xl shadow-inner">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('products_screen.title')}
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl border border-white/10">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder={t('products_screen.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <button type="submit" className="hidden">Search</button>
        </form>
        <button 
          className="w-full md:w-auto px-6 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-5 h-5" />
          {t('products_screen.add_new')}
        </button>
      </div>

      <div className="flex-1 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 text-foreground/70 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-semibold">{t('products_screen.code')}</th>
                <th className="px-6 py-4 font-semibold">{t('products_screen.barcode')}</th>
                <th className="px-6 py-4 font-semibold">{t('products_screen.name')}</th>
                <th className="px-6 py-4 font-semibold">{t('products_screen.group')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('products_screen.stock')}</th>
                <th className="px-6 py-4 font-semibold text-right">{t('products_screen.buy_price')}</th>
                <th className="px-6 py-4 font-semibold text-right">{t('products_screen.sell_price')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('products_screen.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-muted-foreground">
                    {t('products_screen.no_data')}
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.product_id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{p.product_code || p.product_fast_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{p.product_int_code}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{isRTL ? p.product_name_ar : p.product_name_en || p.product_name_ar}</td>
                    <td className="px-6 py-4 text-muted-foreground">{p.group_name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.total_stock <= 0 ? 'bg-destructive/10 text-destructive' : 
                        p.total_stock < 10 ? 'bg-orange-500/10 text-orange-500' : 
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {p.total_stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">{Number(p.buy_price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-accent">{Number(p.sell_price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-colors" title={t('products_screen.edit')} onClick={() => setShowAddForm(true)}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title={t('products_screen.delete')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
            {t('products_screen.prev_page')}
          </button>
          
          <span className="text-sm text-muted-foreground font-medium">
            {t('products_screen.page_info', { page, pages: totalPages })}
          </span>
          
          <button 
            className="px-4 py-2 bg-background/50 border border-border rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            {t('products_screen.next_page')}
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
