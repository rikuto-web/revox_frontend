import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface CardAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'error';
}

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: CardAction[];
  headerAction?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  actions,
  headerAction,
  className,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: CardAction) => {
    action.onClick();
    handleClose();
  };

  return (
    <MuiCard className={className} sx={{ height: '100%' }}>
      {(title || actions || headerAction) && (
        <CardHeader
          title={title && <Typography variant="h6">{title}</Typography>}
          subheader={subtitle}
          action={
            <div>
              {headerAction}
              {actions && actions.length > 0 && (
                <>
                  <IconButton onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    {actions.map((action, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleActionClick(action)}
                      >
                        {action.icon && (
                          <ListItemIcon>{action.icon}</ListItemIcon>
                        )}
                        <ListItemText primary={action.label} />
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </div>
          }
        />
      )}
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};