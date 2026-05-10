import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { Category } from '@/lib/types'

export default function Dashboard() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    // Mock data - בפרוייקט אמיתי יהיה שליפה מ-Airtable
    setCategories([
      {
        name: 'ביטחון בה״א',
        count: { pending: 3, readyGraphic: 5, readyPublish: 12, published: 45 },
      },
      {
        name: 'דרכי החסידות',
        count: { pending: 2, readyGraphic: 4, readyPublish: 8, published: 32 },
      },
      {
        name: 'נשים',
        count: { pending: 1, readyGraphic: 3, readyPublish: 6, published: 28 },
      },
      {
        name: 'עידוד וחיזוק',
        count: { pending: 4, readyGraphic: 7, readyPublish: 15, published: 52 },
      },
    ])
    setLoading(false)
  }, [user, router])

  if (!user) return null

  const totalPending = categories.reduce((acc, cat) => acc + cat.count.pending, 0)
  const totalReadyGraphic = categories.reduce((acc, cat) => acc + cat.count.readyGraphic, 0)
  const totalReadyPublish = categories.reduce((acc, cat) => acc + cat.count.readyPublish, 0)
  const totalPublished = categories.reduce((acc, cat) => acc + cat.count.published, 0)

  return (
    <>
      <Head>
        <title>דשבורד - אור החסידות</title>
      </Head>

      <div className="min-h-screen bg-hebrew-50 dark:bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-hebrew-700 dark:text-hebrew-100 mb-2">
                📊 דשבורד
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                ברוכים הבאים, {user.name}!
              </p>
            </div>
            <button
              onClick={() => {
                useAuthStore.setState({ user: null })
                localStorage.removeItem('user')
                router.push('/')
              }}
              className="btn-secondary"
            >
              התנתק
            </button>
          </div>

          {/* סטטיסטיקות כוללות */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{totalPending}</div>
              <p className="font-bold text-sm">ממתין לאישור</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">{totalReadyGraphic}</div>
              <p className="font-bold text-sm">מוכן לגרפיקה</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{totalReadyPublish}</div>
              <p className="font-bold text-sm">מוכן לפרסום</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{totalPublished}</div>
              <p className="font-bold text-sm">פורסם</p>
            </div>
          </div>

          {/* סטטיסטיקות לפי קטגוריה */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">תמונת מצב לפי קטגוריה</h2>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.name} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-bold mb-3">{cat.name}</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">ממתין לאישור</p>
                      <p className="text-2xl font-bold text-yellow-600">{cat.count.pending}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">מוכן לגרפיקה</p>
                      <p className="text-2xl font-bold text-orange-600">{cat.count.readyGraphic}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">מוכן לפרסום</p>
                      <p className="text-2xl font-bold text-green-600">{cat.count.readyPublish}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">פורסם</p>
                      <p className="text-2xl font-bold text-purple-600">{cat.count.published}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* קישורים ביצירים */}
          {user.role === 'editor' && (
            <div className="grid grid-cols-2 gap-4">
              <Link href="/create" className="card-hover flex flex-col items-center justify-center p-8">
                <div className="text-5xl mb-4">✍️</div>
                <div className="font-bold text-lg">יצירת תוכן</div>
              </Link>
              <Link href="/search" className="card-hover flex flex-col items-center justify-center p-8">
                <div className="text-5xl mb-4">🔍</div>
                <div className="font-bold text-lg">חיפוש וערוך</div>
              </Link>
            </div>
          )}

          {user.role === 'admin' && (
            <div className="grid grid-cols-3 gap-4">
              <Link href="/approval" className="card-hover flex flex-col items-center justify-center p-8">
                <div className="text-5xl mb-4">✅</div>
                <div className="font-bold text-lg">אישור תוכן</div>
              </Link>
              <Link href="/search" className="card-hover flex flex-col items-center justify-center p-8">
                <div className="text-5xl mb-4">🔍</div>
                <div className="font-bold text-lg">חיפוש</div>
              </Link>
              <Link href="/admin" className="card-hover flex flex-col items-center justify-center p-8">
                <div className="text-5xl mb-4">⚙️</div>
                <div className="font-bold text-lg">ניהול</div>
              </Link>
            </div>
          )}

          {user.role === 'designer' && (
            <Link href="/design" className="card-hover flex flex-col items-center justify-center p-8">
              <div className="text-5xl mb-4">🎨</div>
              <div className="font-bold text-lg">עיצובים מוכנים</div>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
