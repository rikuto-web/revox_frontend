// src/types/maintenanceTask.ts

import { Category } from './category';
import { Bike } from './bike';

export interface MaintenanceTask {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  bikeId: number;
  isCompleted: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTaskRequest {
  name: string;
  description: string;
  categoryId: number;
  bikeId: number;
}

export interface MaintenanceTaskUpdateRequest {
  name: string;
  description: string;
}