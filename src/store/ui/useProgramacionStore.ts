import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MyStore {
  idprogramacionzus: any
  setIdProgramacionzus: (id: any) => void
}

export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      idprogramacionzus: '',
      setIdProgramacionzus: (id) => set({ idprogramacionzus: id }),
    }),
    {
      name: 'my-zustand-store', // nombre en el localStorage
    }
  )
)
