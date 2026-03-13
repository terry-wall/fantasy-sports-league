import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseReady } from '@/lib/database'

let isReady = false
let initPromise: Promise<void> | null = null

async function initialize() {
  if (initPromise) {
    return initPromise
  }

  initPromise = (async () => {
    try {
      console.log('Starting application initialization...')
      
      // Initialize database if configured
      const dbReady = await ensureDatabaseReady()
      console.log('Database ready:', dbReady)
      
      // Add any other initialization logic here
      
      isReady = true
      console.log('Application initialization complete')
    } catch (error) {
      console.error('Application initialization failed:', error)
      isReady = false
      initPromise = null // Allow retry
      throw error
    }
  })()

  return initPromise
}

export async function GET() {
  try {
    if (!isReady) {
      await initialize()
    }

    return NextResponse.json(
      { 
        status: 'ready',
        timestamp: new Date().toISOString()
      }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('Readiness check failed:', error)
    return NextResponse.json(
      { 
        status: 'not_ready', 
        timestamp: new Date().toISOString(),
        error: 'Initialization failed'
      }, 
      { status: 503 }
    )
  }
}