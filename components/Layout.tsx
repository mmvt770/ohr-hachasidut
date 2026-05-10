import { useRouter } from 'next/router'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
}

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface NavItem {
  href: string
  icon: string
  label: string
  roles: string[]
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', icon: '📊', label: 'דשבורד', roles: ['editor', 'admin', 'designer'] },
  { href: '/create', icon: '✍️', label: 'יצירת תוכן', roles: ['editor'] },
  { href: '/search', icon: '🔍', label: 'חיפוש פתגמים', roles: ['editor', 'admin'] },
  { href: '/approval', icon: '✅', label: 'אישור תוכן', roles: ['admin'] },
  { href: '/design', icon: '🎨', label: 'עיצוב גרפיקה', roles: ['designer', 'admin'] },
  { href: '/admin', icon: '⚙️', label: 'ניהול ספרים', roles: ['admin'] },
]

export default function Layout({ children, title }: LayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        // וודא שיש את כל השדות הנדרשים
        if (parsedUser && parsedUser.name && parsedUser.role) {
          setUser(parsedUser)
        } else {
          localStorage.removeItem('user')
          router.push('/')
        }
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error loading user:', error)
      localStorage.removeItem('user')
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  // לפני שה-component mounted - מציג loading
  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f0e8',
        }}
      >
        <div style={{ fontSize: '1.5rem', color: '#3d2817' }}>⏳ טוען...</div>
      </div>
    )
  }

  // אם אין user - מציג טוען (התנתבות תקרה ב-useEffect)
  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f0e8',
        }}
      >
        <div style={{ fontSize: '1.5rem', color: '#3d2817' }}>⏳ מעביר לכניסה...</div>
      </div>
    )
  }

  // וודא ש-name קיים
  const userInitial = user.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : '?'

  const allowedItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role))

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f0e8' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col shadow-2xl"
        style={{ backgroundColor: '#3d2817', color: '#e8d5b7' }}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid #5a3a22' }}>
          <h1 className="text-2xl font-bold" style={{ color: '#e8d5b7' }}>
            🌟 אור החסידות
          </h1>
          <p className="text-xs mt-1" style={{ color: '#a89070' }}>
            מערכת ניהול תוכן
          </p>
        </div>

        {/* User Info */}
        <div
          className="p-4"
          style={{
            backgroundColor: '#2a1a0c',
            borderBottom: '1px solid #5a3a22',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: '#8b6f47' }}
            >
              {userInitial}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{user.name}</p>
              <p className="text-xs" style={{ color: '#a89070' }}>
                {user.role === 'editor' && '✍️ עורך'}
                {user.role === 'admin' && '⚙️ מנהל'}
                {user.role === 'designer' && '🎨 גרפיקאי'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {allowedItems.map((item) => {
            const isActive = router.pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition"
                style={{
                  backgroundColor: isActive ? '#8b6f47' : 'transparent',
                  color: isActive ? 'white' : '#e8d5b7',
                }}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4" style={{ borderTop: '1px solid #5a3a22' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition"
            style={{ color: '#e8d5b7' }}
          >
            <span className="text-xl">🚪</span>
            <span>התנתק</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        {title && (
          <div
            className="px-8 py-4 shadow-sm"
            style={{
              backgroundColor: 'white',
              borderBottom: '1px solid #d4c5a9',
            }}
          >
            <h1 className="text-2xl font-bold" style={{ color: '#3d2817' }}>
              {title}
            </h1>
          </div>
        )}

        {/* Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
