'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import dynamic from 'next/dynamic'

const Trophy = dynamic(() => import('lucide-react').then((mod) => mod.Trophy), { ssr: false })
const Heart = dynamic(() => import('lucide-react').then((mod) => mod.Heart), { ssr: false })
const Target = dynamic(() => import('lucide-react').then((mod) => mod.Target), { ssr: false })
const ChevronRight = dynamic(() => import('lucide-react').then((mod) => mod.ChevronRight), { ssr: false })
const Star = dynamic(() => import('lucide-react').then((mod) => mod.Star), { ssr: false })

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-24">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white/70 mb-8">
            <Star size={14} className="text-green-400" />
            Golf with purpose. Every score matters.
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Play Golf.{' '}
            <span className="text-green-400">Win Prizes.</span>
            <br />
            Change Lives.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Subscribe, enter your Stableford scores, compete in monthly draws,
            and automatically donate to a charity you love — all in one platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-full text-lg transition-all"
            >
              Start Subscribing <ChevronRight size={20} />
            </Link>
            <Link
              href="#how-it-works"
              className="text-white/60 hover:text-white underline underline-offset-4 transition"
            >
              See how it works
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
            <div>
              <p className="text-3xl font-bold text-green-400">£40K+</p>
              <p className="text-white/50 text-sm mt-1">Prize Pool</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">12+</p>
              <p className="text-white/50 text-sm mt-1">Charities</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">500+</p>
              <p className="text-white/50 text-sm mt-1">Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-white/50 text-lg">Three simple steps to play, win, and give.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Target size={32} className="text-green-400" />,
              step: '01',
              title: 'Subscribe & Enter Scores',
              desc: 'Choose a monthly or yearly plan. Enter your last 5 Stableford scores to participate in monthly draws.',
            },
            {
              icon: <Trophy size={32} className="text-green-400" />,
              step: '02',
              title: 'Compete in Monthly Draws',
              desc: 'Your scores enter you into our draw engine. Match 3, 4, or all 5 numbers to win prize pool tiers.',
            },
            {
              icon: <Heart size={32} className="text-green-400" />,
              step: '03',
              title: 'Support a Charity',
              desc: 'At least 10% of your subscription goes to a charity you choose. You can give more anytime.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-green-500/40 transition-all"
            >
              <div className="mb-4">{item.icon}</div>
              <p className="text-green-400 text-sm font-mono mb-2">{item.step}</p>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-white/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRIZES SECTION */}
      <section id="prizes" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Prize Pool Breakdown</h2>
          <p className="text-white/50 text-lg mb-12">Every subscriber contributes. Every month, winners are paid out.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { match: '5-Number Match', share: '40%', label: 'Jackpot', rollover: true, color: 'text-yellow-400 border-yellow-400/30' },
              { match: '4-Number Match', share: '35%', label: 'Major Prize', rollover: false, color: 'text-green-400 border-green-400/30' },
              { match: '3-Number Match', share: '25%', label: 'Entry Prize', rollover: false, color: 'text-blue-400 border-blue-400/30' },
            ].map((tier, i) => (
              <div key={i} className={`bg-white/5 border rounded-2xl p-8 ${tier.color}`}>
                <p className="text-4xl font-bold mb-2">{tier.share}</p>
                <p className="text-white font-semibold text-lg mb-1">{tier.match}</p>
                <p className="text-white/40 text-sm mb-4">{tier.label}</p>
                {tier.rollover && (
                  <span className="text-xs bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full">
                    Jackpot Rolls Over
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHARITY SECTION */}
      <section id="charities" className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Give While You Play</h2>
        <p className="text-white/50 text-lg mb-8">
          Choose a charity at signup. A minimum of 10% of your subscription goes directly to them —
          and you can always give more.
        </p>
        <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-10">
          <Heart size={48} className="text-green-400 mx-auto mb-4" />
          <p className="text-2xl font-semibold mb-2">You choose who benefits.</p>
          <p className="text-white/50">
            From cancer research to local golf foundations — browse our full charity directory after signing up.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to make your <span className="text-green-400">game mean more?</span>
          </h2>
          <p className="text-white/50 text-lg mb-10">
            Join hundreds of golfers already competing, winning, and giving back every month.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-10 py-5 rounded-full text-xl transition-all"
          >
            Get Started Today <ChevronRight size={22} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        © 2026 GolfGives. Built for Digital Heroes Selection Process.
      </footer>
    </main>
  )
}