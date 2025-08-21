import { Bike, BikeCreateRequest, BikeUpdateRequest } from '@/types/bike';
import { apiClient } from './api';

/**
 * バイク関連のAPIリクエストを管理するサービスです。
 */
export class BikeService {
  /**
   * 指定されたユーザーIDに紐づく全てのバイク情報を取得します。
   *
   * @param userId ユーザーの一意なID
   * @returns バイク情報の配列を含むPromise
   */
  async getBikesByUserId(userId: number): Promise<Bike[]> {
    return apiClient.get<Bike[]>(`/bikes/user/${userId}`);
  }

  /**
   * 指定されたユーザーとバイクIDに紐づく単一のバイク情報を取得します。
   *
   * @param userId ユーザーの一意なID
   * @param bikeId バイクの一意なID
   * @returns バイク情報を含むPromise
   */
  async getBikeById(userId: number, bikeId: number): Promise<Bike> {
    return apiClient.get<Bike>(`/bikes/user/${userId}/bike/${bikeId}`);
  }

  /**
   * 指定されたユーザーに新しいバイク情報を登録します。
   *
   * @param userId ユーザーの一意なID
   * @param bikeData 作成するバイクの情報
   * @returns 作成されたバイク情報を含むPromise
   */
  async createBike(userId: number, bikeData: BikeCreateRequest): Promise<Bike> {
    return apiClient.post<Bike>(`/bikes/user/${userId}`, bikeData);
  }

  /**
   * 指定されたユーザーとバイクIDに紐づくバイク情報を更新します。
   *
   * @param userId ユーザーの一意なID
   * @param bikeId 更新するバイクの一意なID
   * @param updateData 更新するバイクの情報
   * @returns 更新されたバイク情報を含むPromise
   */
  async updateBike(userId: number, bikeId: number, updateData: BikeUpdateRequest): Promise<Bike> {
    return apiClient.patch<Bike>(`/bikes/user/${userId}/bike/${bikeId}`, updateData);
  }

  /**
   * 指定されたユーザーとバイクIDに紐づくバイク情報を削除（論理削除）します。
   *
   * @param userId ユーザーの一意なID
   * @param bikeId 削除するバイクの一意なID
   * @returns 削除が成功した場合は何も返さないPromise
   */
  async deleteBike(userId: number, bikeId: number): Promise<void> {
    return apiClient.patch<void>(`/bikes/user/${userId}/bike/${bikeId}/softDelete`);
  }
}

export const bikeService = new BikeService();