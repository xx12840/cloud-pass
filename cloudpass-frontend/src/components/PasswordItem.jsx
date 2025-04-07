import React, { useState } from 'react';
import { 
  ListItem, ListItemAvatar, Avatar, ListItemText, 
  IconButton, Typography, Box, Menu, MenuItem
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { decryptPassword } from '../utils/encryption';
import { deletePassword } from '../utils/api';

function PasswordItem({ password, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(password.username);
    alert(`用户名 "${password.username}" 已复制到剪贴板`);
  };

  const handleCopyPassword = () => {
    const masterKey = localStorage.getItem('masterKey');
    const decryptedPassword = decryptPassword(password.password, masterKey);
    navigator.clipboard.writeText(decryptedPassword);
    alert('密码已复制到剪贴板');
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(password);
  };

  const handleDelete = async () => {
    handleMenuClose();

    if (window.confirm(`确定要删除 "${password.name}" 吗？`)) {
      try {
        await deletePassword(password.id);
        onDelete(password.id);
      } catch (error) {
        console.error('删除密码失败:', error);
        alert('删除密码失败');
      }
    }
  };

  return (
    <ListItem
      secondaryAction={
        <Box>
          <IconButton edge="end" aria-label="复制密码" onClick={handleCopyPassword}>
            <ContentCopyIcon />
          </IconButton>
          <IconButton 
            edge="end" 
            aria-label="更多选项" 
            onClick={handleMenuOpen}
            aria-controls={open ? 'password-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="password-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'more-button',
            }}
          >
            <MenuItem onClick={handleEdit}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              编辑
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              删除
            </MenuItem>
          </Menu>
        </Box>
      }
    >
      <ListItemAvatar>
        <Avatar 
          src={password.icon} 
          alt={password.name}
          sx={{ 
            bgcolor: !password.icon ? `hsl(${password.name.charCodeAt(0) % 360}, 70%, 50%)` : undefined 
          }}
        >
          {!password.icon && password.name.charAt(0).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body1" component="div">
            {password.name}
          </Typography>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{ display: 'inline', mr: 1 }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {password.username}
            </Typography>
            <IconButton 
              size="small" 
              edge="end" 
              aria-label="复制用户名" 
              onClick={handleCopyUsername}
              sx={{ p: 0.5 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            {password.tags && password.tags.length > 0 && (
              <Box sx={{ display: 'flex', ml: 1, flexWrap: 'wrap', gap: 0.5 }}>
                {password.tags.map(tag => (
                  <Typography
                    key={tag}
                    variant="caption"
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      fontSize: '0.7rem',
                    }}
                  >
                    {tag}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        }
      />
    </ListItem>
  );
}

export default PasswordItem;