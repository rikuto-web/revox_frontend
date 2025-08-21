import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsBike as BikeIcon,
} from '@mui/icons-material';
import { Bike } from '@/types/bike';
import { formatDate } from '@/utils/dateUtils';

interface BikeCardProps {
  bike: Bike;
  onEdit: (bike: Bike) => void;
  onDelete: (bikeId: number) => void;
  onClick?: (bike: Bike) => void;
}

export const BikeCard: React.FC<BikeCardProps> = ({
  bike,
  onEdit,
  onDelete,
  onClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(bike);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(bike.id);
    handleMenuClose();
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(bike);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          elevation: 4,
          transform: onClick ? 'translateY(-2px)' : 'none',
        },
        transition: 'all 0.2s ease-in-out',
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="div"
        sx={{
          height: 200,
          backgroundImage: bike.imageUrl
            ? `url(${bike.imageUrl})`
            : 'linear-gradient(45deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5), linear-gradient(45deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5)',
          backgroundSize: bike.imageUrl ? 'cover' : '20px 20px',
          backgroundPosition: bike.imageUrl ? 'center' : '0 0, 10px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {!bike.imageUrl && (
          <BikeIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
        )}

        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          onClick={handleMenuClick}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>編集</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>削除</ListItemText>
          </MenuItem>
        </Menu>
      </CardMedia>

            <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {bike.manufacturer} {bike.modelName}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {bike.modelCode && (
              <Chip
                label={bike.modelCode}
                size="small"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            )}
            {bike.modelYear && (
              <Chip
                label={`${bike.modelYear}年式`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            )}
          </Typography>
        </Box>

        {bike.currentMileage != null && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              走行距離:
            </Typography>
            <Typography variant="body2">
              {bike.currentMileage.toLocaleString()} km
            </Typography>
          </Box>
        )}

        {bike.purchaseDate && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              購入日:
            </Typography>
            <Typography variant="body2">
              {formatDate(bike.purchaseDate)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};