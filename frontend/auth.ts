// frontend/auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ✅ Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // ✅ Email/Password con el backend existente
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // ✅ Usar tu backend existente para login
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password
          })

          const { user, token } = response.data

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
          // ✅ Para Google, autenticar con backend
          try {
            const response = await axios.post(`${API_URL}/auth/google`, {
              name: user.name,
              email: user.email,
              googleId: user.id
            })
            token.accessToken = response.data.token
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