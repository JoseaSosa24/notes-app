// frontend/auth.ts - Refactorizado
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { authService } from '@/app/services/authService'
import type { LoginCredentials } from '@/types/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ✅ Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // ✅ Email/Password - Delegando al authService
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // ✅ Validación más estricta con type guards
        if (!credentials || 
            typeof credentials.email !== 'string' || 
            typeof credentials.password !== 'string' ||
            !credentials.email.trim() ||
            !credentials.password.trim()) {
          return null
        }

        // ✅ Crear objeto tipado correctamente
        const loginData: LoginCredentials = {
          email: credentials.email.trim(),
          password: credentials.password.trim()
        }

        try {
          // ✅ Usar authService con datos tipados
          const authResponse = await authService.login(loginData)

          const { user, token } = authResponse

          if (user && token) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              accessToken: token,
              isGoogleUser: false
            }
          }
          return null
        } catch (error) {
          console.error('Error en login:', error)
          return null
        }
      }
    })
  ],
  
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.accessToken = token.accessToken as string
        session.user.isGoogleUser = token.isGoogleUser as boolean
      }
      return session
    },
    
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === "google") {
          // ✅ Para Google, usar authService
          try {
            const authResponse = await authService.authenticateWithGoogle({
              name: user.name || '',
              email: user.email || '',
              googleId: user.id
            })
            token.accessToken = authResponse.token
            token.isGoogleUser = true
          } catch (error) {
            console.error('Error autenticando Google user:', error)
            token.accessToken = 'google-temp'
            token.isGoogleUser = true
          }
        } else if (account.provider === "credentials") {
          // ✅ Para credentials, usar token del backend
          token.accessToken = (user as any).accessToken
          token.isGoogleUser = false
        }
        token.id = user.id
      }
      return token
    },
  },
  
  pages: {
    signIn: '/login'
  },

  session: {
    strategy: "jwt"
  }
})