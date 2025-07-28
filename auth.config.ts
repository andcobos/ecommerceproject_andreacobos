// auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig: NextAuthConfig = {
  // ✅ arreglo vacío solo para cumplir con el tipo
  providers: [],

  callbacks: {
    authorized({ request, auth }) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      const { pathname } = request.nextUrl;

      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID();
        const response = NextResponse.next({
          request: {
            headers: new Headers(request.headers),
          },
        });
        response.cookies.set('sessionCartId', sessionCartId);
        return response;
      }

      return true;
    },
  },
};
