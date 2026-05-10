import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import Layout from '@/components/Layout'

interface DesignItem {
  id: string
  title: string
  text: string
  category: string
}

const MOCK_ITEMS: DesignItem[] = [
  {
    id: '1',
    title: 'פתגם על אמונה',
    text: 'אמונה היא כוח עצום',
    category: 'ביטחון בה״א',
  },
  {
    id: '2',
    title: 'דרכי החסידות',
    text: 'בעבודת ה״ב צריך לשמור על סדר',
    category: 'דרכי החסידות',
  },
]

export default function Design() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [items] = useState<DesignItem[]>(MOCK_ITEMS)
  const [selected, setSelected] = useState<DesignItem | null>(items[0] || null)
  const [designImage, setDesignImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'designer') {
      router.push('/')
    }
  }, [user, router])

  const handleUpload = async () => {
    if (!designImage || !selected) return
    setLoading(true)
    try {
      console.log('Upload:', selected.id, designImage)
      setMessage('✅ העיצוב נשמר בהצלחה!')
      setDesignImage(null)
      setTimeout(() => setMessage(''), 2000)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <>
      <Head>
        <title>עיצוב - אור החסידות</title>
      </Head>

      <Layout title="🎨 העלאת עיצובים">
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - List */}
          <div className="lg:col-span-1">
            <div className="card mb-4">
              <h2 className="font-bold text-[#3d2817]">
                מוכנים לעיצוב ({items.length})
              </h2>
            </div>
            <div>
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`list-row ${selected?.id === item.id ? 'active' : ''}`}
                >
                  <h3 className="font-bold text-[#3d2817]">{item.title}</h3>
                  <span className="tag mt-2">{item.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Upload */}
          {selected && (
            <div className="lg:col-span-2">
              <div className="card space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#3d2817] mb-3">
                    {selected.title}
                  </h2>
                  <p className="text-[#6b5535] preserve-text">{selected.text}</p>
                </div>

                <div>
                  <h3 className="font-bold text-[#3d2817] mb-4">
                    🎨 העלאת עיצוב סופי
                  </h3>
                  <div className="border-2 border-dashed border-[#8b6f47] rounded-xl p-12 text-center bg-[#fef9f0]">
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
                          <p className="font-bold text-[#3d2817]">{designImage.name}</p>
                          <p className="text-sm text-[#a89070] mt-2">לחץ לשינוי</p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-5xl mb-3">📤</div>
                          <p className="font-bold text-lg text-[#3d2817]">
                            לחץ או גרור תמונה
                          </p>
                          <p className="text-sm text-[#a89070] mt-2">
                            PNG, JPG, GIF
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#d4c5a9]">
                  <button
                    onClick={handleUpload}
                    disabled={!designImage || loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? '⏳' : '✅'} שמור עיצוב
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="btn-secondary"
                  >
                    ביטול
                  </button>
                </div>

                {message && (
                  <div className="p-4 rounded-lg text-center font-bold bg-green-100 text-green-800 border border-green-300">
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
