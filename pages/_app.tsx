import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // בדוק אם יש user מחובר
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  if (!mounted) return null

  return <Component {...pageProps} user={user} setUser={setUser} />
}
