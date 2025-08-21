import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2024 REVOX - バイク整備記録アプリ
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              href="/privacy"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/terms"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              利用規約
            </Link>
            <Link
              href="/contact"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              お問い合わせ
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};