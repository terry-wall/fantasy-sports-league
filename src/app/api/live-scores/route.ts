import { NextRequest, NextResponse } from 'next/server'

// Mock live score data - in a real app, this would come from a sports API
const mockLiveScores = [
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
  {
    id: '2',
    homeTeam: 'Dallas Cowboys',
    awayTeam: 'Philadelphia Eagles',
    homeScore: 14,
    awayScore: 28,
    quarter: 4,
    timeRemaining: '2:15',
    status: 'In Progress',
    week: 12,
    season: 2024
  },
  {
    id: '3',
    homeTeam: 'Green Bay Packers',
    awayTeam: 'Chicago Bears',
    homeScore: 35,
    awayScore: 10,
    quarter: 4,
    timeRemaining: 'Final',
    status: 'Final',
    week: 12,
    season: 2024
  },
  {
    id: '4',
    homeTeam: 'San Francisco 49ers',
    awayTeam: 'Seattle Seahawks',
    homeScore: 0,
    awayScore: 0,
    quarter: 1,
    timeRemaining: '15:00',
    status: 'Upcoming',
    week: 12,
    season: 2024
  }
]

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Make API calls to your sports data provider (using SPORTS_API_KEY)
    // 2. Cache results for performance
    // 3. Update scores in real-time via WebSocket or polling
    
    const { searchParams } = new URL(request.url)
    const week = searchParams.get('week')
    const status = searchParams.get('status')
    
    let filteredScores = mockLiveScores
    
    if (week) {
      filteredScores = filteredScores.filter(s => s.week.toString() === week)
    }
    
    if (status) {
      filteredScores = filteredScores.filter(s => s.status.toLowerCase() === status.toLowerCase())
    }
    
    // Simulate live updates by randomly updating scores for in-progress games
    const updatedScores = filteredScores.map(score => {
      if (score.status === 'In Progress' && Math.random() > 0.8) {
        const homeBonus = Math.floor(Math.random() * 7)
        const awayBonus = Math.floor(Math.random() * 7)
        return {
          ...score,
          homeScore: score.homeScore + homeBonus,
          awayScore: score.awayScore + awayBonus,
          timeRemaining: `${Math.floor(Math.random() * 15)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        }
      }
      return score
    })
    
    return NextResponse.json(updatedScores)
  } catch (error) {
    console.error('Error fetching live scores:', error)
    return NextResponse.json({ error: 'Failed to fetch live scores' }, { status: 500 })
  }
}
