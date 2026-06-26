import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname

  if (!isLoggedIn && pathname.startsWith('/belgelerim')) {
    return NextResponse.redirect(new URL('/giris', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/belgelerim/:path*'],
}
