import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Toolbar, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Sidebar from './Sidebar';
import VaultList from './VaultList';
import AddPasswordModal from './AddPasswordModal';
import { fetchPasswords } from '../utils/api';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const Header = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
}));

function Layout() {
  const [open, setOpen] = useState(true);
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadPasswords();
  }, []);

  useEffect(() => {
    filterPasswords();
  }, [passwords, selectedCategory, searchTerm]);

  const loadPasswords = async () => {
    try {
      const data = await fetchPasswords();
      setPasswords(data);
      setFilteredPasswords(data);
    } catch (error) {
      console.error('Failed to load passwords:', error);
    }
  };

  const filterPasswords = () => {
    let filtered = [...passwords];

    // 按类别筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category === selectedCategory || 
        (item.tags && item.tags.includes(selectedCategory))
      );
    }

    // 按搜索词筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.username.toLowerCase().includes(term) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    setFilteredPasswords(filtered);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddPassword = () => {
    setModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('masterKey');
    window.location.href = '/login';
  };

  const handlePasswordAdded = (newPassword) => {
    setPasswords([...passwords, newPassword]);
    setModalOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar 
        open={open} 
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
      />
      <Main open={open}>
        <Header>
          <Typography variant="h6" noWrap component="div">
            {selectedCategory === 'all' ? '所有密码' : selectedCategory}
          </Typography>
          <Box>
            <IconButton color="primary" onClick={handleAddPassword}>
              <AddIcon />
            </IconButton>
            <IconButton color="error" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Header>
        <VaultList passwords={filteredPasswords} onPasswordsChange={setPasswords} />
        <AddPasswordModal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onAdd={handlePasswordAdded} 
        />
      </Main>
    </Box>
  );
}

export default Layout;