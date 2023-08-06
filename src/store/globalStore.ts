import { create } from 'zustand'

type GlobalStore = {
  count: number
  inc: () => void
}

export const useGlobalStore = create<GlobalStore>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))

