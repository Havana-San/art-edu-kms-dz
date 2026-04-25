'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Palette, ArrowRight, BookOpen, Save, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const LEVELS = ['1AM', '2AM', '3AM', '4AM'];

export default function CreateCoursePage() {
  const router = useRouter();

  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [level,       setLevel]       = useState('1AM');
  const [published,   setPublished]   = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { error: err } = await supabase.from('courses').insert({
      title,
      description,
      level,
      teacher_id:   user.id,
      is_published: published,
    });

    if (err) {
      setError('حدث خطأ أثناء الحفظ، يرجى المحاولة مجدداً');
      setLoading(false);
      return;
    }

    router.push('/dashboard/teacher');
  };

  return (
    <div className="min-h-screen bg-slate-950">

      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center">
              <Palette size={16} className="text-white" />
            </div>
            <span className="font-amiri font-bold text-base bg-gradient-to-l from-indigo-400 to-amber-400 bg-clip-text text-transparent">
              Art Edu KMS DZ
            </span>
          </div>
          <Link
            href="/dashboard/teacher"
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors text-sm"
          >
            <ArrowRight size={16} />
            العودة للوحة
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="text-indigo-400" />
              </div>
              <h1 className="font-amiri text-3xl font-bold text-white">
                إنشاء كورس جديد
              </h1>
            </div>
            <p className="text-slate-400">
              أضف معلومات الكورس ثم يمكنك إضافة الدروس لاحقاً
            </p>
          </div>

          {/* Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                  عنوان الكورس <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="مثال: مبادئ الرسم للمبتدئين"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-right"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                  وصف الكورس <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="اكتب وصفاً مختصراً للكورس وما سيتعلمه الطالب..."
                  required
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-right resize-none"
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3 text-right">
                  المستوى الدراسي <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {LEVELS.map(lv => (
                    <button
                      key={lv}
                      type="button"
                      onClick={() => setLevel(lv)}
                      className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        level === lv
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {lv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Publish toggle */}
              <div className="flex items-center justify-between bg-slate-800 rounded-xl px-5 py-4 border border-slate-700">
                <div>
                  <p className="text-slate-200 font-semibold text-sm">نشر الكورس فوراً</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {published ? 'سيظهر للطلاب مباشرة' : 'سيُحفظ كمسوّدة'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    published ? 'bg-indigo-600' : 'bg-slate-600'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                    published ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      {published ? 'نشر الكورس' : 'حفظ كمسوّدة'}
                    </>
                  )}
                </button>
                <Link
                  href="/dashboard/teacher"
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-xl transition-all border border-slate-700"
                >
                  إلغاء
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}