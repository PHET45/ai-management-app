// src/lib/auth.ts
import { getServerSession } from 'next-auth'
import { authOptions } from './auth-config'

export async function auth() {
  try {
    return await getServerSession(authOptions)
  } catch (error) {
    // If auth fails (e.g., during build time without env vars), return null
    // This allows the app to build successfully
    console.warn('Auth error:', error)
    return null
  }
}

export { signIn, signOut } from 'next-auth/react'
