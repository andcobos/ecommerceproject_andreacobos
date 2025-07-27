import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Solo maneja la cookie del carrito
  if (!req.cookies.get('sessionCartId')) {
    const sessionCartId = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set('sessionCartId', sessionCartId);
    return res;
  }

  return NextResponse.next();
}

// Aplica solo a tus rutas principales (evita _next y API)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)'
  ],
};
