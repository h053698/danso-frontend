import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getMe, setLoginCode } from '../api'
import { CatMascot } from '../CatMascot'

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [loginCode, setCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const code = searchParams.get('login_code')
    if (!code) {
      setStatus('error')
      setErrorMsg('로그인 코드가 없습니다.')
      return
    }

    setLoginCode(code)
    getMe()
      .then(() => {
        setCode(code)
        setStatus('success')
      })
      .catch(() => {
        setStatus('error')
        setErrorMsg('유효하지 않은 로그인 코드입니다.')
      })
  }, [searchParams])

  const handleCopy = () => {
    navigator.clipboard.writeText(loginCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="page-bg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
        <span className="brand-title" style={{ color: 'var(--yellow)', fontSize: 56 }}>단소</span>
        <span style={{ color: '#2d2d2d', fontWeight: 700, fontSize: '1rem', letterSpacing: 2 }}>아리랑 타자 파티</span>
      </div>

      <CatMascot />

      <div className="panel" style={{ textAlign: 'center', padding: '2rem 2.5rem', minWidth: 300, maxWidth: 380 }}>
        {status === 'loading' && (
          <>
            <div className="spinner" />
            <p style={{ color: '#fff', marginTop: '1.2rem', fontSize: '1rem', fontWeight: 700 }}>로그인 확인 중...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>로그인 성공! 아래 코드를</p>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.2rem' }}>게임 앱에 입력하세요</p>

            <div style={{
              background: '#1a1a1a',
              border: '2px solid var(--mint)',
              borderRadius: 12,
              padding: '1rem 1.5rem',
              marginBottom: '1.2rem',
            }}>
              <span style={{
                color: 'var(--mint)',
                fontSize: '2rem',
                fontWeight: 900,
                letterSpacing: 6,
                fontFamily: 'monospace',
              }}>
                {loginCode}
              </span>
            </div>

            <button
              className="btn btn-green"
              onClick={handleCopy}
              style={{ width: '100%', fontSize: '1rem', padding: '0.75rem' }}
            >
              {copied ? '✓ 복사됨!' : '복사하기'}
            </button>

            <p style={{ color: '#666', fontSize: '0.78rem', marginTop: '1rem' }}>
              코드는 일회용이에요. 게임에 입력하면 자동으로 로그인돼요.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <p style={{ color: '#ff6b6b', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              ⚠️ {errorMsg}
            </p>
            <button
              className="btn btn-green"
              style={{ width: '100%' }}
              onClick={() => window.location.href = '/login'}
            >
              다시 로그인
            </button>
          </>
        )}
      </div>
    </div>
  )
}
