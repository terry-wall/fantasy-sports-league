import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

// Initialize database tables
export async function initDatabase() {
  const tables = [
    `
      CREATE TABLE IF NOT EXISTS leagues (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sport VARCHAR(50) NOT NULL,
        max_teams INTEGER DEFAULT 10,
        description TEXT,
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        league_id INTEGER REFERENCES leagues(id) ON DELETE CASCADE,
        owner_email VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255),
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        rank INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(10),
        team VARCHAR(255),
        sport VARCHAR(50),
        external_id VARCHAR(100),
        points INTEGER DEFAULT 0,
        goals INTEGER DEFAULT 0,
        assists INTEGER DEFAULT 0,
        rebounds INTEGER DEFAULT 0,
        yards INTEGER DEFAULT 0,
        touchdowns INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS team_players (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(team_id, player_id)
      )
    `,
    `
      CREATE INDEX IF NOT EXISTS idx_leagues_sport ON leagues(sport)
    `,
    `
      CREATE INDEX IF NOT EXISTS idx_teams_league_id ON teams(league_id)
    `,
    `
      CREATE INDEX IF NOT EXISTS idx_teams_owner_email ON teams(owner_email)
    `,
    `
      CREATE INDEX IF NOT EXISTS idx_players_sport ON players(sport)
    `,
    `
      CREATE INDEX IF NOT EXISTS idx_team_players_team_id ON team_players(team_id)
    `
  ]

  for (const table of tables) {
    try {
      await query(table)
    } catch (error) {
      console.error('Error creating table:', error)
    }
  }

  // Seed some sample data if tables are empty
  await seedSampleData()
}

async function seedSampleData() {
  try {
    // Check if we have any leagues
    const leaguesResult = await query('SELECT COUNT(*) FROM leagues')
    if (parseInt(leaguesResult.rows[0].count) > 0) {
      return // Already seeded
    }

    // Create sample leagues
    const sampleLeagues = [
      { name: 'Championship Football League', sport: 'football', max_teams: 12, description: 'Premier fantasy football league for serious players' },
      { name: 'Hoops Masters', sport: 'basketball', max_teams: 10, description: 'Elite basketball fantasy league' },
      { name: 'Home Run Heroes', sport: 'baseball', max_teams: 8, description: 'Classic baseball fantasy competition' },
      { name: 'Ice Warriors', sport: 'hockey', max_teams: 8, description: 'Hockey fantasy league for ice sports fans' }
    ]

    for (const league of sampleLeagues) {
      await query(`
        INSERT INTO leagues (name, sport, max_teams, description, created_by)
        VALUES ($1, $2, $3, $4, 'system@example.com')
      `, [league.name, league.sport, league.max_teams, league.description])
    }

    // Create sample players
    const samplePlayers = [
      // Football
      { name: 'Josh Allen', position: 'QB', team: 'Buffalo Bills', sport: 'football', points: 285 },
      { name: 'Christian McCaffrey', position: 'RB', team: 'San Francisco 49ers', sport: 'football', points: 245 },
      { name: 'Cooper Kupp', position: 'WR', team: 'Los Angeles Rams', sport: 'football', points: 198 },
      
      // Basketball
      { name: 'Luka Dončić', position: 'PG', team: 'Dallas Mavericks', sport: 'basketball', points: 32, rebounds: 8, assists: 9 },
      { name: 'Giannis Antetokounmpo', position: 'PF', team: 'Milwaukee Bucks', sport: 'basketball', points: 31, rebounds: 11, assists: 6 },
      { name: 'Jayson Tatum', position: 'SF', team: 'Boston Celtics', sport: 'basketball', points: 27, rebounds: 8, assists: 5 },
      
      // Hockey
      { name: 'Connor McDavid', position: 'C', team: 'Edmonton Oilers', sport: 'hockey', points: 128, goals: 42, assists: 86 },
      { name: 'David Pastrnak', position: 'RW', team: 'Boston Bruins', sport: 'hockey', points: 113, goals: 55, assists: 58 },
      { name: 'Erik Karlsson', position: 'D', team: 'San Jose Sharks', sport: 'hockey', points: 101, goals: 25, assists: 76 },
      
      // Baseball
      { name: 'Ronald Acuña Jr.', position: 'OF', team: 'Atlanta Braves', sport: 'baseball', points: 95 },
      { name: 'Mookie Betts', position: 'OF', team: 'Los Angeles Dodgers', sport: 'baseball', points: 88 },
      { name: 'Francisco Lindor', position: 'SS', team: 'New York Mets', sport: 'baseball', points: 82 }
    ]

    for (const player of samplePlayers) {
      await query(`
        INSERT INTO players (name, position, team, sport, points, goals, assists, rebounds)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [player.name, player.position, player.team, player.sport, player.points, player.goals || 0, player.assists || 0, player.rebounds || 0])
    }

    console.log('Sample data seeded successfully')
  } catch (error) {
    console.error('Error seeding sample data:', error)
  }
}

// Initialize on import
if (process.env.DATABASE_URL) {
  initDatabase().catch(console.error)
}
