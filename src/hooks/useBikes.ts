import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bikeService } from '@/services/bikeService';
import { useBikeStore } from '@/stores/bikeStore';
import { BikeCreateRequest, BikeUpdateRequest } from '@/types/bike';
import { useEffect } from 'react';
import { isAxiosError } from 'axios';

export const useBikes = (userId: number) => {
  const queryClient = useQueryClient();
  const { setBikes, addBike, updateBike, deleteBike, setLoading, setError } = useBikeStore();

  const {
    data: bikes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bikes', userId],
    queryFn: () => bikeService.getBikesByUserId(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (bikes.length > 0) {
      setBikes(bikes);
    }
  }, [bikes, setBikes]);

  useEffect(() => {
    if (error) {
      let message = 'バイク情報の取得に失敗しました';
      if (isAxiosError(error) && error.response) {
        message = error.response.data.message;
      }
      setError(message);
    }
  }, [error, setError]);

  const createBikeMutation = useMutation({
    mutationFn: (bikeData: BikeCreateRequest) => bikeService.createBike(userId, bikeData),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (newBike) => {
      addBike(newBike);
      queryClient.invalidateQueries({ queryKey: ['bikes', userId] });
      toast.success('バイクを登録しました');
    },
    onError: (error) => {
      let message = 'バイク登録に失敗しました';
      if (isAxiosError(error) && error.response) {
        message = error.response.data.message;
      }
      setError(message);
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateBikeMutation = useMutation({
    mutationFn: ({ bikeId, updateData }: { bikeId: number; updateData: BikeUpdateRequest }) =>
      bikeService.updateBike(userId, bikeId, updateData),
    onSuccess: (updatedBike) => {
      updateBike(updatedBike);
      queryClient.invalidateQueries({ queryKey: ['bikes', userId] });
      queryClient.invalidateQueries({ queryKey: ['bike', userId, updatedBike.id] });
      toast.success('バイク情報を更新しました');
    },
    onError: (error) => {
      let message = 'バイク更新に失敗しました';
      if (isAxiosError(error) && error.response) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });

  const deleteBikeMutation = useMutation({
    mutationFn: (bikeId: number) => bikeService.deleteBike(userId, bikeId),
    onSuccess: (_, bikeId) => {
      deleteBike(bikeId);
      queryClient.invalidateQueries({ queryKey: ['bikes', userId] });
      toast.success('バイクを削除しました');
    },
    onError: (error) => {
      let message = 'バイク削除に失敗しました';
      if (isAxiosError(error) && error.response) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });

  return {
    bikes,
    isLoading,
    error,
    createBike: createBikeMutation.mutate,
    updateBike: updateBikeMutation.mutate,
    deleteBike: deleteBikeMutation.mutate,
    isCreating: createBikeMutation.isPending,
    isUpdating: updateBikeMutation.isPending,
    isDeleting: deleteBikeMutation.isPending,
  };
};