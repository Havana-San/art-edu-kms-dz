'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, BookOpen, User, LayoutDashboard,
  Palette, LogOut, Menu, X, Plus
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface NavProps {
  role?: 'student' | 'teacher' | null;
  userName?: string;
}

export default function UnifiedNav({ role, userName }: NavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isTeacher = role === 'teacher';

  const NAV_ITEMS = [
    { href: '/',         label: 'الرئيسية', icon: Home          },
    { href: '/courses',  label: 'الكورسات', icon: BookOpen       },
    {
      href: isTeacher ? '/dashboard/teacher' : '/dashboard/student',
      label: 'لوحتي',
      icon: LayoutDashboard,
    },
    { href: '/profile',  label: 'ملفي',     icon: User           },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <>
      {/* ══ TOP NAV — Desktop ══ */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center">
              <Palette size={16} className="text-white" />
            </div>
            <span className="font-amiri font-bold text-base bg-gradient-to-l from-indigo-400 to-amber-400 bg-clip-text text-transparent hidden sm:block">
              Art Edu KMS DZ
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-indigo-600/15 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
            {isTeacher && (
              <Link
                href="/dashboard/teacher/create-course"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition-all"
              >
                <Plus size={15} />
                كورس جديد
              </Link>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {role ? (
              <>
                {/* Role badge */}
                <span className={`hidden sm:block text-xs font-bold px-2.5 py-1 rounded-full border ${
                  isTeacher
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                }`}>
                  {isTeacher ? 'أستاذ' : 'طالب'}
                </span>

                {/* User */}
                <Link href="/profile" className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 hover:bg-slate-700 transition-all">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${isTeacher ? 'bg-amber-600' : 'bg-indigo-600'}`}>
                    {userName?.charAt(0) || '؟'}
                  </div>
                  <span className="text-slate-200 text-sm font-medium hidden sm:block max-w-[90px] truncate">
                    {userName}
                  </span>
                </Link>

                {/* Logout desktop */}
                <button onClick={handleLogout}
                  className="hidden md:flex p-2 text-slate-400 hover:text-red-400 transition-colors" title="خروج">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-slate-400 hover:text-slate-100 text-sm font-medium transition-colors">
                  دخول
                </Link>
                <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95">
                  سجّل مجاناً
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-100 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 py-3 text-sm font-medium transition-colors ${
                  i < NAV_ITEMS.length - 1 ? 'border-b border-slate-800' : ''
                } ${isActive(item.href) ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            ))}
            {isTeacher && (
              <Link
                href="/dashboard/teacher/create-course"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 text-sm font-medium text-amber-400 border-t border-slate-800"
              >
                <Plus size={17} />
                إنشاء كورس جديد
              </Link>
            )}
            {role && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-3 text-sm font-medium text-red-400 w-full border-t border-slate-800"
              >
                <LogOut size={17} />
                تسجيل الخروج
              </button>
            )}
          </div>
        )}
      </nav>

      {/* ══ BOTTOM NAV — Mobile only ══ */}
      {role && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800">
          <div className="flex items-center justify-around py-2">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive(item.href) ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            ))}
            {isTeacher && (
              <Link
                href="/dashboard/teacher/create-course"
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-amber-400"
              >
                <Plus size={20} />
                <span className="text-[10px] font-medium">جديد</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}