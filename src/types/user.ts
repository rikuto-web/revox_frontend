export interface User {
  id: number;
  uniqueUserId: string;
  nickname: string;
  displayEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateRequest {
  nickname: string;
}