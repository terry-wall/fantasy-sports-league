import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const leagues = await query(`
      SELECT l.*, COUNT(t.id) as team_count
      FROM leagues l
      LEFT JOIN teams t ON l.id = t.league_id
      GROUP BY l.id
      ORDER BY l.created_at DESC
    `)

    return NextResponse.json(leagues.rows)
  } catch (error) {
    console.error('Error fetching leagues:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, sport, max_teams, description } = await request.json()

    const result = await query(`
      INSERT INTO leagues (name, sport, max_teams, description, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, sport, max_teams, description, session.user?.email])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating league:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
