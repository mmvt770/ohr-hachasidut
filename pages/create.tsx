import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import Layout from '@/components/Layout'

const CONTENT_TYPES = ['פתגמים', 'אגרות קודש', 'חינוך יומי', 'עידוד וחיזוק', 'נשים', 'פנינה יומית']
const CATEGORIES = ['ביטחון בה״א', 'דרכי החסידות', 'נשים', 'עידוד וחיזוק', 'כללי']
const BOOKS = ['תניא', 'אגרות קודש', 'ספר השיחות', 'מענות לשאלות', 'יום־יום']
const TOPICS = [
  'אמונה', 'ביטחון בה״א', 'תשובה', 'עבודת ה״ב', 'קדושה',
  'נשים', 'משפחה', 'חינוך', 'דרכי חסידות', 'ציון וגאולה',
  'תפילה', 'תורה', 'מצוות', 'שמחה', 'ענווה'
]

export default function CreateContent() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    contentType: '',
    category: '',
    sourceBook: '',
    sourcePart: '',
    sourcePage: '',
    topics: [] as string[],
    publishDate: '',
    notes: '',
  })
  const [topicSearch, setTopicSearch] = useState('')
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
        setFormData({ ...formData, text: before + '**' + selected + '**' + after })
      }
    }
  }

  const filteredTopics = TOPICS.filter((t) =>
    t.toLowerCase().includes(topicSearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.text || !formData.contentType) {
      setMessage('❌ נא למלא את כל שדות החובה')
      return
    }

    setLoading(true)
    try {
      console.log('שומר:', formData)
      setMessage('✅ הפתגם נשמר בהצלחה!')

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

      <Layout title="✍️ יצירת תוכן חדש">
        <div className="animate-fade-in max-w-4xl">
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
                className="form-input preserve-text"
                placeholder="הטקסט המלא של הפתגם..."
                rows={8}
                required
              />
              <p className="text-xs text-[#a89070] mt-2">
                💡 בחר טקסט ולחץ Ctrl+B (או Cmd+B) להדגשה
              </p>
            </div>

            {/* סוג וקטגוריה */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">סוג תוכן *</label>
                <select
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  className="form-input"
                  required
                >
                  <option value="">בחר סוג</option>
                  {CONTENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
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
                    <option key={cat} value={cat}>{cat}</option>
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
                    <option key={book} value={book}>{book}</option>
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

            {/* נושאים עם חיפוש */}
            <div>
              <label className="form-label">נושאים</label>
              <input
                type="text"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder="🔍 חפש נושא..."
                className="form-input mb-3"
              />
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-[#d4c5a9] rounded-lg bg-[#fef9f0]">
                {filteredTopics.map((topic) => (
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
                    className={formData.topics.includes(topic) ? 'tag tag-active' : 'tag'}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              {formData.topics.length > 0 && (
                <p className="text-xs text-[#6b5535] mt-2">
                  ✅ נבחרו: {formData.topics.length} נושאים
                </p>
              )}
            </div>

            {/* תאריך והערות */}
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
            <div className="flex gap-4 pt-4 border-t border-[#d4c5a9]">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? '⏳ שומר...' : '💾 שמור פתגם'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="btn-secondary"
              >
                ביטול
              </button>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg text-center font-bold ${
                  message.includes('✅')
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </Layout>
    </>
  )
}
