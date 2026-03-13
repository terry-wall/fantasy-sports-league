'use client'

import { useState, useEffect } from 'react'
import LeagueCard from '@/components/LeagueCard'
import { League } from '@/types'

export default function Home() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeagues()
  }, [])

  const fetchLeagues = async () => {
    try {
      const response = await fetch('/api/leagues')
      const data = await response.json()
      setLeagues(data)
    } catch (error) {
      console.error('Error fetching leagues:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Fantasy Sports League
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your teams across Football, Basketball, Baseball, and Hockey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map((league) => (
          <LeagueCard key={league.id} league={league} />
        ))}
      </div>

      {leagues.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No leagues found
          </h3>
          <p className="text-gray-600">
            Create or join a league to get started!
          </p>
        </div>
      )}
    </div>
  )
}