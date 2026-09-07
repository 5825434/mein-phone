// נתוני דוגמה בלבד — ישמשו למילוי המסכים עד שיחובר Firebase בפועל (ראו src/lib/firebaseClient.js).

// רשימת ספקי סלולר משותפת - גם למסך ההגדרות וגם לבחירה בכרטיס לקוח (סעיף 3.10-ח באיפיון)
export const carrierOptions = [
  'סלקום', 'פרטנר', 'פלאפון', 'הוט מובייל', 'רמי לוי תקשורת', 'גולן טלקום', 'וואן (019)',
]

// קטלוג מתנות לניוד - לכל מתנה כמה ניודים בסה"כ נדרשים כדי להצדיק אותה (סעיף 2.1 באיפיון)
export const giftOptions = [
  { name: 'iPhone 13', requiredPortings: 3 },
  { name: 'Galaxy A54', requiredPortings: 2 },
  { name: 'אוזניות Bluetooth', requiredPortings: 1 },
  { name: 'Powerbank 20,000mAh', requiredPortings: 1 },
  { name: 'שעון חכם', requiredPortings: 2 },
  { name: 'טאבלט Lenovo', requiredPortings: 2 },
  { name: 'רמקול נייד', requiredPortings: 1 },
  { name: 'מטען אלחוטי', requiredPortings: 1 },
]

export const kpis = [
  { label: 'מכירות החודש', value: '18,240 ₪', trend: '▲ 12% מהחודש שעבר', to: '/orders' },
  { label: 'ניודים החודש', value: '16', trend: '▲ 4 ניודים', to: '/portings' },
  { label: 'תזכורות פתוחות', value: '5', trend: '2 באיחור', to: '/portings' },
  { label: 'מלאי קריטי', value: '3 פריטים', trend: 'מתחת לסף', to: '/inventory' },
]

export const monthlySales = [
  { month: 'אפר', value: 11200 },
  { month: 'מאי', value: 13800 },
  { month: 'יונ', value: 15100 },
  { month: 'יול', value: 14400 },
  { month: 'אוג', value: 16900 },
  { month: 'ספט', value: 18240 },
]

// הכנסות מול הוצאות (שני המדדים בש"ח, לכן ניתן להציג על אותו ציר) - 12 חודשים אחרונים, כדי לאפשר גלילה אחורה בגרף
export const monthlyFinance = [
  { month: 'אוק', income: 6200, expenses: 4200 },
  { month: 'נוב', income: 6800, expenses: 4500 },
  { month: 'דצמ', income: 8100, expenses: 5300 },
  { month: 'ינו', income: 7200, expenses: 4800 },
  { month: 'פבר', income: 7900, expenses: 5100 },
  { month: 'מרץ', income: 9500, expenses: 6200 },
  { month: 'אפר', income: 11200, expenses: 7300 },
  { month: 'מאי', income: 13800, expenses: 8100 },
  { month: 'יונ', income: 15100, expenses: 9400 },
  { month: 'יול', income: 14400, expenses: 8800 },
  { month: 'אוג', income: 16900, expenses: 9900 },
  { month: 'ספט', income: 18240, expenses: 10600 },
]

// מספר ניודים (יחידה שונה מהכנסות/הוצאות - כמות, לא ש"ח - לכן בגרף נפרד) - אותם 12 חודשים
export const monthlyPortings = [
  { month: 'אוק', count: 5 },
  { month: 'נוב', count: 6 },
  { month: 'דצמ', count: 7 },
  { month: 'ינו', count: 6 },
  { month: 'פבר', count: 7 },
  { month: 'מרץ', count: 8 },
  { month: 'אפר', count: 9 },
  { month: 'מאי', count: 11 },
  { month: 'יונ', count: 12 },
  { month: 'יול', count: 10 },
  { month: 'אוג', count: 14 },
  { month: 'ספט', count: 16 },
]

export const salesByCategory = [
  { name: 'טלפונים', pct: 52, color: 'var(--color-cat-1)' },
  { name: 'אביזרים', pct: 28, color: 'var(--color-cat-2)' },
  { name: 'סימים ותוכניות', pct: 20, color: 'var(--color-cat-3)' },
]

