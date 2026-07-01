'use client';

import { useState } from 'react';
import { loginAdmin } from '@/app/actions';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await loginAdmin(password);
      if (res.success) {
        window.location.href = '/admin';
      } else {
        setError(res.error || 'خطأ في تسجيل الدخول');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground" dir="rtl">
      <form onSubmit={handleLogin} className="p-8 bg-foreground/5 border border-foreground/10 rounded-lg shadow-md w-96 backdrop-blur-sm">
        <h1 className="mb-6 text-2xl font-bold text-center">لوحة تحكم الموقع</h1>
        
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">كلمة المرور</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-foreground/20 rounded bg-background text-foreground focus:outline-none focus:border-primary"
            required
            dir="ltr"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-2 text-white transition rounded bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'جاري التحقق...' : 'دخول'}
        </button>
      </form>
    </div>
  );
}
