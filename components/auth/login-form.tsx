'use client'

import { useAuth } from '@/contexts/auth-context'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn, signInWithGoogle, signInAnonymously } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (error) {
      setError('Invalid email or password')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      router.push('/dashboard')
    } catch (error) {
      setError('Error signing in with Google')
    }
  }

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously()
      router.push('/dashboard')
    } catch (error) {
      setError('Error signing in anonymously')
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your {process.env.NEXT_PUBLIC_APP_NAME} account
                </p>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Button type="submit" className="w-full">
                  Sign in
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  Sign in with Google
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleAnonymousSignIn}
                >
                  Continue as Guest
                </Button>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden h-full bg-muted md:block">
            <div className="absolute inset-0 bg-gradient-to-t from-muted to-muted/50" />
            <img
              src="/images/login.webp"
              alt="ClassGenie"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
