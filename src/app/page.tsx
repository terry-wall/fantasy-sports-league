import Link from 'next/link'
import { LiveScores } from '@/components/LiveScores'
import { LeagueStandings } from '@/components/LeagueStandings'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Fantasy Sports League
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your team, track live scores, and compete with friends!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/team"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Team
          </Link>
          <Link
            href="/players"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Browse Players
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Live Scores</h2>
          <LiveScores />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">League Standings</h2>
          <LeagueStandings />
        </div>
      </div>
    </div>
  )
}
