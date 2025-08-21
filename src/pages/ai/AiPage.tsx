import React from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import { AiQuestionForm } from '@/components/ai/AiQuestionForm';
import { AiQuestionCard } from '@/components/ai/AiQuestionCard';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAiQuestions } from '@/hooks/useAiQuestions';
import { useBikes } from '@/hooks/useBikes';
import { useCategories } from '@/hooks/useCategories';
import { useMaintenanceTasks } from '@/hooks/useMaintenanceTasks';
import { useAuthStore } from '@/stores/authStore';
import { History as HistoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const AiPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { realtimeQuestion, askQuestion, isAsking } = useAiQuestions(user?.id ?? 0);
  const { bikes, isLoading: bikesLoading } = useBikes(user?.id ?? 0);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { createTask, isCreating } = useMaintenanceTasks();

  const isLoading = bikesLoading || categoriesLoading;

  const handleQuestionSubmit = (data: {
    bikeId: number;
    categoryId: number;
    question: string;
  }) => {
    askQuestion({
      bikeId: data.bikeId,
      categoryId: data.categoryId,
      questionData: { question: data.question },
    });
  };

  const getBikeName = (bikeId: number) => {
    const bike = bikes.find(b => b.id === bikeId);
    return bike ? `${bike.manufacturer} ${bike.modelName}` : undefined;
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name;
  };

  if (isLoading) {
    return <LoadingSpinner message="データを読み込み中..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <PageHeader
        title="AI質問"
        subtitle="バイクのメンテナンスについてAIに質問しよう"
        breadcrumbs={[
          { label: 'ダッシュボード', path: '/dashboard' },
          { label: 'AI質問' },
        ]}
      />
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => navigate('/ai/history')}
        >
          質問履歴を見る
        </Button>
      </Box>

      {bikes.length === 0 ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          AI質問機能を使用するには、まずバイクを登録してください。
        </Alert>
      ) : (
        <>
          <AiQuestionForm
            bikes={bikes}
            categories={categories}
            onSubmit={handleQuestionSubmit}
            isLoading={isAsking}
          />
          
          <Divider sx={{ my: 4 }} />

          {realtimeQuestion && (
            <>
              <Typography variant="h5" gutterBottom>
                最新の回答
              </Typography>
              <Box sx={{ mt: 3 }}>
                <AiQuestionCard
                  question={realtimeQuestion}
                  bikeName={getBikeName(realtimeQuestion.bikeId)}
                  categoryName={getCategoryName(realtimeQuestion.categoryId)}
                  createTask={createTask}
                  isCreating={isCreating}
                  bikeId={realtimeQuestion.bikeId}
                />
              </Box>
            </>
          )}
        </>
      )}
    </Container>
  );
};