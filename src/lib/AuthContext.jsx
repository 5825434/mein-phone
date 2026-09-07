import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, firebaseConfigured } from './firebaseClient'

const GUEST_KEY = 'mein-phone-guest'
const AuthContext = createContext({ user: null, loading: true, configured: false, guest: false })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(firebaseConfigured)
  const [guest, setGuest] = useState(() => sessionStorage.getItem(GUEST_KEY) === '1')

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser)
      setLoading(false)
      if (newUser) {
        setGuest(false)
        sessionStorage.removeItem(GUEST_KEY)
      }
    })
    return unsubscribe
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
    <AuthContext.Provider value={{ user, loading, configured: firebaseConfigured, guest, continueAsGuest, exitGuest }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
