import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BlogState {
  // UI state
  sidebarOpen: boolean
  currentView: 'list' | 'grid' | 'card'
  selectedCategories: string[]
  search: string

  // User preferences
  theme: 'light' | 'dark' | 'system'
  itemsPerPage: number

  // Actions
  toggleSidebar: () => void
  setView: (view: 'list' | 'grid' | 'card') => void
  toggleCategory: (categoryId: string) => void
  setSearch: (search: string) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setItemsPerPage: (count: number) => void
  resetFilters: () => void
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarOpen: false,
      currentView: 'grid',
      selectedCategories: [],
      search: '',
      theme: 'system',
      itemsPerPage: 9,

      // Actions
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setView: (view) =>
        set({ currentView: view }),

      toggleCategory: (categoryId) =>
        set((state) => ({
          selectedCategories: state.selectedCategories.includes(categoryId)
            ? state.selectedCategories.filter(id => id !== categoryId)
            : [...state.selectedCategories, categoryId]
        })),

      setSearch: (search) =>
        set({ search }),

      setTheme: (theme) =>
        set({ theme }),

      setItemsPerPage: (itemsPerPage) =>
        set({ itemsPerPage }),

      resetFilters: () =>
        set({ selectedCategories: [], search: '' }),
    }),
    {
      name: 'blog-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
