import { NextRequest, NextResponse } from 'next/server'
import { Team } from '@/types'

// Mock team data - in a real app, this would come from your database
const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Thunder Bolts',
    ownerId: 'user1',
    ownerName: 'John Smith',
    leagueId: '1',
    totalPoints: 1247,
    wins: 8,
    losses: 4,
    ties: 0,
    rank: 2,
    budget: 85000,
    roster: ['1', '3', '4'], // Player IDs
    isActive: true
  },
  {
    id: '2',
    name: 'Fire Dragons',
    ownerId: 'user2',
    ownerName: 'Sarah Johnson',
    leagueId: '1',
    totalPoints: 1312,
    wins: 9,
    losses: 3,
    ties: 0,
    rank: 1,
    budget: 92000,
    roster: ['2', '5', '6'], // Player IDs
    isActive: true
  },
  {
    id: '3',
    name: 'Storm Chasers',
    ownerId: 'user3',
    ownerName: 'Mike Davis',
    leagueId: '2',
    totalPoints: 1189,
    wins: 7,
    losses: 5,
    ties: 0,
    rank: 3,
    budget: 78000,
    roster: ['1', '4', '6'], // Player IDs
    isActive: true
  }
]

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Connect to your database
    // 2. Query teams based on user authentication
    // 3. Apply filters and sorting
    
    const { searchParams } = new URL(request.url)
    const leagueId = searchParams.get('leagueId')
    const ownerId = searchParams.get('ownerId')
    
    let filteredTeams = mockTeams
    
    if (leagueId) {
      filteredTeams = filteredTeams.filter(t => t.leagueId === leagueId)
    }
    
    if (ownerId) {
      filteredTeams = filteredTeams.filter(t => t.ownerId === ownerId)
    }
    
    return NextResponse.json(filteredTeams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // In a real app, you would validate the data and save to database
    
    const newTeam: Team = {
      id: Date.now().toString(),
      name: body.name,
      ownerId: body.ownerId,
      ownerName: body.ownerName,
      leagueId: body.leagueId,
      totalPoints: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      rank: 0,
      budget: body.budget || 100000,
      roster: [],
      isActive: true
    }
    
    return NextResponse.json(newTeam, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { teamId, ...updates } = body
    
    // In a real app, you would update the team in the database
    const teamIndex = mockTeams.findIndex(t => t.id === teamId)
    if (teamIndex === -1) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }
    
    mockTeams[teamIndex] = { ...mockTeams[teamIndex], ...updates }
    
    return NextResponse.json(mockTeams[teamIndex])
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
  }
}
