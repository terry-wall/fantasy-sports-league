'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LeagueCard from '@/components/LeagueCard'
import StatsTable from '@/components/StatsTable'
import { League, Team, Player } from '@/types'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [leagues, setLeagues] = useState<League[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [topPlayers, setTopPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const [leaguesRes, teamsRes, playersRes] = await Promise.all([
        fetch('/api/leagues'),
        fetch('/api/teams'),
        fetch('/api/players?limit=10&sort=points')
      ])
      
      const [leaguesData, teamsData, playersData] = await Promise.all([
        leaguesRes.json(),
        teamsRes.json(),
        playersRes.json()
      ])
      
      setLeagues(leaguesData)
      setTeams(teamsData)
      setTopPlayers(playersData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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

  if (!session) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome back, {session.user?.name}!
        </h1>
        <p className="text-lg text-gray-600">
          Here's your fantasy sports dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Leagues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leagues.slice(0, 4).map((league) => (
                <LeagueCard key={league.id} league={league} />
              ))}
            </div>
            {leagues.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-600">No leagues found. Create or join one to get started!</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Teams
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {teams.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {teams.map((team) => (
                    <div key={team.id} className="p-4 hover:bg-gray-50 cursor-pointer"
                         onClick={() => router.push(`/team/${team.id}`)}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                          <p className="text-sm text-gray-600">{team.sport} • {team.league_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">{team.points || 0} pts</p>
                          <p className="text-sm text-gray-600">Rank: #{team.rank || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-600">No teams found. Join a league to create your team!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Top Performers
          </h2>
          <div className="bg-white rounded-lg shadow">
            <StatsTable players={topPlayers} />
          </div>
        </div>
      </div>
    </div>
  )
}
