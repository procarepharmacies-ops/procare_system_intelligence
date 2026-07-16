import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCompany } from './api';
import { Building, Phone, MapPin, Mail, Loader2 } from 'lucide-react';

const CompanyInfo = () => {
  const { i18n } = useTranslation();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const data = await getCompany('elsanta');
        setCompany(data);
      } catch (error) {
        console.error('Error fetching company info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-full w-full text-muted-foreground">
        لا توجد بيانات للشركة
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl shadow-inner">
          <Building className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">بيانات الشركة</h1>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-6 pb-6 border-b border-border/50">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-3xl font-bold text-blue-500 shadow-inner border border-white/10">
              {company.co_name_ar ? company.co_name_ar.charAt(0) : 'ش'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{company.co_name_ar || '-'}</h2>
              <h3 className="text-lg text-muted-foreground font-medium">{company.co_name_en || '-'}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/30 border border-white/5 hover:bg-background/50 transition-colors">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">الهاتف</p>
                <p className="text-foreground font-medium font-mono">{company.co_tel || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/30 border border-white/5 hover:bg-background/50 transition-colors">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">الفاكس</p>
                <p className="text-foreground font-medium font-mono">{company.co_fax || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/30 border border-white/5 hover:bg-background/50 transition-colors">
              <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">البريد الإلكتروني</p>
                <p className="text-foreground font-medium">{company.co_email || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/30 border border-white/5 hover:bg-background/50 transition-colors">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">العنوان</p>
                <p className="text-foreground font-medium">{company.co_address || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-border/50">
            <h3 className="text-lg font-bold text-foreground mb-4">ملاحظات إضافية</h3>
            <p className="text-muted-foreground leading-relaxed bg-background/30 p-4 rounded-2xl border border-white/5">
              {company.co_notes || 'لا توجد ملاحظات مسجلة.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
