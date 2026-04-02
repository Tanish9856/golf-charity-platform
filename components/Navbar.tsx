'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          ⛳ GolfGives
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link href="#how-it-works" className="hover:text-white transition">How It Works</Link>
          <Link href="#charities" className="hover:text-white transition">Charities</Link>
          <Link href="#prizes" className="hover:text-white transition">Prizes</Link>
          <Link href="/login" className="hover:text-white transition">Login</Link>
          <Link href="/signup" className="bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2 rounded-full transition">
            Subscribe
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-white/80 text-sm">
          <Link href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href="#charities" onClick={() => setMenuOpen(false)}>Charities</Link>
          <Link href="#prizes" onClick={() => setMenuOpen(false)}>Prizes</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link href="/signup" className="bg-green-500 text-black font-semibold px-5 py-2 rounded-full text-center">
            Subscribe
          </Link>
        </div>
      )}
    </nav>
  )
}