export const customers = [
  { id: 1, name: 'דנה כהן', phone: '050-1234567', currentCarrier: 'הוט מובייל', gift: 'iPhone 13', portingsDone: 2, futureCarrier: 'סלקום', futureDueDate: '02.03.2027', joined: '02.09.2026', lastActivity: '02.09.2026', status: 'pending' },
  { id: 2, name: 'אבי לוי', phone: '052-2345678', currentCarrier: 'פרטנר', gift: 'אוזניות Bluetooth', portingsDone: 1, futureCarrier: '—', futureDueDate: '—', joined: '30.08.2026', lastActivity: '30.08.2026', status: 'done' },
  { id: 3, name: 'מיכל בר-אור', phone: '054-3456789', currentCarrier: 'פלאפון', gift: 'Galaxy A54', portingsDone: 1, futureCarrier: 'פלאפון', futureDueDate: '28.01.2027', joined: '12.03.2026', lastActivity: '28.08.2026', status: 'late' },
  { id: 4, name: 'יוסי מזרחי', phone: '053-4567890', currentCarrier: 'סלקום', gift: 'Powerbank 20,000mAh', portingsDone: 1, futureCarrier: '—', futureDueDate: '—', joined: '25.08.2026', lastActivity: '25.08.2026', status: 'done' },
  { id: 5, name: 'רותם שגיא', phone: '050-5678901', currentCarrier: 'רמי לוי תקשורת', gift: 'שעון חכם', portingsDone: 1, futureCarrier: 'הוט מובייל', futureDueDate: '22.02.2027', joined: '22.08.2026', lastActivity: '22.08.2026', status: 'pending' },
  { id: 6, name: 'עומר אזולאי', phone: '058-6789012', currentCarrier: 'גולן טלקום', gift: 'רמקול נייד', portingsDone: 1, futureCarrier: '—', futureDueDate: '—', joined: '05.02.2026', lastActivity: '20.08.2026', status: 'done' },
  { id: 7, name: 'שירה גבאי', phone: '052-7890123', currentCarrier: 'וואן (019)', gift: 'טאבלט Lenovo', portingsDone: 1, futureCarrier: 'פרטנר', futureDueDate: '17.02.2027', joined: '17.08.2026', lastActivity: '17.08.2026', status: 'declined' },
  { id: 8, name: 'טל פרידמן', phone: '054-8901234', currentCarrier: 'פלאפון', gift: 'מטען אלחוטי', portingsDone: 1, futureCarrier: '—', futureDueDate: '—', joined: '11.11.2025', lastActivity: '12.08.2026', status: 'done' },
]

export const inventoryItems = [
  { sku: 'PH-IP13-128', name: 'iPhone 13 128GB', brand: 'Apple', category: 'טלפונים', qty: 4, cost: 2450, priceBeforeVat: 2966, priceWithVat: 3500, vat: 'חייב', status: 'available' },
  { sku: 'PH-GA54', name: 'Galaxy A54', brand: 'Samsung', category: 'טלפונים', qty: 2, cost: 980, priceBeforeVat: 1186, priceWithVat: 1400, vat: 'חייב', status: 'low' },
  { sku: 'AC-BT-01', name: 'אוזניות Bluetooth', brand: 'Generic', category: 'אביזרים', qty: 14, cost: 45, priceBeforeVat: 76, priceWithVat: 90, vat: 'חייב', status: 'available' },
  { sku: 'AC-PB-20K', name: 'Powerbank 20,000mAh', brand: 'Anker', category: 'אביזרים', qty: 0, cost: 60, priceBeforeVat: 102, priceWithVat: 120, vat: 'חייב', status: 'out' },
  { sku: 'AC-WATCH', name: 'שעון חכם', brand: 'Generic', category: 'אביזרים', qty: 6, cost: 150, priceBeforeVat: 254, priceWithVat: 300, vat: 'חייב', status: 'available' },
  { sku: 'SIM-COM', name: 'סים משולב + תוכנית', brand: '—', category: 'סימים', qty: 40, cost: 0, priceBeforeVat: 0, priceWithVat: 0, vat: 'פטור', status: 'available' },
  { sku: 'PH-USED-S21', name: 'Galaxy S21 (יד שנייה)', brand: 'Samsung', category: 'טלפונים', qty: 3, cost: 700, priceBeforeVat: 850, priceWithVat: 850, vat: 'פטור', status: 'available' },
  { sku: 'AC-CHRG-W', name: 'מטען אלחוטי', brand: 'Generic', category: 'אביזרים', qty: 1, cost: 35, priceBeforeVat: 59, priceWithVat: 70, vat: 'חייב', status: 'low' },
]

