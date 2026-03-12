'use client'

import { Player } from '@/types'
import PlayerCard from './PlayerCard'

interface TeamRosterProps {
  players?: Player[]
  teamId?: string
}

export function TeamRoster({ players = [], teamId }: TeamRosterProps) {
  if (players.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Players</h3>
        <p className="text-gray-500">This team doesn't have any players yet. Start building your roster!</p>
      </div>
    )
  }

  // Group players by position for better organization
  const playersByPosition = players.reduce((acc, player) => {
    const position = player.position || 'Unknown'
    if (!acc[position]) acc[position] = []
    acc[position].push(player)
    return acc
  }, {} as Record<string, Player[]>)

  const positionOrder = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF', 'PG', 'SG', 'SF', 'PF', 'C', 'LW', 'RW', 'D', 'G']
  const sortedPositions = Object.keys(playersByPosition).sort((a, b) => {
    const aIndex = positionOrder.indexOf(a)
    const bIndex = positionOrder.indexOf(b)
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{players.length}</div>
            <div className="text-sm text-gray-600">Total Players</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {players.reduce((sum, player) => sum + (player.points || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {players.length > 0 ? (players.reduce((sum, player) => sum + (player.points || 0), 0) / players.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-gray-600">Avg Points</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(playersByPosition).length}</div>
            <div className="text-sm text-gray-600">Positions</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sortedPositions.map((position) => (
          <div key={position}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              {position} ({playersByPosition[position].length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playersByPosition[position].map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamRoster