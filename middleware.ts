// middleware.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// ✅ Usa el helper correcto
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    '/shipping-address',
    '/payment-method',
    '/place-order',
    '/profile',
    '/user/:path*',
    '/order/:path*',
    '/admin/:path*',
  ],
};
