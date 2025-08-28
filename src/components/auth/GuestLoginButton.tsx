import React from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

interface GuestLoginButtonProps {
  onLogin: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const GuestLoginButton: React.FC<GuestLoginButtonProps> = ({
  onLogin,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      onClick={onLogin}
      disabled={disabled || isLoading}
      sx={{ 
        py: 1.5,
        color: 'grey.600',
        borderColor: 'grey.400',
        '&:hover': {
          borderColor: 'grey.600',
          backgroundColor: 'grey.50',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <PersonIcon />
        )}
        {isLoading ? 'ログイン中...' : 'ゲストとして続行'}
      </Box>
    </Button>
  );
};