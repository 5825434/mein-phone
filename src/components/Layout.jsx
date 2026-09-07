import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import Sidebar from './Sidebar'
import { useAuth } from '../lib/AuthContext'
import { auth } from '../lib/firebaseClient'

const titles = {
  '/': 'דשבורד',
  '/customers': 'לקוחות',
  '/portings': 'ניודים',
  '/inventory': 'מלאי',
  '/orders': 'הזמנות',
  '/suppliers': 'ספקים',
  '/reports': 'דוחות',
  '/settings': 'הגדרות',
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <path d="M3 5.5h14M3 10h14M3 14.5h14" />
    </svg>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, configured, guest, exitGuest } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const title = titles[pathname] ?? 'מיין פון'
  const userLabel = user?.email ?? (guest ? 'אורח (הדגמה)' : 'יוסי · מנהל')

  const handleSignOut = async () => {
    if (guest) {
      exitGuest()
    } else {
      await signOut(auth)
    }
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-text-2 hover:text-text -m-1 p-1"
              aria-label="פתח תפריט"
            >
              <MenuIcon className="w-6 h-6" style={{ width: 24, height: 24 }} />
            </button>
            <h2 className="font-display text-lg font-bold m-0">{title}</h2>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 text-sm text-text-2"
              disabled={!configured}
            >
              <span className="rounded-full bg-[#F2ECFC]" style={{ width: 26, height: 26 }} />
              <span className="hidden sm:inline">{userLabel}</span>
            </button>
            {menuOpen && configured && (
              <div className="absolute left-0 mt-2 bg-white border border-border rounded-lg shadow-lg py-1 w-40 z-20" onMouseLeave={() => setMenuOpen(false)}>
                <button onClick={handleSignOut} className="w-full text-right px-3 py-2 text-sm hover:bg-bg text-danger">
                  התנתקות
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-bg overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
