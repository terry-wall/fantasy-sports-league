import { Pool } from 'pg'

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Database initialization queries
const initQueries = [
  `CREATE TABLE IF NOT EXISTS leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sport VARCHAR(50) NOT NULL,
    season VARCHAR(10) NOT NULL,
    max_teams INTEGER DEFAULT 12,
    current_teams INTEGER DEFAULT 0,
    draft_date TIMESTAMP,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    league_id INTEGER REFERENCES leagues(id),
    total_points INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    ties INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    budget DECIMAL(10,2) DEFAULT 100000.00,
    roster JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(10) NOT NULL,
    team VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 0,
    projected_points DECIMAL(5,2) DEFAULT 0,
    price INTEGER DEFAULT 5000,
    stats JSONB DEFAULT '{}',
    injury_status VARCHAR(50) DEFAULT 'Healthy',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE,
    home_team VARCHAR(255) NOT NULL,
    away_team VARCHAR(255) NOT NULL,
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    quarter INTEGER DEFAULT 1,
    time_remaining VARCHAR(10),
    status VARCHAR(50) DEFAULT 'Upcoming',
    week INTEGER NOT NULL,
    season INTEGER NOT NULL,
    game_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS team_players (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    player_id INTEGER REFERENCES players(id),
    is_starter BOOLEAN DEFAULT false,
    position_slot VARCHAR(10),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, player_id)
  )`,
  
  // Create indexes for better performance
  `CREATE INDEX IF NOT EXISTS idx_teams_league_id ON teams(league_id)`,
  `CREATE INDEX IF NOT EXISTS idx_players_position ON players(position)`,
  `CREATE INDEX IF NOT EXISTS idx_players_team ON players(team)`,
  `CREATE INDEX IF NOT EXISTS idx_games_week_season ON games(week, season)`,
  `CREATE INDEX IF NOT EXISTS idx_team_players_team_id ON team_players(team_id)`,
  `CREATE INDEX IF NOT EXISTS idx_team_players_player_id ON team_players(player_id)`,
]

// Initialize database tables
export async function initializeDatabase() {
  try {
    console.log('Initializing database...')
    
    for (const query of initQueries) {
      await pool.query(query)
    }
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

// Query helper functions
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error:', { text, error })
    throw error
  }
}

export async function getClient() {
  return pool.connect()
}

export default pool
