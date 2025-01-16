import { User } from '@/interfaces/UsuarioLogeado';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface UserState {
  user: User | null; 
  setUser: (user: User) => void;
  clearUser: () => void; 
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null, // Estado inicial
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-store', // Nombre para el almacenamiento (localStorage)
    }
  )
);

export default useUserStore;
