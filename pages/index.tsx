import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // בדוק אם משתמש כבר מחובר
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      router.push('/dashboard')
    }
  }, [router])

  const handleLogin = (role: 'editor' | 'admin' | 'designer') => {
    if (!email || !password) {
      alert('נא למלא אימייל וסיסמא')
      return
    }

    setLoading(true)
    try {
      const userData = {
        id: Math.random().toString(36),
        email,
        name: email.split('@')[0],
        role,
      }

      localStorage.setItem('user', JSON.stringify(userData))
      router.push('/dashboard')
    } catch (error) {
      alert('שגיאה בכניסה')
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="text-2xl text-[#3d2817]">⏳ טוען...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>כניסה - אור החסידות</title>
      </Head>

      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, #f5f0e8 0%, #e8d5b7 100%)',
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
          {/* Left side - Hero */}
          <div
            className="p-12 text-white flex flex-col justify-center"
            style={{
              background:
                'linear-gradient(135deg, #3d2817 0%, #5a3a22 50%, #8b6f47 100%)',
            }}
          >
            <h1 className="text-5xl font-bold mb-4">🌟</h1>
            <h2 className="text-4xl font-bold mb-4">אור החסידות</h2>
            <p className="text-lg mb-8" style={{ color: '#e8d5b7' }}>
              מערכת ניהול תוכן מקצועית
            </p>
            <div className="space-y-3" style={{ color: '#e8d5b7' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">✍️</span>
                <span>יצירת תוכן יומי</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <span>חיפוש מתקדם</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <span>דשבורד וסטטיסטיקות</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎨</span>
                <span>ניהול עיצובים</span>
              </div>
            </div>
          </div>

          {/* Right side - Login */}
          <div className="p-12 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#3d2817' }}>
              ברוכים הבאים
            </h3>
            <p className="mb-8" style={{ color: '#6b5535' }}>
              בחר את התפקיד שלך והתחבר
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="form-label">אימייל</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="your@email.com"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="form-label">סיסמא</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleLogin('editor')}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <span>✍️</span>
                <span>כניסה כעורך</span>
              </button>
              <button
                onClick={() => handleLogin('admin')}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <span>⚙️</span>
                <span>כניסה כמנהל</span>
              </button>
              <button
                onClick={() => handleLogin('designer')}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <span>🎨</span>
                <span>כניסה כגרפיקאי</span>
              </button>
            </div>

            <p className="text-xs text-center mt-6" style={{ color: '#a89070' }}>
              💡 כניסה זמנית למערכת ההדגמה
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
