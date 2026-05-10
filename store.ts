import { create } from 'zustand'
import { User, ContentItem } from './types'

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

interface UIStore {
  activeTab: string
  setActiveTab: (tab: string) => void
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

interface DataStore {
  items: ContentItem[]
  setItems: (items: ContentItem[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    set({ user: null })
    localStorage.removeItem('user')
  },
}))

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'create',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isSidebarOpen: true,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}))

export const useDataStore = create<DataStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
}))
