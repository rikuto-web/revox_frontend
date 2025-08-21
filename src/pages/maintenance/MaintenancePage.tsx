import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Box,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useAuthStore } from '@/stores/authStore';
import { useBikes } from '@/hooks/useBikes';
import { useCategories } from '@/hooks/useCategories';
import { useMaintenanceTasks } from '@/hooks/useMaintenanceTasks';
import { formatDateTime } from '@/utils/dateUtils';
import { isAxiosError } from 'axios';
import { MaintenanceTask } from '@/types/maintenanceTask';

export const MaintenancePage: React.FC = () => {
  const { user } = useAuthStore();
  
  const { bikes, isLoading: bikesLoading, error: bikesError } = useBikes(user?.id || 0);
  const [selectedBikeId, setSelectedBikeId] = useState<number | null>(null);

  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const {
    tasks: allTasks,
    isLoading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useMaintenanceTasks(selectedBikeId, null);

  const filteredTasks = selectedCategoryId 
    ? allTasks.filter(task => task.categoryId === selectedCategoryId)
    : allTasks;
    
  const [page, setPage] = useState(1);
  const tasksPerPage = 5;
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
  const currentTasks = sortedTasks.slice(
    (page - 1) * tasksPerPage,
    page * tasksPerPage
  );

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ 
    name: '', 
    description: '', 
    bikeId: null as number | null, 
    categoryId: null as number | null 
  });
  const [editTarget, setEditTarget] = useState<MaintenanceTask | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (bikes.length > 0 && selectedBikeId === null) {
      setSelectedBikeId(bikes[0].id);
    }
  }, [bikes, selectedBikeId]);

  if (!user?.id) {
    return <LoadingSpinner message="ユーザー情報を読み込み中..." />;
  }

  const handleBikeChange = (event: SelectChangeEvent<number>) => {
    setSelectedBikeId(event.target.value as number);
    setPage(1);
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
    setSelectedCategoryId(value === '' ? null : value as number);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDeleteTask = (taskId: number) => {
    setDeleteTarget(taskId);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteTask(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleAddModalOpen = () => {
    setNewTask({
      name: '',
      description: '',
      bikeId: selectedBikeId,
      categoryId: selectedCategoryId,
    });
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewTask({ name: '', description: '', bikeId: null, categoryId: null });
  };

  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewTaskSelectChange = (event: SelectChangeEvent<number>) => {
    const { name, value } = event.target;
    setNewTask((prev) => ({ ...prev, [name]: value as number }));
  };

  const handleCreateTask = () => {
    if (!newTask.name || !newTask.description || !newTask.bikeId || !newTask.categoryId) {
      return;
    }

    const newMaintenanceTask = {
      name: newTask.name,
      description: newTask.description,
      categoryId: newTask.categoryId,
      bikeId: newTask.bikeId,
    };
    
    createTask(newMaintenanceTask);
    handleAddModalClose();
  };

  const handleEditTask = (task: MaintenanceTask) => {
    setEditTarget(task);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditTarget(null);
  };

  const handleEditTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditTarget((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleUpdateTask = () => {
    if (editTarget) {
      const { id, name, description } = editTarget;
      updateTask({ taskId: id, updateData: { name, description } });
      handleEditModalClose();
    }
  };

  const isLoading = bikesLoading || categoriesLoading || tasksLoading;
  const combinedError = bikesError || categoriesError || tasksError;

  if (isLoading) {
    return <LoadingSpinner message="データを読み込み中..." />;
  }

  if (combinedError) {
    let errorMessage = 'エラーが発生しました';
    if (isAxiosError(combinedError) && combinedError.response?.data?.message) {
      errorMessage = combinedError.response.data.message;
    } else if (combinedError instanceof Error) {
      errorMessage = combinedError.message;
    }
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ErrorMessage message={errorMessage} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <PageHeader
        title="整備記録"
        subtitle="バイクとカテゴリ別の整備記録を管理"
        breadcrumbs={[
          { label: 'ダッシュボード', path: '/dashboard' },
          { label: '整備記録' },
        ]}
      />

      <Card>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <FormControl sx={{ flexGrow: 1, minWidth: '150px' }}>
            <InputLabel id="bike-select-label">バイク</InputLabel>
            <Select
              labelId="bike-select-label"
              id="bike-select"
              value={selectedBikeId || ''}
              label="バイク"
              onChange={handleBikeChange}
            >
              {bikes.map((bike) => (
                <MenuItem key={bike.id} value={bike.id}>
                  {bike.modelName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flexGrow: 1, minWidth: '150px' }}>
            <InputLabel id="category-select-label">カテゴリー</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategoryId || ''}
              label="カテゴリー"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">すべてのカテゴリー</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddModalOpen}
            disabled={!selectedBikeId || isCreating}
            sx={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
          >
            新規登録
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {selectedBikeId && (
            tasksLoading || isCreating || isUpdating ? (
              <LoadingSpinner message="整備記録を読み込み中..." />
            ) : currentTasks.length === 0 ? (
              <EmptyState
                title={selectedCategoryId 
                  ? `${categories.find(c => c.id === selectedCategoryId)?.name || ''}の整備記録がありません`
                  : '整備記録がありません'
                }
                description="AIに質問して整備記録を作成しましょう"
                icon={<BuildIcon sx={{ fontSize: 80 }} />}
              />
            ) : (
              <>
                {currentTasks.map((task) => {
                  const taskCategory = categories.find(c => c.id === task.categoryId);
                  return (
                    <Accordion key={task.id} sx={{ mb: 1, boxShadow: 1 }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${task.id}-content`}
                        id={`panel-${task.id}-header`}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          <Typography variant="h6" component="div">
                            {task.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={taskCategory?.name || 'カテゴリー不明'}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              作成日: {formatDateTime(task.createdAt)}
                            </Typography>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(task);
                              }}
                              disabled={isUpdating}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                              disabled={isDeleting}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ whiteSpace: 'pre-line' }}
                        >
                          {task.description}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              </>
            )
          )}
        </Box>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="整備記録の削除"
        message="この整備記録を削除してもよろしいですか？この操作は取り消せません。"
        confirmText="削除"
        confirmColor="error"
      />

      <Dialog open={isAddModalOpen} onClose={handleAddModalClose} maxWidth="md" fullWidth>
        <DialogTitle>整備記録を新規作成</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel id="new-task-bike-label">バイク</InputLabel>
            <Select
              labelId="new-task-bike-label"
              name="bikeId"
              value={newTask.bikeId || ''}
              label="バイク"
              onChange={handleNewTaskSelectChange}
            >
              {bikes.map((bike) => (
                <MenuItem key={bike.id} value={bike.id}>
                  {bike.modelName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="new-task-category-label">カテゴリー</InputLabel>
            <Select
              labelId="new-task-category-label"
              name="categoryId"
              value={newTask.categoryId || ''}
              label="カテゴリー"
              onChange={handleNewTaskSelectChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            autoFocus
            margin="dense"
            label="タスク名"
            type="text"
            fullWidth
            variant="standard"
            name="name"
            value={newTask.name}
            onChange={handleNewTaskChange}
          />
          <TextField
            margin="dense"
            label="詳細"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            name="description"
            value={newTask.description}
            onChange={handleNewTaskChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddModalClose}>キャンセル</Button>
          <Button 
            onClick={handleCreateTask} 
            disabled={isCreating || !newTask.name || !newTask.description || !newTask.bikeId || !newTask.categoryId}
          >
            作成
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditModalOpen} onClose={handleEditModalClose} maxWidth="md" fullWidth>
        <DialogTitle>整備記録を編集</DialogTitle>
        <DialogContent>
          {editTarget && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="タスク名"
                type="text"
                fullWidth
                variant="standard"
                name="name"
                value={editTarget.name}
                onChange={handleEditTaskChange}
              />
              <TextField
                margin="dense"
                label="詳細"
                type="text"
                fullWidth
                multiline
                rows={10}
                variant="standard"
                name="description"
                value={editTarget.description}
                onChange={handleEditTaskChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose}>キャンセル</Button>
          <Button onClick={handleUpdateTask} disabled={isUpdating}>更新</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};