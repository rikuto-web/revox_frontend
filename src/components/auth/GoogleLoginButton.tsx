import React from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

interface GoogleLoginButtonProps {
  onLogin: (credential: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              width?: string;
            }
          ) => void;
        };
      };
    };
  }
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onLogin,
  isLoading = false,
  disabled = false,
}) => {
  const googleButtonRef = React.useRef<HTMLDivElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = React.useState(false);

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        setIsGoogleLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  React.useEffect(() => {
    if (isGoogleLoaded && window.google && googleButtonRef.current) {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        console.error('Google Client ID が設定されていません');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          onLogin(response.credential);
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: '100%',
      });
    }
  }, [isGoogleLoaded, onLogin]);

  if (!isGoogleLoaded || isLoading) {
    return (
      <Button
        fullWidth
        variant="outlined"
        size="large"
        disabled
        sx={{ py: 1.5 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <GoogleIcon />
          )}
          {isLoading ? 'ログイン中...' : 'Googleでログイン'}
        </Box>
      </Button>
    );
  }

  return (
    <Box
      ref={googleButtonRef}
      sx={{
        width: '100%',
        '& > div': {
          width: '100% !important',
        },
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    />
  );
};