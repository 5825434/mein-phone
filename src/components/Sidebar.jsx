import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  UsersIcon,
  SwapIcon,
  BoxIcon,
  CartIcon,
  TruckIcon,
  ChartIcon,
  GearIcon,
} from './icons'

const navItems = [
  { to: '/', label: 'דשבורד', icon: HomeIcon, end: true },
  { to: '/customers', label: 'לקוחות', icon: UsersIcon },
  { to: '/portings', label: 'ניודים', icon: SwapIcon },
  { to: '/inventory', label: 'מלאי', icon: BoxIcon },
  { to: '/orders', label: 'הזמנות', icon: CartIcon },
  { to: '/suppliers', label: 'ספקים', icon: TruckIcon },
  { to: '/reports', label: 'דוחות', icon: ChartIcon },
  { to: '/settings', label: 'הגדרות', icon: GearIcon },
]

// בנייד הסיידבר הופך למגירה נגררת (מוסתרת כברירת מחדל, נפתחת מכפתור ההמבורגר); בדסקטופ (md+) נשאר קבוע וגלוי כרגיל.
export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={onClose} />}
      <aside
        className={`w-64 md:w-52 shrink-0 bg-[#1F1233] flex flex-col p-3.5 fixed inset-y-0 right-0 z-40 transition-transform duration-200 md:static md:translate-x-0 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2.5 px-1 pb-4 mb-3 border-b border-white/10">
          <span className="w-7.5 h-7.5 rounded-[9px] bg-gradient-to-br from-brand to-brand-2" style={{ width: 30, height: 30 }} />
          <span className="font-display font-bold text-[15px] text-white">מיין פון</span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-[#C9BEEA] hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: 17, height: 17 }} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
