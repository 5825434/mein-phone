import { useState } from 'react'
import Panel from '../components/Panel'
import Field from '../components/Field'
import { carrierOptions } from '../data/sampleData'

const tabs = [
  { id: 'profile', label: 'פרופיל אישי' },
  { id: 'business', label: 'פרטי העסק' },
  { id: 'users', label: 'משתמשים והרשאות' },
  { id: 'reminders', label: 'תזכורות ניודים' },
  { id: 'stock', label: 'התראות מלאי' },
  { id: 'carriers', label: 'ספקי סלולר' },
  { id: 'data', label: 'ניהול נתונים' },
  { id: 'display', label: 'עיצוב/תצוגה' },
]

const SaveButton = () => (
  <button
    disabled
    title="שמירה תופעל לאחר חיבור Supabase"
    className="self-start mt-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-text-2 cursor-not-allowed"
  >
    שמור שינויים
  </button>
)

function ProfileTab() {
  return (
    <div className="flex flex-col gap-3 max-w-md">
      <Field label="שם מלא" defaultValue="יוסי ברנדוין" />
      <Field label="טלפון" defaultValue="050-0000000" />
      <Field label="מייל" defaultValue="b290500@gmail.com" />
      <Field label="סיסמה חדשה" type="password" placeholder="השאר ריק ללא שינוי" />
      <SaveButton />
    </div>
  )
}

function BusinessTab() {
  return (
    <div className="flex flex-col gap-3 max-w-md">
      <Field label="שם העסק" defaultValue="מיין פון" />
      <Field label="כתובת" placeholder="רחוב, עיר" />
      <Field label='ח.פ / עוסק מורשה' placeholder="000000000" />
      <Field label='אחוז מע"מ' defaultValue="18" />
      <SaveButton />
    </div>
  )
}

function UsersTab() {
  const users = [
    { name: 'יוסי ברנדוין', role: 'מנהל' },
    { name: 'עובד לדוגמה', role: 'עובד מכירות' },
  ]
  return (
    <div className="flex flex-col gap-3 max-w-md">
      {users.map((u) => (
        <div key={u.name} className="flex items-center justify-between border border-border rounded-lg px-3 py-2 text-sm">
          <span className="font-semibold">{u.name}</span>
          <span className="text-text-2">{u.role}</span>
        </div>
      ))}
      <button
        disabled
        title="הוספת עובד תתאפשר לאחר חיבור Supabase"
        className="self-start px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-text-2 cursor-not-allowed"
      >
        + הוספת עובד
      </button>
    </div>
  )
}

function RemindersTab() {
  return (
    <div className="flex flex-col gap-3 max-w-md">
      <Field label="פרק זמן דיפולטיבי לתזכורת (חודשים)" type="number" defaultValue="6" />
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-text-2 text-xs">ערוצי התראה</span>
        <select className="border border-border rounded-lg px-3 py-2 text-sm bg-white" defaultValue="app">
          <option value="app">באפליקציה בלבד</option>
          <option value="email">גם במייל</option>
          <option value="whatsapp">גם וואטסאפ/SMS (כשיחובר)</option>
        </select>
      </label>
      <SaveButton />
    </div>
  )
}

function StockTab() {
  return (
    <div className="flex flex-col gap-3 max-w-md">
      <Field label="סף מלאי נמוך כברירת מחדל" type="number" defaultValue="3" />
      <p className="text-xs text-text-2">ניתן לשנות סף פר-מוצר במסך המלאי.</p>
      <SaveButton />
    </div>
  )
}

function CarriersTab() {
  const [carriers, setCarriers] = useState(carrierOptions)
  const [newCarrier, setNewCarrier] = useState('')

  return (
    <div className="flex flex-col gap-3 max-w-md">
      <div className="flex flex-wrap gap-2">
        {carriers.map((c) => (
          <span key={c} className="flex items-center gap-1.5 bg-[#F2ECFC] text-brand text-xs font-semibold px-3 py-1.5 rounded-full">
            {c}
            <button onClick={() => setCarriers(carriers.filter((x) => x !== c))} className="hover:text-danger">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newCarrier}
          onChange={(e) => setNewCarrier(e.target.value)}
          placeholder="שם ספק חדש..."
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white flex-1"
        />
        <button
          onClick={() => {
            if (newCarrier.trim()) {
              setCarriers([...carriers, newCarrier.trim()])
              setNewCarrier('')
            }
          }}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white"
        >
          הוסף
        </button>
      </div>
      <p className="text-xs text-text-2">
        הרשימה כאן פעילה בדפדפן שלך בלבד לצורך הדגמה — עם Supabase היא תישמר ותהיה זמינה בכל המסכים.
      </p>
    </div>
  )
}

function DataTab() {
  const [confirmText, setConfirmText] = useState('')
  const [showFinalWarning, setShowFinalWarning] = useState(false)

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white">ייצוא כל הנתונים (CSV)</button>
        <p className="text-xs text-text-2 mt-1">מומלץ לפני כל מחיקה.</p>
      </div>

      <div className="border-2 border-danger/30 rounded-xl p-4 bg-danger/5 flex flex-col gap-2.5">
        <div className="font-bold text-danger text-sm">אזור מסוכן — מחיקת כל הנתונים</div>
        <p className="text-xs text-text-2">פעולה בלתי הפיכה. מוחקת לקוחות, הזמנות, מלאי, ספקים וניודים.</p>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder='הקלד "מחק הכל" כדי לאפשר'
          className="border border-danger/40 rounded-lg px-3 py-2 text-sm bg-white"
        />
        <button
          disabled={confirmText !== 'מחק הכל'}
          onClick={() => setShowFinalWarning(true)}
          className="self-start px-4 py-2 rounded-lg text-sm font-semibold bg-danger text-white disabled:bg-gray-200 disabled:text-text-2 disabled:cursor-not-allowed"
        >
          מחק את כל הנתונים
        </button>
      </div>

      {showFinalWarning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowFinalWarning(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <div className="font-bold text-danger mb-2">בטוח לגמרי?</div>
            <p className="text-sm text-text-2 mb-4">זו הפעולה בלתי הפיכה. במערכת האמיתית (עם Supabase) המחיקה תתבצע כאן.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setShowFinalWarning(false)} className="px-4 py-2 rounded-lg text-sm font-semibold border border-border">
                ביטול
              </button>
              <button onClick={() => setShowFinalWarning(false)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-danger text-white">
                כן, מחק (הדגמה בלבד)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DisplayTab() {
  return (
    <div className="flex flex-col gap-3 max-w-md">
      <label className="flex items-center gap-2.5 text-sm">
        <input type="checkbox" disabled />
        מצב כהה (Dark mode) — שמור לגרסה עתידית
      </label>
    </div>
  )
}

const tabContent = {
  profile: ProfileTab,
  business: BusinessTab,
  users: UsersTab,
  reminders: RemindersTab,
  stock: StockTab,
  carriers: CarriersTab,
  data: DataTab,
  display: DisplayTab,
}

export default function Settings() {
  const [active, setActive] = useState('profile')
  const Content = tabContent[active]

  return (
    <div className="flex gap-4">
      <div className="w-52 shrink-0 flex flex-col gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`text-right px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active === tab.id ? 'bg-brand text-white font-bold' : 'text-text-2 hover:bg-white hover:text-brand'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <Panel title={tabs.find((t) => t.id === active).label} className="flex-1 p-5">
        <Content />
      </Panel>
    </div>
  )
}
