'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Users, Plus,
  Edit, Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Profile { id: string; name: string; email: string; role: string; }
interface Course  { id: string; title: string; description: string; level: string; is_published: boolean; }

export default function TeacherDashboard() {
  const router  = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: prof } = await supabase
        .from('profiles').select('*').eq('id', user.id).single();

      if (!prof || prof?.role !== 'teacher') { router.push('/dashboard/student'); return; }
      setProfile(prof);

      const { data: crs } = await supabase
        .from('courses').select('*').eq('teacher_id', user.id).order('created_at', { ascending: false });

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

  const published   = courses.filter(c => c.is_published).length;
  const unpublished = courses.filter(c => !c.is_published).length;

  const STATS = [
    { icon: BookOpen, label: 'إجمالي الكورسات', value: courses.length, color: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
    { icon: Eye,      label: 'منشورة',            value: published,      color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Edit,     label: 'مسوّدات',           value: unpublished,    color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
    { icon: Users,    label: 'الطلاب',            value: '—',            color: 'text-rose-400',    bg: 'bg-rose-500/10'    },
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

          {/* Header */}
          <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
            <div>
              <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-white mb-1">
                مرحباً أستاذ {profile?.name} 👨‍🏫
              </h1>
              <p className="text-slate-400">أدِر كورساتك وتابع طلابك من هنا</p>
            </div>
            <Link
              href="/dashboard/teacher/create-course"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl transition-all active:scale-95"
            >
              <Plus size={18} />
              كورس جديد
            </Link>
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

          {/* Courses list */}
          <div className="mb-6">
            <h2 className="font-amiri text-2xl font-bold text-white">كورساتي</h2>
          </div>

          {courses.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-16 text-center">
              <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
              <h3 className="font-amiri text-xl text-slate-300 mb-2">لم تنشئ أي كورس بعد</h3>
              <p className="text-slate-500 text-sm mb-6">ابدأ بإنشاء أول كورس لطلابك الآن</p>
              <Link
                href="/dashboard/teacher/create-course"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                <Plus size={18} />
                إنشاء أول كورس
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map(course => (
                <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-600/40 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${LEVEL_COLOR[course.level] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                      {course.level}
                    </span>
                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${course.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                      {course.is_published ? 'منشور' : 'مسوّدة'}
                    </span>
                  </div>

                  <h3 className="font-amiri text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-2">{course.description}</p>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/teacher/courses/${course.id}`}
                      className="flex-1 flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold px-3 py-2 rounded-xl transition-all border border-slate-700"
                    >
                      <Edit size={14} />
                      تعديل
                    </Link>
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-1 flex items-center justify-center gap-1 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-sm font-semibold px-3 py-2 rounded-xl transition-all border border-indigo-500/30"
                    >
                      <Eye size={14} />
                      معاينة
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