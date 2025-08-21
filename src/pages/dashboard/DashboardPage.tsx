import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  DirectionsBike as BikeIcon,
  Build as BuildIcon,
  Psychology as PsychologyIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BikeForm } from '@/components/bikes/BikeForm';
import { useBikes } from '@/hooks/useBikes';
import { useAuthStore } from '@/stores/authStore';
import { formatDateTime } from '@/utils/dateUtils';
import { useMaintenanceTasks } from '@/hooks/useMaintenanceTasks';
import { useCategories } from '@/hooks/useCategories';
import { BikeCreateRequest } from '@/types/bike';
import { MaintenanceTask } from '@/types/maintenanceTask';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = React.useState(false);

  const {
    bikes,
    isLoading: bikesLoading,
    createBike,
    isCreating,
  } = useBikes(user?.id || 0);

  const { categories, isLoading: categoriesLoading } = useCategories();

  const { tasks: records, isLoading: recordsLoading } = useMaintenanceTasks(user?.id || 0, null);

  const recentRecords = [...records].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  const isLoading = bikesLoading || recordsLoading || categoriesLoading;

  if (isLoading) {
    return <LoadingSpinner message="ダッシュボードを読み込み中..." />;
  }

  const primaryBike = bikes.length > 0 ? bikes[0] : null;

  const handleAddBike = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = (data: BikeCreateRequest) => {
    createBike(data, {
      onSuccess: () => {
        handleFormClose();
      },
    });
  };

  const getRecordDetails = (record: MaintenanceTask) => {
    const bike = bikes.find(b => b.id === record.bikeId);
    const category = categories.find(c => c.id === record.categoryId);
    return {
      bikeName: bike?.modelName || '不明なバイク',
      categoryName: category?.name || '不明なカテゴリー',
    };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <PageHeader
        title={`${user?.nickname}さん、おかえりなさい！`}
        subtitle="今日も愛車のメンテナンスを頑張りましょう"
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.200',
                    p: 4,
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    {primaryBike ? `${primaryBike.modelName}の写真` : 'バイクが未登録です'}
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    gap: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<PsychologyIcon />}
                    onClick={() => navigate('/ai')}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    AIに質問する
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<BuildIcon />}
                    onClick={() => navigate('/maintenance')}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    整備記録を見る
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<BikeIcon />}
                    onClick={() => navigate('/bikes')}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    バイク一覧を見る
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  最近の整備記録
                </Typography>
                <Button
                  startIcon={<BuildIcon />}
                  onClick={() => navigate('/maintenance')}
                >
                  すべて見る
                </Button>
              </Box>
              {recentRecords.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  まだ整備記録がありません。
                </Typography>
              ) : (
                <List dense>
                  {recentRecords.map((record, index) => {
                    const { bikeName, categoryName } = getRecordDetails(record);
                    return (
                      <React.Fragment key={record.id}>
                        <Accordion sx={{ boxShadow: 0, '&::before': { display: 'none' } }}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel-${record.id}-content`}
                            id={`panel-${record.id}-header`}
                            sx={{
                              p: 0,
                              minHeight: 'auto',
                              '& .MuiAccordionSummary-content': {
                                margin: '8px 0',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36, mt: 0 }}>
                              <BuildIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                              <Typography variant="body1">{record.name}</Typography>
                              <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                                <Chip label={bikeName} size="small" variant="outlined" />
                                <Chip label={categoryName} size="small" variant="outlined" />
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                作成日: {formatDateTime(record.createdAt)}
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 1, pt: 0 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                              {record.description}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                        {index < recentRecords.length - 1 && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <BikeForm
        open={showForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        isLoading={isCreating}
        userId={user?.id || 0}
      />
    </Container>
  );
};