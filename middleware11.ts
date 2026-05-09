import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/* ─── تصنيف المسارات ─────────────────────────────────── */

// مسارات عامة — تُفتح بدون تسجيل دخول
const PUBLIC_PREFIXES = ['/', '/about', '/courses'];

// مسارات محمية — يجب تسجيل الدخول
const PROTECTED_PREFIXES = ['/dashboard', '/profile'];

// مسارات المصادقة — يُحوَّل منها المسجّل لـ dashboard
const AUTH_ROUTES = ['/login', '/register'];

function classify(pathname: string) {
  // صفحة كورس عادية → عامة   e.g. /courses/abc
  // صفحة درس          → محمية  e.g. /courses/abc/lessons/xyz
  const isLessonPage = /^\/courses\/.+\/lessons/.test(pathname);
  const isCourseList = pathname === '/courses';
  const isCourseDetail = /^\/courses\/[^/]+$/.test(pathname);

  if (isLessonPage)                                        return 'protected';
  if (isCourseList || isCourseDetail)                      return 'public';
  if (AUTH_ROUTES.some(r => pathname.startsWith(r)))       return 'auth';
  if (PROTECTED_PREFIXES.some(r => pathname.startsWith(r))) return 'protected';
  if (PUBLIC_PREFIXES.some(r => pathname === r))           return 'public';
  return 'public'; // أي مسار غير محدد → عام افتراضياً
}

/* ─── Middleware الرئيسي ─────────────────────────────── */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const type = classify(pathname);

  // بناء Response ودعم تحديث الكوكيز
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // التحقق من الجلسة
  const { data: { user } } = await supabase.auth.getUser();

  /* 1. غير مسجل + مسار محمي → /login?next=... */
  if (!user && type === 'protected') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* 2. مسجل + صفحة login أو register → dashboard */
  if (user && type === 'auth') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const dashboard =
      profile?.role === 'teacher'
        ? '/dashboard/teacher'
        : '/dashboard/student';

    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};