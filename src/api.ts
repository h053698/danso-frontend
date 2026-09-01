const API_BASE = 'https://danso-api.bigbae.app'

const CODE_KEY = 'danso_login_code'

export function getLoginCode(): string | null {
  return localStorage.getItem(CODE_KEY)
}

export function setLoginCode(code: string): void {
  localStorage.setItem(CODE_KEY, code)
}

export function clearLoginCode(): void {
  localStorage.removeItem(CODE_KEY)
}

export const OAUTH_URL = `${API_BASE}/login/oauth/`

interface RequestOptions {
  method?: string
  body?: FormData
  auth?: boolean
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options
  const headers: Record<string, string> = {}

  if (auth) {
    const code = getLoginCode()
    if (code) headers['X-Login-Code'] = code
  }

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body })

  const text = await res.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    let message = `요청에 실패했습니다 (${res.status})`
    if (data && typeof data === 'object' && 'error' in data) {
      message = String((data as { error: unknown }).error)
    }
    throw new ApiError(message, res.status)
  }

  return data as T
}

export interface User {
  id: number
  nickname: string
  email?: string
}

export interface SentencePack {
  id: number
  name: string
  author: string
  original_author: string
  total_likes: number
  is_liked: boolean
  level?: string
}

export interface GamePack extends SentencePack {
  sentences: string[]
}

export function getMe(): Promise<User> {
  return request<User>('/user/me')
}

export function getSentences(): Promise<SentencePack[]> {
  return request<SentencePack[]>('/sentences/')
}

export function getRandomPack(): Promise<SentencePack[]> {
  return request<SentencePack[]>('/sentences/random')
}

export function getGame(id: number): Promise<GamePack> {
  return request<GamePack>(`/sentences/${id}/game`)
}

export function toggleLike(id: number): Promise<unknown> {
  return request(`/sentences/${id}/interact-like`, { method: 'POST' })
}

export function setScore(id: number, score: number): Promise<unknown> {
  const fd = new FormData()
  fd.append('score', String(score))
  return request(`/sentences/${id}/set-score`, { method: 'POST', body: fd })
}

export interface CreatePackInput {
  name: string
  sentences: string[]
  level: string
  original_author: string
}

export function createPack(input: CreatePackInput): Promise<unknown> {
  const fd = new FormData()
  fd.append('name', input.name)
  fd.append('sentences', input.sentences.join('\r\n'))
  fd.append('level', input.level)
  fd.append('original_author', input.original_author)
  return request('/sentences/create', { method: 'POST', body: fd })
}

export function updateNickname(nickname: string): Promise<unknown> {
  const fd = new FormData()
  fd.append('nickname', nickname)
  return request('/user/nickname', { method: 'POST', body: fd })
}
