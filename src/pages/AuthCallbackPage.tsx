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

      <div className="panel" style={{ textAlign: 'center', padding: '2.5rem 3.5rem', minWidth: 420, maxWidth: 520 }}>
        {status === 'loading' && (
          <>
            <div className="spinner" style={{ width: 64, height: 64, borderWidth: 6 }} />
            <p style={{ color: '#fff', marginTop: '1.5rem', fontSize: '1.4rem', fontWeight: 700 }}>로그인 확인 중...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <p style={{ color: '#aaa', fontSize: '1.3rem', marginBottom: '0.6rem' }}>로그인 성공! 아래 코드를</p>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.6rem', marginBottom: '1.5rem' }}>게임 앱에 입력하세요</p>

            <div style={{
              background: '#1a1a1a',
              border: '2px solid var(--mint)',
              borderRadius: 12,
              padding: '1.2rem 2rem',
              marginBottom: '1.4rem',
            }}>
              <span style={{
                color: 'var(--mint)',
                fontSize: '2.8rem',
                fontWeight: 900,
                letterSpacing: 8,
                fontFamily: 'monospace',
              }}>
                {loginCode}
              </span>
            </div>

            <button
              className="btn btn-green"
              onClick={handleCopy}
              style={{ width: '100%', fontSize: '1.2rem', padding: '0.9rem' }}
            >
              {copied ? '✓ 복사됨!' : '복사하기'}
            </button>

            <p style={{ color: '#aaa', fontSize: '1.05rem', marginTop: '1.2rem' }}>
              코드는 일회용이에요. 게임에 입력하면 자동으로 로그인돼요.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <p style={{ color: '#ff6b6b', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              ⚠️ {errorMsg}
            </p>
            <button
              className="btn btn-green"
              style={{ width: '100%', fontSize: '1.1rem', padding: '0.85rem' }}
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
