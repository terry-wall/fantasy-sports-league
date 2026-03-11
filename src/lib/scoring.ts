import { Player } from '@/types'

// Scoring system configurations
export interface ScoringSettings {
  passingTouchdown: number
  passingYards: number // points per yard
  passingInterceptions: number
  rushingTouchdown: number
  rushingYards: number // points per yard
  receivingTouchdown: number
  receivingYards: number // points per yard
  reception: number // PPR (Point Per Reception)
  fumble: number
  twoPointConversion: number
  // Defense/Special Teams
  defensiveTouchdown: number
  interception: number
  fumbleRecovery: number
  sack: number
  safety: number
  blockedKick: number
  // Kicking
  fieldGoal: number
  extraPoint: number
  fieldGoalMissed: number
}

// Default scoring settings (PPR format)
export const DEFAULT_SCORING: ScoringSettings = {
  passingTouchdown: 4,
  passingYards: 0.04, // 1 point per 25 yards
  passingInterceptions: -2,
  rushingTouchdown: 6,
  rushingYards: 0.1, // 1 point per 10 yards
  receivingTouchdown: 6,
  receivingYards: 0.1, // 1 point per 10 yards
  reception: 1, // PPR
  fumble: -2,
  twoPointConversion: 2,
  // Defense/Special Teams
  defensiveTouchdown: 6,
  interception: 2,
  fumbleRecovery: 2,
  sack: 1,
  safety: 2,
  blockedKick: 2,
  // Kicking
  fieldGoal: 3,
  extraPoint: 1,
  fieldGoalMissed: -1
}

// Standard scoring (no PPR)
export const STANDARD_SCORING: ScoringSettings = {
  ...DEFAULT_SCORING,
  reception: 0 // No points for receptions
}

// Half-PPR scoring
export const HALF_PPR_SCORING: ScoringSettings = {
  ...DEFAULT_SCORING,
  reception: 0.5 // Half point per reception
}

// Calculate fantasy points for a player based on their stats
export function calculateFantasyPoints(
  playerStats: any,
  scoringSettings: ScoringSettings = DEFAULT_SCORING
): number {
  let points = 0

  // Passing stats
  if (playerStats.passingTouchdowns) {
    points += playerStats.passingTouchdowns * scoringSettings.passingTouchdown
  }
  if (playerStats.passingYards) {
    points += playerStats.passingYards * scoringSettings.passingYards
  }
  if (playerStats.passingInterceptions) {
    points += playerStats.passingInterceptions * scoringSettings.passingInterceptions
  }

  // Rushing stats
  if (playerStats.rushingTouchdowns) {
    points += playerStats.rushingTouchdowns * scoringSettings.rushingTouchdown
  }
  if (playerStats.rushingYards) {
    points += playerStats.rushingYards * scoringSettings.rushingYards
  }

  // Receiving stats
  if (playerStats.receivingTouchdowns) {
    points += playerStats.receivingTouchdowns * scoringSettings.receivingTouchdown
  }
  if (playerStats.receivingYards) {
    points += playerStats.receivingYards * scoringSettings.receivingYards
  }
  if (playerStats.receptions) {
    points += playerStats.receptions * scoringSettings.reception
  }

  // Misc stats
  if (playerStats.fumbles) {
    points += playerStats.fumbles * scoringSettings.fumble
  }
  if (playerStats.twoPointConversions) {
    points += playerStats.twoPointConversions * scoringSettings.twoPointConversion
  }

  // Defense/Special Teams stats
  if (playerStats.defensiveTouchdowns) {
    points += playerStats.defensiveTouchdowns * scoringSettings.defensiveTouchdown
  }
  if (playerStats.interceptions) {
    points += playerStats.interceptions * scoringSettings.interception
  }
  if (playerStats.fumbleRecoveries) {
    points += playerStats.fumbleRecoveries * scoringSettings.fumbleRecovery
  }
  if (playerStats.sacks) {
    points += playerStats.sacks * scoringSettings.sack
  }
  if (playerStats.safeties) {
    points += playerStats.safeties * scoringSettings.safety
  }
  if (playerStats.blockedKicks) {
    points += playerStats.blockedKicks * scoringSettings.blockedKick
  }

  // Kicking stats
  if (playerStats.fieldGoals) {
    points += playerStats.fieldGoals * scoringSettings.fieldGoal
  }
  if (playerStats.extraPoints) {
    points += playerStats.extraPoints * scoringSettings.extraPoint
  }
  if (playerStats.fieldGoalsMissed) {
    points += playerStats.fieldGoalsMissed * scoringSettings.fieldGoalMissed
  }

  return Math.round(points * 100) / 100 // Round to 2 decimal places
}

