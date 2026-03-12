import { Player } from '@/types'

// Fantasy scoring systems for different sports
const SCORING_SYSTEMS = {
  football: {
    passing_yards: 0.04,
    passing_touchdowns: 6,
    rushing_yards: 0.1,
    rushing_touchdowns: 6,
    receiving_yards: 0.1,
    receiving_touchdowns: 6,
    field_goals: 3,
    extra_points: 1,
    interceptions: -2,
    fumbles: -2
  },
  basketball: {
    points: 1,
    rebounds: 1.2,
    assists: 1.5,
    steals: 3,
    blocks: 3,
    turnovers: -1
  },
  hockey: {
    goals: 6,
    assists: 4,
    plus_minus: 2,
    penalty_minutes: -0.5,
    powerplay_points: 1,
    shots_on_goal: 0.5
  },
  baseball: {
    hits: 3,
    runs: 2,
    rbis: 2,
    home_runs: 10,
    stolen_bases: 5,
    strikeouts: -1
  }
}

export function calculateFantasyPoints(player: Player, stats: any, sport: string): number {
  const scoring = SCORING_SYSTEMS[sport.toLowerCase() as keyof typeof SCORING_SYSTEMS]
  if (!scoring) return 0

  let points = 0
  
  for (const [stat, multiplier] of Object.entries(scoring)) {
    if (stats[stat] !== undefined) {
      points += stats[stat] * multiplier
    }
  }
  
  return Math.round(points * 100) / 100 // Round to 2 decimal places
}

export function calculateTeamScore(players: Player[]): number {
  return players.reduce((total, player) => total + (player.points || 0), 0)
}

export function getPlayerProjection(player: Player, upcomingGames: number = 1): number {
  const currentPoints = player.points || 0
  const seasonGames = 16 // Assume 16 games played so far
  const averagePerGame = currentPoints / seasonGames
  
  // Add some variance based on recent performance
  const projectedPerGame = averagePerGame * (0.9 + Math.random() * 0.2)
  
  return Math.round(projectedPerGame * upcomingGames * 100) / 100
}

export function rankPlayers(players: Player[], sortBy: 'points' | 'projection' = 'points'): Player[] {
  return players.sort((a, b) => {
    if (sortBy === 'projection') {
      const projA = getPlayerProjection(a)
      const projB = getPlayerProjection(b)
      return projB - projA
    }
    return (b.points || 0) - (a.points || 0)
  })
}

export function getOptimalLineup(players: Player[], sport: string): Player[] {
  const lineupRequirements = getLineupRequirements(sport)
  const lineup: Player[] = []
  
  // Group players by position
  const playersByPosition = players.reduce((acc, player) => {
    const position = player.position || 'FLEX'
    if (!acc[position]) acc[position] = []
    acc[position].push(player)
    return acc
  }, {} as Record<string, Player[]>)
  
  // Sort each position group by points
  for (const position in playersByPosition) {
    playersByPosition[position] = rankPlayers(playersByPosition[position])
  }
  
  // Fill required positions
  for (const [position, count] of Object.entries(lineupRequirements)) {
    const availablePlayers = playersByPosition[position] || []
    const selectedCount = Math.min(count, availablePlayers.length)
    
    for (let i = 0; i < selectedCount; i++) {
      if (availablePlayers[i]) {
        lineup.push(availablePlayers[i])
      }
    }
  }
  
  return lineup
}

function getLineupRequirements(sport: string): Record<string, number> {
  switch (sport.toLowerCase()) {
    case 'football':
      return {
        'QB': 1,
        'RB': 2,
        'WR': 3,
        'TE': 1,
        'K': 1,
        'DEF': 1
      }
    case 'basketball':
      return {
        'PG': 2,
        'SG': 2,
        'SF': 2,
        'PF': 2,
        'C': 1
      }
    case 'hockey':
      return {
        'LW': 3,
        'RW': 3,
        'C': 2,
        'D': 4,
        'G': 2
      }
    case 'baseball':
      return {
        'C': 2,
        '1B': 1,
        '2B': 1,
        '3B': 1,
        'SS': 1,
        'OF': 5,
        'P': 9
      }
    default:
      return {}
  }
}

export function calculateMatchupDifficulty(player: Player, opponent: string): 'easy' | 'medium' | 'hard' {
  // Mock matchup difficulty calculation
  // In a real app, this would analyze opponent defensive rankings, player historical performance, etc.
  
  const difficulty = Math.random()
  if (difficulty < 0.33) return 'easy'
  if (difficulty < 0.66) return 'medium'
  return 'hard'
}

export function getWeeklyProjections(players: Player[], week: number): Record<string, number> {
  const projections: Record<string, number> = {}
  
  players.forEach(player => {
    const baseProjection = getPlayerProjection(player, 1)
    const variance = (Math.random() - 0.5) * 0.2 // +/- 10% variance
    projections[player.id] = Math.round((baseProjection * (1 + variance)) * 100) / 100
  })
  
  return projections
}
