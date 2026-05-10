import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store'

export default function App({ Component, pageProps }: AppProps) {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    // טען משתמש משמור
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('user')
      }
    }
  }, [setUser])

  return <Component {...pageProps} />
}
