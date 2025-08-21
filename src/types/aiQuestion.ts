export interface AiQuestion {
  id: number;
  userId: number;
  bikeId: number;
  categoryId: number;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface AiQuestionCreateRequest {
  question: string;
}