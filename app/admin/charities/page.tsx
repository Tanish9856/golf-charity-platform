'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2 } from 'lucide-react'

export default function AdminCharities() {
  const [charities, setCharities] = useState<any[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [featured, setFeatured] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchCharities() }, [])

  const fetchCharities = async () => {
    const { data } = await supabase.from('charities').select('*').order('created_at', { ascending: false })
    setCharities(data || [])
  }

  const addCharity = async () => {
    if (!name || !description) return
    setLoading(true)
    await supabase.from('charities').insert({ name, description, is_featured: featured })
    setName(''); setDescription(''); setFeatured(false)
    setLoading(false)
    fetchCharities()
  }

  const deleteCharity = async (id: string) => {
    await supabase.from('charities').delete().eq('id', id)
    fetchCharities()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Charity Management</h1>

      {/* Add Charity */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold mb-4">Add New Charity</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Charity name"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-500"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-green-500"
            />
            Featured charity
          </label>
          <button
            onClick={addCharity}
            disabled={loading}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded-xl flex items-center gap-2 text-sm transition"
          >
            <Plus size={16} /> Add Charity
          </button>
        </div>
      </div>

      {/* Charity List */}
      <div className="space-y-3">
        {charities.map((c) => (
          <div key={c.id} className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-medium">{c.name}</p>
                {c.is_featured && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Featured</span>
                )}
              </div>
              <p className="text-white/40 text-sm mt-1">{c.description}</p>
            </div>
            <button
              onClick={() => deleteCharity(c.id)}
              className="text-white/20 hover:text-red-400 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}