import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

// כל עוד Firebase לא מחובר, האפליקציה נשארת פתוחה במצב הדגמה (נתוני דוגמה) בלי לחסום בכניסה.
// ברגע שהקוד מוגדר, מסך זה אוכף כניסה אמיתית - חוץ אם המשתמש בחר "המשך ללא הרשמה" (מצב אורח).
export default function RequireAuth({ children }) {
  const { user, loading, configured, guest } = useAuth()

  if (!configured) return children
  if (loading) return null
  if (!user && !guest) return <Navigate to="/login" replace />
  return children
}
