import Link from 'next/link';
import {
  Palette,
  BookOpen,
  Users,
  Award,
  ArrowLeft,
  Star,
  Play,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'دروس تفاعلية',
    desc:  'محتوى تعليمي متكامل بالفيديو والنص لكل مستوى دراسي',
    color: 'text-primary-400',
    bg:    'bg-primary-500/10',
  },
  {
    icon: Palette,
    title: 'فنون بصرية متنوعة',
    desc:  'رسم، تلوين، منظور، خط عربي وأكثر من 12 وحدة دراسية',
    color: 'text-gold-400',
    bg:    'bg-gold-500/10',
  },
  {
    icon: Award,
    title: 'اختبارات ذكية',
    desc:  'تقييم فوري وتتبع التقدم لكل طالب بشكل دقيق',
    color: 'text-emerald-400',
    bg:    'bg-emerald-500/10',
  },
  {
    icon: Users,
    title: 'لوحة المعلم',
    desc:  'أدوات متكاملة لإنشاء الكورسات وإدارة الطلاب',
    color: 'text-rose-400',
    bg:    'bg-rose-500/10',
  },
];

const STATS = [
  { value: '+500', label: 'طالب مسجل' },
  { value: '+50',  label: 'درس تفاعلي' },
  { value: '4',    label: 'مستويات دراسية' },
  { value: '98٪',  label: 'رضا الطلاب' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-4 relative">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="page-container text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2 text-primary-400 text-sm font-semibold mb-6 animate-fade-up">
            <Star size={14} fill="currentColor" />
            منصة الفنون البصرية الأولى في الجزائر
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 animate-fade-up">
            تعلّم الفنون
            <br />
            <span className="gradient-text">بأسلوب عصري</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up">
            منصة تعليمية متخصصة في الفنون البصرية للمرحلة المتوسطة —
            دروس تفاعلية، اختبارات ذكية، وتتبع دقيق للتقدم
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-up">
            <Link href="/register" className="btn-primary flex items-center gap-2 text-base">
              <Play size={18} fill="currentColor" />
              ابدأ التعلم مجاناً
            </Link>
            <Link href="/login" className="btn-secondary flex items-center gap-2 text-base">
              لديك حساب؟ سجّل دخولك
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-y border-slate-800">
        <div className="page-container grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-slate-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-title">لماذا Art Edu DZ؟</h2>
            <p className="section-sub">كل ما تحتاجه لرحلة تعليمية فنية متكاملة</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card group hover:scale-[1.02] transition-transform duration-200"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <f.icon size={24} className={f.color} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="page-container">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-primary-900 to-slate-900 border border-primary-700/30 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-gold-600/5 pointer-events-none" />
            <h2 className="text-4xl font-black text-white mb-4 relative z-10">
              ابدأ رحلتك الفنية اليوم
            </h2>
            <p className="text-slate-300 text-lg mb-8 relative z-10">
              سجّل مجاناً وابدأ التعلم فوراً
            </p>
            <Link
              href="/register"
              className="btn-gold inline-flex items-center gap-2 text-lg relative z-10"
            >
              <Palette size={20} />
              إنشاء حساب مجاني
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© 2025 Art Edu DZ — جميع الحقوق محفوظة</p>
        <p className="mt-1">إعداد: الأستاذ كواشي محمد الصغير</p>
      </footer>
    </main>
  );
}