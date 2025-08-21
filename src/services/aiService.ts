import { AiQuestion, AiQuestionCreateRequest } from '@/types/aiQuestion';
import { apiClient } from './api';

/**
 * AI関連のAPIリクエストを管理するサービスです。
 */
export class AiService {
  /**
   * 指定されたユーザーIDに紐づく全てのAI質問履歴を取得します。
   *
   * @param userId ユーザーの一意なID
   * @returns AI質問の配列を含むPromise
   */
  async getQuestionsByUserId(userId: number): Promise<AiQuestion[]> {
    return apiClient.get<AiQuestion[]>(`/ai/user/${userId}`);
  }

  /**
   * 指定されたユーザー、バイク、カテゴリIDに紐づくAIへの質問を送信します。
   *
   * @param userId ユーザーの一意なID
   * @param bikeId バイクの一意なID
   * @param categoryId 整備カテゴリの一意なID
   * @param questionData 質問データ
   * @returns AIからの回答を含むPromise
   */
  async askQuestion(
    userId: number,
    bikeId: number,
    categoryId: number,
    questionData: AiQuestionCreateRequest
  ): Promise<AiQuestion> {
    return apiClient.post<AiQuestion>(
      `/ai/user/${userId}/bike/${bikeId}/category/${categoryId}`,
      questionData
    );
  }
}

export const aiService = new AiService();