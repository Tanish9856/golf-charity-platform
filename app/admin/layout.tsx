'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Users, Trophy, Heart, CheckSquare, BarChart2, LogOut } from 'lucide-react'

const ADMIN_EMAIL = 'admin@golfgives.com'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== ADMIN_EMAIL) {
      router.push('/admin/login')
      return
    }
    setChecking(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (checking) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-white/40">Checking access...</p>
    </div>
  )

  const navItems = [
    { href: '/admin', icon: <BarChart2 size={18} />, label: 'Overview' },
    { href: '/admin/users', icon: <Users size={18} />, label: 'Users' },
    { href: '/admin/draws', icon: <Trophy size={18} />, label: 'Draws' },
    { href: '/admin/charities', icon: <Heart size={18} />, label: 'Charities' },
    { href: '/admin/winners', icon: <CheckSquare size={18} />, label: 'Winners' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-56 bg-black/50 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <p className="font-bold text-lg">⛳ GolfGives</p>
          <p className="text-white/40 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition text-sm w-full"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}