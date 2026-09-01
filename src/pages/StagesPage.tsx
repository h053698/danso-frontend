import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSentences, toggleLike, type SentencePack } from '../api'

export function StagesPage() {
  const navigate = useNavigate()
  const [packs, setPacks] = useState<SentencePack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getSentences()
      .then((data) => setPacks(data))
      .catch((err) => setError(err.message ?? '불러오기에 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleLike(id: number) {
    setPacks((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              is_liked: !p.is_liked,
              total_likes: p.total_likes + (p.is_liked ? -1 : 1),
            }
          : p,
      ),
    )
    try {
      await toggleLike(id)
    } catch {
      // revert on failure
      setPacks((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                is_liked: !p.is_liked,
                total_likes: p.total_likes + (p.is_liked ? -1 : 1),
              }
            : p,
        ),
      )
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="section-head">
          <h2>스테이지 찾기</h2>
        </div>
        <div className="card">
          {loading && <div className="loading">불러오는 중...</div>}
          {error && <div className="error-msg">{error}</div>}
          {!loading && !error && packs.length === 0 && (
            <div className="empty">아직 문장세트가 없어요.</div>
          )}
          <div className="pack-list">
            {packs.map((pack) => (
              <div className="pack-item" key={pack.id}>
                <div
                  className="pack-info"
                  onClick={() => navigate(`/play/${pack.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigate(`/play/${pack.id}`)
                  }}
                >
                  <div className="pack-name">
                    {pack.name}
                    {pack.level && <span className="pack-level">{pack.level}</span>}
                  </div>
                  <div className="pack-meta">
                    {pack.author}
                    {pack.original_author ? ` · 원작자 ${pack.original_author}` : ''}
                  </div>
                </div>
                <button
                  type="button"
                  className={`like-btn${pack.is_liked ? ' liked' : ''}`}
                  onClick={() => handleLike(pack.id)}
                >
                  {pack.is_liked ? '❤️' : '🤍'} {pack.total_likes}
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="button" className="back-link" onClick={() => navigate('/')}>
          ← 메인으로
        </button>
      </div>
    </div>
  )
}
