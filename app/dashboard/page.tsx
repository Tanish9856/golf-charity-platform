'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Trophy, Heart, Target, LogOut, Plus, Trash2, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [scores, setScores] = useState<any[]>([])
  const [charities, setCharities] = useState<any[]>([])
  const [newScore, setNewScore] = useState('')
  const [newDate, setNewDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [scoreError, setScoreError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUser(user)

    const { data: profileData } = await supabase
      .from('profiles').select('*, charities(name)').eq('id', user.id).single()
    setProfile(profileData)

    const { data: scoresData } = await supabase
      .from('scores').select('*').eq('user_id', user.id)
      .order('played_on', { ascending: false }).limit(5)
    setScores(scoresData || [])

    const { data: charitiesData } = await supabase
      .from('charities').select('*')
    setCharities(charitiesData || [])

    setLoading(false)
  }

  const addScore = async () => {
    setScoreError('')
    const scoreNum = parseInt(newScore)
    if (!newScore || isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setScoreError('Score must be between 1 and 45'); return
    }
    if (!newDate) { setScoreError('Please select a date'); return }

    // If already 5 scores, delete the oldest
    if (scores.length >= 5) {
      const oldest = scores[scores.length - 1]
      await supabase.from('scores').delete().eq('id', oldest.id)
    }

    await supabase.from('scores').insert({
      user_id: user.id,
      score: scoreNum,
      played_on: newDate
    })

    setNewScore('')
    setNewDate('')
    getUser()
  }

  const deleteScore = async (id: string) => {
    await supabase.from('scores').delete().eq('id', id)
    getUser()
  }

  const updateCharity = async (charityId: string, percentage: number) => {
    await supabase.from('profiles').update({
      charity_id: charityId,
      charity_percentage: percentage
    }).eq('id', user.id)
    getUser()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-white/50">Loading...</div>
    </div>
  )

  const tabs = ['overview', 'scores', 'charity', 'draws']

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Top Bar */}
      <div className="bg-black/50 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">⛳ GolfGives</span>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-sm">
            {profile?.full_name || user?.email}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            profile?.subscription_status === 'active'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {profile?.subscription_status === 'active' ? 'Active' : 'Inactive'}
          </span>
          <button onClick={handleLogout} className="text-white/40 hover:text-white">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Subscription Banner */}
        {profile?.subscription_status !== 'active' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 mb-8 flex items-center justify-between">
            <div>
              <p className="font-semibold text-yellow-300">No Active Subscription</p>
              <p className="text-white/50 text-sm">Subscribe to enter draws and compete for prizes.</p>
            </div>
            <button
              onClick={() => router.push('/subscribe')}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded-full text-sm transition"
            >
              Subscribe Now
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-green-500 text-black'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Trophy size={24} className="text-green-400 mb-3" />
              <p className="text-white/50 text-sm">Subscription</p>
              <p className="text-xl font-bold mt-1 capitalize">
                {profile?.subscription_status || 'Inactive'}
              </p>
              {profile?.subscription_plan && (
                <p className="text-white/40 text-sm mt-1 capitalize">{profile.subscription_plan} plan</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Target size={24} className="text-green-400 mb-3" />
              <p className="text-white/50 text-sm">Scores Entered</p>
              <p className="text-xl font-bold mt-1">{scores.length} / 5</p>
              <p className="text-white/40 text-sm mt-1">Latest: {scores[0]?.score || '—'} pts</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Heart size={24} className="text-green-400 mb-3" />
              <p className="text-white/50 text-sm">Charity</p>
              <p className="text-xl font-bold mt-1 truncate">
                {profile?.charities?.name || 'Not selected'}
              </p>
              <p className="text-white/40 text-sm mt-1">
                {profile?.charity_percentage || 10}% contribution
              </p>
            </div>
          </div>
        )}

        {/* SCORES TAB */}
        {activeTab === 'scores' && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Add New Score</h3>

              {scoreError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                  {scoreError}
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <input
                  type="number"
                  min="1" max="45"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="Score (1-45)"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-500 w-40"
                />
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={addScore}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition"
                >
                  <Plus size={18} /> Add Score
                </button>
              </div>
              <p className="text-white/30 text-xs mt-3">
                Only your latest 5 scores are kept. Adding a 6th removes the oldest automatically.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Your Scores</h3>
              {scores.length === 0 ? (
                <p className="text-white/40 text-sm">No scores yet. Add your first score above.</p>
              ) : (
                <div className="space-y-3">
                  {scores.map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-4">
                      <div className="flex items-center gap-4">
                        <span className="text-white/30 text-sm">#{i + 1}</span>
                        <div>
                          <p className="font-bold text-2xl text-green-400">{s.score}</p>
                          <p className="text-white/40 text-xs">Stableford points</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <Calendar size={14} />
                          {new Date(s.played_on).toLocaleDateString('en-GB')}
                        </div>
                        <button
                          onClick={() => deleteScore(s.id)}
                          className="text-white/20 hover:text-red-400 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHARITY TAB */}
        {activeTab === 'charity' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-2">Select Your Charity</h3>
            <p className="text-white/40 text-sm mb-6">
              Minimum 10% of your subscription goes to your chosen charity.
            </p>

            {charities.length === 0 ? (
              <p className="text-white/40 text-sm">No charities listed yet. Check back soon.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {charities.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => updateCharity(c.id, profile?.charity_percentage || 10)}
                    className={`cursor-pointer border rounded-2xl p-5 transition ${
                      profile?.charity_id === c.id
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{c.name}</p>
                      {profile?.charity_id === c.id && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Selected</span>
                      )}
                    </div>
                    <p className="text-white/40 text-sm">{c.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Contribution % */}
            <div className="mt-8">
              <h4 className="font-medium mb-3">Your Contribution Percentage</h4>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="10" max="100"
                  value={profile?.charity_percentage || 10}
                  onChange={(e) => updateCharity(profile?.charity_id, parseInt(e.target.value))}
                  className="flex-1 accent-green-500"
                />
                <span className="text-green-400 font-bold text-xl">
                  {profile?.charity_percentage || 10}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DRAWS TAB */}
        {activeTab === 'draws' && (
            <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-2">
                <h3 className="font-semibold mb-1">Your Draw Entries</h3>
                <p className="text-white/40 text-sm">
                    Your scores automatically enter you into each monthly draw.
                </p>
                </div>
                <DrawResults userId={user?.id} />
            </div>
            )}

      </div>
    </main>
  )
  function DrawResults({ userId }: { userId: string }) {
  const [draws, setDraws] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('draws')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => setDraws(data || []))
  }, [])

  if (draws.length === 0) return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
      <Trophy size={40} className="text-green-400 mx-auto mb-4" />
      <p className="text-white/60">No draws published yet.</p>
      <p className="text-white/30 text-sm mt-2">Check back after the next monthly draw.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {draws.map((d) => (
        <div key={d.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">{d.month}</p>
            <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Published</span>
          </div>
          <p className="text-white/40 text-xs mb-2">Winning Numbers:</p>
          <div className="flex gap-2">
            {d.winning_numbers.map((n: number, i: number) => (
              <span key={i} className="w-9 h-9 bg-green-500/20 text-green-400 text-sm font-bold rounded-full flex items-center justify-center">
                {n}
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-sm">
            <span className="text-white/40">🏆 Jackpot: <span className="text-white">£{parseFloat(d.jackpot_amount).toFixed(2)}</span></span>
          </div>
        </div>
      ))}
    </div>
  )
}
}