export const orders = [
  { id: 'ORD-1042', customer: 'דנה כהן', date: '02.09.2026', summary: 'iPhone 13 128GB', beforeVat: 2966, withVat: 3500, payment: 'paid', linkedPorting: true },
  { id: 'ORD-1041', customer: 'אבי לוי', date: '30.08.2026', summary: 'אוזניות Bluetooth', beforeVat: 76, withVat: 90, payment: 'paid', linkedPorting: true },
  { id: 'ORD-1040', customer: 'נועה שלו', date: '29.08.2026', summary: 'Galaxy A54 + מטען אלחוטי', beforeVat: 1245, withVat: 1470, payment: 'partial', linkedPorting: false },
  { id: 'ORD-1039', customer: 'מיכל בר-אור', date: '28.08.2026', summary: 'Galaxy A54', beforeVat: 1186, withVat: 1400, payment: 'pending', linkedPorting: true },
  { id: 'ORD-1038', customer: 'יוסי מזרחי', date: '25.08.2026', summary: 'Powerbank 20,000mAh', beforeVat: 102, withVat: 120, payment: 'paid', linkedPorting: true },
  { id: 'ORD-1037', customer: 'עידן כרמי', date: '21.08.2026', summary: 'סים משולב + תוכנית', beforeVat: 0, withVat: 0, payment: 'paid', linkedPorting: false },
]

export const suppliers = [
  { name: 'סלולר פלוס בע"מ', contact: '03-6001122', terms: 'שוטף+30', vat: 'עם מע"מ', openBalance: 12400 },
  { name: 'טק-אימפורט', contact: '09-8765432', terms: 'שוטף+60', vat: 'עם מע"מ', openBalance: 3200 },
  { name: 'משה כהן (עוסק פטור)', contact: '050-9988776', terms: 'מזומן', vat: 'ללא מע"מ', openBalance: 0 },
  { name: 'אביזרי סמארט', contact: '04-1122334', terms: 'שוטף+30', vat: 'עם מע"מ', openBalance: 5600 },
  { name: 'יבוא פרטי - דוד לוי', contact: '052-1231234', terms: 'מזומן', vat: 'ללא מע"מ', openBalance: 1500 },
]

export const recentPortings = [
  {
    customer: 'דנה כהן',
    date: '02.09.2026',
    currentCarrier: 'הוט מובייל',
    gift: 'iPhone 13',
    portingsDone: 2,
    requiredPortings: 3,
    futureCarrier: 'סלקום',
    futureDueDate: '02.03.2027',
    status: 'pending',
  },
  {
    customer: 'אבי לוי',
    date: '30.08.2026',
    currentCarrier: 'פרטנר',
    gift: 'אוזניות Bluetooth',
    portingsDone: 1,
    requiredPortings: 1,
    futureCarrier: '—',
    futureDueDate: '—',
    status: 'done',
  },
  {
    customer: 'מיכל בר-אור',
    date: '28.08.2026',
    currentCarrier: 'פלאפון',
    gift: 'Galaxy A54',
    portingsDone: 1,
    requiredPortings: 2,
    futureCarrier: 'פלאפון',
    futureDueDate: '28.01.2027',
    status: 'late',
  },
  {
    customer: 'יוסי מזרחי',
    date: '25.08.2026',
    currentCarrier: 'סלקום',
    gift: 'Powerbank 20,000mAh',
    portingsDone: 1,
    requiredPortings: 1,
    futureCarrier: '—',
    futureDueDate: '—',
    status: 'done',
  },
]

export const allPortings = [
  ...recentPortings,
  {
    customer: 'רותם שגיא',
    date: '22.08.2026',
    currentCarrier: 'רמי לוי תקשורת',
    gift: 'שעון חכם',
    portingsDone: 1,
    requiredPortings: 2,
    futureCarrier: 'הוט מובייל',
    futureDueDate: '22.02.2027',
    status: 'pending',
  },
  {
    customer: 'עומר אזולאי',
    date: '20.08.2026',
    currentCarrier: 'גולן טלקום',
    gift: 'רמקול נייד',
    portingsDone: 1,
    requiredPortings: 1,
    futureCarrier: '—',
    futureDueDate: '—',
    status: 'done',
  },
  {
    customer: 'שירה גבאי',
    date: '17.08.2026',
    currentCarrier: 'וואן (019)',
    gift: 'טאבלט Lenovo',
    portingsDone: 1,
    requiredPortings: 2,
    futureCarrier: 'פרטנר',
    futureDueDate: '17.02.2027',
    status: 'declined',
  },
  {
    customer: 'טל פרידמן',
    date: '12.08.2026',
    currentCarrier: 'פלאפון',
    gift: 'מטען אלחוטי',
    portingsDone: 1,
    requiredPortings: 1,
    futureCarrier: '—',
    futureDueDate: '—',
    status: 'done',
  },
]
