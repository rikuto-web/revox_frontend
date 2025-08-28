import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // 認証チェック中はローディング表示
  if (isLoading) {
    return <LoadingSpinner message="認証状態を確認中..." />;
  }

  // 認証されていない場合、現在のパスを保存してログインページにリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 認証されている場合、子コンポーネントを表示
  return <>{children}</>;
};