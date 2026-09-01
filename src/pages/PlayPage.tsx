import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getGame, getRandomPack, setScore, type GamePack } from '../api'

function flattenSentences(raw: string[]): string[] {
  return raw
    .flatMap((s) => s.split(/\r\n|\r|\n/))
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

interface Stats {
  correct: number
  wrong: number
  wpm: number
  accuracy: number
  elapsed: number
}

export function PlayPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [pack, setPack] = useState<GamePack | null>(null)
  const [packId, setPackId] = useState<number | null>(null)
  const [sentences, setSentences] = useState<string[]>([])
  const [loadError, setLoadError] = useState('')

  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalWrong, setTotalWrong] = useState(0)
  const [finished, setFinished] = useState(false)
  const [finalStats, setFinalStats] = useState<Stats | null>(null)
  const [now, setNow] = useState(Date.now())

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        let targetId: number
        if (id) {
          targetId = Number(id)
        } else {
          const random = await getRandomPack()
          if (!random || random.length === 0) {
            throw new Error('문장세트가 없습니다.')
          }
          targetId = random[0].id
        }
        const game = await getGame(targetId)
        if (!active) return
        const flat = flattenSentences(game.sentences)
        if (flat.length === 0) {
          throw new Error('이 세트에는 문장이 없습니다.')
        }
        setPack(game)
        setPackId(targetId)
        setSentences(flat)
      } catch (err) {
        if (active) setLoadError(err instanceof Error ? err.message : '불러오기에 실패했습니다.')
      }
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  // live timer
  useEffect(() => {
    if (startTime === null || finished) return
    const t = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(t)
  }, [startTime, finished])

  useEffect(() => {
    if (!finished) inputRef.current?.focus()
  }, [finished, index, sentences])

  const current = sentences[index] ?? ''

  const liveStats = useMemo<Stats>(() => {
    const elapsedMs = startTime ? now - startTime : 0
    const elapsed = elapsedMs / 1000
    // count current in-progress correct chars
    let curCorrect = 0
    let curWrong = 0
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === current[i]) curCorrect++
      else curWrong++
    }
    const correct = totalCorrect + curCorrect
    const wrong = totalWrong + curWrong
    const totalTyped = correct + wrong
    const accuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100
    // WPM: (correct chars / 5) / minutes
    const minutes = elapsed / 60
    const wpm = minutes > 0 ? Math.round(correct / 5 / minutes) : 0
    return { correct, wrong, wpm, accuracy, elapsed: Math.round(elapsed) }
  }, [now, startTime, typed, current, totalCorrect, totalWrong])

  const finish = useCallback(
    (correct: number, wrong: number) => {
      const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0
      const totalTyped = correct + wrong
      const accuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100
      const minutes = elapsed / 60
      const wpm = minutes > 0 ? Math.round(correct / 5 / minutes) : 0
      const stats: Stats = { correct, wrong, wpm, accuracy, elapsed: Math.round(elapsed) }
      setFinalStats(stats)
      setFinished(true)
      if (packId !== null) {
        setScore(packId, wpm).catch(() => {
          /* ignore score save failure */
        })
      }
    },
    [startTime, packId],
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (finished) return
    const value = e.target.value
    if (startTime === null) {
      setStartTime(Date.now())
      setNow(Date.now())
    }
    // prevent typing beyond sentence length
    if (value.length > current.length) return
    setTyped(value)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    if (typed.length < current.length) return // must complete line

    let curCorrect = 0
    let curWrong = 0
    for (let i = 0; i < current.length; i++) {
      if (typed[i] === current[i]) curCorrect++
      else curWrong++
    }
    const newCorrect = totalCorrect + curCorrect
    const newWrong = totalWrong + curWrong
    setTotalCorrect(newCorrect)
    setTotalWrong(newWrong)
    setTyped('')

    if (index + 1 >= sentences.length) {
      finish(newCorrect, newWrong)
    } else {
      setIndex(index + 1)
    }
  }

  function restart() {
    setIndex(0)
    setTyped('')
    setStartTime(null)
    setTotalCorrect(0)
    setTotalWrong(0)
    setFinished(false)
    setFinalStats(null)
    setNow(Date.now())
  }

  if (loadError) {
    return (
      <div className="page">
        <div className="center-col">
          <div className="error-msg">{loadError}</div>
          <button type="button" className="back-link" onClick={() => navigate('/')}>
            ← 메인으로
          </button>
        </div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className="page">
        <div className="loading">불러오는 중...</div>
      </div>
    )
  }

  if (finished && finalStats) {
    return (
      <div className="page">
        <div className="result-box">
          <h2>완료!</h2>
          <div className="result-grid">
            <div className="result-stat">
              <div className="stat-value">{finalStats.wpm}</div>
              <div className="stat-label">WPM</div>
            </div>
            <div className="result-stat">
              <div className="stat-value">{finalStats.accuracy}%</div>
              <div className="stat-label">정확도</div>
            </div>
            <div className="result-stat">
              <div className="stat-value">{finalStats.correct}</div>
              <div className="stat-label">맞은 글자</div>
            </div>
            <div className="result-stat">
              <div className="stat-value">{finalStats.elapsed}s</div>
              <div className="stat-label">걸린 시간</div>
            </div>
          </div>
          <div className="result-actions">
            <button type="button" className="btn btn-mint" onClick={restart}>
              다시하기
            </button>
            <button type="button" className="btn btn-lavender" onClick={() => navigate('/stages')}>
              다른 스테이지
            </button>
            <button type="button" className="btn btn-gray" onClick={() => navigate('/')}>
              메인으로
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="game-wrap" onClick={() => inputRef.current?.focus()}>
        <div className="brand" style={{ marginBottom: 16 }}>
          <div className="brand-sub">{pack.name}</div>
        </div>
        <div className="game-stats">
          <div className="stat">
            <div className="stat-value">{liveStats.wpm}</div>
            <div className="stat-label">WPM</div>
          </div>
          <div className="stat">
            <div className="stat-value">{liveStats.accuracy}%</div>
            <div className="stat-label">정확도</div>
          </div>
          <div className="stat">
            <div className="stat-value">{liveStats.elapsed}s</div>
            <div className="stat-label">시간</div>
          </div>
        </div>
        <div className="progress-text">
          {index + 1} / {sentences.length} 문장
        </div>
        <div className="typing-box">
          {current.split('').map((ch, i) => {
            let cls = 'char pending'
            if (i < typed.length) {
              cls = typed[i] === ch ? 'char correct' : 'char wrong'
            } else if (i === typed.length) {
              cls = 'char pending current'
            }
            return (
              <span key={i} className={cls}>
                {ch}
              </span>
            )
          })}
        </div>
        <input
          ref={inputRef}
          className="hidden-input"
          value={typed}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <div className="typing-hint">
          문장을 모두 입력한 뒤 Enter를 눌러 다음 문장으로 넘어가세요.
        </div>
        <button type="button" className="back-link" onClick={() => navigate('/')}>
          ← 메인으로
        </button>
      </div>
    </div>
  )
}
