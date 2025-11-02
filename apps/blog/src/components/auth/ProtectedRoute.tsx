'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (!data.user) {
          const redirectTo = searchParams.get('redirect') || '/profile'
          router.push(`/signin?redirect=${encodeURIComponent(redirectTo)}`)
          return
        }
        
        setIsAuthorized(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/signin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, searchParams])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : null
}

export function withAuth(Component: React.ComponentType) {
  return function WithAuth(props: any) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
