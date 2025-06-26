import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // If we're on a secure connection, we need to set the Secure flag
          if (request.url.startsWith('https://')) {
            options = { ...options, secure: true }
          }
          
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get session
  const { data: { session } } = await supabase.auth.getSession()
  
  console.log('Middleware - Path:', request.nextUrl.pathname)
  console.log('Middleware - Session:', session ? 'Authenticated' : 'Not authenticated')
  // Log cookie names
  const cookieNames = [];
  for (const [name, value] of request.cookies) {
    cookieNames.push(name);
  }
  console.log('Middleware - Cookies:', cookieNames)

  // Protected routes list
  const protectedRoutes = [
    '/sessions', 
    '/profile', 
    '/library', 
    '/CreateSession',
    '/blocks',
    '/individual'
  ]
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Check auth condition and redirect if needed
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}