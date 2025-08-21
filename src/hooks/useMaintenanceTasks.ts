import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { maintenanceService } from '@/services/maintenanceService';
import { useMaintenanceStore } from '@/stores/maintenanceStore';
import { MaintenanceTask, MaintenanceTaskRequest, MaintenanceTaskUpdateRequest } from '@/types/maintenanceTask';
import { isAxiosError } from 'axios';

export const useMaintenanceTasks = (bikeId?: number | null, categoryId?: number | null) => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useMaintenanceStore();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<MaintenanceTask[]>({
    queryKey: ['maintenance-tasks', bikeId, categoryId],
    queryFn: () => {
      console.log('Query function called with:', { bikeId, categoryId });
      if (bikeId && categoryId) {
        console.log('Fetching tasks by bike and category');
        return maintenanceService.getTasksByBikeAndCategory(bikeId, categoryId);
      } else if (bikeId) {
        console.log('Fetching tasks by bike ID only');
        return maintenanceService.getTasksByBikeId(bikeId);
      }
      console.log('No bikeId, returning empty array');
      return Promise.resolve([]);
    },
    enabled: bikeId != null,
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData: MaintenanceTaskRequest) => {
      console.log('Creating task with data:', taskData);
      return maintenanceService.createTask(taskData);
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (newTask) => {
      console.log('Task created successfully:', newTask);
      queryClient.invalidateQueries({ 
        queryKey: ['maintenance-tasks', newTask.bikeId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['maintenance-tasks', newTask.bikeId, newTask.categoryId] 
      });
      toast.success('整備記録を作成しました');
    },
    onError: (error) => {
      console.error('Task creation failed:', error);
      let message = '整備記録の作成に失敗しました';
      if (isAxiosError(error) && error.response) {
        message = error.response.data.message;
        console.error('Error response:', error.response.data);
      }
      setError(message);
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updateData }: { taskId: number; updateData: MaintenanceTaskUpdateRequest }) =>
      maintenanceService.updateTask(taskId, updateData),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ 
        queryKey: ['maintenance-tasks', updatedTask.bikeId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['maintenance-tasks', updatedTask.bikeId, updatedTask.categoryId] 
      });
      toast.success('整備記録を更新しました');
    },
    onError: (error) => {
      let message = '整備記録の更新に失敗しました';
      if (isAxiosError(error) && error.response) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => maintenanceService.deleteTask(taskId),
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
      toast.success('整備記録を削除しました');
    },
    onError: (error) => {
      let message = '整備記録の削除に失敗しました';
      if (isAxiosError(error) && error.response) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};