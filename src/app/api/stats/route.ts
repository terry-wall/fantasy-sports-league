import { NextRequest, NextResponse } from 'next/server'
import { fetchPlayerStats, fetchTeamStats } from '@/lib/stats-api'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get('player_id')
    const teamId = searchParams.get('team_id')
    const sport = searchParams.get('sport')

    if (playerId) {
      // Fetch individual player stats
      const playerResult = await query(
        'SELECT * FROM players WHERE id = $1',
        [playerId]
      )

      if (playerResult.rows.length === 0) {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 })
      }

      const player = playerResult.rows[0]
      let stats = {
        points: player.points || 0,
        goals: player.goals || 0,
        assists: player.assists || 0,
        rebounds: player.rebounds || 0
      }

      // Try to fetch fresh stats from external API
      try {
        if (player.external_id) {
          const freshStats = await fetchPlayerStats(player.external_id, player.sport)
          if (freshStats) {
            stats = freshStats
            // Update database with fresh stats
            await query(`
              UPDATE players 
              SET points = $1, goals = $2, assists = $3, rebounds = $4, updated_at = NOW()
              WHERE id = $5
            `, [stats.points, stats.goals, stats.assists, stats.rebounds, playerId])
          }
        }
      } catch (error) {
        console.warn('Could not fetch fresh player stats:', error)
      }

      return NextResponse.json({
        player: player,
        stats: stats
      })
    }

    if (teamId) {
      // Fetch team stats
      const teamResult = await query(`
        SELECT t.*, l.sport
        FROM teams t
        JOIN leagues l ON t.league_id = l.id
        WHERE t.id = $1
      `, [teamId])

      if (teamResult.rows.length === 0) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 })
      }

      const team = teamResult.rows[0]

      // Get team players and their stats
      const playersResult = await query(`
        SELECT p.* FROM players p
        JOIN team_players tp ON p.id = tp.player_id
        WHERE tp.team_id = $1
      `, [teamId])

      const players = playersResult.rows
      const totalStats = players.reduce((acc, player) => ({
        points: acc.points + (player.points || 0),
        goals: acc.goals + (player.goals || 0),
        assists: acc.assists + (player.assists || 0),
        rebounds: acc.rebounds + (player.rebounds || 0)
      }), { points: 0, goals: 0, assists: 0, rebounds: 0 })

      return NextResponse.json({
        team: team,
        players: players,
        stats: totalStats
      })
    }

    // General stats endpoint
    return NextResponse.json({
      message: 'Stats API - specify player_id or team_id parameter'
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'refresh_all') {
      // Refresh stats for all players
      const playersResult = await query(
        'SELECT id, external_id, sport FROM players WHERE external_id IS NOT NULL'
      )

      const updatePromises = playersResult.rows.map(async (player) => {
        try {
          const stats = await fetchPlayerStats(player.external_id, player.sport)
          if (stats) {
            await query(`
              UPDATE players 
              SET points = $1, goals = $2, assists = $3, rebounds = $4, updated_at = NOW()
              WHERE id = $5
            `, [stats.points, stats.goals, stats.assists, stats.rebounds, player.id])
          }
        } catch (error) {
          console.warn(`Failed to update stats for player ${player.id}:`, error)
        }
      })

      await Promise.allSettled(updatePromises)

      return NextResponse.json({ message: 'Stats refresh initiated' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}