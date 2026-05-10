# 🚀 הוראות הקמת Repository ב-GitHub

## שלב 1: צור Repository חדש
1. היכנס ל: https://github.com/new
2. מלא:
   - **Repository name:** `ohr-hachasidut`
   - **Description:** מערכת ניהול תוכן - אור החסידות
   - **Privacy:** Public (או Private אם תרצה)
3. **לא** בחר "Initialize with README" (יש לנו כבר)
4. לחץ **Create repository**

## שלב 2: העלה את הקוד
אחרי שיצרת את ה-repo, GitHub יתן לך הוראות. הריץ:

```bash
cd /home/claude/ohr-hachasidut

git remote add origin https://github.com/mmvt770/ohr-hachasidut.git
git branch -M main
git push -u origin main
```

## שלב 3: Vercel Deployment
1. היכנס ל: https://vercel.com/new
2. בחר: **Import Git Repository**
3. בחר: `mmvt770/ohr-hachasidut`
4. לחץ: **Deploy**

✅ **זהו! האפליקציה שלך תהיה בחיים ב-Vercel!**

---

## 📍 כתובת הדומיין:
```
https://ohr-hachasidut.vercel.app
```

## 🔓 כניסה לדוגמא:
- **עורך:** editor@example.com / any password
- **גרפיקאי:** designer@example.com / any password  
- **מנהל:** admin@example.com / any password

---

**סיים את שלבים אלה וקבל קישור חי!**
