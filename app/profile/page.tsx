'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Palette, User, Mail, Shield,
  Save, ArrowRight, CheckCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string; name: string; email: string; role: string; created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [name,     setName]     = useState('');
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data } = await supabase
        .from('profiles').select('*').eq('id', user.id).single();

      if (data) { setProfile(data); setName(data.name || ''); }
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true); setError(''); setSuccess(false);

    const { error: err } = await supabase
      .from('profiles').update({ name }).eq('id', profile.id);

    if (err) { setError('حدث خطأ أثناء الحفظ'); }
    else { setSuccess(true); setProfile(prev => prev ? { ...prev, name } : prev); }
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  const dashHref = profile?.role === 'teacher'
    ? '/dashboard/teacher' : '/dashboard/student';

  const roleLabel  = profile?.role === 'teacher' ? 'أستاذ' : 'طالب';
  const roleColor  = profile?.role === 'teacher'
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';

  return (
    <div className="min-h-screen bg-slate-950">

      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center">
              <Palette size={16} className="text-white" />
            </div>
            <span className="font-amiri font-bold text-base bg-gradient-to-l from-indigo-400 to-amber-400 bg-clip-text text-transparent">
              Art Edu KMS DZ
            </span>
          </Link>
          <Link href={dashHref}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm transition-colors">
            <ArrowRight size={16} /> لوحتي
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">

          {/* Avatar section */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black ${
              profile?.role === 'teacher' ? 'bg-amber-600' : 'bg-indigo-600'
            }`}>
              {name.charAt(0) || '؟'}
            </div>
            <h1 className="font-amiri text-2xl font-bold text-white mb-1">{name || 'مستخدم'}</h1>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${roleColor}`}>
              {roleLabel}
            </span>
          </div>

          {/* Profile form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-4">
            <h2 className="font-amiri text-xl font-bold text-white mb-5 flex items-center gap-2">
              <User size={18} className="text-indigo-400" />
              معلوماتي الشخصية
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-400 text-sm mb-4 flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                تم حفظ التغييرات بنجاح
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-right"
                  />
                </div>
              </div>

              {/* Email (read only) */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" />
                  <input
                    type="email"
                    value={profile?.email || ''}
                    readOnly
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-slate-400 cursor-not-allowed text-right"
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1 text-right">لا يمكن تغيير البريد الإلكتروني</p>
              </div>

              {/* Role (read only) */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                  نوع الحساب
                </label>
                <div className="relative">
                  <Shield size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" />
                  <input
                    value={roleLabel}
                    readOnly
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-slate-400 cursor-not-allowed text-right"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save size={17} /> حفظ التغييرات</>
                )}
              </button>
            </form>
          </div>

          {/* Join date */}
          {profile?.created_at && (
            <p className="text-center text-slate-500 text-xs">
              انضممت في {new Date(profile.created_at).toLocaleDateString('ar-DZ', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}