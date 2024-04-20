import { User } from '@/libs/services/user/types'
import { create } from 'zustand'

interface UserStore {
    user: User | null
    setUser: (user: User) => void
    isLoggedIn: boolean
    setIsLoggedIn: (isLoggedIn: boolean) => void
    logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    logout: () => {
        set({ user: null, isLoggedIn: false })
    },
}))
