import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import { useMaintenanceStore } from '@/stores/maintenanceStore';
import { useEffect } from 'react';
import { isAxiosError } from 'axios';

export const useCategories = () => { 
  const { setError } = useMaintenanceStore();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories(),
    enabled: true,
    staleTime: 1000 * 60 * 60,
  });

  return {
    categories,
    isLoading,
    error,
  };
};