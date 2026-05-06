'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Trash2,
  BookOpen, Eye, EyeOff, GripVertical
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Course {
  id: string; title: string; description: string;
  level: string; is_published: boolean;
}
interface Lesson {
  id: string; title: string; order: number;
  video_url?: string; content?: string;
}

export default function TeacherCourseDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [course,   setCourse]   = useState<Course | null>(null);
  const [lessons,  setLessons]  = useState<Lesson[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: crs } = await supabase
        .from('courses').select('*').eq('id', id).single();
      if (!crs) { router.push('/dashboard/teacher'); return; }
      setCourse(crs);

      const { data: lsn } = await supabase
        .from('lessons').select('*').eq('course_id', id).order('order');
      setLessons(lsn || []);
      setLoading(false);
    };
    init();
  }, [id, router]);

  const togglePublish = async () => {
    if (!course) return;
    setToggling(true);
    const { data } = await supabase
      .from('courses')
      .update({ is_published: !course.is_published })
      .eq('id', id).select().single();
    if (data) setCourse(data);
    setToggling(false);
  };

  const deleteLesson = async (lid: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    await supabase.from('lessons').delete().eq('id', lid);
    setLessons(prev => prev.filter(l => l.id !== lid));
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (!course) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Course header card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    course.is_published
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-700 text-slate-400 border-slate-600'
                  }`}>
                    {course.is_published ? '🟢 منشور' : '⚫ مسوّدة'}
                  </span>
                </div>
                <h1 className="font-amiri text-3xl font-bold text-white mb-2">{course.title}</h1>
                <p className="text-slate-400 text-sm leading-relaxed">{course.description}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={togglePublish}
                  disabled={toggling}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    course.is_published
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      : 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700'
                  }`}
                >
                  {course.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                  {course.is_published ? 'إلغاء النشر' : 'نشر الكورس'}
                </button>

                <Link
                  href={`/courses/${course.id}`}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-slate-700"
                >
                  <Eye size={15} /> معاينة
                </Link>
              </div>
            </div>
          </div>

          {/* Lessons section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-amiri text-2xl font-bold text-white">
              الدروس ({lessons.length})
            </h2>
            <Link
              href={`/dashboard/teacher/courses/${id}/add-lesson`}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              <Plus size={16} /> درس جديد
            </Link>
          </div>

          {lessons.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-14 text-center">
              <BookOpen size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-4">لا توجد دروس بعد</p>
              <Link
                href={`/dashboard/teacher/courses/${id}/add-lesson`}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                <Plus size={18} /> إضافة أول درس
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-600/40 transition-all"
                >
                  <GripVertical size={18} className="text-slate-600 flex-shrink-0" />
                  <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{lesson.title}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      {lesson.video_url && <span className="text-slate-500 text-xs">📹 فيديو</span>}
                      {lesson.content   && <span className="text-slate-500 text-xs">📄 نص</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/courses/${id}/lessons/${lesson.id}`}
                      className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
                      title="معاينة"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => deleteLesson(lesson.id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}