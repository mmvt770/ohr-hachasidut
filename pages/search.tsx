import Head from 'next/head'
import { useState } from 'react'

const STATUSES = ['חדש', 'מוכן לגרפיקה', 'בעיצוב', 'מוכן לפרסום', 'פורסם', 'נפסל']
const CATEGORIES = ['ביטחון בה״א', 'דרכי החסידות', 'נשים', 'כללי']

// Mock data - בפועל יגיע מ-Airtable
const MOCK_ITEMS = [
  {
    id: 1,
    title: 'פתגם על אמונה',
    text: 'אמונה היא כוח עצום שמעביר הרים',
    category: 'ביטחון בה״א',
    status: 'מוכן לפרסום',
    publishDate: '2026-05-15',
    editorName: 'דוד כהן',
  },
  {
    id: 2,
    title: 'דרכי החסידות היומיות',
    text: 'בעבודת ה״ב צריך לשמור על סדר',
    category: 'דרכי החסידות',
    status: 'בעיצוב',
    publishDate: '2026-05-16',
    editorName: 'יוסף לוי',
  }
]

export default function Search({ user }: any) {
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [items, setItems] = useState(MOCK_ITEMS)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const filteredItems = items.filter(item => {
    const matchesText = item.title.includes(searchText) || item.text.includes(searchText)
    const matchesStatus = !filterStatus || item.status === filterStatus
    const matchesCategory = !filterCategory || item.category === filterCategory
    return matchesText && matchesStatus && matchesCategory
  })

  const handleDuplicate = (item: any) => {
    // ניתוב ליצירת תוכן עם טעון הנתונים
    console.log('שכפול:', item)
    alert('שכפול התוכן ל"יצירת תוכן"')
  }

  if (!user) {
    return <div className="p-8 text-center">⛔ אתה לא מחובר</div>
  }

  return (
    <>
      <Head>
        <title>חיפוש תוכן - אור החסידות</title>
      </Head>
      
      <div className="min-h-screen bg-hebrew-50 dark:bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="hebrew-title mb-8">🔍 חיפוש תוכן</h1>

          {/* סינון וחיפוש */}
          <div className="card space-y-4 mb-8">
            <input
              type="text"
              placeholder="חיפוש לפי כותרת או טקסט..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">כל הסטטוסים</option>
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">כל הקטגוריות</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* תוצאות */}
          <div className="space-y-4">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="card hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 preserve-text">
                      {item.text.substring(0, 100)}...
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`status-${item.status.replace(/\s+/g, '-').toLowerCase()}`}>
                        {item.status}
                      </span>
                      <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                        {item.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        📅 {item.publishDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicate(item)
                      }}
                      className="btn-secondary px-3 py-1 text-sm"
                    >
                      📋 שכפל
                    </button>
                  </div>
                </div>

                {/* הצגה מורחבת */}
                {selectedItem?.id === item.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="preserve-text whitespace-pre-line text-right">
                      {item.text}
                    </p>
                    <p className="text-sm text-gray-500 mt-4">✍️ על ידי: {item.editorName}</p>
                  </div>
                )}
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-gray-500 text-lg">לא נמצאו תוצאות</p>
              </div>
            )}
          </div>

          {/* חזור */}
          <button
            onClick={() => window.history.back()}
            className="btn-secondary mt-8"
          >
            ← חזור
          </button>
        </div>
      </div>
    </>
  )
}