// Calculate projected points for a player based on season averages
export function calculateProjectedPoints(
  player: Player,
  gamesPlayed: number = 16,
  scoringSettings: ScoringSettings = DEFAULT_SCORING
): number {
  if (!player.stats || gamesPlayed === 0) {
    return 0
  }

  // Calculate season totals and project for remaining games
  const seasonPoints = calculateFantasyPoints(player.stats, scoringSettings)
  const projectedSeasonPoints = (seasonPoints / gamesPlayed) * 17 // 17-game season

  return Math.round(projectedSeasonPoints * 100) / 100
}

// Calculate team total points
export function calculateTeamPoints(
  players: Player[],
  scoringSettings: ScoringSettings = DEFAULT_SCORING
): number {
  return players.reduce((total, player) => {
    if (!player.stats) return total
    return total + calculateFantasyPoints(player.stats, scoringSettings)
  }, 0)
}

// Get position-based scoring modifiers
export function getPositionMultiplier(position: string): number {
  const multipliers: { [key: string]: number } = {
    QB: 1.0,
    RB: 1.0,
    WR: 1.0,
    TE: 1.0,
    K: 0.8, // Kickers typically score less
    DEF: 0.9 // Defense scoring can be volatile
  }
  
  return multipliers[position] || 1.0
}

// Adjust player value based on consistency (standard deviation of weekly scores)
export function calculatePlayerConsistency(
  weeklyScores: number[]
): { average: number; standardDeviation: number; consistencyRating: number } {
  if (weeklyScores.length === 0) {
    return { average: 0, standardDeviation: 0, consistencyRating: 0 }
  }

  const average = weeklyScores.reduce((sum, score) => sum + score, 0) / weeklyScores.length
  
  const variance = weeklyScores.reduce((sum, score) => {
    return sum + Math.pow(score - average, 2)
  }, 0) / weeklyScores.length
  
  const standardDeviation = Math.sqrt(variance)
  
  // Consistency rating: lower standard deviation relative to average is better
  const consistencyRating = average > 0 ? Math.max(0, 100 - (standardDeviation / average) * 100) : 0
  
  return {
    average: Math.round(average * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    consistencyRating: Math.round(consistencyRating)
  }
}

// Generate matchup difficulty rating based on opposing team's defense
export function getMatchupDifficulty(
  playerPosition: string,
  opposingTeam: string,
  defenseRankings?: { [team: string]: { [position: string]: number } }
): { difficulty: 'Easy' | 'Medium' | 'Hard'; rating: number } {
  if (!defenseRankings || !defenseRankings[opposingTeam]) {
    return { difficulty: 'Medium', rating: 50 }
  }
  
  const ranking = defenseRankings[opposingTeam][playerPosition] || 16
  
  let difficulty: 'Easy' | 'Medium' | 'Hard'
  let rating: number
  
  if (ranking <= 10) {
    difficulty = 'Hard'
    rating = 25
  } else if (ranking <= 20) {
    difficulty = 'Medium'
    rating = 50
  } else {
    difficulty = 'Easy'
    rating = 75
  }
  
  return { difficulty, rating }
}

// Calculate player value (points per dollar)
export function calculatePlayerValue(player: Player): number {
  if (!player.price || player.price === 0) return 0
  return Math.round((player.points / player.price) * 1000 * 100) / 100
}
