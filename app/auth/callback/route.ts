import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // If Supabase sent back an error (e.g. expired link), redirect to /login with a message
  if (error) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set(
      'error',
      errorDescription ?? 'The magic link is invalid or has expired. Please request a new one.'
    )
    return NextResponse.redirect(loginUrl)
  }

  // Standard PKCE flow — exchange the code for a session
  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      // Successful login — go to the app
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Exchange failed
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'Could not sign in. Please try again.')
    return NextResponse.redirect(loginUrl)
  }

  // No code and no error — shouldn't normally happen, go to login
  return NextResponse.redirect(new URL('/login', request.url))
}
