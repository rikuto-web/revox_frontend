import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Button,
  TextField,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ContentCopy as CopyIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  Build as BuildIcon,
  Edit as EditIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { AiQuestion } from '@/types/aiQuestion';
import { MaintenanceTaskRequest } from '@/types/maintenanceTask';
import { formatDateTime } from '@/utils/dateUtils';
import toast from 'react-hot-toast';

interface AiQuestionCardProps {
  question: AiQuestion;
  bikeName?: string;
  categoryName?: string;
  createTask: (task: MaintenanceTaskRequest) => void;
  isCreating: boolean;
  bikeId: number;
}

const formatAnswerForDisplay = (answer: string): string => {
  if (!answer) return '';
  return answer.replace(/【注意事項\(安全関連のみ\)】/g, '');
};

export const AiQuestionCard: React.FC<AiQuestionCardProps> = ({
  question,
  bikeName,
  categoryName,
  createTask,
  isCreating,
  bikeId,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedAnswer, setEditedAnswer] = React.useState(
    formatAnswerForDisplay(question.answer)
  );

  useEffect(() => {
    setEditedAnswer(formatAnswerForDisplay(question.answer));
  }, [question.answer]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCopyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(formatAnswerForDisplay(question.answer));
      toast.success('回答をクリップボードにコピーしました');
    } catch (error) {
      toast.error('コピーに失敗しました');
    }
  };

  const handleCreateTask = () => {
    if (!question.categoryId || !editedAnswer) {
      toast.error('整備タスクを作成できませんでした。カテゴリと回答情報が不足しています。');
      return;
    }
    const taskName = `AI質問: ${question.question}`;
    const taskDescription = editedAnswer;
    const newTask: MaintenanceTaskRequest = {
      name: taskName,
      description: taskDescription,
      categoryId: question.categoryId,
      bikeId: bikeId,
    };
    createTask(newTask);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    toast.success('回答を更新しました');
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PersonIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" color="primary">質問</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(question.createdAt)}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {question.question}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {bikeName && (
                <Chip
                  label={bikeName}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
              {categoryName && (
                <Chip
                  label={categoryName}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PsychologyIcon fontSize="small" color="secondary" />
              <Typography variant="subtitle2" color="secondary">
                AI回答
              </Typography>
            </Box>
            <Box>
              {isEditing ? (
                <IconButton onClick={handleSaveClick} size="small" aria-label="保存">
                  <CheckIcon fontSize="small" />
                </IconButton>
              ) : (
                <>
                  <IconButton
                    onClick={handleEditClick}
                    size="small"
                    aria-label="回答を編集"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={handleCopyAnswer} size="small" aria-label="回答をコピー">
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </>
              )}
              <IconButton onClick={handleExpandClick} size="small" aria-label="詳細を表示">
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>
          <Collapse in={expanded || isEditing} timeout="auto" unmountOnExit>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={10}
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            ) : (
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.6,
                }}
              >
                {editedAnswer}
              </Typography>
            )}
          </Collapse>
          {!expanded && !isEditing && (
            <Typography
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.6,
              }}
            >
              {editedAnswer}
            </Typography>
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<BuildIcon />}
              onClick={handleCreateTask}
              disabled={isCreating}
            >
              整備タスクとして登録
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};