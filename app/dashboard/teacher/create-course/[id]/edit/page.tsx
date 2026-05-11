'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const LEVELS = ['1AM', '2AM', '3AM', '4AM'];

export default function EditCoursePage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [level,       setLevel]       = useState('1AM');
  const [published,   setPublished]   = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data } = await supabase
        .from('courses').select('*').eq('id', id).single();
      if (!data) { router.push('/dashboard/teacher'); return; }

      setTitle(data.title || '');
      setDescription(data.description || '');
      setLevel(data.level || '1AM');
      setPublished(data.is_published || false);
      setLoading(false);
    };
    init();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess(false);

    const { error: err } = await supabase
      .from('courses')
      .update({ title, description, level, is_published: published })
      .eq('id', id);

    if (err) {
      setError('حدث خطأ أثناء الحفظ، يرجى المحاولة مجدداً');
    } else {
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/teacher/courses/${id}`), 1000);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Edit size={20} className="text-amber-400" />
              </div>
              <h1 className="font-amiri text-3xl font-bold text-white">تعديل الكورس</h1>
            </div>
            <p className="text-slate-400">عدّل معلومات الكورس وانقر حفظ</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-400 text-sm mb-6 text-center">
                ✅ تم الحفظ بنجاح، جاري التحويل...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                  عنوان الكورس <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                  وصف الكورس <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-right resize-none"
                />
              </div>

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
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {lv}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-800 rounded-xl px-5 py-4 border border-slate-700">
                <div>
                  <p className="text-slate-200 font-semibold text-sm">حالة النشر</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {published ? 'مرئي للطلاب' : 'مسوّدة — غير مرئي'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    published ? 'bg-amber-500' : 'bg-slate-600'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                    published ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-bold py-3 rounded-xl transition-all active:scale-95"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  ) : (
                    <><Save size={18} /> حفظ التعديلات</>
                  )}
                </button>
                <Link
                  href={`/dashboard/teacher/courses/${id}`}
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