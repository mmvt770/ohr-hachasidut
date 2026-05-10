import { useRouter } from 'next/router'
import Link from 'next/link'
import { ReactNode } from 'react'
import { useAuthStore } from '@/lib/store'

interface LayoutProps {
  children: ReactNode
  title?: string
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
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!user) return <>{children}</>

  const allowedItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role))

  return (
    <div className="min-h-screen flex bg-[#f5f0e8] dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3d2817] text-[#e8d5b7] flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="p-6 border-b border-[#5a3a22]">
          <h1 className="text-2xl font-bold text-[#e8d5b7]">
            🌟 אור החסידות
          </h1>
          <p className="text-xs text-[#a89070] mt-1">מערכת ניהול תוכן</p>
        </div>

        {/* User Info */}
        <div className="p-4 bg-[#2a1a0c] border-b border-[#5a3a22]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8b6f47] flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{user.name}</p>
              <p className="text-xs text-[#a89070]">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-bold ${
                  isActive
                    ? 'bg-[#8b6f47] text-white shadow-lg'
                    : 'text-[#e8d5b7] hover:bg-[#5a3a22]'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#5a3a22]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-[#e8d5b7] hover:bg-red-900 font-bold"
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
          <div className="bg-white dark:bg-gray-800 border-b border-[#d4c5a9] dark:border-gray-700 px-8 py-4 shadow-sm">
            <h1 className="text-2xl font-bold text-[#3d2817] dark:text-[#e8d5b7]">
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
