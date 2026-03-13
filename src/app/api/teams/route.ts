import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leagueId = searchParams.get('league_id')
    const userId = searchParams.get('user_id')

    let sqlQuery = `
      SELECT t.*, l.name as league_name, l.sport,
             COALESCE(SUM(p.points), 0) as points
      FROM teams t
      JOIN leagues l ON t.league_id = l.id
      LEFT JOIN team_players tp ON t.id = tp.team_id
      LEFT JOIN players p ON tp.player_id = p.id
    `
    const params: any[] = []
    const conditions: string[] = []

    if (leagueId) {
      conditions.push(`t.league_id = $${params.length + 1}`)
      params.push(leagueId)
    }

    if (userId) {
      conditions.push(`t.owner_email = $${params.length + 1}`)
      params.push(userId)
    }

    if (conditions.length > 0) {
      sqlQuery += ` WHERE ${conditions.join(' AND ')}`
    }

    sqlQuery += ` GROUP BY t.id, l.name, l.sport ORDER BY points DESC`

    const teams = await query(sqlQuery, params)

    return NextResponse.json(teams.rows)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, league_id } = await request.json()

    // Check if league exists and has space
    const leagueCheck = await query(`
      SELECT l.max_teams, COUNT(t.id) as current_teams
      FROM leagues l
      LEFT JOIN teams t ON l.id = t.league_id
      WHERE l.id = $1
      GROUP BY l.id, l.max_teams
    `, [league_id])

    if (leagueCheck.rows.length === 0) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 })
    }

    const league = leagueCheck.rows[0]
    if (league.current_teams >= league.max_teams) {
      return NextResponse.json({ error: 'League is full' }, { status: 400 })
    }

    const result = await query(`
      INSERT INTO teams (name, league_id, owner_email, owner_name)
      VALUES ($1, $2, 'user@example.com', 'User')
      RETURNING *
    `, [name, league_id])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}