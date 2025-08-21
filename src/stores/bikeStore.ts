import { create } from 'zustand';
import { BikeStore } from '@/types/store';
import { Bike } from '@/types/bike';

export const useBikeStore = create<BikeStore>((set, get) => ({
  // State
  bikes: [],
  selectedBike: null,
  isLoading: false,
  error: null,

  // Actions
  setBikes: (bikes: Bike[]) => {
    set({ bikes, error: null });
  },

  addBike: (bike: Bike) => {
    set((state) => ({
      bikes: [...state.bikes, bike],
      error: null,
    }));
  },

  updateBike: (updatedBike: Bike) => {
    set((state) => ({
      bikes: state.bikes.map((bike) =>
        bike.id === updatedBike.id ? updatedBike : bike
      ),
      selectedBike: state.selectedBike?.id === updatedBike.id ? updatedBike : state.selectedBike,
      error: null,
    }));
  },

  deleteBike: (bikeId: number) => {
    set((state) => ({
      bikes: state.bikes.filter((bike) => bike.id !== bikeId),
      selectedBike: state.selectedBike?.id === bikeId ? null : state.selectedBike,
      error: null,
    }));
  },

  setSelectedBike: (bike: Bike | null) => {
    set({ selectedBike: bike });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));