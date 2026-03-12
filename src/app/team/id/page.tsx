'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TeamRoster from '@/components/TeamRoster'
import { Team, Player } from '@/types'

export default function TeamPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [roster, setRoster] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    fetchTeamData()
  }, [session, status, router, params.id])

  const fetchTeamData = async () => {
    try {
      const [teamRes, playersRes] = await Promise.all([
        fetch(`/api/teams/${params.id}`),
        fetch(`/api/players?team_id=${params.id}`)
      ])
      
      if (teamRes.ok) {
        const teamData = await teamRes.json()
        setTeam(teamData)
      }
      
      if (playersRes.ok) {
        const playersData = await playersRes.json()
        setRoster(playersData)
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
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

  if (!session || !team) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Team not found</h1>
        <p className="text-gray-600 mt-2">The team you're looking for doesn't exist.</p>
      </div>
    )
  }

  const totalPoints = roster.reduce((sum, player) => sum + (player.points || 0), 0)

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {team.sport}
              </span>
              <span>League: {team.league_name}</span>
              <span>Owner: {team.owner_name}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{totalPoints} pts</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Record:</span>
                <span className="font-semibold">{team.wins || 0}-{team.losses || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rank:</span>
                <span className="font-semibold">#{team.rank || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Roster Size:</span>
                <span className="font-semibold">{roster.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Points:</span>
                <span className="font-semibold">
                  {roster.length > 0 ? (totalPoints / roster.length).toFixed(1) : '0.0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Team Roster</h2>
            </div>
            <TeamRoster players={roster} />
          </div>
        </div>
      </div>
    </div>
  )
}