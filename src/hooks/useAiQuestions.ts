import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';
import { aiService } from '@/services/aiService';
import { AiQuestion, AiQuestionCreateRequest } from '@/types/aiQuestion';

export const useAiQuestions = (userId: number) => {
  const [realtimeQuestion, setRealtimeQuestion] = useState<AiQuestion | null>(null);

  const askQuestionMutation = useMutation({
    mutationFn: async ({
      bikeId,
      categoryId,
      questionData,
    }: {
      bikeId: number;
      categoryId: number;
      questionData: AiQuestionCreateRequest;
    }) => {
      return aiService.askQuestion(userId, bikeId, categoryId, questionData);
    },
    
    onMutate: async (variables) => {
      const newQuestion: AiQuestion = {
        id: -1,
        question: variables.questionData.question,
        answer: 'AIからの回答を生成中です...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bikeId: variables.bikeId,
        categoryId: variables.categoryId,
        userId: userId,
        isDeleted: false,
      };
      setRealtimeQuestion(newQuestion);
    },

    onSuccess: (newQuestion) => {
      setRealtimeQuestion(newQuestion);
      toast.success('AIへの質問を送信しました');
    },

    onError: (error) => {
      setRealtimeQuestion(null);
      let message = 'AI質問に失敗しました';
      if (isAxiosError(error) && error.response) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });

  return {
    realtimeQuestion,
    askQuestion: askQuestionMutation.mutate,
    isAsking: askQuestionMutation.isPending,
  };
};