'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('بيانات الدخول غير صحيحة');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <div className="w-full max-w-md bg-foreground/5 border border-foreground/10 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">تسجيل الدخول</h1>
          <p className="text-foreground/70">لوحة تحكم موقع المعلم ماجد</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg text-center font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-background border border-foreground/20 rounded-xl focus:outline-none focus:border-primary transition-colors text-left"
                dir="ltr"
                required
              />
              <User className="absolute right-3 top-3 text-foreground/40" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-background border border-foreground/20 rounded-xl focus:outline-none focus:border-primary transition-colors text-left"
                dir="ltr"
                required
              />
              <Lock className="absolute right-3 top-3 text-foreground/40" size={20} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
