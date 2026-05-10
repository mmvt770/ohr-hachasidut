import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import Layout from '@/components/Layout'

interface Book {
  id: string
  name: string
}

export default function Admin() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [books, setBooks] = useState<Book[]>([
    { id: '1', name: 'תניא' },
    { id: '2', name: 'אגרות קודש' },
    { id: '3', name: 'ספר השיחות' },
    { id: '4', name: 'מענות לשאלות' },
  ])
  const [newBook, setNewBook] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBook.trim()) return

    const newId = (Math.max(...books.map((b) => parseInt(b.id) || 0), 0) + 1).toString()
    setBooks([...books, { id: newId, name: newBook }])
    setNewBook('')
    setMessage('✅ ספר נוסף!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleEdit = (id: string, name: string) => {
    if (!name.trim()) return
    setBooks(books.map((b) => (b.id === id ? { ...b, name } : b)))
    setEditing(null)
    setEditName('')
    setMessage('✅ עודכן!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח?')) {
      setBooks(books.filter((b) => b.id !== id))
      setMessage('✅ נמחק!')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>ניהול ספרים - אור החסידות</title>
      </Head>

      <Layout title="⚙️ ניהול ספרים">
        <div className="animate-fade-in space-y-6 max-w-4xl">
          {/* Add Book */}
          <div className="card">
            <h2 className="text-xl font-bold text-[#3d2817] mb-4">
              ➕ הוספת ספר חדש
            </h2>
            <form onSubmit={handleAdd} className="flex gap-3">
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

          {/* Books List */}
          <div className="card">
            <h2 className="text-xl font-bold text-[#3d2817] mb-4">
              📚 ספרים קיימים ({books.length})
            </h2>

            <div>
              {books.length === 0 ? (
                <div className="text-center py-8 text-[#6b5535]">
                  אין ספרים במערכת
                </div>
              ) : (
                books.map((book) => (
                  <div
                    key={book.id}
                    className="flex justify-between items-center p-4 mb-2 bg-[#fef9f0] rounded-lg border border-[#d4c5a9]"
                  >
                    {editing === book.id ? (
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="form-input flex-1"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEdit(book.id, editName)}
                          className="btn-primary btn-sm"
                        >
                          ✅
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="btn-secondary btn-sm"
                        >
                          ❌
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📖</span>
                          <span className="font-bold text-[#3d2817]">{book.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditing(book.id)
                              setEditName(book.name)
                            }}
                            className="btn-secondary btn-sm"
                          >
                            ✏️ ערוך
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="btn-primary btn-danger btn-sm"
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

          {message && (
            <div className="p-4 rounded-lg text-center font-bold bg-green-100 text-green-800 border border-green-300">
              {message}
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
