'use client'

import { Player } from '@/types'

interface PlayerCardProps {
  player: Player
  onClick?: () => void
}

export default function PlayerCard({ player, onClick }: PlayerCardProps) {
  const getPositionColor = (position: string) => {
    const pos = position?.toLowerCase()
    switch (pos) {
      case 'qb':
      case 'pg':
      case 'c':
        return 'bg-purple-100 text-purple-800'
      case 'rb':
      case 'sg':
      case 'lw':
      case 'rw':
        return 'bg-blue-100 text-blue-800'
      case 'wr':
      case 'sf':
      case 'pf':
      case 'd':
        return 'bg-green-100 text-green-800'
      case 'te':
      case 'g':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
          <p className="text-sm text-gray-600">{player.team}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
          {player.position}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{player.points || 0}</div>
          <div className="text-gray-500">Points</div>
        </div>
        
        <div className="space-y-1">
          {player.sport?.toLowerCase() === 'basketball' && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Rebounds:</span>
                <span className="font-medium">{player.rebounds || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assists:</span>
                <span className="font-medium">{player.assists || 0}</span>
              </div>
            </>
          )}
          
          {player.sport?.toLowerCase() === 'hockey' && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Goals:</span>
                <span className="font-medium">{player.goals || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assists:</span>
                <span className="font-medium">{player.assists || 0}</span>
              </div>
            </>
          )}
          
          {(player.sport?.toLowerCase() === 'football' || player.sport?.toLowerCase() === 'baseball') && (
            <div className="flex justify-between">
              <span className="text-gray-600">Season:</span>
              <span className="font-medium">2024</span>
            </div>
          )}
        </div>
      </div>
      
      {onClick && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-blue-600 text-sm font-medium">View Details →</span>
        </div>
      )}
    </div>
  )
}
