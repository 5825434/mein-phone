// נתוני דוגמה בלבד — ישמשו למילוי המסכים עד שיחובר Supabase בפועל (ראו src/lib/supabaseClient.js).

export const kpis = [
  { label: 'מכירות החודש', value: '18,240 ₪', trend: '▲ 12% מהחודש שעבר' },
  { label: 'ניודים החודש', value: '16', trend: '▲ 4 ניודים' },
  { label: 'תזכורות פתוחות', value: '5', trend: '2 באיחור' },
  { label: 'מלאי קריטי', value: '3 פריטים', trend: 'מתחת לסף' },
]

export const monthlySales = [
  { month: 'אפר', value: 11200 },
  { month: 'מאי', value: 13800 },
  { month: 'יונ', value: 15100 },
  { month: 'יול', value: 14400 },
  { month: 'אוג', value: 16900 },
  { month: 'ספט', value: 18240 },
]

export const salesByCategory = [
  { name: 'טלפונים', pct: 52, color: 'var(--color-cat-1)' },
  { name: 'אביזרים', pct: 28, color: 'var(--color-cat-2)' },
  { name: 'סימים ותוכניות', pct: 20, color: 'var(--color-cat-3)' },
]

export const recentPortings = [
  {
    customer: 'דנה כהן',
    date: '02.09.2026',
    currentCarrier: 'הוט מובייל',
    futureCarrier: "סלקום (בעוד 6 חוד')",
    gift: 'iPhone 13',
    status: 'pending',
  },
  {
    customer: 'אבי לוי',
    date: '30.08.2026',
    currentCarrier: 'פרטנר',
    futureCarrier: '—',
    gift: 'אוזניות Bluetooth',
    status: 'done',
  },
  {
    customer: 'מיכל בר-אור',
    date: '28.08.2026',
    currentCarrier: 'פלאפון',
    futureCarrier: "פלאפון (בעוד 6 חוד')",
    gift: 'Galaxy A54',
    status: 'late',
  },
  {
    customer: 'יוסי מזרחי',
    date: '25.08.2026',
    currentCarrier: 'סלקום',
    futureCarrier: '—',
    gift: 'Powerbank 20,000',
    status: 'done',
  },
]
