'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Palette, LogOut, User, Menu, X,
  BookOpen, Home, LayoutDashboard
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface NavbarProps {
  profile?: {
    name: string;
    role: 'student' | 'teacher';
  } | null;
}

export default function Navbar({ profile }: NavbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const dashboardHref = profile?.role === 'teacher'
    ? '/dashboard/teacher'
    : '/dashboard/student';

  const NAV_LINKS = [
    { href: '/',        label: 'الرئيسية', icon: Home        },
    { href: '/courses', label: 'الكورسات', icon: BookOpen     },
  ];

  return (
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
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 text-sm font-medium transition-colors"
            >
              <link.icon size={15} />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {profile ? (
            <>
              {/* Dashboard link */}
              <Link
                href={dashboardHref}
                className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-slate-100 text-sm font-medium transition-colors"
              >
                <LayoutDashboard size={15} />
                لوحتي
              </Link>

              {/* User badge */}
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  profile.role === 'teacher' ? 'bg-amber-600' : 'bg-indigo-600'
                }`}>
                  <User size={12} className="text-white" />
                </div>
                <span className="text-slate-200 text-sm font-medium hidden sm:block max-w-[100px] truncate">
                  {profile.name}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="خروج"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-slate-400 hover:text-slate-100 text-sm font-medium transition-colors hidden sm:block">
                دخول
              </Link>
              <Link href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95">
                سجّل مجاناً
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-100 transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-slate-300 hover:text-white py-2.5 text-sm font-medium border-b border-slate-800 last:border-0 transition-colors"
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
          {profile && (
            <Link
              href={dashboardHref}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 py-2.5 text-sm font-medium transition-colors"
            >
              <LayoutDashboard size={16} />
              لوحتي
            </Link>
          )}
          {profile && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 py-2.5 text-sm font-medium w-full transition-colors"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          )}
        </div>
      )}
    </nav>
  );
}