import { NextRequest, NextResponse } from 'next/server'

// NextAuth internal logging endpoint
// This handles internal logging requests from NextAuth to prevent 404 errors
export async function POST(request: NextRequest) {
  try {
    // In development, we can log the request for debugging
    if (process.env.NODE_ENV === 'development') {
      const body = await request.json().catch(() => null)
      console.log('[NextAuth Log]:', body)
    }
    
    // Return success response
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('NextAuth logging error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

// Handle GET requests as well in case they're needed
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'NextAuth logging endpoint' }, { status: 200 })
}