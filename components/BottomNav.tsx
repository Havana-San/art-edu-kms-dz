'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, BookOpen, User, LogOut,
  Palette, Plus, BarChart2, GraduationCap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface NavProps {
  role?: 'student' | 'teacher' | null;
  name?: string;
}

export default function AppNav({ role, name }: NavProps) {
  const path = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const studentLinks = [
    { href: '/dashboard/student', icon: BarChart2,      label: 'لوحتي'   },
    { href: '/courses',           icon: BookOpen,        label: 'الكورسات' },
    { href: '/profile',           icon: User,            label: 'ملفي'     },
  ];

  const teacherLinks = [
    { href: '/dashboard/teacher',             icon: BarChart2, label: 'لوحتي'    },
    { href: '/dashboard/teacher/create-course', icon: Plus,    label: 'كورس جديد' },
    { href: '/courses',                       icon: BookOpen,  label: 'الكورسات'  },
    { href: '/profile',                       icon: User,      label: 'ملفي'      },
  ];

  const links = role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <>
      {/* ── TOP NAV (Desktop) ── */}
      <nav className="hidden md:flex fixed top-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 h-16 items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center">
              <Palette size={16} className="text-white" />
            </div>
            <span className="font-amiri font-bold text-base bg-gradient-to-l from-indigo-400 to-amber-400 bg-clip-text text-transparent">
              Art Edu KMS DZ
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  path === l.href
                    ? 'text-indigo-400'
                    : 'text-slate-400 hover:text-slate-100'
                }`}>
                <l.icon size={15} />
                {l.label}
              </Link>
            ))}
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            {role && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                role === 'teacher'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
              }`}>
                {role === 'teacher' ? '👨‍🏫 أستاذ' : '🎓 طالب'}
              </span>
            )}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                role === 'teacher' ? 'bg-amber-600' : 'bg-indigo-600'
              }`}>
                {name?.charAt(0) || '؟'}
              </div>
              <span className="text-slate-200 text-sm max-w-[100px] truncate">{name}</span>
            </div>
            <button onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="خروج">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── TOP NAV (Mobile) ── */}
      <nav className="md:hidden fixed top-0 inset-x-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 h-14 flex items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center">
            <Palette size={14} className="text-white" />
          </div>
          <span className="font-amiri font-bold text-sm bg-gradient-to-l from-indigo-400 to-amber-400 bg-clip-text text-transparent">
            Art Edu KMS DZ
          </span>
        </Link>
        <div className="mr-auto flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            role === 'teacher'
              ? 'bg-amber-500/10 text-amber-400'
              : 'bg-indigo-500/10 text-indigo-400'
          }`}>
            {name?.split(' ')[0]}
          </span>
          <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </nav>

      {/* ── BOTTOM NAV (Mobile) ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800">
        <div className="flex items-center justify-around py-2">
          {links.map(l => {
            const active = path === l.href;
            return (
              <Link key={l.href} href={l.href}
                className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
                  active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}>
                <l.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{l.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}