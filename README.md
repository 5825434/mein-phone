# מיין פון — מערכת ניהול

דשבורד ניהול לעסק "מיין פון" (ניוד קווים, מכירת טלפונים, מלאי, ספקים) — לפי מסמך האיפיון `מיין-פון-איפיון-2.md`.

## מצב נוכחי

- שלד React + Vite + Tailwind CSS, RTL מלא, גופנים Heebo/Rubik.
- **כל 8 המודולים בנויים** (דשבורד, לקוחות, ניודים, מלאי, הזמנות, ספקים, דוחות, הגדרות) — כולל הוספה/עריכה בלחיצת שורה, קטלוג מתנות עם ניודים נדרשים, פיצול מע"מ במלאי/ספקים, וגרפים אינטראקטיביים בדשבורד.
- **מסך התחברות** (Google + אימייל/סיסמה + "המשך ללא הרשמה") — ראו `src/pages/Login.jsx`.
- **Firebase עדיין לא מחובר בפועל** — ראו `src/lib/firebaseClient.js` ו-`.env.example`. עד לחיבור, האתר פתוח במצב הדגמה עם נתוני דוגמה קבועים בקוד (`src/data/sampleData.js`), וההתחברות לא אוכפת (כל מי שנכנס רואה את האתר).
- אפליקציית דסקטופ אופליין (Electron) בנויה ועובדת.

## הרצה מקומית

```bash
npm install
npm run dev
```

נפתח על http://localhost:5173

## חיבור ל-Firebase (כשתהיה מוכן)

1. צור פרויקט חדש ב-[console.firebase.google.com](https://console.firebase.google.com).
2. הוסף אפליקציית Web לפרויקט (הסמל `</>`) וקבל את פרטי ה-config.
3. הפעל בפרויקט: **Authentication** → Sign-in method → הפעל **Google** ו-**Email/Password**.
4. העתק את `.env.example` ל-`.env` (הקובץ לא נכנס ל-git).
5. מלא את משתני ה-`VITE_FIREBASE_*` מתוך פרטי ה-config שקיבלת בשלב 2.
6. הפעל מחדש את `npm run dev`.

## פריסה

- **אתר חי:** https://5825434.github.io/mein-phone/ — מתעדכן בכל הרצה של `npm run deploy`.
- **דסקטופ אופליין (Electron):**
  - `npm run electron:dev` — מריץ את האפליקציה בחלון דסקטופ מול שרת הפיתוח (לבדיקה בזמן פיתוח).
  - `npm run electron:build` — בונה קובץ התקנה (`.exe`, NSIS). האפליקציה עובדת לגמרי אופליין (אין תלות ברשת בשלב הזה, כי אין עדיין חיבור אמיתי ל-Firebase).
  - **בעיה ידועה בנתיב עברי:** בגלל שהתיקייה של הפרויקט הזה (`D:\יוסי ברנדוין\מיין פון`) מכילה תווים בעברית, ל-`electron-builder` יש באג ידוע ב-Windows בשלב ה-rename הפנימי שלו (`EPERM: operation not permitted`). הפתרון: להריץ עם נתיב פלט זמני באנגלית, ואז להעתיק את קובץ ה-`.exe` המוגמר לאן שנוח:
    ```bash
    npx electron-builder --config.directories.output="C:\temp\mein-phone-release"
    ```
    קובץ ההתקנה האחרון שנבנה נמצא בתיקיית `installer-output/` (לא נכנס ל-git בגלל הגודל).
- הניתוב במערכת (`HashRouter`) נבחר בכוונה כדי לעבוד גם ב-GitHub Pages וגם באפליקציית הדסקטופ, בלי הגדרות שרת מיוחדות.
- כרגע גרסת הדסקטופ וגרסת האתר **לא מסונכרנות** — כל אחת עצמאית עם נתוני הדוגמה. שכבת הסנכרון האמיתית (סעיף 5.1 באיפיון) תיבנה יחד עם חיבור Firebase.

## מבנה תיקיות

```
src/
  components/   רכיבים משותפים (Sidebar, Layout, KpiCard, StatusBadge, CustomerDrawer...)
  pages/        מסך לכל מודול, כולל Login
  data/         נתוני דוגמה זמניים
  lib/          חיבור Firebase (auth) + AuthContext
```
