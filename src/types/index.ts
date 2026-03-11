// Player types
export interface Player {
  id: string
  name: string
  position: string
  team: string
  points: number
  projectedPoints: number
  price?: number
  stats?: PlayerStats
  injuryStatus: string
  isAvailable: boolean
}

export interface PlayerStats {
  // Passing stats
  passingYards?: number
  passingTouchdowns?: number
  passingInterceptions?: number
  // Rushing stats
  rushingYards?: number
  rushingTouchdowns?: number
  rushingAttempts?: number
  // Receiving stats
  receivingYards?: number
  receivingTouchdowns?: number
  receptions?: number
  targets?: number
  // Misc stats
  fumbles?: number
  twoPointConversions?: number
  // Defense/Special Teams
  defensiveTouchdowns?: number
  interceptions?: number
  fumbleRecoveries?: number
  sacks?: number
  safeties?: number
  blockedKicks?: number
  // Kicking
  fieldGoals?: number
  fieldGoalAttempts?: number
  extraPoints?: number
  extraPointAttempts?: number
  fieldGoalsMissed?: number
}

// Team types
export interface Team {
  id: string
  name: string
  ownerId: string
  ownerName: string
  leagueId: string
  totalPoints: number
  wins: number
  losses: number
  ties: number
  rank: number
  budget?: number
  roster: string[] // Array of player IDs
  isActive: boolean
}

// League types
export interface League {
  id: string
  name: string
  description: string
  sport: string
  season: string
  maxTeams: number
  currentTeams: number
  draftDate: Date
  startDate: Date
  endDate: Date
  isActive: boolean
  settings: LeagueSettings
}

export interface LeagueSettings {
  scoringType: 'Standard' | 'PPR' | 'Half-PPR'
  playoffTeams: number
  tradingEnabled: boolean
  waiverType: 'Standard' | 'FAAB'
  draftType?: 'Snake' | 'Linear'
  maxAcquisitions?: number
  tradeDeadline?: Date
}

// Game/Match types
export interface Game {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  quarter: number
  timeRemaining: string
  status: 'Upcoming' | 'In Progress' | 'Final' | 'Postponed'
  week: number
  season: number
  gameDate?: Date
}

// Fantasy-specific types
export interface Matchup {
  id: string
  week: number
  team1: Team
  team2: Team
  team1Score: number
  team2Score: number
  status: 'Upcoming' | 'In Progress' | 'Final'
  isPlayoff?: boolean
}

export interface Transaction {
  id: string
  type: 'Add' | 'Drop' | 'Trade' | 'Waiver'
  teamId: string
  playersAdded: Player[]
  playersDropped: Player[]
  timestamp: Date
  status: 'Pending' | 'Approved' | 'Rejected'
}

// Roster management types
export interface RosterSlot {
  position: string
  playerId: string | null
  isStarter: boolean
  isFlex?: boolean
}

export interface LineupRequirement {
  position: string
  count: number
  flexPositions?: string[] // For flex positions like RB/WR/TE
}

// Draft types
export interface DraftPick {
  id: string
  draftId: string
  round: number
  pick: number
  teamId: string
  playerId?: string
  timestamp?: Date
  timeOnClock?: number
}

export interface Draft {
  id: string
  leagueId: string
  type: 'Snake' | 'Linear'
  status: 'Scheduled' | 'In Progress' | 'Completed'
  currentPick: number
  timePerPick: number
  picks: DraftPick[]
  scheduledTime: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}

// User/Authentication types (if needed)
export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  isActive: boolean
  createdAt: Date
  lastLoginAt?: Date
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: 'Trade' | 'Waiver' | 'Lineup' | 'Game' | 'League'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  actionUrl?: string
}

// Settings and preferences
export interface UserSettings {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  tradeNotifications: boolean
  waiverNotifications: boolean
  gameStartNotifications: boolean
  theme: 'light' | 'dark' | 'auto'
  timezone: string
}

// Utility types
export type PlayerPosition = 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF'
export type InjuryStatus = 'Healthy' | 'Questionable' | 'Doubtful' | 'Out' | 'IR'
export type GameStatus = 'Upcoming' | 'In Progress' | 'Final' | 'Postponed' | 'Canceled'
export type TransactionType = 'Add' | 'Drop' | 'Trade' | 'Waiver' | 'Draft'
export type LeagueStatus = 'Draft' | 'Active' | 'Playoffs' | 'Complete'
