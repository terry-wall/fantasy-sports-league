'use client'

import Link from 'next/link'
import { League } from '@/types'

interface LeagueCardProps {
  league: League
}

export default function LeagueCard({ league }: LeagueCardProps) {
  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'football':
        return '🏈'
      case 'basketball':
        return '🏀'
      case 'baseball':
        return '⚾'
      case 'hockey':
        return '🏒'
      default:
        return '🏆'
    }
  }

  const getSportColor = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'football':
        return 'bg-orange-100 text-orange-800'
      case 'basketball':
        return 'bg-purple-100 text-purple-800'
      case 'baseball':
        return 'bg-green-100 text-green-800'
      case 'hockey':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Link href={`/league/${league.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getSportIcon(league.sport)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{league.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getSportColor(league.sport)}`}>
                {league.sport}
              </span>
            </div>
          </div>
        </div>
        
        {league.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {league.description}
          </p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            {league.team_count || 0} / {league.max_teams} teams
          </span>
          <span className="text-blue-600 hover:text-blue-800 font-medium">
            View League →
          </span>
        </div>
        
        <div className="mt-3 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(((league.team_count || 0) / league.max_teams) * 100, 100)}%` 
            }}
          ></div>
        </div>
      </div>
    </Link>
  )
}
