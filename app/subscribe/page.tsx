'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function SubscribePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoading(plan)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const priceId = plan === 'monthly'
      ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID

    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId: user.id, email: user.email })
    })

    const { url } = await res.json()
    window.location.href = url
  }

  const features = [
    'Enter monthly prize draws',
    'Track up to 5 Stableford scores',
    'Support your chosen charity',
    'Win jackpots up to 40% of prize pool',
    'Full dashboard access',
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl">

        <div className="text-center mb-12">
          <Link href="/" className="text-2xl font-bold">⛳ GolfGives</Link>
          <h1 className="text-4xl font-bold mt-6 mb-3">Choose Your Plan</h1>
          <p className="text-white/50">Cancel anytime. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Monthly */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/30 transition">
            <p className="text-white/50 text-sm font-medium mb-2">MONTHLY</p>
            <p className="text-5xl font-bold mb-1">£9.99</p>
            <p className="text-white/40 text-sm mb-8">per month</p>

            <ul className="space-y-3 mb-8">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                  <Check size={16} className="text-green-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={loading !== null}
              className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {loading === 'monthly' ? 'Redirecting...' : <> Get Monthly <ChevronRight size={18} /> </>}
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-green-500/10 border border-green-500/40 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black text-xs font-bold px-4 py-1 rounded-full">
              BEST VALUE — SAVE 17%
            </div>
            <p className="text-green-400 text-sm font-medium mb-2">YEARLY</p>
            <p className="text-5xl font-bold mb-1">£99.99</p>
            <p className="text-white/40 text-sm mb-8">per year · ~£8.33/mo</p>

            <ul className="space-y-3 mb-8">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                  <Check size={16} className="text-green-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={loading !== null}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {loading === 'yearly' ? 'Redirecting...' : <> Get Yearly <ChevronRight size={18} /> </>}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}