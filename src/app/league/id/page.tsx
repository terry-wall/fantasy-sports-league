'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { League, Team } from '@/types'

export default function LeaguePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [league, setLeague] = useState<League | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    fetchLeagueData()
  }, [session, status, router, params.id])

  const fetchLeagueData = async () => {
    try {
      const [leagueRes, teamsRes] = await Promise.all([
        fetch(`/api/leagues/${params.id}`),
        fetch(`/api/teams?league_id=${params.id}`)
      ])
      
      const [leagueData, teamsData] = await Promise.all([
        leagueRes.json(),
        teamsRes.json()
      ])
      
      setLeague(leagueData)
      setTeams(teamsData)
    } catch (error) {
      console.error('Error fetching league data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session || !league) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">League not found</h1>
        <p className="text-gray-600 mt-2">The league you're looking for doesn't exist.</p>
      </div>
    )
  }

  const sortedTeams = teams.sort((a, b) => (b.points || 0) - (a.points || 0))

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{league.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {league.sport}
              </span>
              <span>Max Teams: {league.max_teams}</span>
              <span>Current Teams: {teams.length}</span>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Join League
          </button>
        </div>
        {league.description && (
          <p className="mt-4 text-gray-700">{league.description}</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Standings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTeams.map((team, index) => (
                <tr key={team.id} className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/team/${team.id}`)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{team.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.owner_name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {team.points || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.wins || 0}-{team.losses || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {teams.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-600">No teams in this league yet. Be the first to join!</p>
          </div>
        )}
      </div>
    </div>
  )
}