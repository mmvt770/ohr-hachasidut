import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'

interface Book {
  id: string
  name: string
}

export default function Admin() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'books'>('dashboard')
  const [books, setBooks] = useState<Book[]>([
    { id: '1', name: 'תניא' },
    { id: '2', name: 'אגרות קודש' },
    { id: '3', name: 'ספר השיחות' },
    { id: '4', name: 'מענות לשאלות' },
  ])
  const [newBook, setNewBook] = useState('')
  const [editingBook, setEditingBook] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBook.trim()) {
      setMessage('❌ נא להוסיף שם ספר')
      return
    }

    const newId = (Math.max(...books.map((b) => parseInt(b.id) || 0), 0) + 1).toString()
    setBooks([...books, { id: newId, name: newBook }])
    setNewBook('')
    setMessage('✅ ספר נוסף בהצלחה!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleEditBook = (id: string, newName: string) => {
    if (!newName.trim()) {
      setMessage('❌ שם ספר לא יכול להיות ריק')
      return
    }

    setBooks(books.map((b) => (b.id === id ? { ...b, name: newName } : b)))
    setEditingBook(null)
    setEditingName('')
    setMessage('✅ ספר עודכן בהצלחה!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleDeleteBook = (id: string) => {
    if (confirm('הוא בטוח שברצונך למחוק ספר זה?')) {
      setBooks(books.filter((b) => b.id !== id))
      setMessage('✅ ספר נמחק בהצלחה!')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>ניהול - אור החסידות</title>
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
            ⚙️ ניהול מערכת
          </h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 font-bold transition ${
                activeTab === 'dashboard'
                  ? 'text-hebrew-600 dark:text-hebrew-100 border-b-2 border-hebrew-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-hebrew-600'
              }`}
            >
              📊 סטטיסטיקות
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 font-bold transition ${
                activeTab === 'books'
                  ? 'text-hebrew-600 dark:text-hebrew-100 border-b-2 border-hebrew-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-hebrew-600'
              }`}
            >
              📚 ניהול ספרים ({books.length})
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">סטטיסטיקות כלליות</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <p className="text-4xl font-bold text-blue-600 mb-2">156</p>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      סך הכל פתגמים
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                    <p className="text-4xl font-bold text-yellow-600 mb-2">8</p>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      ממתינים לאישור
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                    <p className="text-4xl font-bold text-green-600 mb-2">28</p>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      מוכנים לפרסום
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <p className="text-4xl font-bold text-purple-600 mb-2">145</p>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      פורסמו
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-2xl font-bold mb-6">עם דקות עבודה</h2>
                <div className="text-center py-12 text-gray-500">
                  📊 טבלאות ידווחו כאן בקרוב...
                </div>
              </div>
            </div>
          )}

          {/* Books Tab */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">הוסף ספר חדש</h2>
                <form onSubmit={handleAddBook} className="flex gap-3">
                  <input
                    type="text"
                    value={newBook}
                    onChange={(e) => setNewBook(e.target.value)}
                    placeholder="שם הספר החדש"
                    className="form-input flex-1"
                  />
                  <button type="submit" className="btn-primary">
                    ➕ הוסף
                  </button>
                </form>
              </div>

              <div className="card">
                <h2 className="text-2xl font-bold mb-6">ספרים קיימים</h2>
                <div className="space-y-2">
                  {books.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      אין ספרים במערכת עדיין
                    </div>
                  ) : (
                    books.map((book) => (
                      <div
                        key={book.id}
                        className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        {editingBook === book.id ? (
                          <div className="flex gap-2 flex-1">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="form-input flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() =>
                                handleEditBook(book.id, editingName)
                              }
                              className="btn-primary btn-sm"
                            >
                              ✅ שמור
                            </button>
                            <button
                              onClick={() => setEditingBook(null)}
                              className="btn-secondary btn-sm"
                            >
                              ❌ בטל
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-bold">{book.name}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingBook(book.id)
                                  setEditingName(book.name)
                                }}
                                className="btn-secondary btn-sm"
                              >
                                ✏️ ערוך
                              </button>
                              <button
                                onClick={() => handleDeleteBook(book.id)}
                                className="btn-secondary btn-sm bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-100"
                              >
                                🗑️ מחק
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded text-center font-bold mt-8 ${
                message.includes('✅')
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
