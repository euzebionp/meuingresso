import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/entrar",
    error: "/entrar",
  },
  providers: [], // providers serão definidos no auth.ts para evitar conflito com Edge Middleware
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = ["/minha-conta", "/meus-ingressos", "/painel"].some((p) =>
        nextUrl.pathname.startsWith(p)
      );

      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Redireciona para login
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
