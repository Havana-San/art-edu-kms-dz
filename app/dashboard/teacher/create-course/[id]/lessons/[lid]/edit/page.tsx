'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Save, Video, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function EditLessonPage() {
  const { id, lid } = useParams<{ id: string; lid: string }>();
  const router = useRouter();

  const [title,    setTitle]    = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [content,  setContent]  = useState('');
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data } = await supabase
        .from('lessons').select('*').eq('id', lid).single();
      if (!data) { router.push(`/dashboard/teacher/courses/${id}`); return; }

      setTitle(data.title || '');
      setVideoUrl(data.video_url || '');
      setContent(data.content || '');
      setLoading(false);
    };
    init();
  }, [id, lid, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('عنوان الدرس مطلوب'); return; }
    setSaving(true); setError(''); setSuccess(false);

    const { error: err } = await supabase
      .from('lessons')
      .update({
        title:     title.trim(),
        video_url: videoUrl.trim() || null,
        content:   content.trim()  || null,
      })
      .eq('id', lid);

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
              <h1 className="font-amiri text-3xl font-bold text-white">تعديل الدرس</h1>
            </div>
            <p className="text-slate-400">عدّل محتوى الدرس ثم انقر حفظ</p>
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
                  عنوان الدرس <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                  <span className="flex items-center gap-2 justify-end">
                    رابط الفيديو (اختياري)
                    <Video size={15} className="text-slate-400" />
                  </span>
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                  <span className="flex items-center gap-2 justify-end">
                    شرح الدرس (اختياري)
                    <FileText size={15} className="text-slate-400" />
                  </span>
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-right resize-none"
                />
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