import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
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
  ],
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
  secret: process.env.NEXTAUTH_SECRET,
}