// src/app/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Check if user is authenticated
  // Wrap in try-catch to handle build-time errors
  try {
    const session = await auth()
    
    // Redirect to dashboard if authenticated, otherwise to login
    if (session?.user) {
      redirect('/dashboard')
    } else {
      redirect('/login')
    }
  } catch (error) {
    // If auth fails during build, redirect to login
    // This can happen if environment variables are not set
    redirect('/login')
  }
}

