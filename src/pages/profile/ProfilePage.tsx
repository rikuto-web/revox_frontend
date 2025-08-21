import React from 'react';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Divider,
  Alert,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { formatDateTime } from '@/utils/dateUtils';

const schema = yup.object({
  nickname: yup
    .string()
    .required('ユーザー名は必須です')
    .max(50, 'ユーザー名は50文字以内で入力してください'),
});

type FormData = {
  nickname: string;
};

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { updateUserMutation, deleteUserMutation } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nickname: user?.nickname || '',
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({ nickname: user.nickname });
    }
  }, [user, reset]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && user) {
      reset({ nickname: user.nickname });
    }
  };

  const onSubmit = (data: FormData) => {
    if (user) {
      updateUserMutation.mutate(
        { userId: user.id, updateData: data },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (user) {
      deleteUserMutation.mutate(user.id);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <PageHeader
        title="プロフィール"
        subtitle="アカウント情報の確認・編集"
        breadcrumbs={[
          { label: 'ダッシュボード', path: '/dashboard' },
          { label: 'プロフィール' },
        ]}
      />

      <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                }}
              >
                {user.nickname.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.nickname}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.displayEmail}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">基本情報</Typography>
                <Button
                  startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                  onClick={handleEditToggle}
                  disabled={updateUserMutation.isPending}
                >
                  {isEditing ? 'キャンセル' : '編集'}
                </Button>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 3 }}>
                  <Controller
                    name="nickname"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="ユーザー名"
                        disabled={!isEditing}
                        error={!!errors.nickname}
                        helperText={errors.nickname?.message}
                      />
                    )}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="メールアドレス"
                  value={user.displayEmail}
                  disabled
                  sx={{ mb: 3 }}
                  helperText="メールアドレスはGoogle認証により管理されています"
                />

                {isEditing && (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={updateUserMutation.isPending}
                    sx={{ mb: 2 }}
                  >
                    保存
                  </Button>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                アカウント情報
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    登録日
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(user.createdAt)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteAccount}
                disabled={deleteUserMutation.isPending}
              >
                アカウントを削除
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="アカウント削除の確認"
        message="本当にアカウントを削除しますか？この操作は取り消すことができず、すべてのデータが失われます。"
        confirmText="削除"
        confirmColor="error"
      />
    </Container>
  );
};