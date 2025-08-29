import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginMutation, guestLoginMutation } = useAuth();
  const { error, isLoading, isAuthenticated } = useAuthStore(); 

  // ログイン後のリダイレクト先を取得（デフォルトはダッシュボード）
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // 既にログイン済みの場合はリダイレクト
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleGoogleLogin = (credential: string) => {
    loginMutation.mutate(credential, {
      onSuccess: () => {
        // ログイン成功時は元のページまたはダッシュボードにリダイレクト
        navigate(from, { replace: true });
      },
    });
  };

  const handleGuestLogin = () => {
    guestLoginMutation.mutate();
  };

  // 既にログイン済みの場合は何も表示しない
  if (isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                REVOX
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                バイク整備記録アプリ
              </Typography>
              <Typography variant="body1" color="text.secondary">
                AIと一緒にバイクのメンテナンスを記録・管理しましょう
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <GoogleLoginButton
                onLogin={handleGoogleLogin}
                isLoading={isLoading} 
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGuestLogin}
                disabled={isLoading}
                sx={{ py: 1.5 }}
              >
                ゲストとしてログイン
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ログインすることで、
                <br />
                利用規約およびプライバシーポリシーに同意したものとみなされます。
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>主な機能：</strong>
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              🏍️ バイク情報の登録・管理
            </Typography>
            <Typography variant="body2" color="text.secondary">
              🔧 整備記録の作成・編集
            </Typography>
            <Typography variant="body2" color="text.secondary">
              🤖 AIによる整備に関するアドバイス
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📊 メンテナンス履歴の管理
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};