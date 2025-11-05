// src/lib/auth.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  }
}

// Export ที่ถูกต้อง
const { handlers, signIn, signOut, auth } = NextAuth(authOptions)

export { handlers, signIn, signOut, auth }
export default NextAuth(authOptions)