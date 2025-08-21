import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';
import { Bike, BikeCreateRequest, BikeUpdateRequest } from '@/types/bike';
import { SubmitHandler } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';

const schema = yup.object({
  manufacturer: yup.string().required('必須です').max(50),
  modelName: yup.string().required('必須です').max(100),
  modelCode: yup.string().nullable().optional().max(20),
  modelYear: yup.number().nullable().optional().min(1900).max(new Date().getFullYear() + 1),
  currentMileage: yup.number().nullable().optional().min(0),
  purchaseDate: yup
    .mixed()
    .nullable()
    .optional()
    .test('is-dayjs', '日付が不正です', (value) => value === null || dayjs.isDayjs(value)),
  imageUrl: yup.string().nullable().optional().max(2048).url(),
});

type FormData = yup.InferType<typeof schema>;

interface BikeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BikeCreateRequest | BikeUpdateRequest) => void;
  bike?: Bike;
  isLoading?: boolean;
  userId: number;
}

export const BikeForm: React.FC<BikeFormProps> = ({
  open,
  onClose,
  onSubmit,
  bike,
  isLoading = false,
  userId,
}) => {
  const isEdit = Boolean(bike);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as Resolver<FormData>,
    defaultValues: {
      manufacturer: '',
      modelName: '',
      modelCode: null,
      modelYear: null,
      currentMileage: null,
      purchaseDate: null,
      imageUrl: null,
    },
  });

  React.useEffect(() => {
    if (bike) {
      reset({
        manufacturer: bike.manufacturer,
        modelName: bike.modelName,
        modelCode: bike.modelCode ?? null,
        modelYear: bike.modelYear ?? null,
        currentMileage: bike.currentMileage ?? null,
        purchaseDate: bike.purchaseDate ? dayjs(bike.purchaseDate) : null,
        imageUrl: bike.imageUrl ?? null,
      });
    } else {
      reset({
        manufacturer: '',
        modelName: '',
        modelCode: null,
        modelYear: null,
        currentMileage: null,
        purchaseDate: null,
        imageUrl: null,
      });
    }
  }, [bike, reset]);

  const onFormSubmit: SubmitHandler<FormData> = (data) => {
    const submitData = {
      ...(!isEdit && { userId }),
      manufacturer: data.manufacturer,
      modelName: data.modelName,
      modelCode: data.modelCode ?? undefined,
      modelYear: data.modelYear ?? undefined,
      currentMileage: data.currentMileage ?? undefined,
      purchaseDate: data.purchaseDate ? (data.purchaseDate as Dayjs).toISOString() : undefined,
      imageUrl: data.imageUrl ?? undefined,
    };

    onSubmit(submitData as BikeCreateRequest | BikeUpdateRequest);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? 'バイク情報の編集' : '新しいバイクを登録'}</DialogTitle>

        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="manufacturer"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="メーカー名"
                      placeholder="Honda, Yamaha, Kawasaki等"
                      error={!!errors.manufacturer}
                      helperText={errors.manufacturer?.message}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="modelName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="車両名"
                      placeholder="Ninja ZX-25R, CBR250RR等"
                      error={!!errors.modelName}
                      helperText={errors.modelName?.message}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="modelCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="型式"
                      placeholder="2BK-EX250P, 8BK-MC58等"
                      error={!!errors.modelCode}
                      helperText={errors.modelCode?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="modelYear"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label="年式"
                      placeholder="2024"
                      error={!!errors.modelYear}
                      helperText={errors.modelYear?.message}
                      InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() + 1 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="currentMileage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label="現在の走行距離"
                      placeholder="12345"
                      error={!!errors.currentMileage}
                      helperText={errors.currentMileage?.message}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">km</InputAdornment>,
                        inputProps: { min: 0 },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="purchaseDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value ?? null}
                      onChange={(date) => field.onChange(date)}
                      maxDate={dayjs()}
                      label="購入日"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.purchaseDate}
                          helperText={errors.purchaseDate?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="バイク画像URL"
                      placeholder="http://example.com/bike.jpg"
                      error={!!errors.imageUrl}
                      helperText={errors.imageUrl?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit(onFormSubmit)} variant="contained" disabled={isLoading}>
            {isEdit ? '更新' : '登録'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};