'use client'
import { useState, useEffect } from 'react'

interface Game {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  quarter: number
  timeRemaining: string
  status: string
  week: number
  season: number
}

export function LiveScores() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'live' | 'final'>('all')

  useEffect(() => {
    fetchLiveScores()
    // Set up polling for live updates
    const interval = setInterval(fetchLiveScores, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchLiveScores = async () => {
    try {
      const response = await fetch('/api/live-scores')
      const data = await response.json()
      setGames(data)
    } catch (error) {
      console.error('Error fetching live scores:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGames = games.filter(game => {
    if (filter === 'live') return game.status === 'In Progress'
    if (filter === 'final') return game.status === 'Final'
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'text-green-600 bg-green-100'
      case 'Final': return 'text-gray-600 bg-gray-100'
      case 'Upcoming': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-20 rounded"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('live')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filter === 'live'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Live
        </button>
        <button
          onClick={() => setFilter('final')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filter === 'final'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Final
        </button>
      </div>

      <div className="space-y-3">
        {filteredGames.map((game) => (
          <div key={game.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                {game.status === 'In Progress' ? `Q${game.quarter} ${game.timeRemaining}` : game.status}
              </span>
              <span className="text-xs text-gray-500">Week {game.week}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{game.awayTeam}</span>
                <span className="text-lg font-bold">{game.awayScore}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{game.homeTeam}</span>
                <span className="text-lg font-bold">{game.homeScore}</span>
              </div>
            </div>
            
            {game.status === 'In Progress' && (
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-gray-600">Live</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {filter === 'all' ? 'No games available' : `No ${filter} games`}
          </p>
        </div>
      )}
    </div>
  )
}
