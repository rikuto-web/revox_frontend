import { User } from '@/types/user';
import { Bike } from '@/types/bike';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface BikeState {
  bikes: Bike[];
  selectedBike: Bike | null;
  isLoading: boolean;
  error: string | null;
}

export interface BikeActions {
  setBikes: (bikes: Bike[]) => void;
  addBike: (bike: Bike) => void;
  updateBike: (bike: Bike) => void;
  deleteBike: (bikeId: number) => void;
  setSelectedBike: (bike: Bike | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type AuthStore = AuthState & AuthActions;
export type BikeStore = BikeState & BikeActions;