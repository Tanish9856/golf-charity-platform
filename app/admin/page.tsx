'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Trophy, Heart, CheckSquare } from 'lucide-react'

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalCharities: 0,
    pendingWinners: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [users, active, charities, winners] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('subscription_status', 'active'),
      supabase.from('charities').select('id', { count: 'exact' }),
      supabase.from('winners').select('id', { count: 'exact' }).eq('verification_status', 'pending'),
    ])

    setStats({
      totalUsers: users.count || 0,
      activeSubscribers: active.count || 0,
      totalCharities: charities.count || 0,
      pendingWinners: winners.count || 0,
    })
  }

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={24} />, color: 'text-blue-400' },
    { label: 'Active Subscribers', value: stats.activeSubscribers, icon: <Trophy size={24} />, color: 'text-green-400' },
    { label: 'Charities Listed', value: stats.totalCharities, icon: <Heart size={24} />, color: 'text-pink-400' },
    { label: 'Pending Verifications', value: stats.pendingWinners, icon: <CheckSquare size={24} />, color: 'text-yellow-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className={`mb-3 ${card.color}`}>{card.icon}</div>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-white/50 text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}