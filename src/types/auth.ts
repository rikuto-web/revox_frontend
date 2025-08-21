import { User } from '@/types/user';

export interface LoginRequest {
  idToken: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}