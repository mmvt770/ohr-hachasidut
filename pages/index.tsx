import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  user: any
  setUser: (user: any) => void
}

export default function Home({ user, setUser }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (role: string) => {
    const userData = { email, password, role }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    // ניתוב לפי תפקיד
    if (role === 'editor') window.location.href = '/create'
    else if (role === 'admin') window.location.href = '/admin'
    else if (role === 'designer') window.location.href = '/design'
  }

  if (user) {
    return (
      <>
        <Head>
          <title>אור החסידות - ניהול תוכן</title>
        </Head>
        <div className="min-h-screen bg-hebrew-50 dark:bg-gray-950 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="hebrew-title mb-8 text-center">אור החסידות</h1>
            
            <div className="grid grid-cols-3 gap-6">
              {user.role === 'editor' && (
                <Link href="/create" className="card hover:shadow-lg transition">
                  <h2 className="text-xl font-bold mb-2">✍️ יצירת תוכן</h2>
                  <p className="text-gray-600">העלאת פתגמים ותוכן חדש</p>
                </Link>
              )}
              
              {(user.role === 'editor' || user.role === 'admin') && (
                <Link href="/search" className="card hover:shadow-lg transition">
                  <h2 className="text-xl font-bold mb-2">🔍 חיפוש</h2>
                  <p className="text-gray-600">חיפוש ועריכת תוכן קיים</p>
                </Link>
              )}
              
              {user.role === 'designer' && (
                <Link href="/design" className="card hover:shadow-lg transition">
                  <h2 className="text-xl font-bold mb-2">🎨 עיצוב</h2>
                  <p className="text-gray-600">העלאת עיצובים סופיים</p>
                </Link>
              )}
              
              {user.role === 'admin' && (
                <Link href="/admin" className="card hover:shadow-lg transition">
                  <h2 className="text-xl font-bold mb-2">⚙️ ניהול</h2>
                  <p className="text-gray-600">ניהול מערכת וספרים</p>
                </Link>
              )}
            </div>
            
            <button
              onClick={() => {
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
        <title>אור החסידות - כניסה</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-hebrew-100 to-hebrew-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="hebrew-title text-center mb-8">אור החסידות</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            מערכת ניהול תוכן
          </p>

          <div className="space-y-4 mb-6">
            <input
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              dir="ltr"
            />
            <input
              type="password"
              placeholder="סיסמא"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleLogin('editor')}
              className="btn-primary w-full"
            >
              כניסה כעורך
            </button>
            <button
              onClick={() => handleLogin('admin')}
              className="btn-primary w-full"
            >
              כניסה כמנהל
            </button>
            <button
              onClick={() => handleLogin('designer')}
              className="btn-primary w-full"
            >
              כניסה כגרפיקאי
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
