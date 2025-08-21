
import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "エラーが発生しました",
  message,
  onRetry,
  variant = 'error',
}) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Alert severity={variant}>
        <AlertTitle>{title}</AlertTitle>
        {message}
        {onRetry && (
          <Box sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              再試行
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};