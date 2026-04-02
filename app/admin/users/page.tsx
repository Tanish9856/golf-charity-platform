'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, charities(name)')
      .order('created_at', { ascending: false })
    setUsers(data || [])
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('profiles').update({ subscription_status: status }).eq('id', id)
    fetchUsers()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">User Management</h1>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr className="text-white/40 text-left">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Charity</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition">
                <td className="px-6 py-4 font-medium">{u.full_name || '—'}</td>
                <td className="px-6 py-4 text-white/60">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    u.subscription_status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {u.subscription_status || 'inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/60 capitalize">{u.subscription_plan || '—'}</td>
                <td className="px-6 py-4 text-white/60">{u.charities?.name || '—'}</td>
                <td className="px-6 py-4">
                  {u.subscription_status !== 'active' ? (
                    <button
                      onClick={() => updateStatus(u.id, 'active')}
                      className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full hover:bg-green-500/40 transition"
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(u.id, 'inactive')}
                      className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full hover:bg-red-500/40 transition"
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-white/40 text-sm text-center py-12">No users yet.</p>
        )}
      </div>
    </div>
  )
}