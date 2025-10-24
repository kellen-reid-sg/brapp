'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabaseClient'
import Navigation from '@/components/Navigation'
import VoteButtons from '@/components/VoteButtons'
import CommentList from '@/components/CommentList'

export default function DrillDetailPage() {
  const params = useParams()
  const [drill, setDrill] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDrill()
    fetchComments()
  }, [params.id])

  async function fetchDrill() {
    const { data, error } = await supabase
      .from('drills')
      .select(`
        *,
        drill_stats!inner(score, comment_count)
      `)
      .eq('id', params.id)
      .single()

    if (!error && data) {
      setDrill(data)
    }
    setLoading(false)
  }

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles(display_name, avatar_url)
      `)
      .eq('content_kind', 'drill')
      .eq('content_id', params.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setComments(data)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!drill) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Drill not found</h2>
          <Link href="/drills" className="text-green-500 hover:underline">
            Back to drills
          </Link>
        </div>
      </div>
    )
  }

  const score = drill.drill_stats?.score || 0
  const commentCount = drill.drill_stats?.comment_count || 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <Navigation />

      <main className="max-w-7xl mx-auto px-8 py-8">
        <Link href="/drills" className="text-green-500 hover:underline mb-6 inline-block">
          ← Back to drills
        </Link>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          <div className="flex">
            <VoteButtons score={score} />
            
            <div className="flex-1">
              <h1 style={{
                fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                fontSize: '2.5rem',
                fontWeight: '900',
                fontStyle: 'italic',
                color: 'white',
                textTransform: 'uppercase',
                marginBottom: '24px'
              }}>
                {drill.title}
              </h1>

              {drill.description && (
                <p className="text-gray-300 text-lg mb-6 whitespace-pre-wrap">
                  {drill.description}
                </p>
              )}

              {drill.skill_tags && drill.skill_tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {drill.skill_tags.map((tag, i) => (
                    <span key={i} style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(22,163,74,0.2)',
                      color: '#22C55E',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {drill.media_url && (
                <div className="mb-6">
                  <img 
                    src={drill.media_url} 
                    alt={drill.title}
                    style={{ borderRadius: '12px', maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              )}

              <div style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                borderTop: '1px solid rgba(255,255,255,0.10)',
                paddingTop: '16px',
                marginTop: '16px'
              }}>
                Posted {new Date(drill.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '12px',
          padding: '32px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            fontStyle: 'italic',
            color: 'white',
            marginBottom: '24px'
          }}>
            Comments ({commentCount})
          </h2>
          <CommentList comments={comments} />
        </div>
      </main>
    </div>
  )
}
