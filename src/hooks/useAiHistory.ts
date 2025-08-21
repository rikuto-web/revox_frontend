import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { aiService } from '@/services/aiService';
import { AiQuestion } from '@/types/aiQuestion';

export const useAiHistory = (userId: number, page: number, limit: number) => {
  const {
    data: questions = [],
    isLoading,
    error,
  } = useQuery<AiQuestion[]>({
    queryKey: ['ai-questions', userId],
    queryFn: () => aiService.getQuestionsByUserId(userId),
    enabled: !!userId,
  });

  const { paginatedQuestions, totalQuestions } = useMemo(() => {
    const sortedQuestions = [...questions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const paginatedQuestions = sortedQuestions.slice((page - 1) * limit, page * limit);
    return {
      paginatedQuestions,
      totalQuestions: sortedQuestions.length,
    };
  }, [questions, page, limit]);

  return {
    questions: paginatedQuestions,
    totalQuestions,
    isLoading,
    error,
  };
};