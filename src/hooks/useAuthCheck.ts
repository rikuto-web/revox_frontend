import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { isTokenExpired } from '@/utils/auth';

export const useAuthCheck = () => {
  const { token, user, login, logout, setLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // すでに認証済みで有効なトークンがある場合は何もしない
        if (isAuthenticated && token && user && !isTokenExpired(token)) {
          setLoading(false);
          return;
        }

        // localStorageから認証情報を取得
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user_data');

        if (savedToken && savedUser) {
          // トークンの有効性をチェック
          if (!isTokenExpired(savedToken)) {
            try {
              const userData = JSON.parse(savedUser);
              // storeの状態を復元
              login(savedToken, userData);
              console.log('認証状態を復元しました');
            } catch (parseError) {
              console.error('ユーザーデータの解析に失敗しました:', parseError);
              logout();
            }
          } else {
            console.log('トークンが期限切れです');
            logout();
          }
        } else {
          // 認証情報がない場合
          console.log('認証情報が見つかりません');
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
  }, []); // 依存配列を空にして初回のみ実行
};