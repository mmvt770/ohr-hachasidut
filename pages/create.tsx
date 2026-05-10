import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { ContentType } from '@/lib/types'

interface FormData {
  title: string
  text: string
  contentType: ContentType | ''
  category: string
  sourceBook: string
  sourcePart: string
  sourcePage: string
  topics: string[]
  publishDate: string
  notes: string
}

const CONTENT_TYPES: ContentType[] = [
  'פתגמים',
  'אגרות קודש',
  'חינוך יומי',
  'עידוד וחיזוק',
  'נשים',
  'פנינה יומית',
]

const CATEGORIES = [
  'ביטחון בה״א',
  'דרכי החסידות',
  'נשים',
  'עידוד וחיזוק',
  'כללי',
]

const BOOKS = ['תניא', 'אגרות קודש', 'ספר השיחות', 'מענות לשאלות', 'יום־יום']
const TOPICS = [
  'אמונה',
  'ביטחון בה״א',
  'תשובה',
  'עבודת ה״ב',
  'קדושה',
  'נשים',
  'משפחה',
  'חינוך',
  'דרכי חסידות',
  'ציון וגאולה',
]

export default function CreateContent() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    text: '',
    contentType: '',
    category: '',
    sourceBook: '',
    sourcePart: '',
    sourcePage: '',
    topics: [],
    publishDate: '',
    notes: '',
  })
  const [boldText, setBoldText] = useState(false)
  const [selectedText, setSelectedText] = useState<{ start: number; end: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'editor') {
      router.push('/')
    }
  }, [user, router])

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (start !== end) {
        const selected = formData.text.substring(start, end)
        const before = formData.text.substring(0, start)
        const after = formData.text.substring(end)
        const newText = before + '**' + selected + '**' + after
        setFormData((prev) => ({ ...prev, text: newText }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.text || !formData.contentType) {
      setMessage('❌ נא למלא את כל השדות החובה')
      return
    }

    setLoading(true)
    try {
      // בפרוייקט אמיתי - פוסט ל-API
      console.log('Form data:', formData)

      setMessage('✅ התוכן נשמר בהצלחה!')

      setTimeout(() => {
        setFormData({
          title: '',
          text: '',
          contentType: '',
          category: '',
          sourceBook: '',
          sourcePart: '',
          sourcePage: '',
          topics: [],
          publishDate: '',
          notes: '',
        })
        setMessage('')
      }, 2000)
    } catch (error) {
      setMessage('❌ שגיאה בשמירה')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>יצירת תוכן - אור החסידות</title>
      </Head>

      <div className="min-h-screen bg-hebrew-50 dark:bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 text-hebrew-600 hover:text-hebrew-700 font-bold"
          >
            ← חזור
          </button>

          <h1 className="text-3xl font-bold text-hebrew-700 dark:text-hebrew-100 mb-8">
            ✍️ יצירת תוכן חדש
          </h1>

          <form onSubmit={handleSubmit} className="card space-y-6">
            {/* כותרת */}
            <div>
              <label className="form-label">כותרת *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                placeholder="כותרת הפתגם"
                required
              />
            </div>

            {/* טקסט */}
            <div>
              <label className="form-label">טקסט מלא *</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                onKeyDown={handleTextKeyDown}
                className="form-input preserve-text font-mono"
                placeholder="הטקסט של הפתגם..."
                rows={8}
                required
              />
              <p className="text-xs text-gray-500 mt-2">💡 Ctrl+B (או Cmd+B) להדגשת טקסט</p>
            </div>

            {/* סוג תוכן וקטגוריה */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">סוג תוכן *</label>
                <select
                  value={formData.contentType}
                  onChange={(e) =>
                    setFormData({ ...formData, contentType: e.target.value as ContentType })
                  }
                  className="form-input"
                  required
                >
                  <option value="">בחר סוג</option>
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
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-input"
                >
                  <option value="">בחר קטגוריה</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* מקורות */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="form-label">ספר</label>
                <select
                  value={formData.sourceBook}
                  onChange={(e) => setFormData({ ...formData, sourceBook: e.target.value })}
                  className="form-input"
                >
                  <option value="">בחר ספר</option>
                  {BOOKS.map((book) => (
                    <option key={book} value={book}>
                      {book}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">חלק</label>
                <input
                  type="text"
                  value={formData.sourcePart}
                  onChange={(e) => setFormData({ ...formData, sourcePart: e.target.value })}
                  className="form-input"
                  placeholder="חלק"
                />
              </div>

              <div>
                <label className="form-label">עמוד/שיחה</label>
                <input
                  type="text"
                  value={formData.sourcePage}
                  onChange={(e) => setFormData({ ...formData, sourcePage: e.target.value })}
                  className="form-input"
                  placeholder="עמוד"
                />
              </div>
            </div>

            {/* נושאים */}
            <div>
              <label className="form-label">נושאים</label>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      if (formData.topics.includes(topic)) {
                        setFormData({
                          ...formData,
                          topics: formData.topics.filter((t) => t !== topic),
                        })
                      } else {
                        setFormData({ ...formData, topics: [...formData.topics, topic] })
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-bold transition ${
                      formData.topics.includes(topic)
                        ? 'bg-hebrew-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* תאריך ופרטים נוספים */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">תאריך פרסום</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">הערות</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-input"
                  placeholder="הערות נוספות"
                />
              </div>
            </div>

            {/* כפתורים */}
            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? '⏳ שומר...' : '💾 שמור תוכן'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                ← חזור
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
          </form>
        </div>
      </div>
    </>
  )
}
