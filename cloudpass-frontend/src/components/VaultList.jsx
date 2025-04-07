import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Checkbox, Avatar, Typography, Box
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { decryptPassword } from '../utils/encryption';

function VaultList({ passwords, onPasswordsChange }) {
  const handleCopyUsername = (username) => {
    navigator.clipboard.writeText(username);
    alert('用户名已复制到剪贴板');
  };

  const handleCopyPassword = (encryptedPassword) => {
    const masterKey = localStorage.getItem('masterKey');
    const password = decryptPassword(encryptedPassword, masterKey);
    navigator.clipboard.writeText(password);
    alert('密码已复制到剪贴板');
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="password vault table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>名称</TableCell>
            <TableCell>用户名</TableCell>
            <TableCell>所有者</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {passwords.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={row.icon} alt={row.name} sx={{ mr: 2 }}>
                    {row.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{row.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {row.url}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {row.username}
                  <IconButton size="small" onClick={() => handleCopyUsername(row.username)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>{row.owner}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => handleCopyPassword(row.password)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default VaultList;