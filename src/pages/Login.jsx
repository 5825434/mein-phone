import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.83h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.99-4.32 2.99-7.33Z" />
      <path fill="#34A853" d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.23-2.5c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H1.06v2.59A10 10 0 0 0 10 20Z" />
      <path fill="#FBBC05" d="M4.41 11.91A6 6 0 0 1 4.09 10c0-.66.11-1.31.32-1.91V5.5H1.06A10 10 0 0 0 0 10c0 1.61.39 3.14 1.06 4.5l3.35-2.59Z" />
      <path fill="#EA4335" d="M10 3.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87A9.6 9.6 0 0 0 10 0 10 10 0 0 0 1.06 5.5l3.35 2.59C5.2 5.74 7.4 3.98 10 3.98Z" />
    </svg>
  )
}

function GiftIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M4 13h16" />
      <path d="M12 9v11" />
      <path d="M12 9c-1.2-3-3-4-4.2-3.2C6.6 6.6 7.4 9 12 9Z" />
      <path d="M12 9c1.2-3 3-4 4.2-3.2C16.4 6.6 16.6 9 12 9Z" />
    </svg>
  )
}

export default function Login() {
  const { session, configured } = useAuth()
  const [mode, setMode] = useState('start') // start | signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/" replace />

  const handleGoogle = async () => {
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) setError(error.message)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setBusy(true)
    const action =
      mode === 'signup'
        ? supabase.auth.signUp({ email, password })
        : supabase.auth.signInWithPassword({ email, password })
    const { error } = await action
    setBusy(false)
    if (error) {
      setError(error.message)
    } else if (mode === 'signup') {
      setInfo('נרשמת בהצלחה! בדוק/י את תיבת המייל לאישור החשבון, ואז חזור/י להתחבר.')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand-2 flex items-center justify-center" style={{ width: 56, height: 56 }}>
            <GiftIcon style={{ width: 26, height: 26 }} />
          </div>
        </div>
        <h1 className="font-display text-xl font-bold text-center mb-1">מיין פון</h1>
        <p className="text-sm text-text-2 text-center mb-6">
          התחבר/י כדי להמשיך לדשבורד הניהול — ניוד קווים, מלאי והזמנות במקום אחד.
        </p>

        {!configured && (
          <div className="mb-4 p-3 rounded-lg bg-[#FFF8E8] text-[#8a6d1a] text-xs leading-relaxed">
            Supabase עדיין לא מחובר בקוד הזה — הכניסה כאן לא תעבוד עד שיוגדרו המפתחות ב-.env. בינתיים
            האתר פתוח וזמין עם נתוני דוגמה.
          </div>
        )}

        {mode === 'start' && (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogle}
              className="flex items-center justify-center gap-2.5 border border-border rounded-xl py-2.5 text-sm font-semibold hover:bg-bg transition-colors"
            >
              <GoogleIcon style={{ width: 18, height: 18 }} />
              המשך עם Google
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-2">או</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={() => setMode('signin')}
              className="bg-brand text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#8f45f0] transition-colors"
            >
              המשך עם אימייל
            </button>
          </div>
        )}

        {(mode === 'signin' || mode === 'signup') && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-text-2 text-xs">אימייל</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                placeholder="you@example.com"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-text-2 text-xs">סיסמה</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                placeholder="••••••••"
              />
            </label>

            {error && <p className="text-xs text-danger">{error}</p>}
            {info && <p className="text-xs text-success">{info}</p>}

            <button
              type="submit"
              disabled={busy}
              className="bg-brand text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#8f45f0] transition-colors disabled:opacity-60"
            >
              {busy ? 'רגע...' : mode === 'signup' ? 'הרשמה' : 'התחברות'}
            </button>

            <button type="button" onClick={() => setMode('start')} className="text-xs text-text-2 hover:text-text">
              ← חזרה
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-6">
          {mode === 'signup' ? (
            <>
              כבר רשום/ה?{' '}
              <button onClick={() => setMode('signin')} className="text-brand font-semibold hover:underline">
                התחברות
              </button>
            </>
          ) : (
            <>
              משתמש חדש?{' '}
              <button onClick={() => setMode('signup')} className="text-brand font-semibold hover:underline">
                הרשמה
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
