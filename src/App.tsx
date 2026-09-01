import type { ReactElement } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getLoginCode } from './api'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { CreatePackPage } from './pages/CreatePackPage'
import { LoginPage } from './pages/LoginPage'
import { MainMenuPage } from './pages/MainMenuPage'
import { ProfileEditPage } from './pages/ProfileEditPage'
import { StagesPage } from './pages/StagesPage'

function RequireAuth({ children }: { children: ReactElement }) {
  if (!getLoginCode()) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainMenuPage />
            </RequireAuth>
          }
        />
        <Route
          path="/stages"
          element={
            <RequireAuth>
              <StagesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/create"
          element={
            <RequireAuth>
              <CreatePackPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <RequireAuth>
              <ProfileEditPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
