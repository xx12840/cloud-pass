import axios from 'axios';
import { encryptPasswordObject, generateMasterKey } from './encryption';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.cloudpass.workers.dev';

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器添加认证token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 登录
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });

    // 生成主密钥并存储
    if (response.data.success) {
      const masterKey = generateMasterKey(username, password);
      return {
        ...response.data,
        masterKey
      };
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// 获取所有密码
export const fetchPasswords = async () => {
  try {
    const response = await api.get('/passwords');
    return response.data;
  } catch (error) {
    console.error('Fetch passwords error:', error);
    throw error;
  }
};

// 添加新密码
export const addPassword = async (passwordData) => {
  try {
    const masterKey = localStorage.getItem('masterKey');
    if (!masterKey) {
      throw new Error('Master key not found');
    }

    // 加密密码
    const encryptedData = encryptPasswordObject(passwordData, masterKey);

    const response = await api.post('/passwords', encryptedData);
    return response.data;
  } catch (error) {
    console.error('Add password error:', error);
    throw error;
  }
};

// 更新密码
export const updatePassword = async (id, passwordData) => {
  try {
    const masterKey = localStorage.getItem('masterKey');
    if (!masterKey) {
      throw new Error('Master key not found');
    }

    // 加密密码
    const encryptedData = encryptPasswordObject(passwordData, masterKey);

    const response = await api.put(`/passwords/${id}`, encryptedData);
    return response.data;
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

// 删除密码
export const deletePassword = async (id) => {
  try {
    const response = await api.delete(`/passwords/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete password error:', error);
    throw error;
  }
};

// 上传图标
export const uploadIcon = async (file) => {
  try {
    const formData = new FormData();
    formData.append('icon', file);

    const response = await api.post('/icons/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Upload icon error:', error);
    throw error;
  }
};