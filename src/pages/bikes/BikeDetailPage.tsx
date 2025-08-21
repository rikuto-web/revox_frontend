import React from 'react';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsBike as BikeIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { BikeForm } from '@/components/bikes/BikeForm';
import { useBikes } from '@/hooks/useBikes';
import { useAuthStore } from '@/stores/authStore';
import { formatDate } from '@/utils/dateUtils';
import { Bike, BikeUpdateRequest } from '@/types/bike';
import { bikeService } from '@/services/bikeService';
import toast from 'react-hot-toast';

export const BikeDetailPage: React.FC = () => {
  const { bikeId } = useParams<{ bikeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const id = parseInt(bikeId || '0');
  const { bikes, isLoading, error } = useBikes(user?.id || 0);
  const bike = React.useMemo(() => 
    bikes.find(b => b.id === id), 
    [bikes, id]
  );
  const updateBikeMutation = useMutation({
    mutationFn: (updateData: { bikeId: number; updateData: BikeUpdateRequest }) => 
      bikeService.updateBike(user?.id || 0, updateData.bikeId, updateData.updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bikes', user?.id] });
      toast.success('バイク情報を更新しました');
    },
    onError: () => {
      toast.error('バイク更新に失敗しました');
    },
  });

  const deleteBikeMutation = useMutation({
    mutationFn: (bikeId: number) => bikeService.deleteBike(user?.id || 0, bikeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bikes', user?.id] });
      toast.success('バイクを削除しました');
      navigate('/bikes');
    },
    onError: () => {
      toast.error('バイク削除に失敗しました');
    },
  });

  const [showEditForm, setShowEditForm] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleAskAi = () => {
    navigate('/ai', { state: { selectedBike: bike } });
  };

  const handleFormSubmit = (data: BikeUpdateRequest) => {
    if (bike) {
      updateBikeMutation.mutate({ bikeId: bike.id, updateData: data });
      setShowEditForm(false);
    }
  };

  const confirmDelete = () => {
    if (bike) {
      deleteBikeMutation.mutate(bike.id);
      setShowDeleteDialog(false);
    }
  };

  const isUpdating = updateBikeMutation.isPending;
  const isDeleting = deleteBikeMutation.isPending;
  
  if (isLoading) {
    return <LoadingSpinner message="バイク情報を読み込み中..." />;
  }

  if (error || !bike) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ErrorMessage message={error?.message || 'バイクが見つかりません'} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <PageHeader
        title={`${bike.manufacturer} ${bike.modelName}`}
        subtitle="バイク詳細情報"
        breadcrumbs={[
          { label: 'ダッシュボード', path: '/dashboard' },
          { label: 'バイク管理', path: '/bikes' },
          { label: `${bike.manufacturer} ${bike.modelName}` },
        ]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="div"
              sx={{
                height: 300,
                backgroundImage: bike.imageUrl 
                  ? `url(${bike.imageUrl})`
                  : 'linear-gradient(45deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5), linear-gradient(45deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5)',
                backgroundSize: bike.imageUrl ? 'cover' : '20px 20px',
                backgroundPosition: bike.imageUrl ? 'center' : '0 0, 10px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!bike.imageUrl && (
                <BikeIcon sx={{ fontSize: 120, color: 'text.disabled' }} />
              )}
            </CardMedia>
            
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {bike.manufacturer} {bike.modelName}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                {bike.modelCode && (
                  <Chip
                    label={`型式: ${bike.modelCode}`}
                    sx={{ mr: 1, mb: 1 }}
                    variant="outlined"
                  />
                )}
                {bike.modelYear && (
                  <Chip
                    label={`${bike.modelYear}年式`}
                    sx={{ mr: 1, mb: 1 }}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {bike.currentMileage !== undefined && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      走行距離
                    </Typography>
                    <Typography variant="h6">
                      {bike.currentMileage != null ? bike.currentMileage.toLocaleString() : '-'} km
                    </Typography>
                  </Grid>
                )}
                
                {bike.purchaseDate && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      購入日
                    </Typography>
                    <Typography variant="h6">
                      {formatDate(bike.purchaseDate)}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  disabled={isUpdating}
                >
                  編集
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PsychologyIcon />}
                  onClick={handleAskAi}
                  color="secondary"
                >
                  AIに質問
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  color="error"
                  disabled={isDeleting}
                >
                  削除
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                バイク情報
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    登録日
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(bike.createdAt)}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    最終更新
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(bike.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <BikeForm
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleFormSubmit}
        bike={bike}
        isLoading={isUpdating}
        userId={user?.id || 0}
      />

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="バイクの削除"
        message={`${bike.manufacturer} ${bike.modelName}を削除してもよろしいですか？この操作は取り消せません。`}
        confirmText="削除"
        confirmColor="error"
      />
    </Container>
  );
};