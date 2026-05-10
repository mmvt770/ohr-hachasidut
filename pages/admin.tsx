import Head from 'next/head'
import { useState } from 'react'

export default function Admin({ user }: any) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [books, setBooks] = useState([
    { id: 1, name: 'תניא' },
    { id: 2, name: 'אגרות קודש' },
    { id: 3, name: 'ספר השיחות' },
  ])
  const [newBook, setNewBook] = useState('')

  const stats = {
    pending: 5,
    readyGraphic: 12,
    readyPublish: 28,
    published: 145,
  }

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (newBook.trim()) {
      setBooks([...books, { id: books.length + 1, name: newBook }])
      setNewBook('')
    }
  }

  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-center">⛔ אתה לא מחובר כמנהל</div>
  }

  return (
    <>
      <Head>
        <title>ניהול - אור החסידות</title>
      </Head>
      
      <div className="min-h-screen bg-hebrew-50 dark:bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="hebrew-title mb-8">⚙️ ניהול מערכת</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 font-bold ${
                activeTab === 'dashboard'
                  ? 'text-hebrew-600 border-b-2 border-hebrew-600'
                  : 'text-gray-600'
              }`}
            >
              📊 דשבורד
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 font-bold ${
                activeTab === 'books'
                  ? 'text-hebrew-600 border-b-2 border-hebrew-600'
                  : 'text-gray-600'
              }`}
            >
              📚 ניהול ספרים
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 font-bold ${
                activeTab === 'approvals'
                  ? 'text-hebrew-600 border-b-2 border-hebrew-600'
                  : 'text-gray-600'
              }`}
            >
              ✅ אישור תוכן
            </button>
          </div>

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">תמונת מצב</h2>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="card text-center">
                  <p className="text-4xl font-bold text-yellow-600 mb-2">{stats.pending}</p>
                  <p className="font-bold text-sm">ממתין לאישור</p>
                </div>
                <div className="card text-center">
                  <p className="text-4xl font-bold text-orange-600 mb-2">{stats.readyGraphic}</p>
                  <p className="font-bold text-sm">מוכן לגרפיקה</p>
                </div>
                <div className="card text-center">
                  <p className="text-4xl font-bold text-green-600 mb-2">{stats.readyPublish}</p>
                  <p className="font-bold text-sm">מוכן לפרסום</p>
                </div>
                <div className="card text-center">
                  <p className="text-4xl font-bold text-purple-600 mb-2">{stats.published}</p>
                  <p className="font-bold text-sm">פורסם</p>
                </div>
              </div>

              <div className="card">
                <h3 className="font-bold mb-4">סטטיסטיקות לפי קטגוריה</h3>
                <div className="space-y-3">
                  {['ביטחון בה״א', 'דרכי החסידות', 'נשים', 'כללי'].map(cat => (
                    <div key={cat} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="font-bold">{cat}</span>
                      <span className="text-gray-500">8 / 3 / 12</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Books Management */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">ניהול ספרים</h2>
              
              <div className="card">
                <h3 className="font-bold mb-4">הוסף ספר חדש</h3>
                <form onSubmit={handleAddBook} className="flex gap-2">
                  <input
                    type="text"
                    value={newBook}
                    onChange={(e) => setNewBook(e.target.value)}
                    placeholder="שם הספר החדש"
                    className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    ➕ הוסף
                  </button>
                </form>
              </div>

              <div className="card">
                <h3 className="font-bold mb-4">ספרים קיימים</h3>
                <div className="space-y-2">
                  {books.map(book => (
                    <div
                      key={book.id}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span className="font-bold">{book.name}</span>
                      <button
                        onClick={() => setBooks(books.filter(b => b.id !== book.id))}
                        className="text-red-600 hover:text-red-700 font-bold"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Approvals */}
          {activeTab === 'approvals' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">אישור תוכן</h2>
              
              <div className="card">
                <p className="text-center text-gray-500">
                  🔄 תוכנים ממתינים לאישור יופיעו כאן
                </p>
              </div>
            </div>
          )}

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
