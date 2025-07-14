// frontend/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isGoogleUser?: boolean
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User extends DefaultUser {
    id: string
    accessToken?: string
    isGoogleUser?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string
    id?: string
    isGoogleUser?: boolean
  }
}