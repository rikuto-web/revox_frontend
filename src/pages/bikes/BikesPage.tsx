import React from 'react';
import {
  Container,
  Grid,
  Box,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BikeCard } from '@/components/bikes/BikeCard';
import { BikeForm } from '@/components/bikes/BikeForm';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { SearchBar } from '@/components/common/SearchBar';
import { useBikes } from '@/hooks/useBikes';
import { useAuthStore } from '@/stores/authStore';
import { Bike } from '@/types/bike';
import { DirectionsBike as BikeIcon } from '@mui/icons-material';

export const BikesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedBike, setSelectedBike] = React.useState<Bike | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<number | null>(null);

  const {
    bikes,
    isLoading,
    error,
    createBike,
    updateBike,
    deleteBike,
    isCreating,
    isUpdating,
    isDeleting,
  } = useBikes(user?.id || 0);

  const filteredBikes = React.useMemo(() => {
    if (!searchQuery) return bikes;

    return bikes.filter(bike =>
      bike.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.modelCode?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bikes, searchQuery]);

  const handleAddBike = () => {
    setSelectedBike(null);
    setShowForm(true);
  };

  const handleEditBike = (bike: Bike) => {
    setSelectedBike(bike);
    setShowForm(true);
  };

  const handleDeleteBike = (bikeId: number) => {
    setDeleteTarget(bikeId);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteBike(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (selectedBike) {
      updateBike({ bikeId: selectedBike.id, updateData: data });
    } else {
      createBike(data);
    }
    setShowForm(false);
  };

  const handleBikeClick = (bike: Bike) => {
    navigate(`/bikes/${bike.id}`);
  };

  if (isLoading) {
    return <LoadingSpinner message="バイク情報を読み込み中..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ErrorMessage message={error instanceof Error ? error.message : String(error)} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <PageHeader
        title="バイク管理"
        subtitle="登録されているバイクの一覧です"
        breadcrumbs={[
          { label: 'ダッシュボード', path: '/dashboard' },
          { label: 'バイク管理' },
        ]}
      />
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <SearchBar
            placeholder="メーカー名、車両名、型式で検索..."
            onSearch={setSearchQuery}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddBike}
          sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
        >
          新規登録
        </Button>
      </Box>

      {filteredBikes.length === 0 ? (
        <EmptyState
          title={searchQuery ? "検索結果が見つかりません" : "バイクが登録されていません"}
          description={
            searchQuery
              ? "検索条件を変更して再度お試しください"
              : "まずはあなたの愛車を登録してみましょう"
          }
          actionLabel={searchQuery ? undefined : "バイクを登録"}
          onAction={searchQuery ? undefined : handleAddBike}
          icon={<BikeIcon sx={{ fontSize: 80 }} />}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredBikes.map((bike) => (
            <Grid item xs={12} sm={6} md={4} key={bike.id}>
              <BikeCard
                bike={bike}
                onEdit={handleEditBike}
                onDelete={handleDeleteBike}
                onClick={handleBikeClick}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <BikeForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        bike={selectedBike || undefined}
        isLoading={isCreating || isUpdating}
        userId={user?.id || 0}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="バイクの削除"
        message="このバイクを削除してもよろしいですか？この操作は取り消せません。"
        confirmText="削除"
        confirmColor="error"
      />
    </Container>
  );
};