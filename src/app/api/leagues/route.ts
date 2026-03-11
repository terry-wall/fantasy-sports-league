import { NextRequest, NextResponse } from 'next/server'
import { League } from '@/types'

// Mock league data - in a real app, this would come from your database
const mockLeagues: League[] = [
  {
    id: '1',
    name: 'Championship League',
    description: 'The main fantasy football league for serious competitors',
    sport: 'Football',
    season: '2024',
    maxTeams: 12,
    currentTeams: 10,
    draftDate: new Date('2024-08-15'),
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    settings: {
      scoringType: 'PPR',
      playoffTeams: 6,
      tradingEnabled: true,
      waiverType: 'FAAB'
    }
  },
  {
    id: '2',
    name: 'Friends & Family League',
    description: 'Casual league for friends and family members',
    sport: 'Football',
    season: '2024',
    maxTeams: 10,
    currentTeams: 8,
    draftDate: new Date('2024-08-20'),
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    settings: {
      scoringType: 'Standard',
      playoffTeams: 4,
      tradingEnabled: true,
      waiverType: 'Standard'
    }
  },
  {
    id: '3',
    name: 'Office League',
    description: 'Workplace fantasy league',
    sport: 'Football',
    season: '2024',
    maxTeams: 14,
    currentTeams: 14,
    draftDate: new Date('2024-08-10'),
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    settings: {
      scoringType: 'Half-PPR',
      playoffTeams: 8,
      tradingEnabled: false,
      waiverType: 'FAAB'
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Connect to your database
    // 2. Query leagues based on user authentication
    // 3. Apply filters and sorting
    
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get('sport')
    const active = searchParams.get('active')
    
    let filteredLeagues = mockLeagues
    
    if (sport) {
      filteredLeagues = filteredLeagues.filter(l => l.sport.toLowerCase() === sport.toLowerCase())
    }
    
    if (active === 'true') {
      filteredLeagues = filteredLeagues.filter(l => l.isActive)
    }
    
    return NextResponse.json(filteredLeagues)
  } catch (error) {
    console.error('Error fetching leagues:', error)
    return NextResponse.json({ error: 'Failed to fetch leagues' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // In a real app, you would validate the data and save to database
    
    const newLeague: League = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description || '',
      sport: body.sport,
      season: body.season || new Date().getFullYear().toString(),
      maxTeams: body.maxTeams || 12,
      currentTeams: 0,
      draftDate: new Date(body.draftDate),
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isActive: true,
      settings: body.settings || {
        scoringType: 'Standard',
        playoffTeams: 6,
        tradingEnabled: true,
        waiverType: 'Standard'
      }
    }
    
    return NextResponse.json(newLeague, { status: 201 })
  } catch (error) {
    console.error('Error creating league:', error)
    return NextResponse.json({ error: 'Failed to create league' }, { status: 500 })
  }
}
