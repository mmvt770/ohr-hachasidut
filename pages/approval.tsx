import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

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
    text: 'כל ילד צריך להיחנך בדרכו.',
    contentType: 'חינוך יומי',
    editorName: 'יוסף לוי',
    createdTime: '2026-05-09',
  },
]

export default function Approval() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<PendingItem[]>(MOCK_PENDING)
  const [selected, setSelected] = useState<PendingItem | null>(MOCK_PENDING[0])
  const [feedback, setFeedback] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const u = JSON.parse(savedUser)
      if (u.role === 'admin') {
        setUser(u)
      } else {
        router.push('/dashboard')
      }
    } else {
      router.push('/')
    }
  }, [router])

  const handleApprove = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
    setSelected(null)
    setMessage('✅ הפתגם אושר בהצלחה!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleReject = (id: string) => {
    if (!feedback.trim()) {
      setMessage('❌ נא להוסיף משוב')
      return
    }
    setItems(items.filter((i) => i.id !== id))
    setSelected(null)
    setFeedback('')
    setMessage('✅ הפתגם נדחה')
    setTimeout(() => setMessage(''), 2000)
  }

  if (!mounted || !user) return null

  return (
    <>
      <Head>
        <title>אישור תוכן - אור החסידות</title>
      </Head>

      <Layout title={`✅ אישור תוכן (${items.length})`}>
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card mb-4">
              <h2 className="font-bold" style={{ color: '#3d2817' }}>ממתינים לאישור</h2>
            </div>
            <div>
              {items.length === 0 ? (
                <div className="card text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <p style={{ color: '#6b5535' }}>אין פריטים ממתינים</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`list-row ${selected?.id === item.id ? 'active' : ''}`}
                  >
                    <h3 className="font-bold" style={{ color: '#3d2817' }}>{item.title}</h3>
                    <span className="tag mt-2 inline-block">{item.contentType}</span>
                    <p className="text-xs mt-2" style={{ color: '#a89070' }}>
                      ✍️ {item.editorName} • 📅 {item.createdTime}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {selected && (
            <div className="lg:col-span-2">
              <div className="card space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3" style={{ color: '#3d2817' }}>
                    {selected.title}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    <span className="tag tag-active">{selected.contentType}</span>
                    <span className="tag">✍️ {selected.editorName}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-3" style={{ color: '#3d2817' }}>📜 תוכן:</h3>
                  <div
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: '#fef9f0', border: '1px solid #d4c5a9' }}
                  >
                    <p className="preserve-text whitespace-pre-line" style={{ color: '#3d2817' }}>
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
                    placeholder="הוסף משוב..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid #d4c5a9' }}>
                  <button onClick={() => handleApprove(selected.id)} className="btn-primary btn-success flex-1">
                    ✅ אישור
                  </button>
                  <button onClick={() => handleReject(selected.id)} className="btn-primary btn-danger flex-1">
                    ❌ דחיה
                  </button>
                </div>
                {message && (
                  <div
                    className="p-4 rounded-lg text-center font-bold"
                    style={{
                      backgroundColor: message.includes('✅') ? '#dcfce7' : '#fee2e2',
                      color: message.includes('✅') ? '#166534' : '#991b1b',
                    }}
                  >
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
