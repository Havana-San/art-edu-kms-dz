import Link from 'next/link';
import { Palette, Target, Heart, BookOpen, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Palette size={36} className="text-white" />
            </div>
            <h1 className="font-amiri text-5xl font-bold text-white mb-4">
              عن المنصة
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto">
              منصة Art Edu KMS DZ هي مشروع تعليمي رائد متخصص في
              تعليم الفنون البصرية لطلاب المرحلة المتوسطة في الجزائر
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Target, title: 'رسالتنا', desc: 'تقديم تعليم فني تفاعلي وعصري يواكب احتياجات الطالب الجزائري ويثري إبداعه البصري', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { icon: Heart,  title: 'قيمنا',   desc: 'الإبداع، الجودة، والالتزام بتقديم أفضل تجربة تعليمية ممكنة لكل طالب في كل مستوى', color: 'text-rose-400',   bg: 'bg-rose-500/10'   },
              { icon: Users,  title: 'مجتمعنا', desc: 'نبني مجتمعاً من المتعلمين والمعلمين المتحمسين للفنون البصرية عبر كامل التراب الوطني', color: 'text-amber-400',  bg: 'bg-amber-500/10'  },
            ].map((c, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <c.icon size={22} className={c.color} />
                </div>
                <h3 className="font-amiri text-xl font-bold text-white mb-2">{c.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* About teacher */}
          <div className="bg-gradient-to-l from-slate-900 to-indigo-900/20 border border-slate-800 rounded-2xl p-8 mb-10">
            <div className="flex items-start gap-6 flex-wrap">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-amber-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white flex-shrink-0">
                ك
              </div>
              <div className="flex-1">
                <h2 className="font-amiri text-2xl font-bold text-white mb-1">
                  أ. كواشي محمد الصغير
                </h2>
                <p className="text-indigo-400 font-semibold text-sm mb-3">
                  أستاذ مادة التربية الفنية التشكيلية
                </p>
                <p className="text-slate-400 leading-relaxed text-sm">
                  أستاذ متخصص في تعليم الفنون البصرية للمرحلة المتوسطة،
                  يؤمن بأن كل طالب يحمل في داخله فناناً ينتظر من يوجهه
                  ويساعده على التعبير عن إبداعه بالشكل الصحيح.
                  هذه المنصة هي ثمرة سنوات من التدريس والشغف بالفن التعليمي.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
            {[
              { v: '+500', l: 'طالب استفاد' },
              { v: '+50',  l: 'درس منشور'   },
              { v: '4',    l: 'مستويات'     },
              { v: '2025', l: 'سنة الإطلاق' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
                <div className="font-amiri text-3xl font-bold bg-gradient-to-l from-indigo-400 to-amber-400 bg-clip-text text-transparent mb-1">
                  {s.v}
                </div>
                <div className="text-slate-400 text-xs">{s.l}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center bg-slate-900 border border-slate-800 rounded-2xl p-10">
            <BookOpen size={32} className="text-indigo-400 mx-auto mb-4" />
            <h2 className="font-amiri text-3xl font-bold text-white mb-3">
              هل أنت مستعد للانطلاق؟
            </h2>
            <p className="text-slate-400 mb-6">انضم لمئات الطلاب واكتشف موهبتك الفنية</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/register"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3 rounded-xl transition-all active:scale-95">
                <Palette size={18} />
                ابدأ مجاناً
              </Link>
              <Link href="/courses"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-7 py-3 rounded-xl transition-all border border-slate-700">
                <BookOpen size={18} />
                استكشف الكورسات
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}