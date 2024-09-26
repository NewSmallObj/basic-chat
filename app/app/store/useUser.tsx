import { UserType } from '@/hooks/useAccount'
import { create } from 'zustand'
export interface UserStore {
	user: Partial<UserType>
	setUser: (loading: UserStore['user']) => void
}

const useUserStore = create<UserStore>((set) => ({
	user: {},
	setUser: (user) => set({ user }),
}))

export default useUserStore
