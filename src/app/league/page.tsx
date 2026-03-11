'use client'
import { useState, useEffect } from 'react'
import { LeagueStandings } from '@/components/LeagueStandings'
import { League } from '@/types'

export default function LeaguePage() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeagues()
  }, [])

  const fetchLeagues = async () => {
    try {
      const response = await fetch('/api/leagues')
      const data = await response.json()
      setLeagues(data)
      if (data.length > 0) {
        setSelectedLeague(data[0])
      }
    } catch (error) {
      console.error('Error fetching leagues:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading leagues...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">League Dashboard</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select League:
        </label>
        <select
          value={selectedLeague?.id || ''}
          onChange={(e) => {
            const league = leagues.find(l => l.id === e.target.value)
            setSelectedLeague(league || null)
          }}
          className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a league</option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
      </div>

      {selectedLeague && (
        <div className="grid md:grid-cols-1 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">{selectedLeague.name}</h2>
              <p className="text-gray-600">{selectedLeague.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Season: {selectedLeague.season} | Sport: {selectedLeague.sport}
              </div>
            </div>
            <LeagueStandings leagueId={selectedLeague.id} />
          </div>
        </div>
      )}

      {leagues.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No leagues found. Create your first league!</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create League
          </button>
        </div>
      )}
    </div>
  )
}
