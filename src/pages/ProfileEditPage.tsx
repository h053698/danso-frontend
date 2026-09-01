import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, getMe, updateNickname } from '../api'

export function ProfileEditPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [current, setCurrent] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getMe()
      .then((user) => {
        setCurrent(user.nickname)
        setNickname(user.nickname)
      })
      .catch((err) => setError(err.message ?? '정보를 불러오지 못했습니다.'))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')
    const trimmed = nickname.trim()
    if (!trimmed) {
      setError('이름을 입력해주세요.')
      return
    }
    setSubmitting(true)
    try {
      await updateNickname(trimmed)
      setInfo('이름이 변경되었습니다.')
      setCurrent(trimmed)
      setTimeout(() => navigate('/'), 800)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('이름 변경 기능이 아직 준비 중입니다. 잠시 후 다시 시도해주세요.')
      } else {
        setError(err instanceof ApiError ? err.message : '변경에 실패했습니다.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="section-head">
          <h2>이름 변경</h2>
        </div>
        <div className="card">
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="nickname">현재 이름: {current || '...'}</label>
              <input
                id="nickname"
                className="input input-light"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="새 이름"
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            {info && <div className="info-msg">{info}</div>}
            <button type="submit" className="btn btn-mint" disabled={submitting}>
              {submitting ? '변경 중...' : '변경하기'}
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
