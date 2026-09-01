import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getMe, setLoginCode } from '../api'

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const loginCode = searchParams.get('login_code')
    if (!loginCode) {
      setStatus('error')
      setErrorMsg('로그인 코드가 없습니다.')
      return
    }

    // 코드 저장 후 /user/me 검증
    setLoginCode(loginCode)
    getMe()
      .then(() => {
        navigate('/', { replace: true })
      })
      .catch(() => {
        setStatus('error')
        setErrorMsg('유효하지 않은 로그인 코드입니다.')
      })
  }, [searchParams, navigate])

  return (
    <div className="page-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="panel" style={{ textAlign: 'center', padding: '2.5rem 3rem', minWidth: 280 }}>
        {status === 'loading' ? (
          <>
            <div className="spinner" />
            <p style={{ color: '#fff', marginTop: '1.2rem', fontSize: '1.1rem', fontWeight: 700 }}>
              로그인 중...
            </p>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              잠시만 기다려 주세요
            </p>
          </>
        ) : (
          <>
            <p style={{ color: '#ff6b6b', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              ⚠️ {errorMsg}
            </p>
            <button className="btn btn-green" onClick={() => navigate('/login', { replace: true })}>
              다시 로그인
            </button>
          </>
        )}
      </div>
    </div>
  )
}
