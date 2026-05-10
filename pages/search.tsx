import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'

interface Item {
  id: string
  title: string
  text: string
  contentType: string
  category: string
  status: string
  publishDate: string
  editorName: string
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
  },
]

const CONTENT_TYPES = ['פתגמים', 'אגרות קודש', 'חינוך יומי', 'עידוד וחיזוק']
const CATEGORIES = ['ביטחון בה״א', 'דרכי החסידות', 'נשים', 'כללי']
const STATUSES = ['חדש', 'ממתין לאישור', 'מוכן לגרפיקה', 'בעיצוב', 'מוכן לפרסום', 'פורסם', 'נפסל']

export default function Search() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS)
  const [searchText, setSearchText] = useState('')
  const [filterContentType, setFilterContentType] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  useEffect(() => {
    if (!user || (user.role !== 'editor' && user.role !== 'admin')) {
      router.push('/')
    }
  }, [user, router])

  const filteredItems = items.filter((item) => {
    const matchesText =
      item.title.includes(searchText) || item.text.includes(searchText)
    const matchesType = !filterContentType || item.contentType === filterContentType
    const matchesCategory = !filterCategory || item.category === filterCategory
    const matchesStatus = !filterStatus || item.status === filterStatus
    const matchesDateFrom = !filterDateFrom || item.publishDate >= filterDateFrom
    const matchesDateTo = !filterDateTo || item.publishDate <= filterDateTo

    return (
      matchesText &&
      matchesType &&
      matchesCategory &&
      matchesStatus &&
      matchesDateFrom &&
      matchesDateTo
    )
  })

  if (!user) return null

  return (
    <>
      <Head>
        <title>חיפוש - אור החסידות</title>
      </Head>

      <div className="min-h-screen bg-hebrew-50 dark:bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 text-hebrew-600 hover:text-hebrew-700 font-bold"
          >
            ← חזור
          </button>

          <h1 className="text-3xl font-bold text-hebrew-700 dark:text-hebrew-100 mb-8">
            🔍 חיפוש תוכן
          </h1>

          {/* סינון וחיפוש */}
          <div className="card mb-8 space-y-4">
            <div>
              <label className="form-label">חיפוש</label>
              <input
                type="text"
                placeholder="חיפוש לפי כותרת או טקסט..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="form-label">סוג תוכן</label>
                <select
                  value={filterContentType}
                  onChange={(e) => setFilterContentType(e.target.value)}
                  className="form-input"
                >
                  <option value="">הכל</option>
                  {CONTENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">קטגוריה</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="">הכל</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">סטטוס</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-input"
                >
                  <option value="">הכל</option>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">תאריך מ-</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">תאריך עד-</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* תוצאות */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500 text-lg">לא נמצאו תוצאות</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="card-hover cursor-pointer"
                  onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 preserve-text mb-3 line-clamp-2">
                        {item.text}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`status-badge status-${item.status.replace(/\s+/g, '-').toLowerCase()}`}>
                          {item.status}
                        </span>
                        <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                          {item.contentType}
                        </span>
                        <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                          {item.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          📅 {item.publishDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          alert('שכפול: ' + item.title)
                        }}
                        className="btn-secondary btn-sm"
                      >
                        📋 שכפל
                      </button>
                      {user.role === 'admin' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            alert('עריכה: ' + item.title)
                          }}
                          className="btn-secondary btn-sm"
                        >
                          ✏️ ערוך
                        </button>
                      )}
                    </div>
                  </div>

                  {/* הצגה מורחבת */}
                  {selectedItem?.id === item.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="preserve-text whitespace-pre-line text-right">
                        {item.text}
                      </p>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>✍️ עורך: {item.editorName}</p>
                        <p>📅 תאריך: {item.publishDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
