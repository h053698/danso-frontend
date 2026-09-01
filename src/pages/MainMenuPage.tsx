import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CatMascot } from '../CatMascot'
import { clearLoginCode, getMe } from '../api'

export function MainMenuPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')

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
          <Link to="/play" className="btn btn-lavender">
            타자하기 가기
          </Link>
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
    </div>
  )
}
