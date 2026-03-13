import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'

const providers = []

// Always add demo credentials provider for testing
providers.push(
  CredentialsProvider({
    id: 'credentials',
    name: 'Demo Credentials',
    credentials: {
      email: {
        label: 'Email',
        type: 'email',
        placeholder: 'demo@example.com'
      },
      password: {
        label: 'Password',
        type: 'password',
        placeholder: 'demo123'
      }
    },
    async authorize(credentials) {
      console.log('Authorize called with:', credentials)
      
      // Demo login with hardcoded credentials
      if (
        credentials?.email === 'demo@example.com' &&
        credentials?.password === 'demo123'
      ) {
        console.log('Demo login successful')
        return {
          id: 'demo-user-1',
          email: 'demo@example.com',
          name: 'Demo User',
          image: 'https://via.placeholder.com/150?text=Demo'
        }
      }
      
      console.log('Demo login failed - invalid credentials')
      return null
    }
  })
)

// Add Google provider only if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

// Add Facebook provider only if credentials are available
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  )
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async session({ session, token }) {
      console.log('Session callback:', { session, token })
      if (token?.id) {
        session.user = {
          ...session.user,
          id: token.id as string
        }
      }
      return session
    },
    async jwt({ token, user }) {
      console.log('JWT callback:', { token, user })
      if (user) {
        token.id = user.id
      }
      return token
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { user, account, profile })
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl })
      // Always redirect to home after successful login
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Use environment secret or fallback for development
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
  debug: process.env.NODE_ENV === 'development',
}