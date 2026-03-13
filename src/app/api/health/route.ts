import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET() {
  try {
    // Check if the application is ready
    const checks = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'unknown'
    }

    // Try to connect to database if configured
    if (process.env.DATABASE_URL) {
      try {
        await query('SELECT 1')
        checks.database = 'connected'
      } catch (error) {
        console.warn('Database health check failed:', error)
        checks.database = 'disconnected'
      }
    } else {
      checks.database = 'not_configured'
    }

    return NextResponse.json(checks, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      }, 
      { status: 503 }
    )
  }
}