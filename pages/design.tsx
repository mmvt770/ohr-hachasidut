import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

interface DesignItem {
  id: string
  title: string
  text: string
  category: string
}

const MOCK_ITEMS: DesignItem[] = [
  { id: '1', title: 'פתגם על אמונה', text: 'אמונה היא כוח עצום', category: 'ביטחון בה״א' },
  { id: '2', title: 'דרכי החסידות', text: 'בעבודת ה״ב צריך לשמור על סדר', category: 'דרכי החסידות' },
]

export default function Design() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState<DesignItem | null>(MOCK_ITEMS[0])
  const [designImage, setDesignImage] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const u = JSON.parse(savedUser)
      if (u.role === 'designer' || u.role === 'admin') {
        setUser(u)
      } else {
        router.push('/dashboard')
      }
    } else {
      router.push('/')
    }
  }, [router])

  const handleUpload = () => {
    if (!designImage) return
    setMessage('✅ העיצוב נשמר בהצלחה!')
    setDesignImage(null)
    setTimeout(() => setMessage(''), 2000)
  }

  if (!mounted || !user) return null

  return (
    <>
      <Head>
        <title>עיצוב - אור החסידות</title>
      </Head>

      <Layout title="🎨 העלאת עיצובים">
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card mb-4">
              <h2 className="font-bold" style={{ color: '#3d2817' }}>
                מוכנים לעיצוב ({MOCK_ITEMS.length})
              </h2>
            </div>
            <div>
              {MOCK_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`list-row ${selected?.id === item.id ? 'active' : ''}`}
                >
                  <h3 className="font-bold" style={{ color: '#3d2817' }}>{item.title}</h3>
                  <span className="tag mt-2 inline-block">{item.category}</span>
                </div>
              ))}
            </div>
          </div>

          {selected && (
            <div className="lg:col-span-2">
              <div className="card space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3" style={{ color: '#3d2817' }}>
                    {selected.title}
                  </h2>
                  <p className="preserve-text" style={{ color: '#6b5535' }}>{selected.text}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-4" style={{ color: '#3d2817' }}>
                    🎨 העלאת עיצוב סופי
                  </h3>
                  <div
                    className="rounded-xl p-12 text-center"
                    style={{ border: '2px dashed #8b6f47', backgroundColor: '#fef9f0' }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setDesignImage(e.target.files?.[0] || null)}
                      className="hidden"
                      id="design-upload"
                    />
                    <label htmlFor="design-upload" className="cursor-pointer block">
                      {designImage ? (
                        <div>
                          <div className="text-5xl mb-3">✅</div>
                          <p className="font-bold" style={{ color: '#3d2817' }}>
                            {designImage.name}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-5xl mb-3">📤</div>
                          <p className="font-bold text-lg" style={{ color: '#3d2817' }}>
                            לחץ או גרור תמונה
                          </p>
                          <p className="text-sm mt-2" style={{ color: '#a89070' }}>
                            PNG, JPG, GIF
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid #d4c5a9' }}>
                  <button
                    onClick={handleUpload}
                    disabled={!designImage}
                    className="btn-primary flex-1"
                  >
                    ✅ שמור עיצוב
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="btn-secondary"
                  >
                    ביטול
                  </button>
                </div>
                {message && (
                  <div
                    className="p-4 rounded-lg text-center font-bold"
                    style={{ backgroundColor: '#dcfce7', color: '#166534' }}
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
