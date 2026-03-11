'use client'
import { Player } from '@/types'
import { useState } from 'react'

interface PlayerCardProps {
  player: Player
  onAddToTeam?: (playerId: string) => void
  showActions?: boolean
}

export function PlayerCard({ player, onAddToTeam, showActions = true }: PlayerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getInjuryStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'text-green-600'
      case 'questionable': return 'text-yellow-600'
      case 'doubtful': return 'text-orange-600'
      case 'out': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-red-100 text-red-800'
      case 'RB': return 'bg-green-100 text-green-800'
      case 'WR': return 'bg-blue-100 text-blue-800'
      case 'TE': return 'bg-yellow-100 text-yellow-800'
      case 'K': return 'bg-purple-100 text-purple-800'
      case 'DEF': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{player.name}</h3>
          <p className="text-sm text-gray-600">{player.team}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
          {player.position}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Points:</span>
          <span className="font-semibold">{player.points}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Projected:</span>
          <span className="font-semibold">{player.projectedPoints}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="font-semibold">${player.price?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span className={`font-semibold ${getInjuryStatusColor(player.injuryStatus)}`}>
            {player.injuryStatus}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? 'Hide Stats' : 'View Stats'}
        </button>
        
        {isExpanded && player.stats && (
          <div className="mt-3 p-3 bg-gray-50 rounded text-xs space-y-1">
            {Object.entries(player.stats).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2">
          {player.isAvailable ? (
            <button
              onClick={() => onAddToTeam?.(player.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
            >
              Add to Team
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 text-sm font-medium py-2 px-3 rounded cursor-not-allowed"
            >
              Unavailable
            </button>
          )}
          <button className="px-3 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded transition-colors">
            Details
          </button>
        </div>
      )}
    </div>
  )
}
