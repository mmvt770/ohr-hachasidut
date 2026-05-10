import Head from 'next/head'
import { useState } from 'react'

const MOCK_ITEMS = [
  {
    id: 1,
    title: 'פתגם על אמונה',
    text: 'אמונה היא כוח עצום',
    status: 'מוכן לגרפיקה',
    category: 'ביטחון בה״א',
  },
  {
    id: 2,
    title: 'דרכי החסידות',
    text: 'בעבודת ה״ב צריך לשמור על סדר',
    status: 'מוכן לגרפיקה',
    category: 'דרכי החסידות',
  }
]

export default function Design({ user }: any) {
  const [items, setItems] = useState(MOCK_ITEMS)
  const [selectedItem, setSelectedItem] = useState(items[0])
  const [designImage, setDesignImage] = useState<File | null>(null)

  const handleUploadDesign = (itemId: number) => {
    if (!designImage) {
      alert('בחר תמונה לעיצוב')
      return
    }
    // כאן תשלח לAirtable
    console.log('העלאת עיצוב:', itemId, designImage)
    alert('✅ העיצוב נשמר בהצלחה!')
    setDesignImage(null)
    // סימון כמוכן לפרסום
  }

  if (!user || user.role !== 'designer') {
    return <div className="p-8 text-center">⛔ אתה לא מחובר כגרפיקאי</div>
  }

  return (
    <>
      <Head>
        <title>עיצוב - אור החסידות</title>
      </Head>
      
      <div className="min-h-screen bg-hebrew-50 dark:bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="hebrew-title mb-8">🎨 הוספת עיצובים</h1>

          <div className="grid grid-cols-3 gap-8">
            {/* רשימה */}
            <div className="col-span-1">
              <h2 className="font-bold mb-4">תכנים מוכנים לעיצוב</h2>
              <div className="space-y-2">
                {items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded cursor-pointer transition ${
                      selectedItem?.id === item.id
                        ? 'bg-hebrew-600 text-white'
                        : 'bg-white dark:bg-gray-800 hover:shadow-lg'
                    }`}
                  >
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs opacity-75 mt-1">{item.category}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* עמוד עריכה */}
            {selectedItem && (
              <div className="col-span-2">
                <div className="card space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 preserve-text">
                      {selectedItem.text}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold mb-4">📸 העלאת עיצוב סופי</h3>
                    <div className="border-2 border-dashed border-hebrew-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setDesignImage(e.target.files?.[0] || null)}
                        className="hidden"
                        id="design-upload"
                      />
                      <label
                        htmlFor="design-upload"
                        className="cursor-pointer block"
                      >
                        {designImage ? (
                          <div>
                            <p className="font-bold text-green-600">✅ {designImage.name}</p>
                            <p className="text-sm text-gray-500 mt-2">לחץ לשינוי</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-2xl mb-2">📤</p>
                            <p className="font-bold">בחר תמונה או גרור הנה</p>
                            <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleUploadDesign(selectedItem.id)}
                      className="btn-primary flex-1"
                    >
                      ✅ שמור עיצוב
                    </button>
                    <button
                      onClick={() => window.history.back()}
                      className="btn-secondary flex-1"
                    >
                      ← חזור
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
