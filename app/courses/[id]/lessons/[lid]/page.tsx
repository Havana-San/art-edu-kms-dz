'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Palette, ArrowRight, CheckCircle, ChevronLeft,
  ChevronRight, Play, FileText, HelpCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Lesson {
  id: string; title: string; content?: string;
  video_url?: string; order: number; course_id: string;
}
interface Quiz {
  id: string; question: string;
  options: string[]; correct_answer: string;
}

type Tab = 'content' | 'quiz';

export default function LessonPage() {
  const { id, lid } = useParams<{ id: string; lid: string }>();
  const router = useRouter();

  const [lesson,      setLesson]      = useState<Lesson | null>(null);
  const [quizzes,     setQuizzes]     = useState<Quiz[]>([]);
  const [completed,   setCompleted]   = useState(false);
  const [userId,      setUserId]      = useState<string | null>(null);
  const [tab,         setTab]         = useState<Tab>('content');
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);

  // Quiz state
  const [current,    setCurrent]    = useState(0);
  const [selected,   setSelected]   = useState<string | null>(null);
  const [isCorrect,  setIsCorrect]  = useState<boolean | null>(null);
  const [score,      setScore]      = useState(0);
  const [quizDone,   setQuizDone]   = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const { data: lsn } = await supabase
        .from('lessons').select('*').eq('id', lid).single();
      if (!lsn) { router.push(`/courses/${id}`); return; }
      setLesson(lsn);

      const { data: qz } = await supabase
        .from('quizzes').select('*').eq('lesson_id', lid);
      setQuizzes(qz || []);

      const { data: prg } = await supabase
        .from('progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('lesson_id', lid)
        .single();
      setCompleted(prg?.completed || false);

      setLoading(false);
    };
    init();
  }, [id, lid, router]);

  const markComplete = async () => {
    if (!userId || completed) return;
    setSaving(true);

    await supabase.from('progress').upsert({
      user_id:   userId,
      lesson_id: lid,
      completed: true,
      completed_at: new Date().toISOString(),
    });

    setCompleted(true);
    setSaving(false);
  };

  const handleAnswer = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === quizzes[current].correct_answer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    setSelected(null);
    setIsCorrect(null);
    if (current + 1 < quizzes.length) {
      setCurrent(c => c + 1);
    } else {
      setQuizDone(true);
    }
  };

  const resetQuiz = () => {
    setCurrent(0); setSelected(null);
    setIsCorrect(null); setScore(0); setQuizDone(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson) return null;
  const pct = quizzes.length > 0 ? Math.round((score / quizzes.length) * 100) : 0;

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
          <Link
            href={`/courses/${id}`}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            <ArrowRight size={16} />
            العودة للكورس
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Lesson title */}
          <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-slate-500 text-sm mb-1">الدرس {lesson.order}</p>
              <h1 className="font-amiri text-3xl font-bold text-white">{lesson.title}</h1>
            </div>
            {completed && (
              <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-sm font-bold">
                <CheckCircle size={14} />
                مكتمل
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-slate-900 border border-slate-800 rounded-2xl p-1">
            {([
              { key: 'content', label: 'محتوى الدرس', icon: FileText },
              { key: 'quiz',    label: `الاختبار (${quizzes.length})`, icon: HelpCircle },
            ] as { key: Tab; label: string; icon: React.ElementType }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  tab === t.key
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {/* ── CONTENT TAB ── */}
          {tab === 'content' && (
            <div className="space-y-6">
              {/* Video */}
              {lesson.video_url && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src={lesson.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title={lesson.title}
                    />
                  </div>
                </div>
              )}

              {/* Text content */}
              {lesson.content && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h2 className="font-amiri text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-indigo-400" />
                    شرح الدرس
                  </h2>
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-right">
                    {lesson.content}
                  </div>
                </div>
              )}

              {!lesson.video_url && !lesson.content && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                  <Play size={40} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">لم يُضف محتوى لهذا الدرس بعد</p>
                </div>
              )}

              {/* Complete button */}
              <button
                onClick={markComplete}
                disabled={completed || saving}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all active:scale-95 ${
                  completed
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
                }`}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : completed ? (
                  <><CheckCircle size={20} /> لقد أكملت هذا الدرس</>
                ) : (
                  <><CheckCircle size={20} /> تأكيد إكمال الدرس</>
                )}
              </button>
            </div>
          )}

          {/* ── QUIZ TAB ── */}
          {tab === 'quiz' && (
            <div>
              {quizzes.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                  <HelpCircle size={40} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">لا توجد أسئلة لهذا الدرس</p>
                </div>
              ) : quizDone ? (
                /* Result */
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
                  <div className="text-6xl mb-4">
                    {pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '📚'}
                  </div>
                  <h2 className="font-amiri text-3xl font-bold text-white mb-2">
                    انتهى الاختبار!
                  </h2>
                  <p className="text-slate-400 mb-6">
                    أجبت على {score} من {quizzes.length} بشكل صحيح
                  </p>

                  {/* Score circle */}
                  <div className="w-28 h-28 mx-auto mb-6 relative">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="10" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#6366f1'}
                        strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-black ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-indigo-400'}`}>
                        {pct}٪
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={resetQuiz}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95"
                  >
                    إعادة الاختبار
                  </button>
                </div>
              ) : (
                /* Question */
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  {/* Progress */}
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                    <span>السؤال {current + 1} من {quizzes.length}</span>
                    <span className="text-indigo-400 font-bold">{score} ✓</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${((current + 1) / quizzes.length) * 100}%` }}
                    />
                  </div>

                  {/* Question */}
                  <h3 className="font-amiri text-xl font-bold text-white mb-6 leading-relaxed">
                    {quizzes[current].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {quizzes[current].options.map((opt, i) => {
                      const isSelected = selected === opt;
                      const isAnswer   = opt === quizzes[current].correct_answer;
                      let cls = 'border-slate-700 bg-slate-800 text-slate-200 hover:border-indigo-500';
                      if (selected) {
                        if (isAnswer)        cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                        else if (isSelected) cls = 'border-red-500 bg-red-500/10 text-red-300';
                        else                 cls = 'border-slate-700 bg-slate-800/50 text-slate-500';
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(opt)}
                          disabled={!!selected}
                          className={`w-full text-right px-5 py-4 rounded-xl border-2 font-semibold transition-all ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback */}
                  {selected && (
                    <div className={`rounded-xl px-4 py-3 mb-4 text-sm font-semibold ${
                      isCorrect
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {isCorrect ? '✅ إجابة صحيحة!' : `❌ الإجابة الصحيحة: ${quizzes[current].correct_answer}`}
                    </div>
                  )}

                  {selected && (
                    <button
                      onClick={nextQuestion}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                    >
                      {current + 1 < quizzes.length ? 'السؤال التالي' : 'عرض النتيجة'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}