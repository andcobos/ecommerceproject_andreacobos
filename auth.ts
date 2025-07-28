import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export const authConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password);
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      return session;
    },

    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      // Actualiza el nombre en caso de update
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
    },
  },

  /**
   * Función de autorización para el middleware
   */
  authorized({ request, auth }: any) {
    // Rutas protegidas
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

    // Si no está autenticado y accede a una ruta protegida
    if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

    // Revisa o crea el sessionCartId si no existe
    if (!request.cookies.get('sessionCartId')) {
      const sessionCartId = crypto.randomUUID();
      const newRequestHeaders = new Headers(request.headers);

      const response = NextResponse.next({
        request: {
          headers: newRequestHeaders,
        },
      });

      response.cookies.set('sessionCartId', sessionCartId);
      return response;
    }

    return true;
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
