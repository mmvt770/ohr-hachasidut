import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

interface CategoryStats {
  name: string
  pending: number
  readyGraphic: number
  readyPublish: number
  published: number
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  const categories: CategoryStats[] = [
    { name: 'ביטחון בה״א', pending: 3, readyGraphic: 5, readyPublish: 12, published: 45 },
    { name: 'דרכי החסידות', pending: 2, readyGraphic: 4, readyPublish: 8, published: 32 },
    { name: 'נשים', pending: 1, readyGraphic: 3, readyPublish: 6, published: 28 },
    { name: 'עידוד וחיזוק', pending: 4, readyGraphic: 7, readyPublish: 15, published: 52 },
  ]

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      router.push('/')
    }
  }, [router])

  if (!mounted || !user) return null

  const total = {
    pending: categories.reduce((s, c) => s + c.pending, 0),
    readyGraphic: categories.reduce((s, c) => s + c.readyGraphic, 0),
    readyPublish: categories.reduce((s, c) => s + c.readyPublish, 0),
    published: categories.reduce((s, c) => s + c.published, 0),
  }

  return (
    <>
      <Head>
        <title>דשבורד - אור החסידות</title>
      </Head>

      <Layout title="📊 דשבורד">
        <div className="animate-fade-in space-y-6">
          {/* Welcome */}
          <div className="card">
            <h2 className="text-xl font-bold mb-2" style={{ color: '#3d2817' }}>
              ברוכים הבאים, {user.name}! 👋
            </h2>
            <p style={{ color: '#6b5535' }}>
              הינה תמונת מצב כללית של המערכת
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="text-4xl mb-2">⏳</div>
              <div className="stat-number" style={{ color: '#92400e' }}>{total.pending}</div>
              <div className="stat-label">ממתין לאישור</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl mb-2">🎨</div>
              <div className="stat-number" style={{ color: '#c2410c' }}>{total.readyGraphic}</div>
              <div className="stat-label">מוכן לגרפיקה</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl mb-2">✅</div>
              <div className="stat-number" style={{ color: '#065f46' }}>{total.readyPublish}</div>
              <div className="stat-label">מוכן לפרסום</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl mb-2">🌟</div>
              <div className="stat-number" style={{ color: '#6b21a8' }}>{total.published}</div>
              <div className="stat-label">פורסמו</div>
            </div>
          </div>

          {/* Categories Table */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#3d2817' }}>
              📚 תמונת מצב לפי קטגוריה
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '2px solid #d4c5a9' }}>
                    <th className="text-right py-3 px-4 font-bold" style={{ color: '#3d2817' }}>קטגוריה</th>
                    <th className="text-center py-3 px-4 font-bold" style={{ color: '#92400e' }}>ממתין</th>
                    <th className="text-center py-3 px-4 font-bold" style={{ color: '#c2410c' }}>לגרפיקה</th>
                    <th className="text-center py-3 px-4 font-bold" style={{ color: '#065f46' }}>לפרסום</th>
                    <th className="text-center py-3 px-4 font-bold" style={{ color: '#6b21a8' }}>פורסם</th>
                    <th className="text-center py-3 px-4 font-bold" style={{ color: '#3d2817' }}>סה"כ</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, idx) => (
                    <tr
                      key={cat.name}
                      style={{
                        borderBottom: '1px solid #d4c5a9',
                        backgroundColor: idx % 2 === 0 ? 'white' : '#fef9f0',
                      }}
                    >
                      <td className="py-4 px-4 font-bold" style={{ color: '#3d2817' }}>{cat.name}</td>
                      <td className="text-center py-4 px-4">
                        <span className="status-badge status-pending">{cat.pending}</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="status-badge status-ready-graphic">{cat.readyGraphic}</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="status-badge status-ready-publish">{cat.readyPublish}</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="status-badge status-published">{cat.published}</span>
                      </td>
                      <td className="text-center py-4 px-4 font-bold" style={{ color: '#3d2817' }}>
                        {cat.pending + cat.readyGraphic + cat.readyPublish + cat.published}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#3d2817' }}>
              ⚡ פעולות מהירות
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.role === 'editor' && (
                <>
                  <button onClick={() => router.push('/create')} className="card-hover text-center">
                    <div className="text-4xl mb-2">✍️</div>
                    <div className="font-bold" style={{ color: '#3d2817' }}>פתגם חדש</div>
                  </button>
                  <button onClick={() => router.push('/search')} className="card-hover text-center">
                    <div className="text-4xl mb-2">🔍</div>
                    <div className="font-bold" style={{ color: '#3d2817' }}>חיפוש</div>
                  </button>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <button onClick={() => router.push('/approval')} className="card-hover text-center">
                    <div className="text-4xl mb-2">✅</div>
                    <div className="font-bold" style={{ color: '#3d2817' }}>אישור</div>
                  </button>
                  <button onClick={() => router.push('/search')} className="card-hover text-center">
                    <div className="text-4xl mb-2">🔍</div>
                    <div className="font-bold" style={{ color: '#3d2817' }}>חיפוש</div>
                  </button>
                  <button onClick={() => router.push('/admin')} className="card-hover text-center">
                    <div className="text-4xl mb-2">⚙️</div>
                    <div className="font-bold" style={{ color: '#3d2817' }}>ניהול</div>
                  </button>
                </>
              )}
              {user.role === 'designer' && (
                <button onClick={() => router.push('/design')} className="card-hover text-center">
                  <div className="text-4xl mb-2">🎨</div>
                  <div className="font-bold" style={{ color: '#3d2817' }}>עיצוב</div>
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
