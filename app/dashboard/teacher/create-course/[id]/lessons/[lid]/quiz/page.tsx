'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HelpCircle, Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

const EMPTY_OPTIONS = ['', '', '', ''];

export default function QuizManagerPage() {
  const { id, lid } = useParams<{ id: string; lid: string }>();
  const router = useRouter();

  const [lessonTitle, setLessonTitle] = useState('');
  const [quizzes,     setQuizzes]     = useState<Quiz[]>([]);
  const [loading,     setLoading]     = useState(true);

  // فورم سؤال جديد
  const [question,       setQuestion]       = useState('');
  const [options,        setOptions]        = useState<string[]>([...EMPTY_OPTIONS]);
  const [correctAnswer,  setCorrectAnswer]  = useState('');
  const [saving,         setSaving]         = useState(false);
  const [formError,      setFormError]      = useState('');
  const [formSuccess,    setFormSuccess]    = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: lsn } = await supabase
        .from('lessons').select('title').eq('id', lid).single();
      setLessonTitle(lsn?.title || '');

      const { data: qz } = await supabase
        .from('quizzes').select('*').eq('lesson_id', lid).order('created_at');
      setQuizzes(qz || []);
      setLoading(false);
    };
    init();
  }, [lid, router]);

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
    // إذا كانت الإجابة الصحيحة هي الخيار الذي تغيّر، نحدّثها
    if (correctAnswer === options[index]) setCorrectAnswer(value);
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setFormSuccess(false);

    const filledOptions = options.filter(o => o.trim());
    if (!question.trim())          { setFormError('السؤال مطلوب'); return; }
    if (filledOptions.length < 2)  { setFormError('يجب إدخال خيارين على الأقل'); return; }
    if (!correctAnswer.trim())     { setFormError('يجب تحديد الإجابة الصحيحة'); return; }
    if (!filledOptions.includes(correctAnswer.trim())) {
      setFormError('الإجابة الصحيحة يجب أن تكون ضمن الخيارات');
      return;
    }

    setSaving(true);

    const { data, error } = await supabase.from('quizzes').insert({
      lesson_id:      lid,
      question:       question.trim(),
      options:        filledOptions.map(o => o.trim()),
      correct_answer: correctAnswer.trim(),
    }).select().single();

    if (error) {
      setFormError('حدث خطأ أثناء الحفظ');
    } else {
      setQuizzes(prev => [...prev, data]);
      setQuestion('');
      setOptions([...EMPTY_OPTIONS]);
      setCorrectAnswer('');
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 2000);
    }
    setSaving(false);
  };

  const handleDelete = async (qid: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    await supabase.from('quizzes').delete().eq('id', qid);
    setQuizzes(prev => prev.filter(q => q.id !== qid));
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <HelpCircle size={20} className="text-emerald-400" />
              </div>
              <div>
                <h1 className="font-amiri text-3xl font-bold text-white">أسئلة الاختبار</h1>
                <p className="text-slate-500 text-sm truncate">{lessonTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
                {quizzes.length} سؤال
              </span>
              <Link
                href={`/dashboard/teacher/courses/${id}`}
                className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                ← العودة للكورس
              </Link>
            </div>
          </div>

          {/* ── الأسئلة الموجودة ── */}
          {quizzes.length > 0 && (
            <div className="space-y-3 mb-8">
              <h2 className="font-amiri text-xl font-bold text-white mb-3">الأسئلة الحالية</h2>
              {quizzes.map((q, idx) => (
                <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-black flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-white font-semibold leading-relaxed">{q.question}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mr-9">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border ${
                              opt === q.correct_answer
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {opt === q.correct_answer && (
                              <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                            )}
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                      title="حذف السؤال"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── فورم إضافة سؤال جديد ── */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
            <h2 className="font-amiri text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Plus size={18} className="text-emerald-400" />
              إضافة سؤال جديد
            </h2>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-5 text-center">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-400 text-sm mb-5 flex items-center justify-center gap-2">
                <CheckCircle size={15} />
                تمت الإضافة بنجاح!
              </div>
            )}

            <form onSubmit={handleAddQuestion} className="space-y-5">

              {/* السؤال */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 text-right">
                  نص السؤال <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="مثال: ما هي الألوان الأساسية؟"
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-right resize-none"
                />
              </div>

              {/* الخيارات */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3 text-right">
                  الخيارات <span className="text-red-400">*</span>
                  <span className="text-slate-500 font-normal mr-2">(خيارين على الأقل)</span>
                </label>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => updateOption(i, e.target.value)}
                        placeholder={`الخيار ${i + 1}`}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-right text-sm"
                      />
                      {/* زر تحديد كإجابة صحيحة */}
                      {opt.trim() && (
                        <button
                          type="button"
                          onClick={() => setCorrectAnswer(opt.trim())}
                          className={`flex-shrink-0 p-2 rounded-xl border transition-all ${
                            correctAnswer === opt.trim()
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'text-slate-500 border-slate-700 hover:text-emerald-400 hover:border-emerald-500/30'
                          }`}
                          title="تعيين كإجابة صحيحة"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {correctAnswer && (
                  <p className="text-emerald-400 text-xs mt-2 text-right">
                    ✅ الإجابة الصحيحة: {correctAnswer}
                  </p>
                )}
                {!correctAnswer && (
                  <p className="text-slate-500 text-xs mt-2 text-right">
                    انقر على ✓ بجانب الخيار الصحيح
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save size={18} /> حفظ السؤال</>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}