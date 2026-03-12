'use client'

import { Player } from '@/types'

interface StatsTableProps {
  players: Player[]
}

export default function StatsTable({ players }: StatsTableProps) {
  if (players.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No player data available
      </div>
    )
  }

  const getStatColumns = (sport: string) => {
    switch (sport?.toLowerCase()) {
      case 'basketball':
        return [
          { key: 'points', label: 'PTS' },
          { key: 'rebounds', label: 'REB' },
          { key: 'assists', label: 'AST' }
        ]
      case 'hockey':
        return [
          { key: 'points', label: 'PTS' },
          { key: 'goals', label: 'G' },
          { key: 'assists', label: 'A' }
        ]
      case 'football':
        return [
          { key: 'points', label: 'PTS' },
          { key: 'yards', label: 'YDS' },
          { key: 'touchdowns', label: 'TD' }
        ]
      case 'baseball':
        return [
          { key: 'points', label: 'PTS' },
          { key: 'avg', label: 'AVG' },
          { key: 'rbi', label: 'RBI' }
        ]
      default:
        return [{ key: 'points', label: 'PTS' }]
    }
  }

  // Group players by sport for better display
  const playersBySport = players.reduce((acc, player) => {
    const sport = player.sport || 'unknown'
    if (!acc[sport]) acc[sport] = []
    acc[sport].push(player)
    return acc
  }, {} as Record<string, Player[]>)

  return (
    <div className="space-y-6">
      {Object.entries(playersBySport).map(([sport, sportPlayers]) => {
        const statColumns = getStatColumns(sport)
        
        return (
          <div key={sport} className="overflow-hidden">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                {sport} Players
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    {statColumns.map((col) => (
                      <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sportPlayers.map((player, index) => (
                    <tr key={player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{player.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{player.team}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {player.position}
                        </span>
                      </td>
                      {statColumns.map((col) => (
                        <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(player as any)[col.key] || 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
