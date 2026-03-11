'use client'
import { useState, useEffect } from 'react'
import { Team } from '@/types'

interface LeagueStandingsProps {
  leagueId?: string
}

export function LeagueStandings({ leagueId }: LeagueStandingsProps) {
  const [standings, setStandings] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStandings()
  }, [leagueId])

  const fetchStandings = async () => {
    try {
      const url = leagueId ? `/api/teams?leagueId=${leagueId}` : '/api/teams'
      const response = await fetch(url)
      const teams = await response.json()
      
      // Sort teams by wins (descending), then by total points (descending)
      const sortedTeams = teams.sort((a: Team, b: Team) => {
        if (b.wins !== a.wins) {
          return b.wins - a.wins
        }
        return b.totalPoints - a.totalPoints
      })
      
      // Update ranks based on sorted order
      const rankedTeams = sortedTeams.map((team: Team, index: number) => ({
        ...team,
        rank: index + 1
      }))
      
      setStandings(rankedTeams)
    } catch (error) {
      console.error('Error fetching standings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-100'
    if (rank === 2) return 'text-gray-600 bg-gray-100'
    if (rank === 3) return 'text-orange-600 bg-orange-100'
    if (rank <= 6) return 'text-green-600 bg-green-100' // Playoff teams
    return 'text-red-600 bg-red-100'
  }

  const getWinPercentage = (wins: number, losses: number, ties: number = 0) => {
    const totalGames = wins + losses + ties
    if (totalGames === 0) return 0
    return ((wins + ties * 0.5) / totalGames * 100).toFixed(1)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
        ))}
      </div>
    )
  }

  if (standings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No teams in standings yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {standings.map((team) => (
        <div
          key={team.id}
          className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(team.rank)}`}>
                {team.rank}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{team.name}</h3>
                <p className="text-sm text-gray-600">{team.ownerName}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-sm font-semibold">{team.wins}-{team.losses}</div>
                  <div className="text-xs text-gray-500">{getWinPercentage(team.wins, team.losses)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{team.totalPoints}</div>
                  <div className="text-xs text-gray-500">Points</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Playoff indicator */}
          {team.rank <= 6 && (
            <div className="mt-2 flex justify-end">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                {team.rank <= 2 ? 'Playoff Bye' : 'Playoff Bound'}
              </span>
            </div>
          )}
        </div>
      ))}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Playoff Teams (Top 6)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 rounded"></div>
            <span>1st Place</span>
          </div>
        </div>
      </div>
    </div>
  )
}
