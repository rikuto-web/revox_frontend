import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { UserUpdateRequest } from '@/types/user';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, logout, updateUser, setLoading, setError } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.loginWithGoogle,
    onMutate: () => {
      setLoading(true); 
      setError(null);
    },
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      toast.success('ログインしました');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'ログインに失敗しました';
      setError(message);
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false); 
    },
  });

  const guestLoginMutation = useMutation({
    mutationFn: authService.loginAsGuest,
    onMutate: () => {
      setLoading(true); 
      setError(null);
    },
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      localStorage.setItem('is_guest', 'true');
      toast.success('ゲストログインしました');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'ゲストログインに失敗しました';
      setError(message);
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, updateData }: { userId: number; updateData: UserUpdateRequest }) =>
      authService.updateUser(userId, updateData),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('プロフィールを更新しました');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'プロフィール更新に失敗しました';
      toast.error(message);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: authService.deleteUser,
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('アカウントを削除しました');
      navigate('/');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'アカウント削除に失敗しました';
      toast.error(message);
    },
  });

  const handleLogout = () => {
    logout();
    localStorage.removeItem('is_guest');
    queryClient.clear();
    toast.success('ログアウトしました');
    navigate('/');
  };

  return {
    loginMutation,
    guestLoginMutation,
    updateUserMutation,
    deleteUserMutation,
    handleLogout,
  };
};