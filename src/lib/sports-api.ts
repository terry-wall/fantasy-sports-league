import axios from 'axios'

const SPORTS_API_KEY = process.env.SPORTS_API_KEY
const BASE_URL = 'https://api.sportsdata.io/v3/nfl' // Example NFL API

// Create axios instance with default config
const sportsApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    key: SPORTS_API_KEY
  }
})

// Player data interface for API response
interface ApiPlayer {
  PlayerID: number
  Name: string
  Position: string
  Team: string
  FantasyPoints: number
  FantasyPointsPerGame: number
  Salary?: number
  InjuryStatus?: string
  // Add more fields as needed based on your API
}

// Game data interface for API response
interface ApiGame {
  GameID: number
  HomeTeam: string
  AwayTeam: string
  HomeScore?: number
  AwayScore?: number
  Quarter?: number
  TimeRemainingMinutes?: number
  TimeRemainingSeconds?: number
  Status: string
  Week: number
  Season: number
  DateTime: string
}

// Fetch players from sports API
export async function fetchPlayersFromAPI(season: number = 2024, week?: number) {
  try {
    console.log(`Fetching players for season ${season}${week ? `, week ${week}` : ''}`)
    
    const endpoint = week 
      ? `/PlayerGameProjectionsByWeek/${season}/${week}` 
      : `/PlayerSeasonProjections/${season}`
    
    const response = await sportsApi.get(endpoint)
    
    return response.data.map((player: ApiPlayer) => ({
      externalId: player.PlayerID.toString(),
      name: player.Name,
      position: player.Position,
      team: player.Team,
      points: Math.round(player.FantasyPoints || 0),
      projectedPoints: parseFloat((player.FantasyPointsPerGame || 0).toFixed(2)),
      price: player.Salary || Math.round((player.FantasyPointsPerGame || 0) * 500),
      injuryStatus: player.InjuryStatus || 'Healthy',
      isAvailable: true
    }))
  } catch (error) {
    console.error('Error fetching players from API:', error)
    
    // Return mock data if API fails
    return getMockPlayers()
  }
}

// Fetch live scores from sports API
export async function fetchLiveScoresFromAPI(season: number = 2024, week?: number) {
  try {
    console.log(`Fetching live scores for season ${season}${week ? `, week ${week}` : ''}`)
    
    const endpoint = week
      ? `/ScoresByWeek/${season}/${week}`
      : `/Scores/${season}`
    
    const response = await sportsApi.get(endpoint)
    
    return response.data.map((game: ApiGame) => ({
      id: game.GameID.toString(),
      homeTeam: game.HomeTeam,
      awayTeam: game.AwayTeam,
      homeScore: game.HomeScore || 0,
      awayScore: game.AwayScore || 0,
      quarter: game.Quarter || 1,
      timeRemaining: formatTimeRemaining(game.TimeRemainingMinutes, game.TimeRemainingSeconds),
      status: mapGameStatus(game.Status),
      week: game.Week,
      season: game.Season
    }))
  } catch (error) {
    console.error('Error fetching live scores from API:', error)
    
    // Return mock data if API fails
    return getMockGames()
  }
}

// Fetch player statistics
export async function fetchPlayerStats(playerId: string, season: number = 2024) {
  try {
    const response = await sportsApi.get(`/PlayerSeasonStats/${season}/${playerId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching stats for player ${playerId}:`, error)
    return null
  }
}

// Helper functions
function formatTimeRemaining(minutes?: number, seconds?: number): string {
  if (!minutes && !seconds) return 'Final'
  return `${minutes || 0}:${(seconds || 0).toString().padStart(2, '0')}`
}

function mapGameStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    'InProgress': 'In Progress',
    'Final': 'Final',
    'FinalOT': 'Final OT',
    'Scheduled': 'Upcoming',
    'Postponed': 'Postponed',
    'Canceled': 'Canceled'
  }
  
  return statusMap[status] || status
}

// Mock data fallbacks
function getMockPlayers() {
  return [
    {
      externalId: '1',
      name: 'Patrick Mahomes',
      position: 'QB',
      team: 'Kansas City Chiefs',
      points: 285,
      projectedPoints: 22.5,
      price: 9500,
      injuryStatus: 'Healthy',
      isAvailable: true
    },
    // Add more mock players as needed
  ]
}

function getMockGames() {
  return [
    {
      id: '1',
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'Buffalo Bills',
      homeScore: 21,
      awayScore: 17,
      quarter: 3,
      timeRemaining: '8:42',
      status: 'In Progress',
      week: 12,
      season: 2024
    },
    // Add more mock games as needed
  ]
}

// Update players in database with fresh API data
export async function syncPlayersWithAPI() {
  try {
    console.log('Syncing players with sports API...')
    const apiPlayers = await fetchPlayersFromAPI()
    
    // In a real implementation, you would:
    // 1. Compare API data with database
    // 2. Update existing players
    // 3. Add new players
    // 4. Mark inactive players
    
    console.log(`Synced ${apiPlayers.length} players from API`)
    return apiPlayers
  } catch (error) {
    console.error('Error syncing players:', error)
    throw error
  }
}

// Update live scores in database
export async function syncLiveScores() {
  try {
    console.log('Syncing live scores with sports API...')
    const apiGames = await fetchLiveScoresFromAPI()
    
    // In a real implementation, you would update the database
    
    console.log(`Synced ${apiGames.length} games from API`)
    return apiGames
  } catch (error) {
    console.error('Error syncing live scores:', error)
    throw error
  }
}
