import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CatMascot } from '../CatMascot'
import { clearLoginCode, getLoginCode, getMe } from '../api'

export function MainMenuPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    getMe()
      .then((user) => setNickname(user.nickname))
      .catch(() => {
        clearLoginCode()
        navigate('/login')
      })
  }, [navigate])

  function handleLogout() {
    clearLoginCode()
    navigate('/login')
  }

  const loginCode = getLoginCode()

  return (
    <div className="page">
      <div className="topbar">
        <span className="nickname">{nickname ? `${nickname}님 환영합니다` : ''}</span>
        <button type="button" className="link-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
      <div className="brand">
        <div className="brand-title blue">단소</div>
        <div className="brand-sub">아리랑 타자 파티</div>
      </div>
      <div className="layout">
        <div className="mascot">
          <CatMascot />
        </div>
        <div className="panel">
          <button type="button" className="btn btn-lavender" onClick={() => setShowModal(true)}>
            타자하기 가기
          </button>
          <Link to="/stages" className="btn btn-mint-pale">
            스테이지 찾기
          </Link>
          <div className="btn-row">
            <Link to="/create" className="btn btn-gray">
              문장세트 추가
            </Link>
            <Link to="/profile/edit" className="btn btn-gray">
              이름 변경
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🎮</div>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.8rem' }}>
              게임 앱에서 플레이하세요
            </h2>
            <p style={{ color: '#ccc', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.4rem' }}>
              웹에서는 게임을 플레이할 수 없어요.<br />
              게임 앱을 열고 아래 로그인 코드를 입력하세요.
            </p>
            {loginCode && (
              <div style={{
                background: '#1a1a1a',
                border: '2px solid var(--mint)',
                borderRadius: 10,
                padding: '0.8rem 1.5rem',
                marginBottom: '1rem',
              }}>
                <span style={{ color: 'var(--mint)', fontSize: '2rem', fontWeight: 900, letterSpacing: 6, fontFamily: 'monospace' }}>
                  {loginCode}
                </span>
              </div>
            )}
            <button
              type="button"
              className="btn btn-green"
              style={{ width: '100%' }}
              onClick={() => {
                if (loginCode) navigator.clipboard.writeText(loginCode)
                setShowModal(false)
              }}
            >
              코드 복사 후 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
