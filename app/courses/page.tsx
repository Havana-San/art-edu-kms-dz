'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Palette, BookOpen, Search, ArrowRight, Clock, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  created_at: string;
}

const LEVELS = ['الكل', 'السنة 1', 'السنة 2', 'السنة 3', 'السنة 4'];

const LEVEL_COLOR: Record<string, string> = {
  '1AM': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  '2AM': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  '3AM': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  '4AM': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export default function CoursesPage() {
  const [courses,  setCourses]  = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [search,   setSearch]   = useState('');
  const [level,    setLevel]    = useState('الكل');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      setCourses(data || []);
      setFiltered(data || []);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = courses;
    if (level !== 'الكل') {
      result = result.filter(c => c.level === level);
    }
    if (search.trim()) {
      result = result.filter(c =>
        c.title.includes(search) || c.description?.includes(search)
      );
    }
    setFiltered(result);
  }, [search, level, courses]);

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
          <div className="flex items-center gap-3">
            <Link href="/login"    className="text-slate-400 hover:text-slate-200 text-sm transition-colors">دخول</Link>
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
              سجّل مجاناً
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white mb-3">
              مكتبة الدروس الفنية
            </h1>
            <p className="text-slate-400 text-lg">
              اختر درسك وابدأ رحلتك الفنية اليوم
            </p>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن درس..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-11 pl-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-right"
              />
            </div>

            {/* Level filter */}
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map(lv => (
                <button
                  key={lv}
                  onClick={() => setLevel(lv)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    level === lv
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-slate-500 text-sm mb-6">
            {filtered.length} درس متاح
          </p>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">لا توجد دروس مطابقة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(course => (
                <div
                  key={course.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-600/40 transition-all hover:scale-[1.01] flex flex-col"
                >
                  {/* Level */}
                  <span className={`inline-block self-start px-3 py-1 rounded-full text-xs font-bold border mb-4 ${LEVEL_COLOR[course.level] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                    {course.level}
                  </span>

                  <h3 className="font-amiri text-xl font-bold text-white mb-2 leading-snug flex-1">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Clock size={12} />
                      <span>
                        {new Date(course.created_at).toLocaleDateString('ar-DZ')}
                      </span>
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
                    >
                      عرض الدرس
                      <ChevronLeft size={14} />
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