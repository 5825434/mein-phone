import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const GUEST_KEY = 'mein-phone-guest'
const AuthContext = createContext({ session: null, loading: true, configured: false, guest: false })

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(!!supabase)
  const [guest, setGuest] = useState(() => sessionStorage.getItem(GUEST_KEY) === '1')

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession) {
        setGuest(false)
        sessionStorage.removeItem(GUEST_KEY)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const continueAsGuest = () => {
    sessionStorage.setItem(GUEST_KEY, '1')
    setGuest(true)
  }

  const exitGuest = () => {
    sessionStorage.removeItem(GUEST_KEY)
    setGuest(false)
  }

  return (
    <AuthContext.Provider value={{ session, loading, configured: !!supabase, guest, continueAsGuest, exitGuest }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
