import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = <LoadingSpinner message="認証状態を確認中..." /> 
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};