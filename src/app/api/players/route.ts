import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/database'
import { fetchPlayerStats } from '@/lib/stats-api'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('team_id')
    const sport = searchParams.get('sport')
    const limit = searchParams.get('limit') || '50'
    const sort = searchParams.get('sort') || 'name'

    let sqlQuery = `
      SELECT p.*, tp.team_id
      FROM players p
      LEFT JOIN team_players tp ON p.id = tp.player_id
    `
    const params: any[] = []
    const conditions: string[] = []

    if (teamId) {
      conditions.push(`tp.team_id = $${params.length + 1}`)
      params.push(teamId)
    }

    if (sport) {
      conditions.push(`p.sport = $${params.length + 1}`)
      params.push(sport)
    }

    if (conditions.length > 0) {
      sqlQuery += ` WHERE ${conditions.join(' AND ')}`
    }

    // Add sorting
    const sortColumn = sort === 'points' ? 'p.points DESC' : 'p.name ASC'
    sqlQuery += ` ORDER BY ${sortColumn} LIMIT $${params.length + 1}`
    params.push(parseInt(limit))

    const players = await query(sqlQuery, params)

    return NextResponse.json(players.rows)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, position, team, sport, external_id } = await request.json()

    // Try to fetch current stats for the player
    let stats = { points: 0, goals: 0, assists: 0, rebounds: 0 }
    try {
      if (external_id) {
        const playerStats = await fetchPlayerStats(external_id, sport)
        if (playerStats) {
          stats = playerStats
        }
      }
    } catch (error) {
      console.warn('Could not fetch player stats:', error)
    }

    const result = await query(`
      INSERT INTO players (name, position, team, sport, external_id, points, goals, assists, rebounds)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [name, position, team, sport, external_id, stats.points, stats.goals, stats.assists, stats.rebounds])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating player:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
