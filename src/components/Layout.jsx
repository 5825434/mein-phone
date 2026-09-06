import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

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

export default function Layout() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'מיין פון'

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-white">
          <h2 className="font-display text-lg font-bold m-0">{title}</h2>
          <div className="flex items-center gap-2 text-sm text-text-2">
            <span className="rounded-full bg-[#F2ECFC]" style={{ width: 26, height: 26 }} />
            יוסי · מנהל
          </div>
        </header>
        <main className="flex-1 p-6 bg-bg">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
