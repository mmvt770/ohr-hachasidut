import Head from 'next/head'
import { useState } from 'react'

const STATUSES = ['חדש', 'מוכן לגרפיקה', 'בעיצוב', 'מוכן לפרסום', 'פורסם']
const CONTENT_TYPES = ['פתגמים', 'אגרות קודש', 'חינוך יומי', 'עידוד וחיזוק']
const CATEGORIES = ['ביטחון בה״א', 'דרכי החסידות', 'נשים', 'כללי']
const SOURCES = ['תניא', 'אגרות קודש', 'ספר השיחות', 'פי התורה']
const EDITORS = ['עורך 1', 'עורך 2', 'עורך 3']

interface FormData {
  title: string
  text: string
  contentType: string
  category: string
  source: string
  sourceBook: string
  sourcePage: string
  topics: string[]
  publishDate: string
  editorName: string
  sourceImage?: File
  status: string
}

export default function CreateContent({ user }: any) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    text: '',
    contentType: '',
    category: '',
    source: '',
    sourceBook: '',
    sourcePage: '',
    topics: [],
    publishDate: '',
    editorName: user?.email || '',
    status: 'חדש',
  })

  const [message, setMessage] = useState('')

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // כאן תתחברות ל-Airtable API
    console.log('שמירת תוכן:', formData)
    setMessage('✅ התוכן נשמר בהצלחה!')
    
    setTimeout(() => {
      setFormData({
        title: '',
        text: '',
        contentType: '',
        category: '',
        source: '',
        sourceBook: '',
        sourcePage: '',
        topics: [],
        publishDate: '',
        editorName: user?.email || '',
        status: 'חדש',
      })
      setMessage('')
    }, 2000)
  }

  if (!user) {
    return <div className="p-8 text-center">⛔ אתה לא מחובר</div>
  }

  return (
    <>
      <Head>
        <title>יצירת תוכן - אור החסידות</title>
      </Head>
      
      <div className="min-h-screen bg-hebrew-50 dark:bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="hebrew-title mb-8">✍️ יצירת תוכן חדש</h1>

          <form onSubmit={handleSubmit} className="card space-y-6">
            {/* כותרת */}
            <div>
              <label className="block font-bold mb-2">כותרת</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                placeholder="כותרת הפתגם"
                required
              />
            </div>

            {/* טקסט */}
            <div>
              <label className="block font-bold mb-2">טקסט מלא</label>
              <textarea
                value={formData.text}
                onChange={(e) => handleInputChange('text', e.target.value)}
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 preserve-text"
                placeholder="הטקסט של הפתגם"
                rows={6}
                required
              />
              <p className="text-sm text-gray-500 mt-2">💡 Ctrl+B להדגשת טקסט</p>
            </div>

            {/* סוג תוכן */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2">סוג תוכן</label>
                <select
                  value={formData.contentType}
                  onChange={(e) => handleInputChange('contentType', e.target.value)}
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="">בחר סוג</option>
                  {CONTENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-2">קטגוריה</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="">בחר קטגוריה</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* מקור */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-bold mb-2">מקור - ספר</label>
                <select
                  value={formData.sourceBook}
                  onChange={(e) => handleInputChange('sourceBook', e.target.value)}
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="">בחר ספר</option>
                  {SOURCES.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-2">חלק</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="חלק"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">עמוד/שיחה</label>
                <input
                  type="text"
                  value={formData.sourcePage}
                  onChange={(e) => handleInputChange('sourcePage', e.target.value)}
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="עמוד"
                />
              </div>
            </div>

            {/* תאריך פרסום */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2">תאריך פרסום</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => handleInputChange('publishDate', e.target.value)}
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">עורך</label>
                <input
                  type="text"
                  value={formData.editorName}
                  disabled
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 opacity-50"
                />
              </div>
            </div>

            {/* תמונת מקור */}
            <div>
              <label className="block font-bold mb-2">📷 תמונת מקור</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange('sourceImage', e.target.files?.[0])}
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* כפתור שליחה */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                💾 שמור תוכן
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn-secondary flex-1"
              >
                ← חזור
              </button>
            </div>

            {message && (
              <div className="p-4 bg-green-100 text-green-800 rounded text-center font-bold">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
