import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await query(`
      SELECT t.*, l.name as league_name, l.sport,
             COALESCE(SUM(p.points), 0) as points
      FROM teams t
      JOIN leagues l ON t.league_id = l.id
      LEFT JOIN team_players tp ON t.id = tp.team_id
      LEFT JOIN players p ON tp.player_id = p.id
      WHERE t.id = $1
      GROUP BY t.id, l.name, l.sport
    `, [params.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}