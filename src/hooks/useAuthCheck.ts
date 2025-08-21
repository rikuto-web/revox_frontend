import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { isTokenExpired } from '@/utils/auth';

export const useAuthCheck = () => {
  const { token, logout, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user_data');

        if (savedToken && savedUser && !isTokenExpired(savedToken)) {
          const user = JSON.parse(savedUser);
        } else {
          logout();
        }
      } catch (error) {
        console.error('認証チェック中にエラーが発生しました:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [logout, setLoading]);
};