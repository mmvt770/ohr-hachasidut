import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import Layout from '@/components/Layout'

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
    text: 'בעבודת ה״ב צריך לשמור על סדר וקביעות. כל יום צריך להיות זהה לקודמו בעבודה הרוחנית.',
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
    text: 'בעת קושי - יש לזכור שהקב״ה תמיד איתנו ולא לאבד תקווה.',
    contentType: 'עידוד וחיזוק',
    category: 'ביטחון בה״א',
    status: 'פורסם',
    publishDate: '2026-04-20',
    editorName: 'יוסף לוי',
    sourceBook: 'ספר השיחות',
  },
]

const CONTENT_TYPES = ['פתגמים', 'אגרות קודש', 'חינוך יומי', 'עידוד וחיזוק']
const CATEGORIES = ['ביטחון בה״א', 'דרכי החסידות', 'נשים', 'כללי']
const STATUSES = ['חדש', 'ממתין לאישור', 'מוכן לגרפיקה', 'בעיצוב', 'מוכן לפרסום', 'פורסם', 'נפסל']
const BOOKS = ['תניא', 'אגרות קודש', 'ספר השיחות', 'מענות לשאלות']

export default function Search() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [items] = useState<Item[]>(MOCK_ITEMS)
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterBook, setFilterBook] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (!user || (user.role !== 'editor' && user.role !== 'admin')) {
      router.push('/')
    }
  }, [user, router])

  const filtered = items.filter((item) => {
    const matchText = item.title.includes(searchText) || item.text.includes(searchText)
    const matchType = !filterType || item.contentType === filterType
    const matchCat = !filterCategory || item.category === filterCategory
    const matchStatus = !filterStatus || item.status === filterStatus
    const matchBook = !filterBook || item.sourceBook === filterBook
    const matchFrom = !filterFrom || item.publishDate >= filterFrom
    const matchTo = !filterTo || item.publishDate <= filterTo
    return matchText && matchType && matchCat && matchStatus && matchBook && matchFrom && matchTo
  })

  const handleDuplicate = (item: Item) => {
    if (confirm(`לשכפל "${item.title}" ולעבור ליצירת תוכן?`)) {
      // בפרוייקט אמיתי - שמירה ב-state והעברה ל-/create
      sessionStorage.setItem('duplicateItem', JSON.stringify(item))
      router.push('/create')
    }
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>חיפוש - אור החסידות</title>
      </Head>

      <Layout title="🔍 חיפוש פתגמים">
        <div className="animate-fade-in space-y-4">
          {/* Search Bar */}
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
                {showFilters ? '🔼 הסתר' : '🔽 סינון מתקדם'}
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-[#d4c5a9] grid grid-cols-2 md:grid-cols-3 gap-3 animate-fade-in">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input"
                >
                  <option value="">כל הסוגים</option>
                  {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="">כל הקטגוריות</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-input"
                >
                  <option value="">כל הסטטוסים</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                  value={filterBook}
                  onChange={(e) => setFilterBook(e.target.value)}
                  className="form-input"
                >
                  <option value="">כל הספרים</option>
                  {BOOKS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <input
                  type="date"
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  className="form-input"
                  placeholder="מתאריך"
                />
                <input
                  type="date"
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                  className="form-input"
                  placeholder="עד תאריך"
                />
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex justify-between items-center">
            <p className="text-[#6b5535] font-bold">
              נמצאו {filtered.length} פתגמים
            </p>
          </div>

          {/* List */}
          <div>
            {filtered.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-[#6b5535] text-lg">לא נמצאו תוצאות</p>
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
                      <h3 className="text-lg font-bold text-[#3d2817] mb-2">{item.title}</h3>
                      <p className="text-[#6b5535] preserve-text mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.text}
                      </p>
                      <div className="flex gap-2 flex-wrap items-center">
                        <span className={`status-badge status-${item.status.replace(/\s+/g, '-')}`}>
                          {item.status}
                        </span>
                        <span className="tag">{item.contentType}</span>
                        <span className="tag">{item.category}</span>
                        <span className="text-xs text-[#a89070]">📅 {item.publishDate}</span>
                        <span className="text-xs text-[#a89070]">📖 {item.sourceBook}</span>
                        <span className="text-xs text-[#a89070]">✍️ {item.editorName}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mr-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicate(item)
                        }}
                        className="btn-secondary btn-sm"
                        title="שכפל פריט"
                      >
                        📋 שכפל
                      </button>
                      {user.role === 'admin' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            alert('עריכה של: ' + item.title)
                          }}
                          className="btn-secondary btn-sm"
                          title="ערוך"
                        >
                          ✏️ ערוך
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded view */}
                  {selectedItem?.id === item.id && (
                    <div className="mt-4 pt-4 border-t border-[#d4c5a9] animate-fade-in">
                      <h4 className="font-bold text-[#3d2817] mb-2">📜 הטקסט המלא:</h4>
                      <p className="preserve-text whitespace-pre-line bg-[#fef9f0] p-4 rounded-lg">
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
