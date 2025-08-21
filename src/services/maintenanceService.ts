import { MaintenanceTask, MaintenanceTaskRequest, MaintenanceTaskUpdateRequest } from '@/types/maintenanceTask';
import { apiClient } from './api';

export class MaintenanceService {
  /**
   * 整備タスクを新規登録する
   */
  async createTask(taskData: MaintenanceTaskRequest): Promise<MaintenanceTask> {
    return apiClient.post<MaintenanceTask>('/maintenance-task', taskData);
  }

  // --- READ (取得) ---
  
  /**
   * ユーザーIDに紐づく最新の整備タスクを取得する
   */
  async getLatestTasksByUserId(userId: number): Promise<MaintenanceTask[]> {
    return apiClient.get<MaintenanceTask[]>(`/maintenance-task/user/${userId}`);
  }

  /**
   * バイクIDに紐づく全ての整備タスクを取得する
   */
  async getTasksByBikeId(bikeId: number): Promise<MaintenanceTask[]> {
    return apiClient.get<MaintenanceTask[]>(`/maintenance-task/bike/${bikeId}`);
  }

  /**
   * バイクとカテゴリーに紐づく全ての整備タスクを取得する
   */
  async getTasksByBikeAndCategory(bikeId: number, categoryId: number): Promise<MaintenanceTask[]> {
    return apiClient.get<MaintenanceTask[]>(`/maintenance-task/bike/${bikeId}/category/${categoryId}`);
  }

  // --- UPDATE (更新) ---
  
  /**
   * 指定されたタスクIDの整備タスクを更新する
   */
  async updateTask(taskId: number, updateData: MaintenanceTaskUpdateRequest): Promise<MaintenanceTask> {
    return apiClient.patch<MaintenanceTask>(`/maintenance-task/${taskId}`, updateData);
  }

  // --- DELETE (削除) ---
  
  /**
   * 指定されたタスクIDの整備タスクを削除する
   */
  async deleteTask(taskId: number): Promise<void> {
    return apiClient.patch<void>(`/maintenance-task/${taskId}/softDelete`);
  }
}

export const maintenanceService = new MaintenanceService();