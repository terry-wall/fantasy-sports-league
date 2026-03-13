import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

// Fallback data when database is not available
const fallbackLeagues = [
  {
    id: 1,
    name: 'Championship Football League',
    sport: 'football',
    max_teams: 12,
    description: 'Premier fantasy football league for serious players',
    created_by: 'system@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    team_count: 8
  },
  {
    id: 2,
    name: 'Hoops Masters',
    sport: 'basketball',
    max_teams: 10,
    description: 'Elite basketball fantasy league',
    created_by: 'system@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    team_count: 6
  },
  {
    id: 3,
    name: 'Home Run Heroes',
    sport: 'baseball',
    max_teams: 8,
    description: 'Classic baseball fantasy competition',
    created_by: 'system@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    team_count: 4
  },
  {
    id: 4,
    name: 'Ice Warriors',
    sport: 'hockey',
    max_teams: 8,
    description: 'Hockey fantasy league for ice sports fans',
    created_by: 'system@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    team_count: 5
  }
]

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from database first
    if (process.env.DATABASE_URL) {
      try {
        const leagues = await query(`
          SELECT l.*, COUNT(t.id) as team_count
          FROM leagues l
          LEFT JOIN teams t ON l.id = t.league_id
          GROUP BY l.id
          ORDER BY l.created_at DESC
        `)

        return NextResponse.json(leagues.rows)
      } catch (dbError) {
        console.warn('Database query failed, using fallback data:', dbError)
      }
    }

    // Return fallback data if database is not available
    return NextResponse.json(fallbackLeagues)
  } catch (error) {
    console.error('Error fetching leagues:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, sport, max_teams, description } = await request.json()

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    try {
      const result = await query(`
        INSERT INTO leagues (name, sport, max_teams, description, created_by)
        VALUES ($1, $2, $3, $4, 'user@example.com')
        RETURNING *
      `, [name, sport, max_teams, description])

      return NextResponse.json(result.rows[0], { status: 201 })
    } catch (dbError) {
      console.error('Database insert failed:', dbError)
      return NextResponse.json({ error: 'Database operation failed' }, { status: 503 })
    }
  } catch (error) {
    console.error('Error creating league:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}