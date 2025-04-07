import React from 'react';
import { 
  Drawer, List, Divider, ListItem, ListItemIcon, ListItemText, 
  IconButton, InputBase, Paper, ListItemButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoginIcon from '@mui/icons-material/Login';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BadgeIcon from '@mui/icons-material/Badge';
import NoteIcon from '@mui/icons-material/Note';
import FolderIcon from '@mui/icons-material/Folder';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(1),
}));

function Sidebar({ open, drawerWidth, handleDrawerToggle, onCategorySelect, onSearch, selectedCategory }) {
  const categories = [
    { id: 'all', name: '所有项目', icon: <AllInboxIcon /> },
    { id: 'favorites', name: '收藏', icon: <FavoriteIcon /> },
    { id: 'login', name: '登录', icon: <LoginIcon /> },
    { id: 'card', name: '卡片', icon: <CreditCardIcon /> },
    { id: 'identity', name: '身份', icon: <BadgeIcon /> },
    { id: 'note', name: '笔记', icon: <NoteIcon /> },
  ];

  const folders = [
    { id: 'finance', name: '财务' },
    { id: 'health', name: '健康' },
    { id: 'entertainment', name: '娱乐' },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />

      <SearchBar>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="搜索"
          onChange={(e) => onSearch(e.target.value)}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </SearchBar>

      <List>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton 
              selected={selectedCategory === category.id}
              onClick={() => onCategorySelect(category.id)}
            >
              <ListItemIcon>
                {category.icon}
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem>
          <ListItemText primary="文件夹" />
        </ListItem>
        {folders.map((folder) => (
          <ListItem key={folder.id} disablePadding>
            <ListItemButton
              selected={selectedCategory === folder.id}
              onClick={() => onCategorySelect(folder.id)}
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={folder.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;