import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStore } from '@/types/store';
import { User } from '@/types/user';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // 初期値をtrueに変更
      error: null,

      login: (token: string, user: User) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      },

      updateUser: (user: User) => {
        localStorage.setItem('user_data', JSON.stringify(user));
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // 初期化用のメソッドを追加
      initializeAuth: () => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user_data');
        
        if (savedToken && savedUser) {
          try {
            const user = JSON.parse(savedUser);
            set({
              user,
              token: savedToken,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } catch (error) {
            console.error('保存されたユーザーデータの解析に失敗しました:', error);
          }
        }
        
        set({ isLoading: false });
        return false;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);