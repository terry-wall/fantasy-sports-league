import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseReady } from '@/lib/database'

export async function POST() {
  try {
    console.log('Manual database initialization requested')
    const result = await ensureDatabaseReady()
    
    return NextResponse.json({ 
      success: result,
      message: result ? 'Database initialized successfully' : 'Database initialization skipped (no DATABASE_URL)'
    })
  } catch (error) {
    console.error('Manual database initialization failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Database initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}