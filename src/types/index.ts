export interface User {
  id: string
  email: string
  name?: string
  image?: string
  created_at: string
  updated_at: string
}

export interface League {
  id: number
  name: string
  sport: 'football' | 'basketball' | 'baseball' | 'hockey'
  max_teams: number
  description?: string
  created_by: string
  created_at: string
  updated_at: string
  team_count?: number
}

export interface Team {
  id: number
  name: string
  league_id: number
  league_name?: string
  sport?: string
  owner_email: string
  owner_name?: string
  wins?: number
  losses?: number
  points?: number
  rank?: number
  created_at: string
  updated_at: string
}

export interface Player {
  id: number
  name: string
  position: string
  team: string
  sport: string
  external_id?: string
  points?: number
  goals?: number
  assists?: number
  rebounds?: number
  yards?: number
  touchdowns?: number
  avg?: number
  rbi?: number
  created_at: string
  updated_at: string
}

export interface TeamPlayer {
  id: number
  team_id: number
  player_id: number
  created_at: string
}

export interface GameStats {
  id: string
  home_team: string
  away_team: string
  home_score: number
  away_score: number
  status: 'scheduled' | 'live' | 'final'
  sport: string
  game_time?: string
}

export interface PlayerStats {
  player_id: number
  week: number
  season: number
  points: number
  goals?: number
  assists?: number
  rebounds?: number
  yards?: number
  touchdowns?: number
  [key: string]: any
}

export interface FantasyLineup {
  id: number
  team_id: number
  week: number
  season: number
  players: Player[]
  total_points: number
  created_at: string
  updated_at: string
}

export interface LeagueSettings {
  id: number
  league_id: number
  scoring_system: Record<string, number>
  roster_positions: Record<string, number>
  trade_deadline?: string
  playoff_weeks: number[]
  created_at: string
  updated_at: string
}

export interface Trade {
  id: number
  from_team_id: number
  to_team_id: number
  from_players: number[]
  to_players: number[]
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  created_at: string
  updated_at: string
}

export interface Matchup {
  id: number
  league_id: number
  week: number
  season: number
  team1_id: number
  team2_id: number
  team1_score?: number
  team2_score?: number
  status: 'scheduled' | 'active' | 'complete'
  created_at: string
  updated_at: string
}
