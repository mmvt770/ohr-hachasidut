import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (role: 'editor' | 'admin' | 'designer') => {
    if (!email || !password) {
      alert('נא למלא אימייל וסיסמא')
      return
    }

    setLoading(true)
    try {
      // בפרוייקט אמיתי - יהיה חיבור ל-backend
      const userData = {
        id: Math.random().toString(36),
        email,
        name: email.split('@')[0],
        role,
      }

      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // ניתוב לפי תפקיד
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      alert('שגיאה בכניסה')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <>
        <Head>
          <title>אור החסידות - מערכת ניהול תוכן</title>
        </Head>
        <div className="min-h-screen bg-hebrew-50 dark:bg-gray-950 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-hebrew-700 dark:text-hebrew-100 mb-2">
              🌟 אור החסידות
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              ברוכים הבאים, {user.name}! ({user.role})
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user.role === 'editor' && (
                <>
                  <button
                    onClick={() => router.push('/create')}
                    className="card-hover flex flex-col items-center justify-center p-6 h-32"
                  >
                    <div className="text-4xl mb-2">✍️</div>
                    <div className="font-bold text-center">יצירת תוכן</div>
                  </button>

                  <button
                    onClick={() => router.push('/search')}
                    className="card-hover flex flex-col items-center justify-center p-6 h-32"
                  >
                    <div className="text-4xl mb-2">🔍</div>
                    <div className="font-bold text-center">חיפוש</div>
                  </button>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => router.push('/approval')}
                    className="card-hover flex flex-col items-center justify-center p-6 h-32"
                  >
                    <div className="text-4xl mb-2">✅</div>
                    <div className="font-bold text-center">אישור תוכן</div>
                  </button>

                  <button
                    onClick={() => router.push('/admin')}
                    className="card-hover flex flex-col items-center justify-center p-6 h-32"
                  >
                    <div className="text-4xl mb-2">⚙️</div>
                    <div className="font-bold text-center">ניהול</div>
                  </button>

                  <button
                    onClick={() => router.push('/search')}
                    className="card-hover flex flex-col items-center justify-center p-6 h-32"
                  >
                    <div className="text-4xl mb-2">🔍</div>
                    <div className="font-bold text-center">חיפוש</div>
                  </button>
                </>
              )}

              {user.role === 'designer' && (
                <button
                  onClick={() => router.push('/design')}
                  className="card-hover flex flex-col items-center justify-center p-6 h-32"
                >
                  <div className="text-4xl mb-2">🎨</div>
                  <div className="font-bold text-center">עיצוב</div>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                useAuthStore.setState({ user: null })
                localStorage.removeItem('user')
                setUser(null)
              }}
              className="btn-secondary mt-8"
            >
              התנתק
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>כניסה - אור החסידות</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-hebrew-100 to-hebrew-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-hebrew-600 dark:text-hebrew-100 text-center mb-2">
            🌟 אור החסידות
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            מערכת ניהול תוכן
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

          <div className="space-y-3">
            <button
              onClick={() => handleLogin('editor')}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? '⏳ טוען...' : '✍️ כניסה כעורך'}
            </button>
            <button
              onClick={() => handleLogin('admin')}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? '⏳ טוען...' : '⚙️ כניסה כמנהל'}
            </button>
            <button
              onClick={() => handleLogin('designer')}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? '⏳ טוען...' : '🎨 כניסה כגרפיקאי'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            💡 כניסה זמנית - בפרוייקט אמיתי יהיה אימות אמיתי
          </p>
        </div>
      </div>
    </>
  )
}
