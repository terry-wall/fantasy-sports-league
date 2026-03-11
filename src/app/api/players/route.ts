import { NextRequest, NextResponse } from 'next/server'
import { Player } from '@/types'

// Mock player data - in a real app, this would come from your database
const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Patrick Mahomes',
    position: 'QB',
    team: 'Kansas City Chiefs',
    points: 285,
    projectedPoints: 22.5,
    price: 9500,
    stats: {
      passingYards: 4183,
      passingTouchdowns: 27,
      rushingYards: 358,
      rushingTouchdowns: 1
    },
    injuryStatus: 'Healthy',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Josh Allen',
    position: 'QB',
    team: 'Buffalo Bills',
    points: 278,
    projectedPoints: 21.8,
    price: 9200,
    stats: {
      passingYards: 4006,
      passingTouchdowns: 29,
      rushingYards: 524,
      rushingTouchdowns: 15
    },
    injuryStatus: 'Healthy',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Christian McCaffrey',
    position: 'RB',
    team: 'San Francisco 49ers',
    points: 342,
    projectedPoints: 24.1,
    price: 10000,
    stats: {
      rushingYards: 1459,
      rushingTouchdowns: 14,
      receivingYards: 741,
      receivingTouchdowns: 7
    },
    injuryStatus: 'Healthy',
    isAvailable: false
  },
  {
    id: '4',
    name: 'Tyreek Hill',
    position: 'WR',
    team: 'Miami Dolphins',
    points: 298,
    projectedPoints: 19.2,
    price: 8800,
    stats: {
      receivingYards: 1799,
      receivingTouchdowns: 13,
      receptions: 119
    },
    injuryStatus: 'Questionable',
    isAvailable: true
  },
  {
    id: '5',
    name: 'Travis Kelce',
    position: 'TE',
    team: 'Kansas City Chiefs',
    points: 267,
    projectedPoints: 16.8,
    price: 7900,
    stats: {
      receivingYards: 984,
      receivingTouchdowns: 5,
      receptions: 93
    },
    injuryStatus: 'Healthy',
    isAvailable: true
  },
  {
    id: '6',
    name: 'Stefon Diggs',
    position: 'WR',
    team: 'Buffalo Bills',
    points: 276,
    projectedPoints: 18.4,
    price: 8500,
    stats: {
      receivingYards: 1183,
      receivingTouchdowns: 11,
      receptions: 107
    },
    injuryStatus: 'Healthy',
    isAvailable: true
  }
]

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Connect to your database
    // 2. Query players based on request parameters
    // 3. Apply filters, sorting, pagination
    
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')
    const team = searchParams.get('team')
    const available = searchParams.get('available')
    
    let filteredPlayers = mockPlayers
    
    if (position) {
      filteredPlayers = filteredPlayers.filter(p => p.position === position)
    }
    
    if (team) {
      filteredPlayers = filteredPlayers.filter(p => p.team.toLowerCase().includes(team.toLowerCase()))
    }
    
    if (available === 'true') {
      filteredPlayers = filteredPlayers.filter(p => p.isAvailable)
    }
    
    return NextResponse.json(filteredPlayers)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // In a real app, you would validate the data and save to database
    
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: body.name,
      position: body.position,
      team: body.team,
      points: 0,
      projectedPoints: body.projectedPoints || 0,
      price: body.price || 5000,
      stats: body.stats || {},
      injuryStatus: body.injuryStatus || 'Healthy',
      isAvailable: true
    }
    
    return NextResponse.json(newPlayer, { status: 201 })
  } catch (error) {
    console.error('Error creating player:', error)
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 })
  }
}
