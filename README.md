# 🌟 אור החסידות - מערכת ניהול תוכן

> מערכת מקצועית וחזקה לניהול תוכן יומי עבור "אור החסידות"

## 📋 מה בתוך?

### 👥 תפקידים וממשקים

| תפקיד | ממשקים | תכונות |
|------|--------|--------|
| **עורך** | יצירה, חיפוש | העלאת פתגמים, חיפוש וערוך, שכפול |
| **מנהל** | אישור, ניהול, חיפוש | אישור/דחיית תוכן, ניהול ספרים, סטטיסטיקות |
| **גרפיקאי** | עיצוב | העלאת עיצובים סופיים |

### 📱 דפים ותכונות

- **🏠 דף בית (/)** - כניסה בעברית מלאה
- **📊 דשבורד** - סטטיסטיקות וסקירה כוללת
- **✍️ יצירת תוכן** - טופס יצירה עם שמירת מבנה טקסט
- **🔍 חיפוש** - חיפוש וסינון מתקדם לפי קטגוריה, תאריך, סוג
- **✅ אישור** - ממשק אישור תוכן למנהל
- **🎨 עיצוב** - העלאת עיצובים סופיים
- **⚙️ ניהול** - ניהול ספרים וסטטיסטיקות

## 🚀 התחלה מהירה

### דרישות

- Node.js 18+
- npm / yarn

### התקנה

```bash
git clone https://github.com/mmvt770/ohr-hachasidut-pro.git
cd ohr-hachasidut-pro
npm install
```

### פיתוח

```bash
npm run dev
```

פתח את [http://localhost:3000](http://localhost:3000)

### בנייה לייצור

```bash
npm run build
npm start
```

## 🔧 הגדרות Airtable

1. צור Base חדש ב-Airtable
2. צור טבלה "Content" עם השדות הבאים:
   - `Title` (Text)
   - `Text` (Long Text)
   - `ContentType` (Select)
   - `Category` (Select)
   - `SourceBook` (Select)
   - `SourcePart` (Text)
   - `SourcePage` (Text)
   - `Topics` (Multiple Select)
   - `PublishDate` (Date)
   - `EditorName` (Text)
   - `SourceImage` (Attachment)
   - `FinalImage` (Attachment)
   - `Status` (Select)
   - `Notes` (Long Text)

3. הוסף את `.env.local`:
```bash
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id
NEXT_PUBLIC_AIRTABLE_API_KEY=your_api_key
```

## 🎨 עיצוב וטכנולוגיה

- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **React Hook Form** - Form Management
- **Airtable API** - Database

## 📊 מבנה הפרויקט

```
ohr-hachasidut-pro/
├── pages/
│   ├── index.tsx          (כניסה)
│   ├── dashboard.tsx      (דשבורד)
│   ├── create.tsx         (יצירת תוכן)
│   ├── search.tsx         (חיפוש)
│   ├── approval.tsx       (אישור)
│   ├── design.tsx         (עיצוב)
│   ├── admin.tsx          (ניהול)
│   ├── _app.tsx
│   └── _document.tsx
├── lib/
│   ├── airtable.ts        (Airtable API)
│   ├── types.ts           (TypeScript Types)
│   ├── store.ts           (Zustand Store)
│   └── utils.ts           (Utilities)
├── styles/
│   └── globals.css        (Global Styles)
└── public/
    └── favicon.ico
```

## 🔐 הרשאות והאבטחה

בפרויקט הנוכחי - הרשאות זמניות.

בפרוייקט אמיתי - יכללו:
- NextAuth.js או Firebase Auth
- JWT tokens
- Role-based access control
- Secure session management

## ✨ תכונות עתידיות

- [ ] אימות משתמשים אמיתי (Google OAuth / NextAuth)
- [ ] חיפוש בעזרת AI (זיהוי כפילויות)
- [ ] ייצוא ל-PDF וWord
- [ ] לוח שנה לתצוגת פרסום
- [ ] אוטומציות עם n8n/Make
- [ ] תמיכה בקובצים (Google Drive)

## 📞 תמיכה וברקנים

כל שגיאה או הערה - בואו נתקן ביחד!

## 📄 רישיון

עבור אור החסידות בלבד

---

**Built with ❤️ by Claude**
