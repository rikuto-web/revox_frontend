import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Toolbar,
  Box,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsBike as BikeIcon,
  Build as BuildIcon,
  Psychology as PsychologyIcon,
  Category as CategoryIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUiStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';

const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactElement;
  children?: NavItem[];
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useUiStore();
  const { user } = useAuthStore();
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      label: 'ダッシュボード',
      path: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      label: 'バイク一覧',
      path: '/bikes',
      icon: <BikeIcon />,
    },
    {
      label: '記録一覧',
      path: '/maintenance',
      icon: <BuildIcon />,
    },
    {
      label: 'AI質問',
      path: '/ai',
      icon: <PsychologyIcon />,
    },
  ];

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      setOpenSubmenu(openSubmenu === item.label ? null : item.label);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const renderNavItem = (item: NavItem, depth = 0) => (
    <React.Fragment key={item.label}>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleItemClick(item)}
          selected={item.path ? isActiveRoute(item.path) : false}
          sx={{
            pl: 2 + depth * 2,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '& .MuiListItemIcon-root': {
                color: 'white',
              },
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
          {item.children && (
            openSubmenu === item.label ? <ExpandLess /> : <ExpandMore />
          )}
        </ListItemButton>
      </ListItem>

      {item.children && (
        <Collapse in={openSubmenu === item.label} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => renderNavItem(child, depth + 1))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );

  if (!user) {
    return null;
  }

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map((item) => renderNavItem(item))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};