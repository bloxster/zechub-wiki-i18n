import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.pathname = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
    return NextResponse.redirect(canonicalUrl);
  }

  if (pathname === '/it' || pathname.startsWith('/it/')) {
    const rewrittenUrl = request.nextUrl.clone();
    rewrittenUrl.pathname = pathname.replace(/^\/it(?=\/|$)/, '') || '/';
    headers.set('x-zechub-locale', 'it');
    return NextResponse.rewrite(rewrittenUrl, { request: { headers } });
  }

  if (!headers.get('x-zechub-locale')) {
    headers.set('x-zechub-locale', 'en');
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png|.*\\..*).*)']
};
