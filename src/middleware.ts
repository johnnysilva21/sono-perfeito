import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Permitir acesso ao quiz sem autenticação
  if (req.nextUrl.pathname === '/quiz') {
    return res
  }

  // Se não está autenticado e não está na página de login, redireciona para quiz
  if (!session && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/quiz', req.url))
  }

  // Se está autenticado e está na página de login ou quiz, redireciona para home
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/quiz')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
