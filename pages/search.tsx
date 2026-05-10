import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

interface Item {
  id: string
  title: string
  text: string
  contentType: string
  category: string
  status: string
  publishDate: string
  editorName: string
  sourceBook: string
}

const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    title: 'פתגם על אמונה',
    text: 'אמונה היא כוח עצום שמעביר הרים. כאשר אנו מאמינים בה׳ באמונה תמימה, כל הקשיים והחסומים מתפרקים.',
    contentType: 'פתגמים',
    category: 'ביטחון בה״א',
    status: 'מוכן לפרסום',
    publishDate: '2026-05-15',
    editorName: 'דוד כהן',
    sourceBook: 'תניא',
  },
  {
    id: '2',
    title: 'דרכי החסידות היומיות',
    text: 'בעבודת ה״ב צריך לשמור על סדר וקביעות.',
    contentType: 'חינוך יומי',
    category: 'דרכי החסידות',
    status: 'בעיצוב',
    publishDate: '2026-05-16',
    editorName: 'יוסף לוי',
    sourceBook: 'אגרות קודש',
  },
  {
    id: '3',
    title: 'עצה לחיזוק',
    text: 'בעת קושי - יש לזכור שהקב״ה תמיד איתנו.',
    contentType: 'עידוד וחיזוק',
    category: 'ביטחון בה״א',
    status: 'פורסם',
    publishDate: '2026-04-20',
    editorName: 'יוסף לוי',
    sourceBook: 'ספר השיחות',
  },
]

export default function Search() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const u = JSON.parse(savedUser)
      if (u.role === 'editor' || u.role === 'admin') {
        setUser(u)
      } else {
        router.push('/dashboard')
      }
    } else {
      router.push('/')
    }
  }, [router])

  const filtered = MOCK_ITEMS.filter((item) => {
    const matchText = item.title.includes(searchText) || item.text.includes(searchText)
    const matchType = !filterType || item.contentType === filterType
    const matchCat = !filterCategory || item.category === filterCategory
    const matchStatus = !filterStatus || item.status === filterStatus
    return matchText && matchType && matchCat && matchStatus
  })

  if (!mounted || !user) return null

  return (
    <>
      <Head>
        <title>חיפוש - אור החסידות</title>
      </Head>

      <Layout title="🔍 חיפוש פתגמים">
        <div className="animate-fade-in space-y-4">
          <div className="card">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="🔍 חיפוש לפי כותרת או טקסט..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="form-input flex-1"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary whitespace-nowrap"
              >
                {showFilters ? '🔼 הסתר' : '🔽 סינון'}
              </button>
            </div>

            {showFilters && (
              <div
                className="mt-4 pt-4 grid grid-cols-2 md:grid-cols-3 gap-3"
                style={{ borderTop: '1px solid #d4c5a9' }}
              >
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input"
                >
                  <option value="">כל הסוגים</option>
                  <option value="פתגמים">פתגמים</option>
                  <option value="חינוך יומי">חינוך יומי</option>
                  <option value="עידוד וחיזוק">עידוד וחיזוק</option>
                </select>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="">כל הקטגוריות</option>
                  <option value="ביטחון בה״א">ביטחון בה״א</option>
                  <option value="דרכי החסידות">דרכי החסידות</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-input"
                >
                  <option value="">כל הסטטוסים</option>
                  <option value="מוכן לפרסום">מוכן לפרסום</option>
                  <option value="בעיצוב">בעיצוב</option>
                  <option value="פורסם">פורסם</option>
                </select>
              </div>
            )}
          </div>

          <p className="font-bold" style={{ color: '#6b5535' }}>
            נמצאו {filtered.length} פתגמים
          </p>

          <div>
            {filtered.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg" style={{ color: '#6b5535' }}>לא נמצאו תוצאות</p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className={`list-row ${selectedItem?.id === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2" style={{ color: '#3d2817' }}>
                        {item.title}
                      </h3>
                      <p
                        className="preserve-text mb-3"
                        style={{
                          color: '#6b5535',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.text}
                      </p>
                      <div className="flex gap-2 flex-wrap items-center">
                        <span className={`status-badge status-${item.status.replace(/\s+/g, '-')}`}>
                          {item.status}
                        </span>
                        <span className="tag">{item.contentType}</span>
                        <span className="tag">{item.category}</span>
                        <span className="text-xs" style={{ color: '#a89070' }}>
                          📅 {item.publishDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mr-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          alert('שכפול: ' + item.title)
                        }}
                        className="btn-secondary btn-sm"
                      >
                        📋 שכפל
                      </button>
                    </div>
                  </div>

                  {selectedItem?.id === item.id && (
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid #d4c5a9' }}>
                      <h4 className="font-bold mb-2" style={{ color: '#3d2817' }}>
                        📜 הטקסט המלא:
                      </h4>
                      <p
                        className="preserve-text whitespace-pre-line p-4 rounded-lg"
                        style={{ backgroundColor: '#fef9f0' }}
                      >
                        {item.text}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}
