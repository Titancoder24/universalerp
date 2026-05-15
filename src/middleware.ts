import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const PUBLIC_PATHS = new Set<string>([
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth/callback',
  '/welcome',
  '/terms',
  '/privacy',
  '/portal/login',
  '/manifest.json',
  '/sw.js',
  '/_offline',
]);

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith('/api/public/')) return true;
  if (pathname.startsWith('/_next/')) return true;
  if (pathname.startsWith('/icons/')) return true;
  if (pathname.startsWith('/images/')) return true;
  if (pathname === '/favicon.ico' || pathname === '/robots.txt' || pathname === '/sitemap.xml')
    return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths skip auth
  if (isPublic(pathname)) return NextResponse.next();

  const response = NextResponse.next({ request: { headers: req.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without Supabase configured, allow through (dev mode); the app shows config helpers
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          req.cookies.set({ name, value, ...(undefined as unknown as CookieOptions) }),
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set({ name, value, ...(options as CookieOptions) }),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = pathname.startsWith('/portal') ? '/portal/login' : '/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|otf|css|js)).*)'],
};
