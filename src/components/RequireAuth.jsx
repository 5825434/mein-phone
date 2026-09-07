import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

// כל עוד Supabase לא מחובר, האפליקציה נשארת פתוחה במצב הדגמה (נתוני דוגמה) בלי לחסום בכניסה.
// ברגע שה-URL/מפתח מוגדרים, מסך זה אוכף כניסה אמיתית.
export default function RequireAuth({ children }) {
  const { session, loading, configured } = useAuth()

  if (!configured) return children
  if (loading) return null
  if (!session) return <Navigate to="/login" replace />
  return children
}
