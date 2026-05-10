import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'

interface DesignItem {
  id: string
  title: string
  text: string
  status: string
  category: string
  sourceImage?: string
}

const MOCK_DESIGN_ITEMS: DesignItem[] = [
  {
    id: '1',
    title: 'פתגם על אמונה',
    text: 'אמונה היא כוח עצום שמעביר הרים',
    status: 'מוכן לגרפיקה',
    category: 'ביטחון בה״א',
  },
  {
    id: '2',
    title: 'דרכי החסידות',
    text: 'בעבודת ה״ב צריך לשמור על סדר',
    status: 'מוכן לגרפיקה',
    category: 'דרכי החסידות',
  },
]

export default function Design() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [items, setItems] = useState<DesignItem[]>(MOCK_DESIGN_ITEMS)
  const [selectedItem, setSelectedItem] = useState<DesignItem | null>(items[0] || null)
  const [designImage, setDesignImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'designer') {
      router.push('/')
    }
  }, [user, router])

  const handleUploadDesign = async (itemId: string) => {
    if (!designImage) {
      setMessage('❌ בחר תמונה לעיצוב')
      return
    }

    setLoading(true)
    try {
      // בפרוייקט אמיתי - העלאה ל-Airtable
      console.log('Uploading design for item:', itemId, designImage)
      
      setMessage('✅ העיצוב נשמר בהצלחה!')
      setDesignImage(null)
      
      // סימון כמוכן לפרסום (בפרוייקט אמיתי - עדכון ב-Airtable)
      setTimeout(() => {
        setMessage('')
      }, 2000)
    } catch (error) {
      setMessage('❌ שגיאה בהעלאה')
      console.error(error)
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

      <div className="min-h-screen bg-hebrew-50 dark:bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 text-hebrew-600 hover:text-hebrew-700 font-bold"
          >
            ← חזור
          </button>

          <h1 className="text-3xl font-bold text-hebrew-700 dark:text-hebrew-100 mb-8">
            🎨 העלאת עיצובים
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* רשימת פריטים */}
            <div className="lg:col-span-1">
              <h2 className="font-bold mb-4">תכנים מוכנים לעיצוב ({items.length})</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full p-4 rounded-lg text-right transition ${
                      selectedItem?.id === item.id
                        ? 'bg-hebrew-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 hover:shadow-lg border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <p className="font-bold">{item.title}</p>
                    <p className="text-xs opacity-75 mt-1">{item.category}</p>
                    <p className="text-xs opacity-75">📌 {item.status}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* עמוד עריכה */}
            {selectedItem && (
              <div className="lg:col-span-2">
                <div className="card space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 preserve-text">
                      {selectedItem.text}
                    </p>
                    <div className="mt-4 flex gap-2 text-sm">
                      <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">
                        {selectedItem.category}
                      </span>
                      <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-3 py-1 rounded">
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>

                  {/* תמונת מקור - רק לצפייה */}
                  {selectedItem.sourceImage && (
                    <div>
                      <h3 className="font-bold mb-3">📷 תמונת מקור</h3>
                      <img
                        src={selectedItem.sourceImage}
                        alt="Source"
                        className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}

                  {/* העלאת עיצוב סופי */}
                  <div>
                    <h3 className="font-bold mb-4">🎨 העלאת עיצוב סופי</h3>
                    <div className="border-2 border-dashed border-hebrew-600 rounded-lg p-8 text-center">
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
                            <p className="font-bold text-green-600">✅ {designImage.name}</p>
                            <p className="text-sm text-gray-500 mt-2">לחץ לשינוי</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-3xl mb-3">📤</p>
                            <p className="font-bold text-lg">בחר תמונה או גרור הנה</p>
                            <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* כפתורים */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleUploadDesign(selectedItem.id)}
                      disabled={!designImage || loading}
                      className="btn-primary flex-1"
                    >
                      {loading ? '⏳ שומר...' : '✅ שמור עיצוב'}
                    </button>
                    <button onClick={() => router.back()} className="btn-secondary flex-1">
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
