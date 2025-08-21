import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Pagination,
} from '@mui/material';
import { AiQuestionCard } from '@/components/ai/AiQuestionCard';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { useAiHistory } from '@/hooks/useAiHistory';
import { useBikes } from '@/hooks/useBikes';
import { useCategories } from '@/hooks/useCategories';
import { useMaintenanceTasks } from '@/hooks/useMaintenanceTasks';
import { useAuthStore } from '@/stores/authStore';
import { Psychology as PsychologyIcon } from '@mui/icons-material';
import { isAxiosError } from 'axios';

export const HistoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const limit = 5;

  const { questions, totalQuestions, isLoading, error } = useAiHistory(user?.id ?? 0, page, limit);
  const { bikes } = useBikes(user?.id ?? 0);
  const { categories } = useCategories();
  const { createTask, isCreating } = useMaintenanceTasks();

  const getBikeName = (bikeId: number) => {
    const bike = bikes.find(b => b.id === bikeId);
    return bike ? `${bike.manufacturer} ${bike.modelName}` : undefined;
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name;
  };

  if (isLoading) {
    return <LoadingSpinner message="質問履歴を読み込み中..." />;
  }

  if (error) {
    let errorMessage = '質問履歴の取得に失敗しました';
    if (isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ErrorMessage message={errorMessage} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <PageHeader
        title="AI質問履歴"
        subtitle="過去の質問と回答を振り返る"
        breadcrumbs={[
          { label: 'AI質問', path: '/ai' },
          { label: '質問履歴' },
        ]}
      />

      {questions.length === 0 ? (
        <EmptyState
          title="質問履歴がありません"
          description="AIに質問して、バイクのメンテナンスに関するアドバイスを受けましょう"
          icon={<PsychologyIcon sx={{ fontSize: 80 }} />}
        />
      ) : (
        <Box sx={{ mt: 3 }}>
          {questions.map((question) => (
            <AiQuestionCard
              key={question.id}
              question={question}
              bikeName={getBikeName(question.bikeId)}
              categoryName={getCategoryName(question.categoryId)}
              createTask={createTask}
              isCreating={isCreating}
              bikeId={question.bikeId}
            />
          ))}
          {totalQuestions > limit && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(totalQuestions / limit)}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};