import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CatMascot } from '../CatMascot'
import { ApiError, getMe, OAUTH_URL, setLoginCode } from '../api'

export function LoginPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleGoogleLogin() {
    window.location.href = OAUTH_URL
  }

  async function handleCodeSubmit() {
    const trimmed = code.trim()
    if (!trimmed) {
      setError('로그인 코드를 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')
    setLoginCode(trimmed)
    try {
      await getMe()
      navigate('/')
    } catch (err) {
      localStorage.removeItem('danso_login_code')
      const msg = err instanceof ApiError ? err.message : '로그인에 실패했습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="brand">
        <div className="brand-title yellow">단소</div>
        <div className="brand-sub">아리랑 타자 파티</div>
      </div>
      <div className="layout">
        <div className="mascot">
          <CatMascot />
        </div>
        <div className="panel">
          <button type="button" className="btn btn-mint" onClick={handleGoogleLogin}>
            구글 로그인하기
          </button>
          <div className="code-label">로그인이 안되나요? 로그인 코드 입력</div>
          <div className="code-row">
            <input
              className="input"
              placeholder="로그인 코드"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCodeSubmit()
              }}
            />
            <button
              type="button"
              className="btn btn-mint"
              onClick={handleCodeSubmit}
              disabled={loading}
            >
              확인
            </button>
          </div>
          {error && <div className="error-msg">{error}</div>}
        </div>
      </div>
    </div>
  )
}
