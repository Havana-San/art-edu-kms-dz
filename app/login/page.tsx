'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Palette, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const nextPath     = searchParams.get('next') || '';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setLoading(false);
      return;
    }

    if (data.user) {
      // إذا كان هناك مسار محفوظ قبل طلب تسجيل الدخول → نعود إليه
      if (nextPath && nextPath.startsWith('/')) {
        router.push(nextPath);
        return;
      }

      // وإلا نوجّه حسب الدور
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      router.push(
        profile?.role === 'teacher'
          ? '/dashboard/teacher'
          : '/dashboard/student'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center">
              <Palette size={20} className="text-white" />
            </div>
            <span className="font-amiri font-bold text-xl bg-gradient-to-l from-indigo-400 to-amber-400 bg-clip-text text-transparent">
              Art Edu KMS DZ
            </span>
          </Link>
          <h1 className="font-amiri text-3xl font-bold text-white mb-2">
            أهلاً بعودتك
          </h1>
          <p className="text-slate-400">سجّل دخولك للمتابعة</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6 text-center">
              {error}
            </div>
          )}

          {/* رسالة إذا كان قادماً من صفحة محمية */}
          {nextPath && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3 text-indigo-400 text-sm mb-6 text-center">
              سجّل دخولك للوصول إلى المحتوى المطلوب
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-11 pl-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-right"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-11 pl-11 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-500 text-sm">أو</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <p className="text-center text-slate-400 text-sm">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              سجّل الآن مجاناً
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/" className="hover:text-slate-300 transition-colors">
            ← العودة للصفحة الرئيسية
          </Link>
        </p>
      </div>
    </div>
  );
}

// useSearchParams يحتاج Suspense في Next.js 14
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}