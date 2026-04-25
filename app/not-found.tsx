import Link from 'next/link';
import { Palette, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-slate-800 mb-4">404</div>
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Palette size={28} className="text-white" />
        </div>
        <h1 className="font-amiri text-3xl font-bold text-white mb-3">
          الصفحة غير موجودة
        </h1>
        <p className="text-slate-400 mb-8">
          يبدو أن هذه الصفحة لا وجود لها أو تم نقلها
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
        >
          <Home size={18} />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}