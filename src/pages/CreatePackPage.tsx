import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, createPack } from '../api'

const LEVELS = ['A', 'B', 'C', 'D', 'E']

export function CreatePackPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [sentencesText, setSentencesText] = useState('')
  const [level, setLevel] = useState('A')
  const [originalAuthor, setOriginalAuthor] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const sentences = sentencesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (!name.trim()) {
      setError('세트 이름을 입력해주세요.')
      return
    }
    if (sentences.length === 0) {
      setError('문장을 한 줄 이상 입력해주세요.')
      return
    }

    setSubmitting(true)
    try {
      await createPack({
        name: name.trim(),
        sentences,
        level,
        original_author: originalAuthor.trim(),
      })
      navigate('/')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '생성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="section-head">
          <h2>문장세트 추가</h2>
        </div>
        <div className="card">
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">세트 이름</label>
              <input
                id="name"
                className="input input-light"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 아리랑 명문장"
              />
            </div>
            <div className="field">
              <label htmlFor="sentences">문장 (한 줄에 하나씩)</label>
              <textarea
                id="sentences"
                value={sentencesText}
                onChange={(e) => setSentencesText(e.target.value)}
                placeholder={'안녕하세요\n반갑습니다'}
              />
            </div>
            <div className="field">
              <label htmlFor="level">난이도</label>
              <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map((lv) => (
                  <option key={lv} value={lv}>
                    {lv}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="author">원작자</label>
              <input
                id="author"
                className="input input-light"
                value={originalAuthor}
                onChange={(e) => setOriginalAuthor(e.target.value)}
                placeholder="원작자 (선택)"
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn btn-mint" disabled={submitting}>
              {submitting ? '저장 중...' : '만들기'}
            </button>
          </form>
        </div>
        <button type="button" className="back-link" onClick={() => navigate('/')}>
          ← 메인으로
        </button>
      </div>
    </div>
  )
}
