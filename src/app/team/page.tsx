'use client'
import { useState, useEffect } from 'react'
import { TeamRoster } from '@/components/TeamRoster'
import { Team } from '@/types'

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      setTeams(data)
      if (data.length > 0) {
        setSelectedTeam(data[0])
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading teams...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Team Management</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Team:
        </label>
        <select
          value={selectedTeam?.id || ''}
          onChange={(e) => {
            const team = teams.find(t => t.id.toString() === e.target.value)
            setSelectedTeam(team || null)
          }}
          className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeam && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{selectedTeam.name}</h2>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-lg font-semibold text-blue-600">
                Total Points: {selectedTeam.points || 0}
              </span>
            </div>
          </div>
          <TeamRoster teamId={selectedTeam.id.toString()} />
        </div>
      )}

      {teams.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No teams found. Create your first team!</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Team
          </button>
        </div>
      )}
    </div>
  )
}