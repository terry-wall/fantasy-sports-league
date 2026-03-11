'use client'
import { useState, useEffect } from 'react'
import { Player } from '@/types'
import { PlayerCard } from './PlayerCard'

interface TeamRosterProps {
  teamId: string
}

export function TeamRoster({ teamId }: TeamRosterProps) {
  const [rosterPlayers, setRosterPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'starters' | 'bench'>('starters')

  useEffect(() => {
    if (teamId) {
      fetchRoster()
    }
  }, [teamId])

  const fetchRoster = async () => {
    try {
      setLoading(true)
      // First get team data to get roster player IDs
      const teamResponse = await fetch(`/api/teams?teamId=${teamId}`)
      const teams = await teamResponse.json()
      const team = teams.find((t: any) => t.id === teamId)
      
      if (!team || !team.roster) {
        setRosterPlayers([])
        return
      }

      // Then get all players and filter by roster IDs
      const playersResponse = await fetch('/api/players')
      const allPlayers = await playersResponse.json()
      const roster = allPlayers.filter((p: Player) => team.roster.includes(p.id))
      
      setRosterPlayers(roster)
    } catch (error) {
      console.error('Error fetching roster:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromTeam = async (playerId: string) => {
    try {
      // In a real app, you would make an API call to remove the player
      setRosterPlayers(prev => prev.filter(p => p.id !== playerId))
    } catch (error) {
      console.error('Error removing player:', error)
    }
  }

  const getStartingLineup = () => {
    const lineup: { [position: string]: Player[] } = {
      QB: [],
      RB: [],
      WR: [],
      TE: [],
      K: [],
      DEF: []
    }

    rosterPlayers.forEach(player => {
      if (lineup[player.position]) {
        lineup[player.position].push(player)
      }
    })

    return lineup
  }

  const getBenchPlayers = () => {
    const startingLineup = getStartingLineup()
    const startersCount = {
      QB: 1,
      RB: 2,
      WR: 3,
      TE: 1,
      K: 1,
      DEF: 1
    }

    const benchPlayers: Player[] = []
    
    Object.entries(startingLineup).forEach(([position, players]) => {
      const maxStarters = startersCount[position as keyof typeof startersCount] || 0
      if (players.length > maxStarters) {
        benchPlayers.push(...players.slice(maxStarters))
      }
    })

    return benchPlayers
  }

  if (loading) {
    return <div className="text-center py-4">Loading roster...</div>
  }

  if (rosterPlayers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No players in your roster yet.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Players
        </button>
      </div>
    )
  }

  const startingLineup = getStartingLineup()
  const benchPlayers = getBenchPlayers()
  const totalPoints = rosterPlayers.reduce((sum, player) => sum + player.points, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('starters')}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === 'starters'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Starting Lineup ({Object.values(startingLineup).flat().length - benchPlayers.length})
          </button>
          <button
            onClick={() => setActiveTab('bench')}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === 'bench'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bench ({benchPlayers.length})
          </button>
        </div>
        <div className="text-lg font-semibold text-blue-600">
          Total Points: {totalPoints}
        </div>
      </div>

      {activeTab === 'starters' && (
        <div className="space-y-6">
          {Object.entries(startingLineup).map(([position, players]) => {
            const startersCount = {
              QB: 1, RB: 2, WR: 3, TE: 1, K: 1, DEF: 1
            }[position as keyof typeof startingLineup] || 0
            
            const starters = players.slice(0, startersCount)
            
            if (starters.length === 0 && startersCount > 0) {
              return (
                <div key={position} className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {position} ({startersCount} needed)
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No {position} assigned</p>
                    <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                      Add {position}
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div key={position} className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {position} ({starters.length}/{startersCount})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {starters.map(player => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      showActions={false}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'bench' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Bench Players</h3>
          {benchPlayers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benchPlayers.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No bench players</p>
          )}
        </div>
      )}
    </div>
  )
}
