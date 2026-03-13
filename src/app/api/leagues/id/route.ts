import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(`
      SELECT l.*, COUNT(t.id) as team_count
      FROM leagues l
      LEFT JOIN teams t ON l.id = t.league_id
      WHERE l.id = $1
      GROUP BY l.id
    `, [params.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching league:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, sport, max_teams, description } = await request.json()

    const result = await query(`
      UPDATE leagues
      SET name = $1, sport = $2, max_teams = $3, description = $4
      WHERE id = $5
      RETURNING *
    `, [name, sport, max_teams, description, params.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating league:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(`
      DELETE FROM leagues
      WHERE id = $1
      RETURNING *
    `, [params.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'League deleted successfully' })
  } catch (error) {
    console.error('Error deleting league:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}