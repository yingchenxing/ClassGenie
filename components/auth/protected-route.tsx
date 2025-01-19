'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const publicPaths = ['/login', '/signup']

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user && !publicPaths.includes(pathname)) {
        router.push('/login')
      } else if (user && publicPaths.includes(pathname)) {
        router.push('/dashboard')
      }
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>
} 