import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'

const providers = []

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

// Always add demo credentials provider for testing
providers.push(
  CredentialsProvider({
    id: 'demo',
    name: 'Demo Login',
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
      // Demo login with hardcoded credentials
      if (
        credentials?.email === 'demo@example.com' &&
        credentials?.password === 'demo123'
      ) {
        return {
          id: 'demo-user-1',
          email: 'demo@example.com',
          name: 'Demo User',
          image: 'https://via.placeholder.com/150?text=Demo'
        }
      }
      return null
    }
  })
)

export const authOptions: AuthOptions = {
  providers,
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  // Use a default secret if not provided
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
}