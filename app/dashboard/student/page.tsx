'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Award, Clock,
  TrendingUp, Star,
  ChevronLeft, Play
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string; name: string; email: string; role: string;
}
interface Course {
  id: string; title: string; description: string; level: string;
}

export default function StudentDashboard() {
  const router  = useRouter();
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [courses,  setCourses]  = useState<Course[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: prof } = await supabase
        .from('profiles').select('*').eq('id', user.id).single();

      if (prof?.role === 'teacher') { router.push('/dashboard/teacher'); return; }
      setProfile(prof);

      const { data: crs } = await supabase
        .from('courses').select('*').eq('is_published', true).limit(6);

      setCourses(crs || []);
      setLoading(false);
    };
    init();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const STATS = [
    { icon: BookOpen,   label: 'الكورسات المتاحة', value: courses.length, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { icon: TrendingUp, label: 'دروس مكتملة',       value: '0',           color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Award,      label: 'الاختبارات',         value: '0',           color: 'text-amber-400',   bg: 'bg-amber-500/10'  },
    { icon: Star,       label: 'النقاط المكتسبة',    value: '0',           color: 'text-rose-400',    bg: 'bg-rose-500/10'   },
  ];

  const LEVEL_COLOR: Record<string, string> = {
    '1AM': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    '2AM': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    '3AM': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    '4AM': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Welcome */}
          <div className="mb-10">
            <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-white mb-1">
              أهلاً، {profile?.name} 👋
            </h1>
            <p className="text-slate-400">استمر في رحلتك الفنية اليوم</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {STATS.map((s, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon size={20} className={s.color} />
                </div>
                <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                <div className="text-slate-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Courses */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-amiri text-2xl font-bold text-white">الكورسات المتاحة</h2>
            <Link href="/courses" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 transition-colors">
              عرض الكل <ChevronLeft size={16} />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <BookOpen size={40} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">لا توجد كورسات متاحة حالياً</p>
              <p className="text-slate-500 text-sm mt-1">تابعنا لمزيد من المحتوى قريباً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-600/40 transition-all hover:scale-[1.01] group"
                >
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4 ${LEVEL_COLOR[course.level] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                    {course.level}
                  </span>
                  <h3 className="font-amiri text-xl font-bold text-white mb-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Clock size={12} />
                      <span>جديد</span>
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
                    >
                      <Play size={14} fill="currentColor" />
                      ابدأ
                    </Link>
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