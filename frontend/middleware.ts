// frontend/middleware.ts - NextAuth completo
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname.startsWith('/login')
  const isOnRegisterPage = req.nextUrl.pathname.startsWith('/register')
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnApiRoute = req.nextUrl.pathname.startsWith('/api')

  // Permitir rutas de API y auth
  if (isOnApiRoute || req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // ✅ Redirigir usuarios autenticados lejos de login/register
  if (isLoggedIn && (isOnLoginPage || isOnRegisterPage)) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  // ✅ Redirigir usuarios no autenticados del dashboard
  if (!isLoggedIn && isOnDashboard) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // ✅ Redirigir root según autenticación
  if (req.nextUrl.pathname === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    } else {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}