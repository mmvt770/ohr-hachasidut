import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'

interface PendingItem {
  id: string
  title: string
  text: string
  contentType: string
  editorName: string
  status: string
  createdTime: string
}

const MOCK_PENDING: PendingItem[] = [
  {
    id: '1',
    title: 'פתגם על סבלנות',
    text: 'הסבלנות היא מעלה גדולה בעבודת ה״ב. צריך לחכות ביעבור עד שיבוא הזמן הנכון.',
    contentType: 'פתגמים',
    editorName: 'דוד כהן',
    status: 'ממתין לאישור',
    createdTime: '2026-05-10',
  },
  {
    id: '2',
    title: 'עצה על חינוך ילדים',
    text: 'כל ילד צריך להיחנך בדרכו. צריך להכיר את אופיו של כל ילד בנפרד.',
    contentType: 'חינוך יומי',
    editorName: 'יוסף לוי',
    status: 'ממתין לאישור',
    createdTime: '2026-05-09',
  },
]

export default function Approval() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [pendingItems, setPendingItems] = useState<PendingItem[]>(MOCK_PENDING)
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(pendingItems[0] || null)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])

  const handleApprove = async (itemId: string) => {
    setLoading(true)
    try {
      console.log('Approving item:', itemId)
      // בפרוייקט אמיתי - עדכון ב-Airtable
      
      setPendingItems(pendingItems.filter((item) => item.id !== itemId))
      setSelectedItem(null)
      setMessage('✅ התוכן אושר בהצלחה!')
      
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage('❌ שגיאה בעדכון')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (itemId: string) => {
    if (!feedback.trim()) {
      setMessage('❌ נא להוסיף משוב לפני דחיה')
      return
    }

    setLoading(true)
    try {
      console.log('Rejecting item:', itemId, 'Feedback:', feedback)
      // בפרוייקט אמיתי - עדכון ב-Airtable עם סטטוס נפסל
      
      setPendingItems(pendingItems.filter((item) => item.id !== itemId))
      setSelectedItem(null)
      setFeedback('')
      setMessage('✅ התוכן נדחה')
      
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage('❌ שגיאה בעדכון')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (itemId: string) => {
    alert('עריכה של: ' + itemId)
    // בפרוייקט אמיתי - ניתוב לדף עריכה
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>אישור תוכן - אור החסידות</title>
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
            ✅ אישור תוכן ({pendingItems.length})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* רשימת ממתינים */}
            <div className="lg:col-span-1">
              <h2 className="font-bold mb-4">ממתינים לאישור</h2>
              <div className="space-y-2">
                {pendingItems.length === 0 ? (
                  <div className="card text-center py-8">
                    <p className="text-gray-500">✅ אין פריטים ממתינים</p>
                  </div>
                ) : (
                  pendingItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full p-4 rounded-lg text-right transition border-2 ${
                        selectedItem?.id === item.id
                          ? 'border-hebrew-600 bg-hebrew-50 dark:bg-gray-800 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'
                      }`}
                    >
                      <p className="font-bold">{item.title}</p>
                      <p className="text-xs opacity-75 mt-1">{item.contentType}</p>
                      <p className="text-xs opacity-75">✍️ {item.editorName}</p>
                      <p className="text-xs opacity-75">📅 {item.createdTime}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* תצוגה וקבלת החלטה */}
            {selectedItem && (
              <div className="lg:col-span-2">
                <div className="card space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                    <div className="flex gap-2 text-sm mb-4">
                      <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-3 py-1 rounded">
                        {selectedItem.contentType}
                      </span>
                      <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">
                        ✍️ {selectedItem.editorName}
                      </span>
                    </div>
                  </div>

                  {/* טקסט */}
                  <div>
                    <h3 className="font-bold mb-2">תוכן:</h3>
                    <p className="preserve-text whitespace-pre-line bg-gray-50 dark:bg-gray-800 p-4 rounded">
                      {selectedItem.text}
                    </p>
                  </div>

                  {/* משוב */}
                  <div>
                    <label className="form-label">משוב/הערות</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="form-input"
                      placeholder="הוסף משוב או הערות לעורך..."
                      rows={4}
                    />
                  </div>

                  {/* כפתורים */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(selectedItem.id)}
                      disabled={loading}
                      className="btn-primary flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? '⏳ עדכון...' : '✅ אישור'}
                    </button>
                    <button
                      onClick={() => handleReject(selectedItem.id)}
                      disabled={loading}
                      className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                    >
                      {loading ? '⏳ עדכון...' : '❌ דחיה'}
                    </button>
                    <button
                      onClick={() => handleEdit(selectedItem.id)}
                      className="btn-secondary flex-1"
                    >
                      ✏️ עריכה
                    </button>
                  </div>

                  {message && (
                    <div
                      className={`p-4 rounded text-center font-bold ${
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
            )}
          </div>
        </div>
      </div>
    </>
  )
}
