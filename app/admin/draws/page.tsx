'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Play, Eye, Trophy, Loader2 } from 'lucide-react'

export default function AdminDraws() {
  const [draws, setDraws] = useState<any[]>([])
  const [subscribers, setSubscribers] = useState(0)
  const [simResult, setSimResult] = useState<number[] | null>(null)
  const [drawMode, setDrawMode] = useState<'random' | 'algorithmic'>('random')
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data: drawsData } = await supabase
      .from('draws').select('*').order('created_at', { ascending: false })
    setDraws(drawsData || [])

    const { count } = await supabase
      .from('profiles').select('id', { count: 'exact' }).eq('subscription_status', 'active')
    setSubscribers(count || 0)
  }

  const generateNumbers = async (mode: 'random' | 'algorithmic') => {
    if (mode === 'random') {
      const nums: number[] = []
      while (nums.length < 5) {
        const n = Math.floor(Math.random() * 45) + 1
        if (!nums.includes(n)) nums.push(n)
      }
      return nums.sort((a, b) => a - b)
    } else {
      const { data: scores } = await supabase.from('scores').select('score')
      if (!scores || scores.length === 0) {
        const nums: number[] = []
        while (nums.length < 5) {
          const n = Math.floor(Math.random() * 45) + 1
          if (!nums.includes(n)) nums.push(n)
        }
        return nums.sort((a, b) => a - b)
      }

      const freq: Record<number, number> = {}
      scores.forEach(({ score }) => { freq[score] = (freq[score] || 0) + 1 })
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([score]) => parseInt(score))
      const result = sorted.slice(0, 5)
      while (result.length < 5) {
        const n = Math.floor(Math.random() * 45) + 1
        if (!result.includes(n)) result.push(n)
      }
      return result.sort((a, b) => a - b)
    }
  }

  const runSimulation = async () => {
    setLoading(true)
    const nums = await generateNumbers(drawMode)
    setSimResult(nums)
    setLoading(false)
  }

  const publishDraw = async () => {
    if (!simResult) return
    setPublishing(true)

    const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    const prizePoolValue = subscribers * 9.99
    
    const { data: draw, error } = await supabase.from('draws').insert({
      month,
      winning_numbers: simResult,
      jackpot_amount: prizePoolValue * 0.40,
      pool_4match: prizePoolValue * 0.35,
      pool_3match: prizePoolValue * 0.25,
      status: 'published'
    }).select().single()

    if (error) {
      console.error(error)
      setPublishing(false)
      return
    }

    // Winner verification logic
    const { data: profiles } = await supabase.from('profiles').select('id').eq('subscription_status', 'active')
    if (profiles) {
      for (const profile of profiles) {
        const { data: userScores } = await supabase.from('scores').select('score').eq('user_id', profile.id)
        if (!userScores || userScores.length === 0) continue
        const userNums = userScores.map(s => s.score)
        const matches = userNums.filter(n => simResult.includes(n)).length

        if (matches >= 3) {
          let prize = 0
          if (matches === 5) prize = prizePoolValue * 0.40
          else if (matches === 4) prize = prizePoolValue * 0.35
          else if (matches === 3) prize = prizePoolValue * 0.25

          await supabase.from('winners').insert({
            draw_id: draw.id,
            user_id: profile.id,
            match_type: `${matches}-match`,
            prize_amount: prize,
            verification_status: 'pending'
          })
        }
      }
    }

    setSimResult(null)
    setPublishing(false)
    fetchData()
    alert('Draw published successfully!')
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-white">Draw Management</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/50 text-sm">Active Subscribers</p>
          <p className="text-3xl font-bold mt-1 text-white">{subscribers}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/50 text-sm">Est. Prize Pool</p>
          <p className="text-3xl font-bold mt-1 text-green-400">£{(subscribers * 9.99).toFixed(2)}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/50 text-sm">Draws Run</p>
          <p className="text-3xl font-bold mt-1 text-white">{draws.length}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold mb-6 text-white text-lg">Run New Draw</h2>
        <div className="flex gap-3 mb-6">
          <button onClick={() => setDrawMode('random')} className={`px-5 py-2 rounded-xl text-sm transition ${drawMode === 'random' ? 'bg-green-500 text-black font-bold' : 'bg-white/5 text-white/60'}`}>🎲 Random</button>
          <button onClick={() => setDrawMode('algorithmic')} className={`px-5 py-2 rounded-xl text-sm transition ${drawMode === 'algorithmic' ? 'bg-green-500 text-black font-bold' : 'bg-white/5 text-white/60'}`}>🧠 Algorithmic</button>
        </div>

        {!simResult ? (
          <button 
            disabled={loading}
            onClick={runSimulation}
            className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-green-400 transition flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
            Run Draw Simulation
          </button>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <p className="text-green-400 text-sm font-bold mb-4 uppercase tracking-wider">Simulation Result:</p>
            <div className="flex gap-3 mb-6">
              {simResult.map((n, i) => (
                <span key={i} className="w-12 h-12 bg-green-500 text-black font-black rounded-full flex items-center justify-center text-xl shadow-lg shadow-green-500/20">{n}</span>
              ))}
            </div>
            <button 
              disabled={publishing}
              onClick={publishDraw}
              className="bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-xl font-bold transition flex items-center gap-2"
            >
              {publishing ? <Loader2 className="animate-spin" size={20} /> : <Trophy size={20} />}
              Confirm & Publish Results
            </button>
          </div>
        )}
      </div>
    </main>
  )
}