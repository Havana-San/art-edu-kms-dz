'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Palette, BookOpen, Play,
  CheckCircle, Lock, Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Course {
  id: string; title: string; description: string; level: string;
}
interface Lesson {
  id: string; title: string; order: number; content?: string;
}
interface Progress {
  lesson_id: string; completed: boolean;
}

const LEVEL_COLOR: Record<string, string> = {
  '1AM': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  '2AM': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  '3AM': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  '4AM': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export default function CourseDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();

  const [course,    setCourse]    = useState<Course | null>(null);
  const [lessons,   setLessons]   = useState<Lesson[]>([]);
  const [progress,  setProgress]  = useState<Progress[]>([]);
  const [userId,    setUserId]    = useState<string | null>(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const { data: crs } = await supabase
        .from('courses').select('*').eq('id', id).single();
      if (!crs) { router.push('/courses'); return; }
      setCourse(crs);

      const { data: lsn } = await supabase
        .from('lessons').select('*').eq('course_id', id).order('order');
      setLessons(lsn || []);

      if (user) {
        const { data: prg } = await supabase
          .from('progress')
          .select('lesson_id, completed')
          .eq('user_id', user.id);
        setProgress(prg || []);
      }

      setLoading(false);
    };
    init();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.lesson_id));
  const completedCount = lessons.filter(l => completedIds.has(l.id)).length;
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Course header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4 ${LEVEL_COLOR[course.level] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
              {course.level}
            </span>
            <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-white mb-3">
              {course.title}
            </h1>
            <p className="text-slate-400 leading-relaxed mb-6">{course.description}</p>

            <div className="flex items-center gap-6 text-sm text-slate-400 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-400" />
                <span>{lessons.length} درس</span>
              </div>
              {userId && (
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-400" />
                  <span>{completedCount} مكتمل</span>
                </div>
              )}
            </div>

            {userId && lessons.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>تقدّمك في الكورس</span>
                  <span className="text-indigo-400 font-bold">{progressPct}٪</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-indigo-500 to-indigo-400 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Lessons list */}
          <h2 className="font-amiri text-2xl font-bold text-white mb-4">محتوى الكورس</h2>

          {lessons.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <Clock size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">لم تُضف دروس لهذا الكورس بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, idx) => {
                const done = completedIds.has(lesson.id);
                const canAccess = userId !== null;

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-4 bg-slate-900 border rounded-2xl p-5 transition-all ${
                      done ? 'border-emerald-500/30' : 'border-slate-800 hover:border-indigo-600/40'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                      done ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {done ? <CheckCircle size={20} /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{lesson.title}</h3>
                      {done && <span className="text-emerald-400 text-xs">مكتمل ✓</span>}
                    </div>

                    {canAccess ? (
                      <Link
                        href={`/courses/${id}/lessons/${lesson.id}`}
                        className={`flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95 flex-shrink-0 ${
                          done
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {done ? (
                          <><CheckCircle size={14} /> مراجعة</>
                        ) : (
                          <><Play size={14} fill="currentColor" /> ابدأ</>
                        )}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-500 text-sm flex-shrink-0">
                        <Lock size={14} />
                        <Link href="/login" className="hover:text-indigo-400 transition-colors">سجّل دخولك</Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!userId && (
            <div className="mt-8 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-6 text-center">
              <p className="text-white font-semibold mb-3">سجّل الآن للوصول لجميع الدروس</p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all">
                <Palette size={18} />
                إنشاء حساب مجاني
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}