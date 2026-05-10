import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import Layout from '@/components/Layout'

interface PendingItem {
  id: string
  title: string
  text: string
  contentType: string
  editorName: string
  createdTime: string
}

const MOCK_PENDING: PendingItem[] = [
  {
    id: '1',
    title: 'פתגם על סבלנות',
    text: 'הסבלנות היא מעלה גדולה בעבודת ה״ב.\n\nצריך לחכות ביעבור עד שיבוא הזמן הנכון.',
    contentType: 'פתגמים',
    editorName: 'דוד כהן',
    createdTime: '2026-05-10',
  },
  {
    id: '2',
    title: 'עצה על חינוך ילדים',
    text: 'כל ילד צריך להיחנך בדרכו.\n\nצריך להכיר את אופיו של כל ילד בנפרד.',
    contentType: 'חינוך יומי',
    editorName: 'יוסף לוי',
    createdTime: '2026-05-09',
  },
]

export default function Approval() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [items, setItems] = useState<PendingItem[]>(MOCK_PENDING)
  const [selected, setSelected] = useState<PendingItem | null>(items[0] || null)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])

  const handleApprove = async (id: string) => {
    setLoading(true)
    try {
      setItems(items.filter((i) => i.id !== id))
      setSelected(null)
      setMessage('✅ הפתגם אושר בהצלחה!')
      setTimeout(() => setMessage(''), 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id: string) => {
    if (!feedback.trim()) {
      setMessage('❌ נא להוסיף משוב לפני דחיה')
      return
    }
    setLoading(true)
    try {
      setItems(items.filter((i) => i.id !== id))
      setSelected(null)
      setFeedback('')
      setMessage('✅ הפתגם נדחה')
      setTimeout(() => setMessage(''), 2000)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>אישור תוכן - אור החסידות</title>
      </Head>

      <Layout title={`✅ אישור תוכן (${items.length})`}>
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - List */}
          <div className="lg:col-span-1">
            <div className="card mb-4">
              <h2 className="font-bold text-[#3d2817]">ממתינים לאישור</h2>
            </div>

            <div>
              {items.length === 0 ? (
                <div className="card text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-[#6b5535]">אין פריטים ממתינים</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`list-row ${selected?.id === item.id ? 'active' : ''}`}
                  >
                    <h3 className="font-bold text-[#3d2817]">{item.title}</h3>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <span className="tag">{item.contentType}</span>
                    </div>
                    <p className="text-xs text-[#a89070] mt-2">
                      ✍️ {item.editorName} • 📅 {item.createdTime}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right - Detail */}
          {selected && (
            <div className="lg:col-span-2">
              <div className="card space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#3d2817] mb-3">
                    {selected.title}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    <span className="tag tag-active">{selected.contentType}</span>
                    <span className="tag">✍️ {selected.editorName}</span>
                    <span className="tag">📅 {selected.createdTime}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#3d2817] mb-3">📜 תוכן מלא:</h3>
                  <div className="bg-[#fef9f0] p-6 rounded-lg border border-[#d4c5a9]">
                    <p className="preserve-text whitespace-pre-line text-[#3d2817]">
                      {selected.text}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="form-label">📝 משוב/הערות</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="form-input"
                    placeholder="הוסף משוב או הערות לעורך..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#d4c5a9]">
                  <button
                    onClick={() => handleApprove(selected.id)}
                    disabled={loading}
                    className="btn-primary btn-success flex-1"
                  >
                    {loading ? '⏳' : '✅'} אישור
                  </button>
                  <button
                    onClick={() => handleReject(selected.id)}
                    disabled={loading}
                    className="btn-primary btn-danger flex-1"
                  >
                    {loading ? '⏳' : '❌'} דחיה
                  </button>
                  <button
                    onClick={() => alert('עריכה של: ' + selected.title)}
                    className="btn-secondary"
                  >
                    ✏️ ערוך
                  </button>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg text-center font-bold ${
                    message.includes('✅')
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
