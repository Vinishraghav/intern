import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
    cache: 'no-store',
  })
  
  if (!response.ok) {
    return null
  }
  
  const data = await response.json()
  return data.user || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/signin?redirect=' + encodeURIComponent(window.location.pathname))
  }
  
  return user
}

export function getAuthToken() {
  return cookies().get('user_id')?.value
}
