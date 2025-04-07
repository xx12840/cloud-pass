import React, { useState } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, FormControl, 
  InputLabel, Select, MenuItem, Chip, IconButton, InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { addPassword } from '../utils/api';

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

function AddPasswordModal({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    url: '',
    category: 'login',
    tags: [],
    notes: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPassword = await addPassword(formData);
      onAdd(newPassword);
    } catch (error) {
      console.error('Failed to add password:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-password-modal"
    >
      <ModalContainer>
        <ModalHeader>
          <Typography variant="h6" component="h2">
            添加新密码
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="名称"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="用户名"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="密码"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="网址"
            name="url"
            value={formData.url}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>类别</InputLabel>
            <Select
              name="category"
              value={formData.category}
              label="类别"
              onChange={handleChange}
            >
              <MenuItem value="login">登录</MenuItem>
              <MenuItem value="card">卡片</MenuItem>
              <MenuItem value="identity">身份</MenuItem>
              <MenuItem value="note">笔记</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              标签
            </Typography>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <TextField
                size="small"
                label="添加标签"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <Button variant="outlined" onClick={handleAddTag}>
                添加
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                />
              ))}
            </Box>
          </Box>

          <TextField
            margin="normal"
            fullWidth
            label="备注"
            name="notes"
            multiline
            rows={3}
            value={formData.notes}
            onChange={handleChange}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              取消
            </Button>
            <Button type="submit" variant="contained">
              保存
            </Button>
          </Box>
        </Box>
      </ModalContainer>
    </Modal>
  );
}

export default AddPasswordModal;