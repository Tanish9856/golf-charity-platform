'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle } from 'lucide-react'

export default function AdminWinners() {
  const [winners, setWinners] = useState<any[]>([])

  useEffect(() => { fetchWinners() }, [])

  const fetchWinners = async () => {
    const { data } = await supabase
      .from('winners')
      .select('*, profiles(full_name, email), draws(month, winning_numbers)')
      .order('created_at', { ascending: false })
    setWinners(data || [])
  }

  const updateVerification = async (id: string, status: string) => {
    await supabase.from('winners').update({ verification_status: status }).eq('id', id)
    fetchWinners()
  }

  const updatePayout = async (id: string) => {
    await supabase.from('winners').update({ payout_status: 'paid' }).eq('id', id)
    fetchWinners()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Winners Management</h1>

      {winners.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white/40">No winners yet. Run a draw first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {winners.map((w) => (
            <div key={w.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="font-semibold">{w.profiles?.full_name || 'Unknown'}</p>
                  <p className="text-white/40 text-sm">{w.profiles?.email}</p>
                  <p className="text-white/40 text-sm mt-1">Draw: {w.draws?.month}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full capitalize">
                      {w.match_type}
                    </span>
                    <span className="text-green-400 font-bold">
                      £{parseFloat(w.prize_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  {/* Verification */}
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-xs">Verification:</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      w.verification_status === 'approved'
                        ? 'bg-green-500/20 text-green-400'
                        : w.verification_status === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {w.verification_status}
                    </span>
                  </div>

                  {w.verification_status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateVerification(w.id, 'approved')}
                        className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full hover:bg-green-500/40 transition"
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button
                        onClick={() => updateVerification(w.id, 'rejected')}
                        className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full hover:bg-red-500/40 transition"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  )}

                  {/* Payout */}
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-xs">Payout:</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      w.payout_status === 'paid'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {w.payout_status}
                    </span>
                  </div>

                  {w.verification_status === 'approved' && w.payout_status === 'pending' && (
                    <button
                      onClick={() => updatePayout(w.id)}
                      className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full hover:bg-blue-500/40 transition"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}