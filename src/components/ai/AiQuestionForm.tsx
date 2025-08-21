import React from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon, Psychology as PsychologyIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Bike } from '@/types/bike';
import { Category } from '@/types/category';

const schema = yup.object({
  bikeId: yup.number().required('バイクを選択してください'),
  categoryId: yup.number().required('カテゴリを選択してください'),
  question: yup
    .string()
    .required('質問内容は必須です')
    .max(1000, '質問は1000文字以内で入力してください')
    .min(10, '質問は10文字以上で入力してください'),
});

type FormData = {
  bikeId: number;
  categoryId: number;
  question: string;
};

interface AiQuestionFormProps {
  bikes: Bike[];
  categories: Category[];
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  selectedBike?: Bike;
  selectedCategory?: Category;
}

export const AiQuestionForm: React.FC<AiQuestionFormProps> = ({
  bikes,
  categories,
  onSubmit,
  isLoading = false,
  selectedBike,
  selectedCategory,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      bikeId: selectedBike?.id || 0,
      categoryId: selectedCategory?.id || 0,
      question: '',
    },
  });

  const watchedBikeId = watch('bikeId');
  const selectedBikeInfo = bikes.find(bike => bike.id === watchedBikeId);

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset({
      bikeId: data.bikeId,
      categoryId: data.categoryId,
      question: '',
    });
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PsychologyIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">AIに質問する</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Controller
              name="bikeId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.bikeId} disabled={isLoading}>
                  <InputLabel>質問対象のバイク</InputLabel>
                  <Select {...field} label="質問対象のバイク">
                    <MenuItem value={0}>バイクを選択してください</MenuItem>
                    {bikes.map((bike) => (
                      <MenuItem key={bike.id} value={bike.id}>
                        {bike.manufacturer} {bike.modelName}
                        {bike.modelYear && ` (${bike.modelYear}年式)`}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.bikeId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.bikeId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.categoryId} disabled={isLoading}>
                  <InputLabel>質問カテゴリ</InputLabel>
                  <Select {...field} label="質問カテゴリ">
                    <MenuItem value={0}>カテゴリを選択してください</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.categoryId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="question"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="質問内容"
                  placeholder="例: エンジンオイル交換の手順を教えてください"
                  error={!!errors.question}
                  helperText={errors.question?.message || `${field.value.length}/1000文字`}
                  disabled={isLoading}
                />
              )}
            />
            
            <Typography variant="body2" color="error" sx={{ mt: -2 }}>
              AIの回答は参考情報です。内容の正確性や安全性を保証するものではありません。
              実際の作業を行う際は、必ず専門の整備士に相談するか、車両の公式マニュアルを参照してください。
            </Typography>

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={
                isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />
              }
              disabled={isLoading}
              sx={{ alignSelf: 'flex-start' }}
            >
              {isLoading ? '回答を作成中です…' : 'AIに質問'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};