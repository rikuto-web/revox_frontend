import { create } from 'zustand';
import { MaintenanceTask } from '@/types/maintenanceTask';
import { Category } from '@/types/category';

interface MaintenanceState {
  tasks: MaintenanceTask[];
  categories: Category[];
  selectedTask: MaintenanceTask | null;
  isLoading: boolean;
  error: string | null;
}

interface MaintenanceActions {
  setTasks: (tasks: MaintenanceTask[]) => void;
  addTask: (task: MaintenanceTask) => void;
  updateTask: (task: MaintenanceTask) => void;
  deleteTask: (taskId: number) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedTask: (task: MaintenanceTask | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type MaintenanceStore = MaintenanceState & MaintenanceActions;

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  tasks: [],
  categories: [],
  selectedTask: null,
  isLoading: false,
  error: null,

  setTasks: (tasks: MaintenanceTask[]) => {
    set({ tasks, error: null });
  },

  addTask: (task: MaintenanceTask) => {
    set((state) => ({
      tasks: [...state.tasks, task],
      error: null,
    }));
  },

  updateTask: (updatedTask: MaintenanceTask) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
      selectedTask: state.selectedTask?.id === updatedTask.id ? updatedTask : state.selectedTask,
      error: null,
    }));
  },

  deleteTask: (taskId: number) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      selectedTask: state.selectedTask?.id === taskId ? null : state.selectedTask,
      error: null,
    }));
  },

  setCategories: (categories: Category[]) => {
    set({ categories, error: null });
  },

  setSelectedTask: (task: MaintenanceTask | null) => {
    set({ selectedTask: task });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));