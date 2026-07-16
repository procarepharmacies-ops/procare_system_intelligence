import React, { useState } from 'react';
import { runBackup } from './api';
import { Database, Save, CheckCircle2, AlertCircle } from 'lucide-react';

const Backup = () => {
  const [source, setSource] = useState('elsanta');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleBackup = async () => {
    setStatus('loading');
    try {
      const result = await runBackup(source);
      if (result.status === 'success') {
        setStatus('success');
        setMessage(`تم أخذ النسخة الاحتياطية بنجاح: ${result.filename}`);
      } else {
        setStatus('error');
        setMessage(result.message || 'حدث خطأ غير معروف');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'فشل الاتصال بالخادم');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">النسخ الاحتياطي (Backup)</h1>
            <p className="text-muted-foreground mt-1">إنشاء نسخة احتياطية من قاعدة البيانات لضمان أمان البيانات</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
        <Database className="w-24 h-24 text-muted-foreground/30" />
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold">حدد الفرع المراد أخذ نسخة احتياطية له</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            سيتم حفظ النسخة الاحتياطية في المجلد D:\Backups على جهاز الخادم لتتمكن من استعادتها لاحقاً.
          </p>
        </div>

        <select 
          className="bg-background border border-border rounded-xl px-6 py-3 w-64 text-lg"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="elsanta">فرع السنطة (شراكة)</option>
          <option value="mashala">فرع مشلة (ملكي)</option>
        </select>

        <button 
          onClick={handleBackup}
          disabled={status === 'loading'}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>جاري النسخ...</>
          ) : (
            <><Save className="w-5 h-5" /> إنشاء نسخة احتياطية الآن</>
          )}
        </button>

        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-6 py-4 rounded-xl border border-green-500/20">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-6 py-4 rounded-xl border border-destructive/20">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Backup;
