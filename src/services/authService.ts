import { LoginRequest, LoginResponse } from '@/types/auth';
import { User, UserUpdateRequest } from '@/types/user';
import { apiClient } from './api';

/**
 * 認証およびユーザー情報関連のAPIリクエストを管理するサービスです。
 * バックエンドとの通信ロジックをカプセル化します。
 */
export class AuthService {
  /**
   * Google認証を使用してログインします。
   * @param idToken Googleから取得したIDトークン
   * @returns ログイン成功時に返されるJWTトークンとユーザー情報
   */
  async loginWithGoogle(idToken: string): Promise<LoginResponse> {
    const request: LoginRequest = { idToken };
    return apiClient.post<LoginResponse>('/auth/google', request);
  }

  /**
   * ゲストユーザーとしてログインします。
   * @returns ゲストログイン成功時に返されるJWTトークンとユーザー情報
   */
  async loginAsGuest(): Promise<LoginResponse> {
    const response = await apiClient.post<{ token: string }>('/auth/guest');
    
    // ゲストユーザー情報を作成
    const guestUser: User = {
      id: 99999999,
      uniqueUserId: 'guest-user',
      nickname: 'ゲストユーザー',
      displayEmail: 'guest@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      accessToken: response.token,
      tokenType: 'Bearer',
      user: guestUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * 指定されたユーザー情報を更新します。
   * @param userId 更新対象のユーザーID
   * @param updateData 更新するユーザー情報
   * @returns 更新されたユーザー情報
   */
  async updateUser(userId: number, updateData: UserUpdateRequest): Promise<User> {
    return apiClient.patch<User>(`/users/${userId}`, updateData);
  }

  /**
   * 指定されたユーザーアカウントを論理削除します。
   * @param userId 削除対象のユーザーID
   * @returns 処理が成功した場合は何も返さないPromise
   */
  async deleteUser(userId: number): Promise<void> {
    return apiClient.patch<void>(`/users/${userId}/softDelete`);
  }
}

export const authService = new AuthService();