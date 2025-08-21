import { Category } from '@/types/category';
import { apiClient } from './api';

/**
 * カテゴリー関連のAPIリクエストを管理するサービスです。
 */
export class CategoryService {
  /**
   * 全てのカテゴリー情報を取得します。
   * @returns カテゴリー情報の配列を含むPromise
   */
  async getAllCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  }
}

export const categoryService = new CategoryService();